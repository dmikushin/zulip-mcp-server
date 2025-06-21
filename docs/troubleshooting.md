---
title: "Troubleshooting Guide"
description: "Common issues and solutions for Zulip MCP Server"
---

**Navigation:** [Home](index) | [Installation](installation) | [API Reference](api-reference) | [Configuration](configuration) | [Usage Examples](usage-examples)

# Troubleshooting Guide

Solutions for common issues when using the Zulip MCP Server.

## Quick Diagnosis

Start here for immediate help:

### 1. Test Connection
Run the `get-started` tool in your LLM client:
```
You: "Can you test the Zulip connection?"
```

Expected response should include:
- ✅ Connected to Zulip
- Your email and Zulip URL
- Available streams count
- Quick tips

### 2. Check Server Status
```bash
# Test the server directly
node dist/server.js

# With debug output
DEBUG=true node dist/server.js
```

### 3. Verify Environment
```bash
# Check environment variables
echo $ZULIP_URL
echo $ZULIP_EMAIL
echo $ZULIP_API_KEY
```

---

## Installation Issues

### "Module not found" or "Cannot find package"

**Symptoms**: 
- Error: `Cannot find module '@modelcontextprotocol/sdk'`
- Server fails to start

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Update to latest versions
npm update

# Check Node.js version (needs 18+)
node --version
```

### "TypeScript compilation errors"

**Symptoms**:
- Build fails with type errors
- `npm run build` shows compilation errors

**Solutions**:
```bash
# Update TypeScript
npm install -g typescript@latest
npm install --save-dev typescript@latest

# Clean and rebuild
npm run clean
npm run build

# Check TypeScript version
tsc --version
```

### "Permission denied" during installation

**Symptoms**:
- Cannot create files or directories
- npm install fails with permission errors

**Solutions**:
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Use npx instead of global install
npx @modelcontextprotocol/inspector

# Alternative: Use Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

---

## Connection Issues

### "Missing required environment variables"

**Symptoms**:
```
Error: Missing required environment variables. Please set:
- ZULIP_URL: Your Zulip server URL
- ZULIP_EMAIL: Your bot/user email address  
- ZULIP_API_KEY: Your API key from Zulip settings
```

**Solutions**:
1. **Create .env file**:
   ```bash
   # Create .env in project root
   cat > .env << EOF
   ZULIP_URL=https://your-org.zulipchat.com
   ZULIP_EMAIL=your-bot@your-org.zulipchat.com
   ZULIP_API_KEY=your-api-key-here
   EOF
   ```

2. **Set environment variables**:
   ```bash
   export ZULIP_URL="https://your-org.zulipchat.com"
   export ZULIP_EMAIL="your-bot@your-org.zulipchat.com"
   export ZULIP_API_KEY="your-api-key-here"
   ```

3. **Verify variables are set**:
   ```bash
   env | grep ZULIP
   ```

### "Connection test failed" or "Unauthorized"

**Symptoms**:
- get-started tool returns connection errors
- 401 Unauthorized responses
- Network timeout errors

**Solutions**:

1. **Verify Zulip URL format**:
   ```bash
   # Correct format (note https://)
   ZULIP_URL=https://your-organization.zulipchat.com
   
   # Common mistakes to avoid:
   # ❌ http://your-org.zulipchat.com (missing https)
   # ❌ your-org.zulipchat.com (missing protocol)
   # ❌ https://your-org.zulipchat.com/ (trailing slash)
   ```

2. **Test credentials manually**:
   ```bash
   # Test API access with curl
   curl -X GET https://your-org.zulipchat.com/api/v1/users/me \
     -u "your-bot@your-org.zulipchat.com:your-api-key"
   ```

3. **Check bot permissions**:
   - Go to Zulip organization settings → Bots
   - Verify bot is active and has necessary permissions
   - Ensure bot can send messages to required streams

4. **Regenerate API key**:
   - Go to Zulip settings → Account & privacy → API key
   - Generate new API key
   - Update your configuration

### "Stream not found" or "User not found"

**Symptoms**:
- Error: `Stream 'general' does not exist`
- Error: `Invalid user email`

**Solutions**:

1. **Use exact stream names**:
   ```
   You: "What streams am I subscribed to?"
   [Use get-subscribed-streams tool to see exact names]
   ```

2. **Search for users first**:
   ```
   You: "Search for users with 'john' in their name"
   [Use search-users tool to find correct email addresses]
   ```

3. **Check spelling and case**:
   - Stream names are case-sensitive
   - Use exact names returned by list tools
   - Avoid typos in email addresses

---

## Configuration Issues

### LLM Client Not Detecting Server

**Symptoms**:
- No Zulip tools appear in LLM client
- Client shows 0 tools available
- MCP server not listed

**Solutions**:

1. **Verify file paths**:
   ```bash
   # Get absolute path
   pwd
   # Should be something like: /Users/username/zulip-mcp-server
   
   # Verify dist/server.js exists
   ls -la dist/server.js
   ```

2. **Update configuration with absolute paths**:
   ```json
   {
     "mcpServers": {
       "zulip": {
         "command": "node",
         "args": ["/absolute/path/to/zulip-mcp-server/dist/server.js"]
       }
     }
   }
   ```

3. **Restart LLM client** completely after configuration changes

4. **Check client-specific config locations**:
   - **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Cursor**: `.cursor-mcp/config.json` in workspace
   - **Raycast**: MCP extension settings

### "Server failed to start" in LLM Client

**Symptoms**:
- Client shows server error
- Tools briefly appear then disappear
- Connection timeout

**Solutions**:

1. **Test server manually**:
   ```bash
   # Run server directly to see errors
   node dist/server.js
   ```

2. **Check for port conflicts**:
   ```bash
   # Kill any existing node processes
   pkill -f "node.*server.js"
   
   # Check for port usage
   lsof -i :3000  # Adjust port if configured differently
   ```

3. **Use debug mode**:
   ```json
   {
     "env": {
       "ZULIP_URL": "...",
       "ZULIP_EMAIL": "...", 
       "ZULIP_API_KEY": "...",
       "DEBUG": "true"
     }
   }
   ```

---

## Runtime Issues

### Tools Timing Out or Slow Responses

**Symptoms**:
- Tools take >30 seconds to respond
- Timeout errors from LLM client
- Partial responses

**Solutions**:

1. **Check network connectivity**:
   ```bash
   # Test Zulip API response time
   time curl -X GET https://your-org.zulipchat.com/api/v1/users/me \
     -u "your-bot@your-org.zulipchat.com:your-api-key"
   ```

2. **Reduce request size**:
   ```
   # Instead of getting all messages
   You: "Get recent messages with limit 10"
   
   # Instead of all users
   You: "Search for specific users only"
   ```

3. **Check Zulip server status**:
   - Verify your Zulip instance is responsive
   - Check if there are any ongoing maintenance windows
   - Contact Zulip administrator if issues persist

### "Rate limit exceeded" Errors

**Symptoms**:
- Error: `Rate limit exceeded`
- 429 HTTP responses
- Temporary tool failures

**Solutions**:

1. **Reduce request frequency**:
   - Batch multiple operations together
   - Add delays between rapid requests
   - Use more specific queries

2. **Check rate limits**:
   ```
   You: "What's my current rate limit status?"
   [Some tools may include rate limit info in responses]
   ```

3. **Contact Zulip administrator**:
   - Request higher rate limits for your bot
   - Verify bot permissions and quotas

### Messages Not Sending or Formatting Issues

**Symptoms**:
- Messages appear sent but don't show in Zulip
- Formatting not applied correctly
- Special characters causing errors

**Solutions**:

1. **Verify message content**:
   ```
   # Test with simple message first
   You: "Send a simple test message to #general saying 'Hello'"
   
   # Then try formatted content
   You: "Send a message with **bold** and *italic* formatting"
   ```

2. **Check topic requirements**:
   ```
   # For stream messages, topic is required
   You: "Send to #general with topic 'Test' saying hello"
   ```

3. **Escape special characters**:
   - Use `\` to escape markdown characters
   - Be careful with `@` mentions and `#` stream references
   - Test complex formatting in small chunks

