# MCP Community Submission

## Zulip MCP Server

### Category: Productivity and Communication

### Description
A Model Context Protocol server that exposes Zulip REST API capabilities as tools for LLMs. Enables AI assistants to interact with Zulip workspaces for messaging, channel management, user operations, and file sharing.

### Repository
https://github.com/avisekrath/zulip-mcp-server

### Key Features
- **22 MCP Tools**: Complete coverage of Zulip's core functionality
- **5 MCP Resources**: Contextual data for users, channels, formatting guides
- **MCP Protocol Compliant**: Stdio transport for universal client compatibility
- **Production Ready**: TypeScript, comprehensive error handling, input validation

### Tools Available
- Message operations (send, get, edit, delete, reactions)
- Draft and scheduled message management
- Channel and user management
- File upload capabilities
- Real-time status updates

### Installation
```bash
npm install
cp .env.example .env  # Add Zulip credentials
npm run build
npm start
```

### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "zulip": {
      "command": "node",
      "args": ["/path/to/zulip-mcp-server/dist/server.js"],
      "env": {
        "ZULIP_URL": "https://your-org.zulipchat.com",
        "ZULIP_EMAIL": "bot@yourcompany.com",
        "ZULIP_API_KEY": "your-api-key"
      }
    }
  }
}
```

### MCP Protocol
Uses standard stdio transport for compatibility with any MCP-compliant client.

### License
MIT

### Author
thearlabs with claude code

### Status
✅ Production Ready
✅ Multi-Platform Compatible
✅ Comprehensive Documentation
✅ Remote Deployment Support