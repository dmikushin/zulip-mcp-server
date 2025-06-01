---
name: MCP Community Submission
about: Submit this server to the MCP community servers list
title: "Add Zulip MCP Server to Community Servers"
labels: community-submission
---

## 📋 Server Information

**Name**: Zulip MCP Server  
**Category**: Productivity and Communication  
**Repository**: https://github.com/avisekrath/zulip-mcp-server  
**License**: MIT  

## 📝 Description

A comprehensive Model Context Protocol server that exposes Zulip REST API capabilities as tools for LLMs. Enables AI assistants to interact with Zulip workspaces for messaging, channel management, user operations, and file sharing.

## ✨ Key Features

- **22 MCP Tools**: Complete Zulip API coverage
- **5 MCP Resources**: Contextual data access
- **MCP Protocol Compliant**: Standard stdio transport for universal compatibility
- **Production Ready**: TypeScript, security, error handling

## 🛠️ Tools Provided

### Message Operations (10 tools)
- `send-message` - Send to channels or direct messages
- `get-messages` - Retrieve with filtering and search
- `get-message` - Get specific message details
- `edit-message`, `delete-message` - Message management
- `upload-file` - File sharing capabilities
- `add-emoji-reaction` - Message reactions
- `get-message-read-receipts` - Read status tracking
- `create-scheduled-message`, `edit-scheduled-message` - Message scheduling

### Draft Management (3 tools)
- `create-draft`, `get-drafts`, `edit-draft` - Draft management

### Channel Management (4 tools)
- `get-subscribed-channels` - List user subscriptions
- `get-channel-id`, `get-channel-by-id` - Channel operations
- `get-topics-in-channel` - Topic browsing

### User Operations (5 tools)
- `get-user`, `get-user-by-email`, `get-users` - User management
- `update-status` - Status management
- `get-user-groups` - Group information

## 🚀 Installation

```bash
npm install
cp .env.example .env  # Configure Zulip credentials
npm run build
npm start
```

## 📱 Claude Desktop Configuration

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

## 🔌 MCP Protocol

Uses standard stdio transport for compatibility with any MCP-compliant client.

## 📚 Documentation

- Comprehensive README with setup instructions
- Multi-platform client configurations
- Remote deployment guide
- API documentation and examples

## ✅ Quality Assurance

- ✅ TypeScript with strict mode
- ✅ ESLint configuration
- ✅ Comprehensive error handling
- ✅ Production-ready code quality
- ✅ MCP protocol compliance
- ✅ Security best practices

## 🎯 Target Placement

Request addition to the **Community Servers** section under **Productivity and Communication** category, alongside the existing Slack server.

## 📄 Additional Information

**Author**: thearlabs with claude code  
**Version**: 1.0.0  
**Status**: Production Ready  
**Maintenance**: Actively maintained