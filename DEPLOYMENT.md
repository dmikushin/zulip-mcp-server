# Deployment Guide

## Quick Start

1. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your Zulip credentials
```

2. **Install & Build**
```bash
npm install
npm run build
```

3. **Test Setup**
```bash
node test-setup.js
```

4. **Run Server**
```bash
npm start
```

## Environment Variables

Required variables in `.env`:

```env
ZULIP_URL=https://your-zulip-instance.com
ZULIP_EMAIL=your-bot-email@yourcompany.com
ZULIP_API_KEY=your-api-key-here
NODE_ENV=production
```

### Getting Zulip Credentials

#### For Bot Access (Recommended)
1. Go to Zulip Organization Settings → Bots
2. Create new bot or use existing
3. Copy bot email and API key

#### For Personal Access
1. Go to Personal Settings → Account & Privacy
2. Find "API key" section
3. Generate/reveal API key

## Testing

### Using MCP Inspector
```bash
npx @modelcontextprotocol/inspector npm start
```

### Manual Testing
1. Verify environment validation
2. Test resource access
3. Test tool execution
4. Check error handling

## Production Deployment

### As CLI Tool
```bash
npm run build
node dist/server.js
```

### As NPM Package
```bash
npm pack
npm install -g zulip-mcp-server-1.0.0.tgz
zulip-mcp-server
```

### With Process Manager
```bash
# PM2 example
npm install -g pm2
pm2 start dist/server.js --name zulip-mcp-server
```

## Integration with LLM Applications

### Claude Desktop
Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "zulip": {
      "command": "node",
      "args": ["/path/to/zulip-mcp-server/dist/server.js"],
      "env": {
        "ZULIP_URL": "https://your-zulip-instance.com",
        "ZULIP_EMAIL": "bot@yourcompany.com",
        "ZULIP_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Custom Applications
```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["dist/server.js"],
  env: {
    ZULIP_URL: "https://your-zulip-instance.com",
    ZULIP_EMAIL: "bot@yourcompany.com",
    ZULIP_API_KEY: "your-api-key"
  }
});

const client = new Client({
  name: "my-app",
  version: "1.0.0"
});

await client.connect(transport);
```

## Security Considerations

- **Never commit credentials** to version control
- **Use bot accounts** instead of personal accounts
- **Limit bot permissions** to minimum required
- **Rotate API keys** regularly
- **Monitor API usage** for suspicious activity

## Troubleshooting

### Common Issues

**Environment Error**
```
Missing required environment variables
```
Solution: Ensure all required env vars are set

**Authentication Failed**
```
Zulip API Error (401): Invalid API key
```
Solution: Verify API key and email are correct

**Network Error**
```
Unable to reach Zulip server
```
Solution: Check ZULIP_URL and network connectivity

**Permission Denied**
```
Zulip API Error (403): Insufficient permissions
```
Solution: Check bot/user permissions in Zulip

### Debug Mode
Set environment variable:
```bash
NODE_ENV=development
```

### Logs
Server logs errors to stderr:
```bash
npm start 2> error.log
```

## Performance

- **Rate Limiting**: Zulip has API rate limits
- **Caching**: Server caches user/channel data
- **Timeouts**: 30-second timeout for API calls
- **Pagination**: Handles large result sets

## Updates

To update the server:
1. Pull latest changes
2. Run `npm install`
3. Run `npm run build`
4. Restart server

## Monitoring

Monitor these metrics:
- API request success/failure rates
- Response times
- Error frequencies
- Memory/CPU usage