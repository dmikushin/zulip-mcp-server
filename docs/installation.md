---
title: "Installation Guide"
description: "Complete installation and setup guide for Zulip MCP Server"
---

**Navigation:** [Home](index) | [API Reference](api-reference) | [Configuration](configuration) | [Usage Examples](usage-examples) | [Troubleshooting](troubleshooting)

# Installation Guide

Complete guide to install and configure the Zulip MCP Server for your environment.

## Prerequisites

Before installing, ensure you have:

- **Node.js 18+** with npm
- **TypeScript 5+** (installed via npm)
- **Access to a Zulip instance** (e.g., https://your-organization.zulipchat.com)
- **Zulip API credentials** (bot token or personal API key)

## Quick Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/avisekrath/zulip-mcp-server.git
cd zulip-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Configure Environment

Create a `.env` file with your Zulip credentials:

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
nano .env
```

Add your Zulip configuration:

```env
ZULIP_URL=https://your-organization.zulipchat.com
ZULIP_EMAIL=your-bot-email@yourcompany.com
ZULIP_API_KEY=your-api-key-here
NODE_ENV=production
```

### 3. Test the Installation

```bash
# Test the server
npm start

# Or use the development server
npm run dev
```

## Getting Zulip API Credentials

### Option 1: Bot Access (Recommended)

Bot access provides controlled permissions and is ideal for production use.

1. **Navigate to Bot Settings**:
   - Go to your Zulip organization settings
   - Click on "Bots" in the left sidebar
   - Click "Add a new bot"

2. **Create Bot**:
   - **Bot type**: Choose "Generic bot"
   - **Full name**: "MCP Integration Bot" (or your preferred name)
   - **Username**: "mcp-bot" (or your preferred username)
   - **Description**: "Bot for MCP server integration"

3. **Get Credentials**:
   - After creation, copy the **bot email** and **API key**
   - The bot email will be something like `mcp-bot@your-organization.zulipchat.com`

4. **Set Permissions** (Optional):
   - Configure bot permissions based on your needs
   - For full functionality, ensure the bot can send messages and access public streams

### Option 2: Personal Access

Personal access uses your own account credentials.

1. **Navigate to Personal Settings**:
   - Click on your profile picture → "Personal settings"
   - Go to "Account & privacy" tab

2. **Generate API Key**:
   - Find the "API key" section
   - Click "Generate API key" or "Show API key"
   - Copy your email address and the generated API key

⚠️ **Security Note**: Personal API keys have the same permissions as your account. Use bot accounts for production deployments.

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ZULIP_URL` | ✅ | Your Zulip server URL | `https://your-org.zulipchat.com` |
| `ZULIP_EMAIL` | ✅ | Bot or user email address | `bot@your-org.zulipchat.com` |
| `ZULIP_API_KEY` | ✅ | API key from Zulip settings | `abcdef123456...` |
| `NODE_ENV` | ❌ | Environment mode | `production` or `development` |
| `DEBUG` | ❌ | Enable debug logging | `true` or `false` |

## Verification

### Test Connection

Run the built-in connection test:

```bash
# Using the MCP inspector
npx @modelcontextprotocol/inspector npm start
```

This will open a web interface where you can:
1. Test the `get-started` tool to verify connection
2. Browse available tools and resources
3. Execute sample commands

### Expected Output

A successful connection should show:

```json
{
  "status": "✅ Connected to Zulip",
  "your_email": "your-bot@example.com",
  "zulip_url": "https://your-org.zulipchat.com",
  "streams_available": 15,
  "sample_streams": ["general", "development", "announcements"],
  "recent_activity": true,
  "quick_tips": [...]
}
```

## Build Scripts Reference

The project includes several useful npm scripts:

### Development Scripts
```bash
npm run dev              # Live development server with tsx
npm run build:watch      # TypeScript compilation in watch mode
```

### Production Scripts
```bash
npm run build           # Clean build: removes dist/ then compiles TypeScript
npm start              # Run compiled server from dist/
npm run clean          # Remove dist/ folder (clear build artifacts)
```

### Code Quality Scripts
```bash
npm run quality        # lint + typecheck + audit
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix ESLint issues
npm run typecheck      # TypeScript compilation check
npm run audit:fix      # Fix npm security vulnerabilities
```

### Quality with Tests (Future)
```bash
npm run quality-full   # Includes tests when implemented
npm test              # Jest (no tests implemented yet)
```

### Pre-commit Scripts
```bash
npm run precommit     # lint + typecheck + build
```

## Directory Structure

After installation, your project structure will be:

```
zulip-mcp-server/
├── src/
│   ├── server.ts          # Main MCP server implementation
│   ├── types.ts           # TypeScript type definitions
│   └── zulip/
│       └── client.ts      # Zulip REST API client
├── dist/                  # Compiled JavaScript (after build)
├── docs/                  # Documentation (GitHub Pages)
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── .env                   # Environment variables (you create this)
└── README.md              # Project README
```

## Troubleshooting

### Common Issues

#### "Missing required environment variables"
- **Cause**: Environment variables not set or `.env` file missing
- **Solution**: Create `.env` file with all required variables
- **Check**: Ensure no typos in variable names

#### "Connection test failed"
- **Cause**: Invalid Zulip URL, email, or API key
- **Solution**: Verify credentials in Zulip settings
- **Check**: Ensure URL includes `https://` and correct domain

#### "TypeScript compilation errors"
- **Cause**: Outdated Node.js or TypeScript version
- **Solution**: Update to Node.js 18+ and TypeScript 5+
- **Check**: Run `node --version` and `npm list typescript`

#### "Permission denied" errors
- **Cause**: Bot lacks necessary permissions
- **Solution**: Check bot permissions in Zulip organization settings
- **Check**: Ensure bot can access required streams

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Set debug mode in .env
DEBUG=true

# Or run with debug environment variable
DEBUG=true npm start
```

### Getting Help

If you encounter issues:

1. **Check the logs**: Look for error messages in the console output
2. **Verify credentials**: Use the `get-started` tool to test connection
3. **Review Zulip API docs**: [zulip.com/api](https://zulip.com/api/)
4. **Open an issue**: [GitHub Issues](https://github.com/avisekrath/zulip-mcp-server/issues)

## Next Steps

After successful installation:

1. **Configure your LLM client**: See [Configuration Guide](/configuration)
2. **Explore the API**: Check out [API Reference](/api-reference)
3. **Try examples**: Review [Usage Examples](/usage-examples)
4. **Customize setup**: Modify for your specific use case

## Security Best Practices

### For Production Deployments

1. **Use Bot Accounts**: Create dedicated bots instead of personal accounts
2. **Limit Permissions**: Give bots only necessary permissions
3. **Secure API Keys**: Store API keys securely, never commit to version control
4. **Regular Rotation**: Rotate API keys periodically
5. **Monitor Usage**: Track bot activity for unusual patterns

### Environment Security

```bash
# Add .env to .gitignore (already included)
echo ".env" >> .gitignore

# Set proper file permissions
chmod 600 .env

# Use environment variables in production
export ZULIP_URL="https://your-org.zulipchat.com"
export ZULIP_EMAIL="bot@your-org.zulipchat.com"
export ZULIP_API_KEY="your-secure-api-key"
```

---

**Ready to configure your LLM client?** Continue to the **[Configuration Guide](configuration)** to set up Claude Desktop, Cursor, or Raycast integration.

---

**Navigation:** [← Home](index) | [Configuration →](configuration) | [API Reference](api-reference) | [Troubleshooting](troubleshooting)