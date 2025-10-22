# Zulip MCP Server

A Model Context Protocol (MCP) server that exposes Zulip REST API capabilities as tools for LLMs. This server allows AI assistants to interact with your Zulip workspace programmatically.

**NPM Package:** [@dmikushin/zulip-mcp-server](https://www.npmjs.com/package/@dmikushin/zulip-mcp-server)

## Quick Start

**Recommended: Use npx (no installation required)**

Add to Claude Desktop (`~/.claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "zulip": {
      "command": "npx",
      "args": ["@dmikushin/zulip-mcp-server"],
      "env": {
        "ZULIP_URL": "https://your-org.zulipchat.com",
        "ZULIP_EMAIL": "your-bot@your-org.zulipchat.com",
        "ZULIP_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Alternative: Global installation**
```bash
npm install -g @dmikushin/zulip-mcp-server
```

Then use in Claude Desktop:
```json
{
  "mcpServers": {
    "zulip": {
      "command": "zulip-mcp-server",
      "env": {
        "ZULIP_URL": "https://your-org.zulipchat.com",
        "ZULIP_EMAIL": "your-bot@your-org.zulipchat.com",
        "ZULIP_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Features

### 🔄 **Resources** (Contextual Data)
- **User Directory**: Browse organization members with roles and status
- **Stream Directory**: Explore available streams and permissions
- **Message Formatting Guide**: Complete Zulip markdown syntax reference
- **Organization Info**: Server settings, policies, and custom emoji
- **User Groups**: Available groups for mentions and permissions

### 🛠️ **Tools** (25 Available Actions)

#### Helper Tools (LLM-Friendly Discovery)
- `search-users` - Find users by name/email before sending DMs
- `get-started` - Test connection and get workspace overview

#### Message Operations
- `send-message` - Send to streams or direct messages
- `get-messages` - Retrieve with advanced filtering and search
- `get-message` - Get detailed information about specific message
- `upload-file` - Share files and images
- `edit-message` - Modify content or move topics
- `delete-message` - Remove messages (admin permissions required)
- `get-message-read-receipts` - Check who read messages
- `add-emoji-reaction` - React with Unicode or custom emoji
- `remove-emoji-reaction` - Remove emoji reactions from messages

#### Scheduled Messages & Drafts
- `create-scheduled-message` - Schedule future messages
- `edit-scheduled-message` - Modify scheduled messages
- `create-draft` - Create new message drafts
- `get-drafts` - Retrieve saved drafts
- `edit-draft` - Update draft content

#### Stream Management
- `get-subscribed-streams` - List user's stream subscriptions
- `get-stream-id` - Get stream ID by name
- `get-stream-by-id` - Detailed stream information
- `get-topics-in-stream` - Browse recent topics

#### User Operations
- `get-users` - List organization members
- `get-user-by-email` - Find users by email
- `get-user` - Get detailed user information by ID
- `update-status` - Set status message and availability
- `get-user-groups` - List available user groups

## Zulip Configuration

### Getting Your API Credentials

You need to obtain Zulip API credentials. You can use either a bot account (recommended) or your personal account:

**Option 1: Bot Account (Recommended)**
1. In your Zulip organization, go to **Settings** → **Your bots**
2. Click **Add a new bot**
3. Choose **Generic bot** type
4. Set a name (e.g., "Claude MCP Bot")
5. Copy the **bot email** and **API key**

**Option 2: Personal Account**
1. Go to **Settings** → **Account & privacy**
2. Click **Show/change your API key**
3. Copy your **email** and **API key**

### Required Permissions
The bot/user needs these permissions:
- Send messages to streams
- Send private messages
- Read all messages (for message retrieval)
- Access user information

### Environment Variables
Set these in your Claude Desktop configuration:
```bash
ZULIP_URL=https://your-org.zulipchat.com    # Your Zulip server URL
ZULIP_EMAIL=your-bot@your-org.zulipchat.com # Bot email or your email
ZULIP_API_KEY=your_api_key_here             # API key from above steps
```

## 📝 Zulip Terminology: Streams vs Channels

In Zulip, **"streams"** and **"channels"** refer to the same concept:
- **Stream** = Official Zulip terminology (used in API, tools, interface)
- **Channel** = Common term from Slack/Discord/Teams
- **Same thing** = Conversation spaces where teams discuss topics

This MCP server uses "stream" to match Zulip's official documentation and API.

## Usage in Claude

After adding the MCP server to Claude Desktop configuration, restart Claude and you'll have access to Zulip tools. Here are some examples:

### Sending Messages
```typescript
// Send to a stream
await callTool("send-message", {
  type: "stream",
  to: "general",
  topic: "Daily Standup",
  content: "Good morning team! 👋\n\n**Today's Goals:**\n- Review PR #123\n- Deploy feature X"
});

// Direct message
await callTool("send-message", {
  type: "direct",
  to: "user@example.com",
  content: "Hey! Can you review the latest changes when you have a moment?"
});
```

### Getting Messages
```typescript
// Get recent messages from a stream
await callTool("get-messages", {
  narrow: [["stream", "general"], ["topic", "announcements"]],
  num_before: 50
});

// Search messages
await callTool("get-messages", {
  narrow: [["search", "deployment"], ["sender", "admin@example.com"]]
});
```

### Stream Management
```typescript
// List subscribed streams
await callTool("get-subscribed-streams", {
  include_subscribers: true
});

// Get stream topics
await callTool("get-topics-in-stream", {
  stream_id: 123
});
```

## Development Setup

If you want to contribute or run from source:

1. **Clone and build the server:**
   ```bash
   git clone https://github.com/dmikushin/zulip-mcp-server.git
   cd zulip-mcp-server
   npm install
   npm run build
   ```

2. **Set up environment variables** (create `.env` file or set in your shell):
   ```bash
   ZULIP_URL=https://your-org.zulipchat.com
   ZULIP_EMAIL=your-bot@your-org.zulipchat.com
   ZULIP_API_KEY=your_api_key_here
   ```

3. **Add to Claude Desktop** for local development:
   ```json
   {
     "mcpServers": {
       "zulip": {
         "command": "node",
         "args": ["/path/to/zulip-mcp-server/dist/server.js"],
         "env": {
           "ZULIP_URL": "https://your-org.zulipchat.com",
           "ZULIP_EMAIL": "your-bot@your-org.zulipchat.com",
           "ZULIP_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

### Testing

**Test the published package:**
```bash
npx @dmikushin/zulip-mcp-server
```

**Test during development:**
```bash
npm run dev
# or
npx @modelcontextprotocol/inspector
```

### Scripts
```bash
npm run dev          # Development with hot reload
npm run build        # Build for production
npm test            # Run tests
npm run lint        # Lint TypeScript
npm run typecheck   # Type checking
```

## Claude Desktop Config Location

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.claude/claude_desktop_config.json`

## Markdown Formatting Support

The server includes a comprehensive formatting guide resource. Zulip supports:

- **Standard Markdown**: Bold, italic, code, links, lists
- **Mentions**: `@**Full Name**` (notify), `@_**Name**_` (silent)
- **Stream Links**: `#**stream-name**`
- **Code Blocks**: With syntax highlighting
- **Math**: LaTeX expressions with `$$math$$`
- **Spoilers**: `||hidden content||`
- **Custom Emoji**: Organization-specific emoji

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure TypeScript compilation passes
5. Submit a pull request

## Support

For issues and questions:
- **GitHub Issues**: https://github.com/dmikushin/zulip-mcp-server/issues
- **Zulip API Docs**: https://zulip.com/api/
- **MCP Specification**: https://modelcontextprotocol.io/