---

## Performance Optimization

### Slow Tool Responses

**Optimizations**:

1. **Use specific queries**:
   ```
   # Instead of: "Get all messages"
   You: "Get last 10 messages from #development"
   
   # Instead of: "Find all users"  
   You: "Search for users named 'john'"
   ```

2. **Batch operations**:
   ```
   You: "Send the same announcement to #sales, #marketing, and #support streams"
   ```

3. **Use appropriate tools**:
   - `search-users` for discovery
   - `get-user-by-email` for specific lookups
   - `get-messages` for browsing
   - `get-message` for single message details

### Memory Usage

**For large workspaces**:

1. **Limit concurrent requests**
2. **Use pagination when available**
3. **Restart server periodically in long-running environments**

---

## Debug Mode

### Enable Detailed Logging

1. **Environment variable**:
   ```bash
   DEBUG=true node dist/server.js
   ```

2. **In LLM client config**:
   ```json
   {
     "env": {
       "DEBUG": "true",
       "NODE_ENV": "development"
     }
   }
   ```

3. **Check logs**:
   - Look for detailed request/response information
   - Identify specific API calls failing
   - Check timing information

### Common Debug Patterns

```bash
# Test specific API endpoints
curl -v -X GET https://your-org.zulipchat.com/api/v1/streams \
  -u "your-bot@your-org.zulipchat.com:your-api-key"

# Check server accessibility
telnet your-org.zulipchat.com 443

# Verify DNS resolution
nslookup your-org.zulipchat.com
```

---

## Getting Help

### Before Asking for Help

1. **Try the get-started tool** to verify basic functionality
2. **Check recent error messages** in your LLM client
3. **Test with simple operations** before complex workflows
4. **Review configuration** for typos or incorrect paths

### When Reporting Issues

Include this information:

- **Version**: Zulip MCP Server version and Node.js version
- **Environment**: OS, LLM client, configuration method
- **Error messages**: Complete error text or screenshots
- **Steps to reproduce**: Minimal example that triggers the issue
- **Expected vs actual behavior**: What you expected to happen

### Resources

- **GitHub Issues**: [github.com/avisekrath/zulip-mcp-server/issues](https://github.com/avisekrath/zulip-mcp-server/issues)
- **Zulip API Docs**: [zulip.com/api](https://zulip.com/api/)
- **MCP Documentation**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- **Node.js Troubleshooting**: [nodejs.org/en/docs/guides/](https://nodejs.org/en/docs/guides/)

---

## Emergency Recovery

### Complete Reset

If nothing else works:

```bash
# 1. Stop all processes
pkill -f "node.*server"

# 2. Clean installation
rm -rf node_modules dist package-lock.json
npm install
npm run build

# 3. Reset configuration
rm .env
# Recreate .env with fresh credentials

# 4. Test directly
node dist/server.js

# 5. Restart LLM client
# Close and reopen your LLM client application
```

### Backup Configuration

Keep working configurations backed up:

```bash
# Backup working .env
cp .env .env.backup

# Backup working LLM client config
cp ~/.config/claude/claude_desktop_config.json claude_config.backup
```

This allows quick recovery when experimenting with new settings.