---
title: "Zulip MCP Server"
description: "Model Context Protocol server for Zulip API integration with LLMs"
---

# Zulip MCP Server

A comprehensive **Model Context Protocol (MCP)** server that bridges LLMs with Zulip workspaces, providing **25 powerful tools** and **4 contextual resources** for seamless chat integration.

```
🤖 AI + 💬 Zulip = 🚀 Powerful Automation
```

## 📚 Documentation Navigation

- **[Installation Guide](installation)** - Complete setup and configuration
- **[API Reference](api-reference)** - All 25 tools and 4 resources documented  
- **[Configuration](configuration)** - Claude Desktop, Cursor, Raycast setup
- **[Usage Examples](usage-examples)** - Real-world workflows and tutorials
- **[Zulip Terminology](zulip-terminology)** - Understanding streams vs channels
- **[Troubleshooting](troubleshooting)** - Common issues and solutions
- **[Development](development)** - Contributing and extending the server
- **[Changelog](changelog)** - Version history and migration guides

---

## 🚀 Quick Start

Get started in 3 simple steps:

### 1. Install and Configure
```bash
git clone https://github.com/avisekrath/zulip-mcp-server.git
cd zulip-mcp-server
npm install && npm run build
```

### 2. Set Environment Variables
```bash
export ZULIP_URL="https://your-org.zulipchat.com"
export ZULIP_EMAIL="your-bot@example.com"
export ZULIP_API_KEY="your-api-key"
```

### 3. Connect to Your LLM Client
- **[Claude Desktop Configuration](configuration#claude-desktop)**
- **[Cursor IDE Setup](configuration#cursor-ide)**
- **[Raycast Integration](configuration#raycast)**

## ✨ What You Can Do

### 💬 **Message Operations**
- Send messages to streams or direct users
- Retrieve message history with advanced filtering
- Edit, delete, and react to messages
- Schedule messages for future delivery
- Manage drafts and uploads

### 👥 **User Management**
- Search and discover users by name/email
- Get detailed user profiles and status
- Update your own status and availability
- List organization members and groups

### 📺 **Stream Management**
- Browse subscribed streams (channels)
- Get stream details and recent topics
- Navigate conversation threads
- Access stream permissions and settings

### 🛠️ **Helper Tools**
- Test connections with workspace overview
- Get formatting guides and usage patterns
- Access comprehensive error guidance
- Browse contextual resources

## 📖 **Zulip Terminology**

**Streams = Channels** - In Zulip, these terms are interchangeable:
- **Stream** = Official Zulip terminology (used in API/tools)
- **Channel** = Common term from Slack/Discord/Teams
- **Same concept** = Conversation spaces for team discussions

This server uses "stream" to match Zulip's official documentation.

## 🔧 **Features Overview**

| Category | Tools Available | Description |
|----------|----------------|-------------|
| **Helper Tools** | 2 tools | Discovery and orientation for LLMs |
| **Messages** | 10 tools | Send, retrieve, edit, schedule, react |
| **Users** | 5 tools | Search, profiles, status management |
| **Streams** | 4 tools | Browse, manage, get details |
| **Drafts & Files** | 4 tools | Draft management and file uploads |
| **Resources** | 4 resources | Contextual data for better LLM responses |

**Total: `25 Tools + 4 Resources`**

## 🎯 **Use Cases**

### **For Development Teams**
- Automate standup updates and deployment notifications
- Create intelligent code review notifications
- Set up automated testing result summaries
- Generate release notes and announcements

### **For Customer Success**
- Automated customer health check summaries
- Escalation notifications with context
- Weekly/monthly report generation
- Customer feedback aggregation and routing

### **For Project Management**
- Sprint planning and retrospective summaries
- Automated milestone notifications
- Resource allocation updates
- Risk assessment and mitigation alerts

### **For Sales Teams**
- Deal stage progression notifications
- Lead scoring and qualification updates
- Automated follow-up reminders
- Pipeline health summaries

## 🔗 **Quick Links**

- 📦 **[Installation Guide](installation)** - Get started with setup
- 📚 **[API Reference](api-reference)** - Complete tool documentation  
- 💡 **[Usage Examples](usage-examples)** - Practical workflows
- ⚙️ **[Client Setup](configuration)** - Configure your LLM client

## 🌟 **Why Choose Zulip MCP Server?**

- **LLM-Optimized**: Helper tools and enhanced error messages designed for AI assistants
- **Comprehensive**: 25 tools covering all major Zulip operations
- **Well-Documented**: Extensive guides, examples, and troubleshooting
- **Multi-Client**: Works with Claude Desktop, Cursor, Raycast, and any MCP client
- **Production-Ready**: TypeScript implementation with robust error handling
- **Active Development**: Regular updates and community-driven improvements

## 📈 **Project Statistics**

| Metric | Value |
|--------|-------|
| **Current Version** | v1.5.0 |
| **MCP Protocol** | v1.0.0 compatible |
| **Node.js Required** | 18+ LTS |
| **TypeScript** | 5+ supported |
| **Total Tools** | 25 MCP tools |
| **Resources** | 4 contextual resources |
| **Supported Clients** | Claude, Cursor, Raycast |

## 🤝 **Community & Support**

- **GitHub Repository**: [avisekrath/zulip-mcp-server](https://github.com/avisekrath/zulip-mcp-server)
- **Issues & Bug Reports**: [GitHub Issues](https://github.com/avisekrath/zulip-mcp-server/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/avisekrath/zulip-mcp-server/discussions)
- **Zulip API Documentation**: [zulip.com/api](https://zulip.com/api/)
- **MCP Specification**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)

---

Ready to get started? Check out our **[Installation Guide](installation)** or explore the **[API Reference](api-reference)** to see all available tools and resources.

## 📖 **Documentation Pages**

| Page | Description |
|------|-------------|
| [Installation](installation) | Complete setup and configuration guide |
| [API Reference](api-reference) | All 25 tools and 4 resources documented |
| [Configuration](configuration) | Claude Desktop, Cursor, Raycast setup |
| [Usage Examples](usage-examples) | Real-world workflows and tutorials |
| [Zulip Terminology](zulip-terminology) | Understanding streams vs channels |
| [Troubleshooting](troubleshooting) | Common issues and solutions |
| [Development](development) | Contributing and extending the server |
| [Changelog](changelog) | Version history and migration guides |