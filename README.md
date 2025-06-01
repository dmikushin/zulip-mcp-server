# Zulip MCP Server

A Model Context Protocol (MCP) server that exposes Zulip REST API capabilities as tools for LLMs. This server allows AI assistants to interact with your Zulip workspace programmatically.

## Features

### 🔄 **Resources** (Contextual Data)
- **User Directory**: Browse organization members with roles and status
- **Channel Directory**: Explore available channels and permissions  
- **Message Formatting Guide**: Complete Zulip markdown syntax reference
- **Organization Info**: Server settings, policies, and custom emoji
- **User Groups**: Available groups for mentions and permissions

### 🛠️ **Tools** (19 Available Actions)

#### Message Operations
- `send-message` - Send to channels or direct messages
- `get-messages` - Retrieve with advanced filtering and search
- `upload-file` - Share files and images
- `edit-message` - Modify content or move topics
- `delete-message` - Remove messages (admin permissions required)
- `get-message-read-receipts` - Check who read messages
- `add-emoji-reaction` - React with Unicode or custom emoji

#### Scheduled Messages & Drafts
- `create-scheduled-message` - Schedule future messages
- `edit-scheduled-message` - Modify scheduled messages
- `get-drafts` - Retrieve saved drafts
- `edit-draft` - Update draft content

#### Channel Management
- `get-subscribed-channels` - List user's channel subscriptions
- `get-channel-id` - Get channel ID by name
- `get-channel-by-id` - Detailed channel information
- `get-topics-in-channel` - Browse recent topics

#### User Operations
- `get-user-by-email` - Find users by email
- `get-users` - List organization members
- `update-status` - Set status message and availability
- `get-user-groups` - List available user groups

## Installation & Setup

### Prerequisites
- Node.js 18+ with npm
- TypeScript 5+
- Access to a Zulip instance (e.g., https://your-organization.zulipchat.com)
- Zulip API credentials (bot token or API key)

### Quick Start

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd zulip-mcp-server
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your Zulip credentials
```

3. **Build and run:**
```bash
npm run build
npm start
```

### Environment Configuration

Create a `.env` file with your Zulip credentials:

```env
ZULIP_URL=https://your-organization.zulipchat.com
ZULIP_EMAIL=your-bot-email@yourcompany.com
ZULIP_API_KEY=your-api-key-here
NODE_ENV=production
```

#### Getting Zulip API Credentials

1. **For Bot Access** (Recommended):
   - Go to your Zulip organization settings
   - Navigate to "Bots" section
   - Create a new bot or use existing one
   - Copy the bot email and API key

2. **For Personal Access**:
   - Go to Personal Settings → Account & Privacy
   - Find "API key" section
   - Generate or reveal your API key

### Claude Desktop Integration

To use this MCP server with Claude Desktop, add the following configuration to your Claude Desktop config file:

#### Option 1: Using Environment Variables (Recommended)

Add to your Claude Desktop configuration:
```json
{
  "mcpServers": {
    "zulip": {
      "command": "node",
      "args": ["/path/to/zulip-mcp-server/dist/server.js"],
      "env": {
        "ZULIP_URL": "https://your-organization.zulipchat.com",
        "ZULIP_EMAIL": "your-bot-email@yourcompany.com", 
        "ZULIP_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Option 2: Using .env File

If you prefer using a `.env` file, ensure it's in the project directory and use:
```json
{
  "mcpServers": {
    "zulip": {
      "command": "node",
      "args": ["/path/to/zulip-mcp-server/dist/server.js"],
      "cwd": "/path/to/zulip-mcp-server"
    }
  }
}
```

**Claude Desktop Config Location:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Development

### Scripts
```bash
npm run dev          # Development with hot reload
npm run build        # Build for production
npm test            # Run tests
npm run lint        # Lint TypeScript
npm run typecheck   # Type checking
```

### Project Structure
```
src/
├── server.ts        # Main MCP server
├── zulip/
│   └── client.ts    # Zulip API client
└── types.ts         # TypeScript definitions
```

### Testing

Test the server using MCP Inspector:
```bash
npx @modelcontextprotocol/inspector npm start
```

## Usage Examples

### Sending Messages
```typescript
// Send to a channel
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
// Get recent messages from a channel
await callTool("get-messages", {
  narrow: [["stream", "general"], ["topic", "announcements"]],
  num_before: 50
});

// Search messages
await callTool("get-messages", {
  narrow: [["search", "deployment"], ["sender", "admin@example.com"]]
});
```

### Channel Management
```typescript
// List subscribed channels
await callTool("get-subscribed-channels", {
  include_subscribers: true
});

// Get channel topics
await callTool("get-topics-in-channel", {
  stream_id: 123
});
```

## Markdown Formatting Support

The server includes a comprehensive formatting guide resource. Zulip supports:

- **Standard Markdown**: Bold, italic, code, links, lists
- **Mentions**: `@**Full Name**` (notify), `@_**Name**_` (silent)
- **Channel Links**: `#**channel-name**`
- **Code Blocks**: With syntax highlighting
- **Math**: LaTeX expressions with `$$math$$`
- **Spoilers**: `||hidden content||`
- **Custom Emoji**: Organization-specific emoji

## Error Handling

The server provides comprehensive error handling:
- Network connectivity issues
- Authentication failures
- Permission errors
- Rate limiting
- Invalid parameters
- Zulip API errors

All errors include helpful messages for debugging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure TypeScript compilation passes
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check Zulip API documentation: https://zulip.com/api/
- Review MCP specification: https://modelcontextprotocol.io/
- Open GitHub issues for bugs or feature requests