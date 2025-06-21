---
title: "Zulip Terminology"
description: "Understanding Zulip's unique terminology and concepts for better MCP integration"
---

**Navigation:** [Home](index) | [Installation](installation) | [API Reference](api-reference) | [Configuration](configuration) | [Usage Examples](usage-examples)

# Zulip Terminology Reference

Understanding Zulip's terminology is crucial for effective use of the MCP server. This guide explains key concepts and their equivalents in other platforms.

## Core Concepts

### Streams vs Channels

**The most important concept to understand:**

| Zulip Term | Other Platforms | Description |
|------------|----------------|-------------|
| **Stream** | Channel (Slack/Discord), Team (Teams) | Main conversation spaces for topics |
| **Topic** | Thread (Slack), Thread (Discord) | Focused discussions within streams |

**Key Points:**
- **Streams = Channels** - These terms are completely interchangeable
- This MCP server uses "stream" to match Zulip's official terminology
- If you're familiar with Slack "channels" or Discord "channels", Zulip "streams" work identically

### Message Organization

```
Organization
├── Stream #1 (e.g., "Development")
│   ├── Topic: "Sprint Planning"
│   ├── Topic: "Code Reviews" 
│   └── Topic: "Bug Reports"
├── Stream #2 (e.g., "General")
│   ├── Topic: "Announcements"
│   └── Topic: "Random Chat"
└── Direct Messages
    ├── 1:1 conversations
    └── Group conversations
```

## Stream Types and Properties

### Stream Privacy Levels

| Type | Description | Who Can Join | Message Visibility |
|------|-------------|--------------|-------------------|
| **Public** | Open to all organization members | Anyone can subscribe | Messages visible to all subscribers |
| **Private** | Invitation-only | Only invited members | Messages only visible to subscribers |
| **Web Public** | Publicly accessible | Anyone on internet | Messages visible to anyone with link |
| **Announcement-only** | Read-only for most users | Admins control posting | Limited posting permissions |

### Stream Settings

- **invite_only**: Boolean indicating if stream is private
- **is_web_public**: Stream is accessible without login
- **is_archived**: Stream is archived (read-only)
- **is_announcement_only**: Only designated users can post

## Topics: Zulip's Threading System

### What Makes Topics Special

Unlike other platforms where threads are optional, **Zulip requires topics for all stream messages**:

```
Stream: #development
├── Topic: "Sprint 23 Planning"     ← All messages about sprint planning
├── Topic: "API Rate Limiting Fix"  ← All messages about this bug
└── Topic: "Code Review Process"    ← All messages about reviews
```

### Topic Benefits

1. **Perfect Organization**: Every message has a clear context
2. **Easy Catching Up**: Read only topics relevant to you
3. **Persistent Discussions**: Topics maintain focus over time
4. **Search Efficiency**: Find conversations by topic name

### Topic Best Practices

- **Descriptive Names**: "API Bug Fix" not "Bug"
- **Specific Scope**: One topic per discussion thread
- **Consistent Naming**: Follow team conventions
- **Update When Scope Changes**: Rename topics if discussion evolves

## User Roles and Permissions

### Organizational Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| **Owner** | Full admin + ownership transfer | Organization founder/owner |
| **Administrator** | All admin functions | Full management access |
| **Moderator** | Stream and user moderation | Content and behavior management |
| **Member** | Standard user access | Regular team member |
| **Guest** | Limited access to specific streams | External collaborators |
| **Bot** | Automated access via API | Integration and automation |

### Stream-Level Permissions

- **Stream administrators**: Manage specific streams
- **Subscribers**: Members who receive stream notifications
- **Posting permissions**: Who can send messages to streams

## Message Features

### Mentions and Notifications

| Syntax | Effect | When to Use |
|--------|--------|-------------|
| `@**Full Name**` | Standard mention with notification | Direct someone's attention |
| `@_**Full Name**_` | Silent mention (no notification) | Reference without interrupting |
| `@**all**` | Mentions everyone in organization | Important announcements only |
| `@**stream**` | Mentions all stream subscribers | Stream-wide announcements |
| `@**topic**` | Mentions all topic participants | Topic-specific updates |

### Stream and Topic References

- `#**stream-name**` - Link to a stream
- `#**stream-name>topic-name**` - Link to specific topic
- `#**stream-name>topic-name@messageID**` - Link to specific message

### Message Types

| Type | Description | Use Cases |
|------|-------------|-----------|
| **Stream Message** | Public message in a stream topic | Team discussions, announcements |
| **Direct Message** | Private 1:1 or group message | Private conversations, sensitive topics |
| **Scheduled Message** | Message sent at future time | Reminders, time-zone coordination |
| **Draft** | Saved unsent message | Work-in-progress, offline composition |

