# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that exposes key capabilities of the Zulip REST API as tools for LLMs. The server acts as a bridge between LLMs and Zulip, allowing AI assistants to interact with Zulip chat workspaces programmatically.

## Technology Stack

- **Language**: TypeScript/Node.js
- **Framework**: MCP TypeScript SDK (`@modelcontextprotocol/sdk`)
- **Zulip Integration**: Zulip REST API client
- **Transport**: StdioServerTransport (for CLI) or StreamableHTTPServerTransport (for remote access)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint and type check
npm run lint
npm run typecheck
```

## Project Structure

```
src/
├── server.ts           # Main MCP server setup
├── tools/             # Zulip API tools
│   ├── messages.ts    # Message operations
│   ├── streams.ts     # Stream management
│   ├── users.ts       # User operations
│   └── index.ts       # Tool exports
├── resources/         # Optional: Zulip data resources
├── zulip/            # Zulip API client wrapper
└── types.ts          # TypeScript type definitions
```

## MCP Server Architecture

The server implements the MCP specification using the TypeScript SDK:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "zulip-mcp-server",
  version: "1.0.0"
});

// Tools for Zulip operations
server.tool("send-message", schema, handler);
server.tool("get-messages", schema, handler);
```

## Zulip Instance Configuration

- **Zulip URL**: https://your-zulip-instance.com (configure in environment variables)
- **Authentication**: Bot token or API key via environment variables
- **Base API URL**: https://your-zulip-instance.com/api/v1/

## Key Zulip API Tools to Implement

### Messages (`/api/v1/messages`)
- `send-message`: Send to channels or direct messages
  - **Required**: `type` (channel/direct), `to` (channel name or user IDs), `content`
  - **Optional**: `topic` (for channel messages), `queue_id`, `local_id`
- `get-messages`: Retrieve message history with advanced filtering
  - **Parameters**: `anchor` (newest/oldest/message_id), `narrow` (filters), `num_before/after`
  - **Filtering**: By sender, channel, topic, search terms
  - **Pagination**: Max 1000 messages per request (hard limit 5000)
- `update-message`: Edit existing messages
- `delete-message`: Delete messages
- `get-message-history`: Get edit history of a message
- `add-reaction`: Add emoji reactions to messages
- `remove-reaction`: Remove emoji reactions

### Channels/Streams (`/api/v1/streams`)
- `list-streams`: Get all accessible channels
  - **Parameters**: `include_public`, `include_subscribed`, `exclude_archived`
  - **Returns**: `stream_id`, `name`, `description`, `invite_only`, `is_archived`
- `get-stream-info`: Channel details and settings
- `create-stream`: Create new channels
- `update-stream`: Modify channel settings
- `archive-stream`: Archive channels
- `subscribe-to-stream`: Add users to channels
- `unsubscribe-from-stream`: Remove users from channels
- `get-stream-topics`: Get topics in a channel

### Users (`/api/v1/users`)
- `list-users`: All users in organization
  - **Returns**: User ID, email, full name, role, status, avatar, custom fields
- `get-user-info`: User profile and details
- `get-user-by-email`: Find user by email address
- `create-user`: Add new users (admin only)
- `update-user`: Modify user information
- `deactivate-user`: Deactivate user accounts
- `reactivate-user`: Reactivate user accounts
- `get-user-groups`: List user groups
- `create-user-group`: Create user groups
- `update-user-status`: Set user presence/status

### Real-time Events (`/api/v1/register`, `/api/v1/events`)
- `register-event-queue`: Register for real-time events
  - **Event types**: messages, subscriptions, users, realm_emoji
  - **Filtering**: By event types and narrow parameters
- `get-events`: Poll for events from registered queue
- `delete-event-queue`: Clean up event queue

### Organization & Server (`/api/v1/server_settings`, `/api/v1/realm`)
- `get-server-settings`: Server configuration and features
- `get-realm-info`: Organization settings and policies
- `get-realm-emoji`: Custom emoji in organization
- `upload-file`: Upload files and images
- `get-attachments`: List uploaded files

### Advanced Features
- `get-scheduled-messages`: List scheduled messages
- `create-scheduled-message`: Schedule messages for later
- `edit-scheduled-message`: Modify scheduled messages
- `delete-scheduled-message`: Cancel scheduled messages
- `get-drafts`: Get saved message drafts
- `create-draft`: Save message drafts
- `edit-draft`: Update message drafts

## Authentication Pattern

Use environment variables for Zulip credentials:
```typescript
const zulipConfig = {
  url: process.env.ZULIP_URL,
  email: process.env.ZULIP_EMAIL,
  apiKey: process.env.ZULIP_API_KEY
};
```

## Tool Implementation Pattern

Follow this pattern for implementing MCP tools:

```typescript
import { z } from "zod";

server.tool(
  "tool-name",
  {
    param1: z.string().describe("Description"),
    param2: z.number().optional()
  },
  async ({ param1, param2 }) => {
    try {
      const result = await zulipClient.someOperation(param1, param2);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text", 
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
);
```

## Error Handling

- Use try-catch blocks for all Zulip API calls
- Return structured error responses with `isError: true`
- Include helpful error messages for debugging
- Handle rate limiting and network errors gracefully

## Testing

- Use MCP Inspector for interactive testing: `npx @modelcontextprotocol/inspector`
- Test with real Zulip workspace in development
- Mock Zulip API for unit tests