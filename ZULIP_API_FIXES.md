# Zulip API Integration Fixes

## Issues Identified & Fixed

### 1. **Message Type Parameter**
**Problem**: Using `type: "direct"` when Zulip API expects `type: "private"`

**Fix**: Convert message types in the client:
```typescript
const zulipType = params.type === 'direct' ? 'private' : 'stream';
```

### 2. **Direct Message Recipients Format**
**Problem**: Zulip API expects recipients as JSON array, not comma-separated string

**Before**:
```javascript
{ to: "user@example.com,user2@example.com" }
```

**After**:
```javascript
{ to: JSON.stringify(["user@example.com", "user2@example.com"]) }
```

### 3. **Content-Type Header**
**Problem**: Some Zulip endpoints prefer form-encoded data over JSON

**Fix**: Use `application/x-www-form-urlencoded` with URLSearchParams:
```typescript
headers: {
  'Content-Type': 'application/x-www-form-urlencoded'
},
transformRequest: [(data) => {
  const params = new URLSearchParams();
  for (const key in data) {
    if (data[key] !== undefined) {
      params.append(key, data[key]);
    }
  }
  return params;
}]
```

### 4. **Parameter Validation**
**Added**: Client-side validation for email formats in direct messages

## Updated Tool Usage

### Send Direct Message
```typescript
// Correct usage
await callTool("send-message", {
  type: "direct",
  to: "user@yourcompany.com",           // Single recipient
  content: "Hello! How are you doing?"
});

// Multiple recipients
await callTool("send-message", {
  type: "direct", 
  to: "user1@yourcompany.com,user2@yourcompany.com",  // Comma-separated
  content: "Team meeting in 10 minutes!"
});
```

### Send Stream Message
```typescript
await callTool("send-message", {
  type: "stream",
  to: "general",                        // Channel name
  topic: "Daily Standup",               // Required for streams
  content: "Good morning team! 👋"
});
```

## Testing the Fixes

### 1. **Direct Message Test**
```bash
# Should work now
{
  "type": "direct",
  "to": "your-email@yourcompany.com",
  "content": "Test message from MCP server"
}
```

### 2. **Stream Message Test** 
```bash
# Should work now
{
  "type": "stream", 
  "to": "test-channel",
  "topic": "MCP Testing",
  "content": "This is a test from the MCP server!"
}
```

## Error Handling Improvements

### Better Error Messages
- **Invalid email format**: Clear validation before API call
- **Missing topic**: Explicit check for stream messages
- **API errors**: More detailed error parsing from Zulip responses

### Debug Information
Set `NODE_ENV=development` for verbose logging:
```bash
NODE_ENV=development npm start
```

## Verification Steps

1. **Rebuild the server**:
   ```bash
   npm run build
   ```

2. **Test with Claude Desktop**:
   - Update your config with the new server
   - Try sending both direct and stream messages

3. **Check Zulip activity**:
   - Verify messages appear in correct channels/conversations
   - Confirm proper formatting and recipients

## Common Issues & Solutions

### "Missing 'type' argument"
- **Cause**: Server not converting `direct` → `private`
- **Solution**: ✅ Fixed in client conversion

### "Invalid recipients"
- **Cause**: Wrong recipient format for direct messages  
- **Solution**: ✅ Fixed with JSON array formatting

### "Authentication failed"
- **Cause**: Wrong credentials or bot permissions
- **Solution**: Verify ZULIP_EMAIL and ZULIP_API_KEY in .env

### "Stream not found"
- **Cause**: Channel name doesn't exist or no access
- **Solution**: Use `get-subscribed-channels` tool to see available channels

## API Reference Updates

The server now correctly implements:
- ✅ POST `/api/v1/messages` with proper formatting
- ✅ POST `/api/v1/scheduled_messages` with proper formatting  
- ✅ Form-encoded requests where required
- ✅ JSON array formatting for recipients
- ✅ Type conversion (direct → private)

All 19 tools should now work correctly with your Zulip instance at https://your-zulip-instance.com!