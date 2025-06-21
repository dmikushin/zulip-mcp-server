# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that exposes Zulip REST API capabilities as tools for LLMs. The server acts as a bridge between LLMs and Zulip workspaces, enabling AI assistants to send messages, retrieve chat history, manage users, and perform other Zulip operations programmatically.

## Technology Stack

- **Language**: TypeScript/Node.js (ES modules)
- **Framework**: MCP TypeScript SDK (`@modelcontextprotocol/sdk`)
- **API Client**: Custom Zulip REST API client with axios
- **Schema Validation**: Zod for input validation
- **Transport**: StdioServerTransport for CLI usage

## Essential Development Commands

```bash
# Development
npm run dev              # Live development server with tsx
npm run build           # Clean build: removes dist/ then compiles TypeScript
npm run clean           # Remove dist/ folder (clear build artifacts)
npm run build:watch     # TypeScript compilation in watch mode
npm start              # Run compiled server from dist/

# Code Quality (Current Baseline)
npm run quality        # lint + typecheck + audit
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix ESLint issues
npm run typecheck      # TypeScript compilation check
npm run audit:fix      # Fix npm security vulnerabilities

# Quality with Tests (Future - currently fails)
npm run quality-full   # Includes tests when implemented
npm test              # Jest (no tests implemented yet)

# Pre-commit
npm run precommit     # lint + typecheck + build
```

## Current Project Structure

```
src/
├── server.ts          # Main MCP server - all tools/resources defined here
├── types.ts           # Zod schemas and TypeScript type definitions
└── zulip/
    └── client.ts      # Zulip REST API client implementation
```

**Note**: The architecture is currently monolithic with all MCP tools and resources defined in `server.ts`. The documented `tools/` directory structure doesn't exist yet.

## MCP Server Architecture

The server is implemented as a single file (`server.ts`) that:

1. **Environment Setup**: Validates required environment variables with helpful error messages
2. **Resource Registration**: Provides contextual data (user directory, channels, formatting guide, common patterns)
3. **Tool Registration**: Implements Zulip API operations as MCP tools
4. **Transport**: Uses StdioServerTransport for CLI integration

```typescript
// Key architectural pattern
import 'dotenv/config';  // Automatic .env loading
const server = new McpServer({ name: "zulip-mcp-server", version: "1.5.0" });

// Resources provide contextual data
server.resource("users-directory", "zulip://users", handler);

// Tools provide Zulip operations  
server.tool("send-message", SendMessageSchema.shape, handler);
```

## Environment Configuration

**Required Variables** (set in `.env` file or environment):
```bash
ZULIP_URL=https://your-org.zulipchat.com
ZULIP_EMAIL=your-bot@your-org.zulipchat.com  
ZULIP_API_KEY=your_api_key_here
```

**Optional**:
```bash
DEBUG=true                    # Enable debug logging
NODE_ENV=development         # Environment mode
```

The server automatically loads `.env` files and provides detailed error messages for missing variables.

## Current MCP Tools Implementation

**Helper Tools** (LLM-friendly discovery):
- `search-users` - Find users by name/email before sending DMs
- `get-started` - Test connection and get workspace overview

**Message Operations**:
- `send-message` - Send to channels or direct messages
- `get-messages` - Retrieve message history with filtering
- `edit-message` - Modify existing messages  
- `delete-message` - Remove messages
- `add-emoji-reaction` / `remove-emoji-reaction` - React to messages
- `get-message` - Get specific message details
- `get-message-read-receipts` - Check who read messages

**Channel/Stream Management**:
- `get-subscribed-channels` - List user's subscriptions
- `get-channel-id` - Get channel ID by name
- `get-channel-by-id` - Detailed channel information
- `get-topics-in-channel` - Browse recent topics

**User Operations**:
- `get-users` - List organization members
- `get-user-by-email` - Find user by email
- `get-user` - Get user details by ID
- `update-status` - Set user status message
- `get-user-groups` - List available user groups

**Scheduling & Drafts**:
- `create-scheduled-message` / `edit-scheduled-message` - Schedule messages
- `get-drafts` / `create-draft` / `edit-draft` - Manage message drafts
- `upload-file` - Share files and images

**MCP Resources Available**:
- `users-directory` (zulip://users) - Browse organization members
- `channels-directory` (zulip://channels) - Explore available channels
- `message-formatting-guide` (zulip://formatting/guide) - Markdown syntax reference
- `common-patterns` (zulip://patterns/common) - LLM usage workflows and troubleshooting

## Key Implementation Patterns

### Environment Validation with Helpful Errors
```typescript
function validateEnvironment(): ZulipConfig {
  if (!url || !email || !apiKey) {
    throw new Error(`Missing required environment variables. Please set:
      - ZULIP_URL: Your Zulip server URL (e.g., https://your-org.zulipchat.com)
      - ZULIP_EMAIL: Your bot/user email address  
      - ZULIP_API_KEY: Your API key from Zulip settings
      
      Missing: ${!url ? 'ZULIP_URL ' : ''}${!email ? 'ZULIP_EMAIL ' : ''}${!apiKey ? 'ZULIP_API_KEY ' : ''}`);
  }
}
```

### MCP Tool Pattern (using Zod schemas from types.ts)
```typescript
server.tool(
  "tool-name",
  SchemaFromTypes.shape,  // Import from types.ts
  async (params) => {
    try {
      const result = await zulipClient.operation(params);
      return createSuccessResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      return createErrorResponse(`Error: ${error.message}`);
    }
  }
);
```

### Enhanced Error Messages (in zulip/client.ts)
The Zulip client provides contextual error guidance:
- "User not found" → Points to `search-users` tool
- "Channel not found" → Points to `get-subscribed-channels`
- "Invalid email" → Explains to use actual emails, not display names

## LLM Usability Features & Tool Workflows

### **Recommended Workflows**
**Discovery**: `get-started` → `search-users` → `send-message`
**User Lookup**: `search-users` (explore) → `get-user-by-email` (exact) → `get-user` (detailed)
**Messages**: `get-messages` (bulk/search) → `get-message` (detailed analysis)
**Channels**: `get-subscribed-channels` → `get-channel-id` → `get-topics-in-channel`

### **Tool Selection Guide**
**When to use each user tool:**
- 🔍 `search-users` - Don't know exact details, want to explore users
- 📧 `get-user-by-email` - Have exact email, need profile details  
- 🆔 `get-user` - Have user ID from search, need complete information

**When to use each message tool:**
- 📋 `get-messages` - Browse conversations, search content, get history
- 🔍 `get-message` - Analyze one specific message, check edit history

**Channel vs Stream terminology**: Tools use "channel" (user-friendly) but API parameters use "stream" (technical) - they're the same thing.

## Testing & Quality

**Current State**: No tests implemented yet (TODO item in DEVELOPMENT.md)

**Interactive Testing**:
```bash
npx @modelcontextprotocol/inspector  # Test MCP tools interactively
npm run dev                          # Test against real Zulip workspace
```

**Quality Checks**:
```bash
npm run quality      # Current baseline: lint + typecheck + audit
npm run quality-full # Future: includes tests when implemented
```