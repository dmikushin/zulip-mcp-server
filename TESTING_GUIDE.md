# Testing & Troubleshooting Guide

## 🧪 **Testing the Fixed Implementation**

### **Step 1: Setup Environment**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your actual Zulip credentials
nano .env
```

Your `.env` should look like:
```env
ZULIP_URL=https://your-zulip-instance.com
ZULIP_EMAIL=your-bot-email@yourcompany.com
ZULIP_API_KEY=your-actual-api-key-here
NODE_ENV=development
```

### **Step 2: Test Zulip Connection**
```bash
# Test basic Zulip API connectivity
node debug-zulip.js
```

**Expected Output:**
```
✅ Server connection successful
✅ Authentication successful
✅ Stream access successful
✅ Message sent successfully!
```

### **Step 3: Test MCP Server**
```bash
# Test the MCP send-message tool
node test-message.js
```

**Expected Output:**
```
✅ SUCCESS: Message was sent!
```

### **Step 4: Test with Claude Desktop**

Add to your Claude Desktop config:
```json
{
  "mcpServers": {
    "zulip": {
      "command": "node",
      "args": ["/Users/clarisights/Desktop/mcp-servers/zulip-mcp-server/dist/server.js"],
      "env": {
        "ZULIP_URL": "https://your-zulip-instance.com",
        "ZULIP_EMAIL": "your-bot-email@yourcompany.com", 
        "ZULIP_API_KEY": "your-actual-api-key-here",
        "NODE_ENV": "development"
      }
    }
  }
}
```

## 🔍 **Debug Information Added**

The updated server now logs detailed debug information:

### **What You'll See in Logs:**
```
🎯 MCP Tool - send-message called with: {"type":"direct","to":"user@example.com","content":"test"}
📧 Validating direct message recipients: ["user@example.com"]
🚀 Calling Zulip API...
🔍 Debug - sendMessage called with: {"type":"direct","to":"user@example.com","content":"test"}
🔍 Debug - Direct message recipients: ["user@example.com"]
🔍 Debug - Final payload: {"type":"direct","content":"test","to":["user@example.com"]}
✅ Debug - Message sent successfully: {"id":12345}
```

### **Error Scenarios:**
1. **Missing Environment Variables:**
   ```
   ❌ Missing environment variables. Please set: ZULIP_URL, ZULIP_EMAIL, ZULIP_API_KEY
   ```

2. **Authentication Failed:**
   ```
   💥 Zulip API Error (401): Invalid API key
   ```

3. **Invalid Recipients:**
   ```
   💥 Zulip API Error (400): Invalid user ID: user@invalid.com
   ```

## 🎯 **What The Fixes Address**

### **Issue 1: API Type Parameter**
- **Fixed**: Now tries `type: "direct"` first (modern API)
- **Fallback**: Falls back to form-encoded with different formats if needed

### **Issue 2: Recipient Format**
- **Fixed**: Tries multiple recipient formats:
  1. Array format: `["user@example.com"]`
  2. JSON string format: `"[\"user@example.com\"]"`

### **Issue 3: Content-Type Headers**
- **Fixed**: Tries JSON first, falls back to form-encoded
- **Smart**: Automatically detects which format your Zulip server prefers

### **Issue 4: Multiple Recipients**
- **Fixed**: Handles both single and comma-separated recipients:
  ```javascript
  // Single recipient
  { to: "user@example.com" }
  
  // Multiple recipients  
  { to: "user1@example.com,user2@example.com" }
  ```

## 🚨 **Common Error Solutions**

### **"Missing 'type' argument"**
- ✅ **FIXED**: Server now properly sends type parameter
- Check debug logs to see exact payload being sent

### **"Invalid recipients"**
- ✅ **FIXED**: Server tries multiple recipient formats
- Ensure email addresses are valid and users exist in Zulip

### **"Authentication failed"**
- Check `ZULIP_EMAIL` is correct (bot email, not your personal email)
- Verify `ZULIP_API_KEY` is correct and active
- Ensure bot has permission to send messages

### **"Stream not found"**
- Use `get-subscribed-channels` tool to see available channels
- Check channel name spelling and permissions

## 🔬 **Manual Testing Examples**

### **Test Direct Message:**
```json
{
  "type": "direct",
  "to": "your-email@yourcompany.com",
  "content": "Test message from fixed MCP server! 🎉"
}
```

### **Test Stream Message:**
```json
{
  "type": "stream",
  "to": "general", 
  "topic": "MCP Testing",
  "content": "Testing the fixed Zulip MCP server!"
}
```

### **Test Multiple Recipients:**
```json
{
  "type": "direct",
  "to": "user1@yourcompany.com,user2@yourcompany.com",
  "content": "Group message test from MCP server"
}
```

## 📊 **Verification Steps**

1. **Check Zulip Activity**: Messages should appear in Zulip
2. **Verify Recipients**: Direct messages go to correct users
3. **Check Formatting**: Markdown should render properly
4. **Test Permissions**: Bot should have necessary access

## 💡 **Next Steps If Still Not Working**

1. **Share Debug Logs**: Run with `NODE_ENV=development` and share the console output
2. **Test Manual API Call**: Use curl to test Zulip API directly
3. **Check Bot Permissions**: Verify bot settings in Zulip admin
4. **Verify Server Version**: Some older Zulip versions might need different formats

The server now automatically tries multiple formats and provides detailed logging to help identify exactly what's happening with your API calls!