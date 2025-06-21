---
title: "Configuration Guide"
description: "LLM client configuration guide for Claude Desktop, Cursor IDE, and Raycast"
---

**Navigation:** [Home](index) | [Installation](installation) | [API Reference](api-reference) | [Usage Examples](usage-examples) | [Troubleshooting](troubleshooting)

# Client Configuration Guide

Configure the Zulip MCP Server with your preferred LLM client. This guide covers the most popular integrations.

## Overview

The Zulip MCP Server works with any MCP-compliant client. Here are verified configurations:

| Client | Status | Use Case | Configuration |
|--------|---------|----------|---------------|
| **Claude Desktop** | ✅ Verified | AI conversations with Zulip | [Setup →](#claude-desktop) |
| **Cursor IDE** | ✅ Verified | Code editor with Zulip notifications | [Setup →](#cursor-ide) |
| **Raycast** | ✅ Verified | Quick commands and automation | [Setup →](#raycast) |
| **Other MCP Clients** | 🔄 Compatible | Any MCP-compliant application | [Generic →](#generic-mcp-client) |

---

## Claude Desktop

### Configuration Location

Find your Claude Desktop config file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Option 1: Environment Variables (Recommended)

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "zulip": {
      "command": "node",
      "args": ["/absolute/path/to/zulip-mcp-server/dist/server.js"],
      "env": {
        "ZULIP_URL": "https://your-organization.zulipchat.com",
        "ZULIP_EMAIL": "your-bot-email@yourcompany.com", 
        "ZULIP_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Option 2: .env File

If you prefer using a `.env` file:

```json
{
  "mcpServers": {
    "zulip": {
      "command": "node",
      "args": ["/absolute/path/to/zulip-mcp-server/dist/server.js"],
      "cwd": "/absolute/path/to/zulip-mcp-server"
    }
  }
}
```

### Verification

1. **Restart Claude Desktop** after updating the configuration
2. **Open a new conversation** and ask: "Can you check if Zulip is connected?"
3. **Look for Zulip tools** in the tools panel (should show 25 tools available)

### Example Usage in Claude

```
You: "Send a message to the #general stream saying hello to the team"

Claude: I'll send a message to the general stream for you. Let me use the send-message tool.

[Claude uses the send-message tool with appropriate parameters]

The message has been sent successfully to the general stream!
```

---

## Cursor IDE

### Configuration Location

Cursor supports both workspace and global MCP configurations:

- **Workspace**: `.cursor-mcp/config.json` in your project root
- **Global**: Platform-specific Cursor settings directory

### Workspace Configuration

Create `.cursor-mcp/config.json` in your project:

```json
{
  "mcpServers": {
    "zulip": {
      "command": "node",
      "args": ["/absolute/path/to/zulip-mcp-server/dist/server.js"],
      "env": {
        "ZULIP_URL": "https://your-organization.zulipchat.com",
        "ZULIP_EMAIL": "your-bot-email@yourcompany.com",
        "ZULIP_API_KEY": "your-api-key-here"
      },
      "capabilities": {
        "tools": true,
        "resources": true
      }
    }
  }
}
```

### Global Configuration

Add to Cursor's global MCP settings:

```json
{
  "mcpServers": {
    "zulip": {
      "name": "Zulip Integration",
      "description": "Send messages and interact with Zulip workspace",
      "command": "node",
      "args": ["/absolute/path/to/zulip-mcp-server/dist/server.js"],
      "env": {
        "ZULIP_URL": "https://your-organization.zulipchat.com",
        "ZULIP_EMAIL": "your-bot-email@yourcompany.com",
        "ZULIP_API_KEY": "your-api-key-here"
      },
      "capabilities": {
        "tools": true,
        "resources": true
      }
    }
  }
}
```

### Setup Steps

1. **Create configuration file** in your preferred location
2. **Update file paths** to match your installation
3. **Add your Zulip credentials** 
4. **Restart Cursor IDE**
5. **Open MCP panel** to verify connection

### Use Cases in Cursor

- **Deployment notifications**: Automatically notify team when code is deployed
- **Code review requests**: Send formatted messages about pull requests
- **Error reporting**: Forward build failures to development channels
- **Status updates**: Share development progress with stakeholders

---

## Raycast

### Installation

1. **Install Raycast MCP Extension**:
   - Open Raycast
   - Search for "MCP" extension
   - Install the official MCP extension

2. **Configure Server**:
   - Open Raycast preferences
   - Go to Extensions → MCP
   - Add new server configuration

### Configuration

Add this configuration in the Raycast MCP extension:

```json
{
  "servers": {
    "zulip": {
      "name": "Zulip Integration",
      "description": "Send messages and interact with Zulip workspace",
      "command": "node",
      "args": ["/absolute/path/to/zulip-mcp-server/dist/server.js"],
      "env": {
        "ZULIP_URL": "https://your-organization.zulipchat.com",
        "ZULIP_EMAIL": "your-bot-email@yourcompany.com",
        "ZULIP_API_KEY": "your-api-key-here"
      },
      "icon": "💬",
      "categories": ["communication", "productivity"],
      "capabilities": {
        "tools": true,
        "resources": true
      }
    }
  }
}
```

### Usage

1. **Open Raycast** with `⌘ + Space` (macOS) or `Alt + Space` (Windows/Linux)
2. **Search for "Zulip"** commands
3. **Execute tools directly** from the Raycast interface

### Example Raycast Commands

- "Zulip send message to general"
- "Zulip get recent messages"
- "Zulip search users"
- "Zulip check connection"

---

## Generic MCP Client

For any MCP-compliant client, use this universal configuration pattern:

### Basic Setup

```json
{
  "name": "zulip-mcp-server",
  "command": "node",
  "args": ["/absolute/path/to/zulip-mcp-server/dist/server.js"],
  "env": {
    "ZULIP_URL": "https://your-organization.zulipchat.com",
    "ZULIP_EMAIL": "your-bot-email@yourcompany.com",
    "ZULIP_API_KEY": "your-api-key-here"
  }
}
```

### Command Line Usage

You can also run the server directly:

```bash
# Set environment variables
export ZULIP_URL="https://your-org.zulipchat.com"
export ZULIP_EMAIL="bot@your-org.zulipchat.com"  
export ZULIP_API_KEY="your-api-key"

# Run the server
node /path/to/zulip-mcp-server/dist/server.js
```

---

## Path Configuration

### Finding Absolute Paths

Use these commands to get the correct paths for your configuration:

```bash
# Get the project directory
pwd
# Example output: /Users/username/zulip-mcp-server

# Verify the compiled server exists
ls -la dist/server.js
# Should show the compiled JavaScript file

# Test the server directly
node dist/server.js
```

### Common Path Examples

**macOS/Linux**:
```
/Users/username/zulip-mcp-server/dist/server.js
/home/username/zulip-mcp-server/dist/server.js
```

**Windows**:
```
C:\Users\username\zulip-mcp-server\dist\server.js
```

---

## Environment Variables vs .env Files

### Environment Variables (Recommended for Production)

**Pros**:
- More secure (not stored in files)
- Better for containerized deployments
- Easier to manage in CI/CD

**Setup**:
```bash
export ZULIP_URL="https://your-org.zulipchat.com"
export ZULIP_EMAIL="bot@your-org.zulipchat.com"
export ZULIP_API_KEY="your-api-key"
```

### .env Files (Good for Development)

**Pros**:
- Easy to manage locally
- Version control friendly (when properly excluded)
- Simple configuration

**Setup**:
```env
# .env file in project root
ZULIP_URL=https://your-org.zulipchat.com
ZULIP_EMAIL=bot@your-org.zulipchat.com
ZULIP_API_KEY=your-api-key
```

---

## Troubleshooting Configuration

### Common Issues

#### "Server not found" or "Command failed"
- **Check file paths**: Ensure absolute paths are correct
- **Verify build**: Run `npm run build` to ensure `dist/server.js` exists
- **Test directly**: Run `node dist/server.js` to verify the server works

#### "Environment variables missing"
- **Check credentials**: Verify all required variables are set
- **Test variables**: Use `echo $ZULIP_URL` to check if set
- **Restart client**: Some clients need restart after config changes

#### "Connection failed" 
- **Verify credentials**: Test with `get-started` tool
- **Check network**: Ensure Zulip URL is accessible
- **Review permissions**: Verify bot has necessary permissions

### Debug Mode

Enable debug logging in any client:

```json
{
  "env": {
    "ZULIP_URL": "https://your-org.zulipchat.com",
    "ZULIP_EMAIL": "bot@your-org.zulipchat.com",
    "ZULIP_API_KEY": "your-api-key",
    "DEBUG": "true"
  }
}
```

### Verification Steps

1. **Test direct execution**:
   ```bash
   node dist/server.js
   ```

2. **Use MCP Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector npm start
   ```

3. **Try the get-started tool** in your client to verify connection

---

## Next Steps

After successful configuration:

1. **Test basic functionality** with the `get-started` tool
2. **Explore available tools** in the [API Reference](/api-reference)
3. **Try practical examples** from [Usage Examples](/usage-examples)
4. **Customize for your workflow** based on your team's needs

Need help with specific use cases? Check out our [Usage Examples](/usage-examples) or [Troubleshooting Guide](/troubleshooting).