## Zulip vs Other Platforms

### Coming from Slack

| Slack Concept | Zulip Equivalent | Key Difference |
|---------------|------------------|----------------|
| Channel | Stream | Same concept, different name |
| Thread | Topic | Topics are required and more prominent |
| DM | Direct Message | Same functionality |
| Workspace | Organization | Same concept |
| App/Bot | Bot | Same integration capabilities |

### Coming from Discord

| Discord Concept | Zulip Equivalent | Key Difference |
|-----------------|------------------|----------------|
| Server | Organization | Same concept |
| Channel | Stream | Same concept, different name |
| Thread | Topic | Topics are more central to Zulip |
| DM | Direct Message | Same functionality |
| Role | Role | Similar permission system |

### Coming from Microsoft Teams

| Teams Concept | Zulip Equivalent | Key Difference |
|---------------|------------------|----------------|
| Team | Organization | Same concept |
| Channel | Stream | Same concept, different name |
| Conversation | Topic | Topics are more structured |
| Chat | Direct Message | Same functionality |

## MCP Server Terminology Usage

### Why "Stream" in Tool Names?

The MCP server uses "stream" terminology because:

1. **Official Zulip API** uses "stream" in all endpoints
2. **Consistency** with Zulip documentation and UI
3. **Clarity** for developers working with Zulip API
4. **Future-proofing** as Zulip evolves

### Tool Name Mapping

| MCP Tool | Function | Zulip API Endpoint |
|----------|----------|-------------------|
| `get-subscribed-streams` | List user's stream subscriptions | `/api/v1/users/me/subscriptions` |
| `get-stream-id` | Get stream ID by name | `/api/v1/get_stream_id` |
| `get-stream-by-id` | Get stream details | `/api/v1/streams/{id}` |
| `get-topics-in-stream` | List topics in stream | `/api/v1/users/me/{id}/topics` |

### Resource URI Schemes

- `zulip://streams` - Browse available streams
- `zulip://users` - Browse organization members  
- `zulip://formatting/guide` - Message formatting reference
- `zulip://patterns/common` - Usage patterns and workflows

## Common Workflow Terminology

### Message Workflow Terms

- **Send**: Create and deliver a message
- **Edit**: Modify existing message content or topic
- **React**: Add emoji reaction to message
- **Quote**: Reference another message in your reply
- **Star**: Bookmark message for later reference
- **Pin**: Highlight important message in topic

### Stream Management Terms

- **Subscribe**: Join a stream to receive messages
- **Unsubscribe**: Leave a stream
- **Mute**: Stop notifications from stream/topic
- **Archive**: Make stream read-only and hide from lists
- **Pin**: Keep stream at top of sidebar

### Organization Terms

- **Realm**: Zulip's internal term for organization
- **Domain**: Email domain for organization members
- **Custom Profile Fields**: Additional user information fields
- **Emoji**: Custom emoji specific to organization

## Best Practices for MCP Usage

### When Using MCP Tools

1. **Stream Discovery**: Always use `get-subscribed-streams` to see exact stream names
2. **User Search**: Use `search-users` before sending direct messages
3. **Topic Clarity**: Include descriptive topics for all stream messages
4. **Error Handling**: Tool error messages guide you to correct syntax

### Common Mistakes to Avoid

| Mistake | Correct Approach | Tool to Use |
|---------|------------------|-------------|
| Using display names for DMs | Use actual email addresses | `search-users` |
| Wrong stream name spelling | Use exact names from API | `get-subscribed-streams` |
| Forgetting topic for streams | Always include topic parameter | N/A (required) |
| Assuming stream exists | Verify stream access first | `get-stream-id` |

### Terminology in Error Messages

The MCP server provides helpful error messages:

- **"Stream not found"** → Check exact spelling with `get-subscribed-streams`
- **"User not found"** → Use email addresses from `search-users`
- **"Topic required"** → Include topic parameter for stream messages
- **"Permission denied"** → Check bot permissions in Zulip settings

---

## Quick Reference

### Essential Zulip Concepts

1. **Streams** = Channels (conversation spaces)
2. **Topics** = Required thread names for stream messages
3. **Direct Messages** = Private conversations
4. **Mentions** = `@**Name**` syntax for notifications
5. **Stream Links** = `#**stream-name**` for references

### MCP Tool Categories

- **Helper Tools**: `get-started`, `search-users`
- **Stream Tools**: `get-subscribed-streams`, `get-stream-id`, `get-stream-by-id`, `get-topics-in-stream`
- **Message Tools**: `send-message`, `get-messages`, `get-message`, `edit-message`
- **User Tools**: `get-users`, `get-user-by-email`, `get-user`

Understanding these concepts will help you use the Zulip MCP Server effectively and communicate clearly with your team about Zulip features and functionality.