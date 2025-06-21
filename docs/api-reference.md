---
title: "API Reference"
description: "Complete API documentation for all 25 tools and 4 resources in Zulip MCP Server"
---

**Navigation:** [Home](index) | [Installation](installation) | [Configuration](configuration) | [Usage Examples](usage-examples) | [Troubleshooting](troubleshooting)

# API Reference

Complete documentation for all **25 tools** and **4 resources** available in the Zulip MCP Server.

## Table of Contents

- [Resources](#resources) (4 available)
- [Helper Tools](#helper-tools) (2 tools)
- [Message Operations](#message-operations) (10 tools)
- [User Operations](#user-operations) (5 tools)
- [Stream Management](#stream-management) (4 tools)
- [Drafts & Files](#drafts--files) (4 tools)

---

## Resources

Resources provide contextual data to enhance LLM understanding of your Zulip workspace.

### 1. User Directory
**URI**: `zulip://users?include_bots={include_bots}`

Browse organization members with roles and status information.

**Parameters**:
- `include_bots` (boolean, optional): Include bot users in results

**Returns**: Complete user directory with:
- User IDs, emails, and full names
- Role information (owner, admin, moderator, guest, member)
- Activity status and bot indicators

### 2. Streams Directory
**URI**: `zulip://streams?include_archived={include_archived}`

Explore available streams and their settings.

**Parameters**:
- `include_archived` (boolean, optional): Include archived streams

**Returns**: Stream information including:
- Stream IDs, names, and descriptions
- Privacy settings (invite-only, web-public)
- Archive status and announcement-only flags

### 3. Message Formatting Guide
**URI**: `zulip://formatting/guide`

Complete Zulip markdown syntax reference for message formatting.

**Returns**: Comprehensive formatting guide covering:
- Standard Markdown (bold, italic, code, links)
- Zulip-specific features (mentions, stream links, spoilers)
- Code blocks with syntax highlighting
- Math expressions and custom emoji

### 4. Common Patterns
**URI**: `zulip://patterns/common`

LLM usage workflows and troubleshooting guidance.

**Returns**: Best practices including:
- Recommended tool workflows
- Common mistakes to avoid
- Debugging tips and error resolution
- Tool selection guidance

---

## Helper Tools

LLM-optimized tools for discovery and orientation.

### 1. search-users
🔍 **DISCOVERY**: Search for users by partial name or email when you don't know exact details.

**Parameters**:
- `query` (string, required): Name, email, or partial match to search for users
- `limit` (number, optional): Maximum number of results to return (default: 10)

**Returns**: Array of matching users with basic info (name, email, ID, status)

**Example**:
```json
{
  "query": "john",
  "limit": 5
}
```

### 2. get-started
🚀 **START HERE**: Test connection and get workspace overview. Perfect for orientation and troubleshooting.

**Parameters**: None

**Returns**: Connection status and workspace information:
- Your email and Zulip URL
- Available streams count and sample names
- Recent activity indicators
- Quick tips for LLM usage

---

## Message Operations

Comprehensive message management capabilities.

### 1. send-message
💬 **SEND MESSAGE**: Send messages to streams or direct users.

**Parameters**:
- `type` (enum, required): "stream" for channels, "direct" for private messages
- `to` (string, required): For streams: channel name. For direct: comma-separated emails
- `content` (string, required): Message content using Zulip Markdown syntax
- `topic` (string, optional): Topic name for stream messages (required for streams)

**Example - Stream Message**:
```json
{
  "type": "stream",
  "to": "general",
  "topic": "Daily Standup",
  "content": "Good morning team! 👋\n\n**Today's Goals:**\n- Review PR #123\n- Deploy feature X"
}
```

**Example - Direct Message**:
```json
{
  "type": "direct",
  "to": "user@example.com,colleague@example.com",
  "content": "Can you review the latest changes when you have a moment?"
}
```

### 2. get-messages
📋 **BULK RETRIEVAL**: Get multiple messages with filtering, pagination, and search.

**Parameters**:
- `anchor` (number|string, optional): Starting point: message ID, "newest", "oldest", or "first_unread"
- `num_before` (number, optional): Number of messages before anchor (max 1000)
- `num_after` (number, optional): Number of messages after anchor (max 1000)
- `narrow` (array, optional): Filters: `[["stream", "name"], ["topic", "name"], ["sender", "email"], ["search", "query"]]`
- `message_id` (number, optional): Get specific message by ID

**Example - Stream History**:
```json
{
  "narrow": [["stream", "general"], ["topic", "announcements"]],
  "num_before": 50
}
```

**Example - Search Messages**:
```json
{
  "narrow": [["search", "deployment"], ["sender", "admin@example.com"]]
}
```

### 3. get-message
🔍 **SINGLE MESSAGE**: Get complete details about one specific message.

**Parameters**:
- `message_id` (number, required): Unique message ID to retrieve
- `apply_markdown` (boolean, optional): Return HTML content (true) or raw Markdown (false). Default: true
- `allow_empty_topic_name` (boolean, optional): Allow empty topic names in response. Default: false

**Returns**: Single message with full details including edit history and reactions.

### 4. edit-message
Edit an existing message's content or topic.

**Parameters**:
- `message_id` (number, required): Unique ID of the message to edit
- `content` (string, optional): New message content with Markdown formatting
- `topic` (string, optional): New topic name (for stream messages only)

### 5. delete-message
Delete a message by its ID.

**Parameters**:
- `message_id` (number, required): Unique ID of the message to delete

### 6. add-emoji-reaction
Add an emoji reaction to a message.

**Parameters**:
- `message_id` (number, required): ID of the message to react to
- `emoji_name` (string, required): Emoji name (e.g., "thumbs_up", "heart", "rocket")
- `emoji_code` (string, optional): Unicode code point for the emoji
- `reaction_type` (enum, optional): "unicode_emoji", "realm_emoji", or "zulip_extra_emoji"

### 7. remove-emoji-reaction
Remove an emoji reaction from a message.

**Parameters**:
- `message_id` (number, required): ID of the message to remove reaction from
- `emoji_name` (string, required): Emoji name to remove
- `emoji_code` (string, optional): Unicode code point for the emoji
- `reaction_type` (enum, optional): Type of emoji reaction

### 8. upload-file
Upload a file or image to Zulip.

**Parameters**:
- `filename` (string, required): Name of the file including extension
- `content` (string, required): Base64 encoded file content
- `content_type` (string, optional): MIME type. Auto-detected if not provided

**Returns**: File URI for use in messages

### 9. get-message-read-receipts
Get list of users who have read a specific message.

**Parameters**:
- `message_id` (number, required): Unique message ID to get read receipts for

**Returns**: Array of user IDs who have read the message

### 10. create-scheduled-message
Schedule a message to be sent at a future time.

**Parameters**:
- `type` (enum, required): "stream" for channels, "direct" for private messages
- `to` (string, required): Recipients (channel name or comma-separated emails)
- `content` (string, required): Message content with Markdown formatting
- `topic` (string, optional): Topic for stream messages
- `scheduled_delivery_timestamp` (number, required): Unix timestamp when message should be sent

---

## User Operations

User discovery and profile management.

### 1. get-users
👥 **ALL USERS**: Get complete list of all users in the organization.

**Parameters**:
- `client_gravatar` (boolean, optional): Include Gravatar URLs for users. Default: true
- `include_custom_profile_fields` (boolean, optional): Include custom profile fields. Default: false

**Returns**: Complete user list with profiles, roles, and activity status

### 2. get-user-by-email
📧 **EXACT LOOKUP**: Find a user when you have their exact email address.

**Parameters**:
- `email` (string, required): Email address of the user to look up
- `client_gravatar` (boolean, optional): Include Gravatar profile image URL
- `include_custom_profile_fields` (boolean, optional): Include organization-specific custom profile fields

**Returns**: Single user with complete profile details

### 3. get-user
🆔 **DETAILED LOOKUP**: Get comprehensive user profile when you have their user ID.

**Parameters**:
- `user_id` (number, required): Unique user ID to retrieve information for
- `client_gravatar` (boolean, optional): Include Gravatar URL. Default: true
- `include_custom_profile_fields` (boolean, optional): Include custom profile fields. Default: false

**Returns**: Complete user information including role, timezone, avatar, and custom fields

### 4. update-status
Update user status message with emoji and availability.

**Parameters**:
- `status_text` (string, optional): Status message text (max 60 chars, empty string clears status)
- `away` (boolean, optional): Set away status (deprecated in Zulip 6.0)
- `emoji_name` (string, optional): Emoji name for status
- `emoji_code` (string, optional): Emoji identifier
- `reaction_type` (enum, optional): "unicode_emoji", "realm_emoji", or "zulip_extra_emoji"

**Examples**:
```json
{
  "status_text": "In a meeting",
  "emoji_name": "coffee",
  "emoji_code": "2615",
  "reaction_type": "unicode_emoji"
}
```

### 5. get-user-groups
Get all user groups in the organization.

**Parameters**: None

**Returns**: List of user groups with member counts and descriptions

---

## Stream Management

Stream (channel) discovery and management.

### 1. get-subscribed-streams
📺 **USER STREAMS**: Get all streams you're subscribed to.

**Parameters**:
- `include_subscribers` (boolean, optional): Include subscriber lists for streams

**Returns**: Your stream subscriptions with settings and permissions

### 2. get-stream-id
🔢 **STREAM ID LOOKUP**: Get the numeric ID of a stream when you know its name.

**Parameters**:
- `stream_name` (string, required): Name of the stream to get ID for

**Returns**: Stream ID for the specified stream name

### 3. get-stream-by-id
📊 **STREAM DETAILS**: Get comprehensive information about a stream when you have its numeric ID.

**Parameters**:
- `stream_id` (number, required): Unique stream ID to get details for
- `include_subscribers` (boolean, optional): Include subscriber list

**Returns**: Complete stream information including settings, description, and creation date

### 4. get-topics-in-stream
💬 **STREAM TOPICS**: Get all recent topics (conversation threads) in a specific stream.

**Parameters**:
- `stream_id` (number, required): Unique stream ID to get topics for

**Returns**: List of recent topics with their latest message IDs

---

## Drafts & Files

Message draft management and file operations.

### 1. create-draft
📝 **CREATE DRAFT**: Save a message as draft for later editing or sending.

**Parameters**:
- `type` (enum, required): "stream" for channels, "private" for direct messages
- `to` (array, required): Array of user IDs for private messages, or single channel ID for stream messages
- `topic` (string, required): Topic for stream messages (required even for private messages in API)
- `content` (string, required): Draft message content with Markdown formatting
- `timestamp` (number, optional): Unix timestamp for draft creation (defaults to current time)

### 2. get-drafts
Retrieve all saved message drafts.

**Parameters**: None

**Returns**: Array of all saved drafts with content and metadata

### 3. edit-draft
Update an existing message draft.

**Parameters**:
- `draft_id` (number, required): Unique draft ID to edit
- `type` (enum, required): Draft message type
- `to` (array, required): Array of user IDs or channel ID
- `topic` (string, required): Topic for the draft
- `content` (string, required): Draft content
- `timestamp` (number, optional): Updated timestamp

### 4. edit-scheduled-message
Modify a scheduled message before it's sent.

**Parameters**:
- `scheduled_message_id` (number, required): Unique scheduled message ID to edit
- `type` (enum, optional): Message type
- `to` (string, optional): Recipients (channel name or comma-separated emails)
- `content` (string, optional): New message content
- `topic` (string, optional): New topic for stream messages
- `scheduled_delivery_timestamp` (number, optional): New delivery timestamp

---

## Tool Selection Guide

### When to use each user tool:
- 🔍 `search-users` → Exploring, don't know exact details, want multiple options
- 📧 `get-user-by-email` → Have exact email, need profile information  
- 🆔 `get-user` → Have user ID from search results, need complete details

### When to use each message tool:
- 📋 `get-messages` → Browse conversations, search content, get message history
- 🔍 `get-message` → Analyze one specific message, check reactions/edit history

### Recommended Workflows:
1. **Discovery**: `get-started` → `search-users` → `send-message`
2. **User Lookup**: `search-users` (explore) → `get-user-by-email` (exact) → `get-user` (detailed)
3. **Messages**: `get-messages` (bulk/search) → `get-message` (detailed analysis)
4. **Streams**: `get-subscribed-streams` → `get-stream-id` → `get-topics-in-stream`

---

## Error Handling

All tools provide comprehensive error handling with helpful messages:

- **"User not found"** → Points to `search-users` tool
- **"Stream not found"** → Points to `get-subscribed-streams`
- **"Invalid email"** → Explains to use actual emails, not display names
- **"Topic required"** → Reminds about topic requirement for stream messages

For debugging issues, always start with the `get-started` tool to verify your connection and workspace access.