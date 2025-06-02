#!/usr/bin/env node

/**
 * Zulip MCP Server - Clean version with improved code quality
 * Maintains full MCP compliance with better organization
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ZulipClient } from "./zulip/client.js";
import { 
  ZulipConfig,
  SendMessageSchema,
  GetMessagesSchema,
  UploadFileSchema,
  EditMessageSchema,
  AddReactionSchema,
  RemoveReactionSchema,
  CreateScheduledMessageSchema,
  EditScheduledMessageSchema,
  GetUserByEmailSchema,
  UpdateStatusSchema,
  CreateDraftSchema,
  EditDraftSchema,
  GetUserSchema,
  GetMessageSchema,
  GetMessageReadReceiptsSchema,
  ListUsersSchema,
  ListStreamsSchema,
  DeleteMessageSchema,
  GetStreamTopicsSchema,
  GetSubscribedChannelsSchema,
  GetChannelIdSchema,
  GetChannelByIdSchema
} from "./types.js";

/**
 * Environment validation
 */
function validateEnvironment(): ZulipConfig {
  const url = process.env.ZULIP_URL;
  const email = process.env.ZULIP_EMAIL;
  const apiKey = process.env.ZULIP_API_KEY;

  if (!url || !email || !apiKey) {
    throw new Error(
      "Missing required environment variables. Please set ZULIP_URL, ZULIP_EMAIL, and ZULIP_API_KEY"
    );
  }

  return { url, email, apiKey };
}

/**
 * Create success response in MCP format
 */
function createSuccessResponse(text: string) {
  return {
    content: [{
      type: "text" as const,
      text
    }]
  };
}

/**
 * Create error response in MCP format
 */
function createErrorResponse(message: string) {
  return {
    content: [{
      type: "text" as const,
      text: message
    }],
    isError: true
  };
}

/**
 * Validate email format for direct messages
 */
function validateEmailList(emailString: string): { isValid: boolean; emails: string[] } {
  const emails = emailString.split(',').map(email => email.trim());
  const invalidEmails = emails.filter(email => !email.includes('@'));
  
  return {
    isValid: invalidEmails.length === 0,
    emails
  };
}

// Initialize Zulip client
const config = validateEnvironment();
const zulipClient = new ZulipClient(config);

// Create MCP server
const server = new McpServer({
  name: "zulip-mcp-server",
  version: "1.0.0"
});

// Register Resources
server.resource(
  "users-directory",
  new ResourceTemplate("zulip://users?include_bots={include_bots}", { list: undefined }),
  async (uri, { include_bots }) => {
    try {
      const result = await zulipClient.getUsers({
        client_gravatar: true,
        include_custom_profile_fields: true
      });
      
      const users = result.members.filter(user => include_bots || !user.is_bot);
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            users: users.map(user => ({
              id: user.user_id,
              email: user.email,
              name: user.full_name,
              is_bot: user.is_bot,
              is_active: user.is_active,
              role: user.is_owner ? 'owner' : user.is_admin ? 'admin' : user.is_moderator ? 'moderator' : user.is_guest ? 'guest' : 'member'
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        contents: [{
          uri: uri.href,
          text: `Error fetching users: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

server.resource(
  "channels-directory", 
  new ResourceTemplate("zulip://channels?include_archived={include_archived}", { list: undefined }),
  async (uri, { include_archived }) => {
    try {
      const result = await zulipClient.getSubscriptions(false);
      const channels = include_archived 
        ? result.subscriptions 
        : result.subscriptions.filter(stream => !stream.is_archived);
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            channels: channels.map(stream => ({
              id: stream.stream_id,
              name: stream.name,
              description: stream.description,
              invite_only: stream.invite_only,
              is_archived: stream.is_archived,
              is_announcement_only: stream.is_announcement_only
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        contents: [{
          uri: uri.href,
          text: `Error fetching channels: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

server.resource(
  "message-formatting-guide",
  "zulip://formatting/guide",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: `# Zulip Message Formatting Guide

## Basic Markdown
- **Bold text**: **bold** or __bold__
- *Italic text*: *italic* or _italic_
- \`Code\`: \`inline code\`
- Links: [text](URL)
- ~~Strikethrough~~: ~~strikethrough~~
- Quoted text: > quoted text

## Zulip-Specific Formatting

### Mentions
#### User Mentions
- \`@**Full Name**\` - Standard mention (notifies user)
- \`@_**Full Name**_\` - Silent mention (no notification)

#### Group Mentions  
- \`@**groupname**\` - Standard group mention
- \`@_*groupname*\` - Silent group mention

#### Wildcard Mentions
- \`@**all**\` - Mentions all users in organization
- \`@**everyone**\` - Mentions all users in organization
- \`@**channel**\` - Mentions all subscribers to current channel
- \`@**topic**\` - Mentions all participants in current topic

### Channel and Topic Links
- \`#**channelname**\` - Link to channel
- \`#**channelname>topicname**\` - Link to specific topic
- \`#**channelname>topicname@messageID**\` - Link to specific message

### Code Blocks
\`\`\`python
def hello():
    print("Hello, Zulip!")
\`\`\`

### Spoiler Text
\`\`\`spoiler Header text
Hidden content here
\`\`\`

### Global Time Mentions
- \`<time:timestamp>\` - Displays time in user's timezone
- Example: \`<time:2024-06-02T10:30:00Z>\`

### Best Practices
- Use mentions sparingly to avoid notification spam
- Format code blocks with appropriate language for syntax highlighting
- Use silent mentions when you don't need immediate attention
- Link to specific topics/messages for better context
- Images are automatically thumbnailed and support previews

### Supported Features
- Unicode emoji and custom emoji
- Image uploads with automatic thumbnailing
- File attachments
- LaTeX math rendering (if enabled)
- Message reactions
- Message editing history`
    }]
  })
);

// Register Tools
server.tool(
  "send-message",
  "Send a message to a Zulip channel or direct message to users. Messages support full Markdown formatting.",
  SendMessageSchema.shape,
  async ({ type, to, content, topic }) => {
    try {
      if (type === 'stream' && !topic) {
        return createErrorResponse('Topic is required for stream messages');
      }

      if (type === 'direct') {
        const validation = validateEmailList(to);
        if (!validation.isValid) {
          return createErrorResponse(`Invalid email format for direct message recipients: ${to}`);
        }
      }

      const result = await zulipClient.sendMessage({ type, to, content, topic });
      return createSuccessResponse(`Message sent successfully! Message ID: ${result.id}`);
    } catch (error) {
      return createErrorResponse(`Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-messages",
  "Retrieve messages from Zulip with advanced filtering options.",
  GetMessagesSchema.shape,
  async ({ anchor, num_before, num_after, narrow, message_id }) => {
    try {
      const result = await zulipClient.getMessages({
        anchor,
        num_before,
        num_after,
        narrow,
        message_id
      });
      
      return createSuccessResponse(JSON.stringify({
        message_count: result.messages.length,
        messages: result.messages.map(msg => ({
          id: msg.id,
          sender: msg.sender_full_name,
          timestamp: new Date(msg.timestamp * 1000).toISOString(),
          content: msg.content,
          type: msg.type,
          topic: msg.topic || msg.subject,
          stream_id: msg.stream_id,
          reactions: msg.reactions
        }))
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error retrieving messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-users",
  "Get all users in the Zulip organization with their profile information.",
  ListUsersSchema.shape,
  async ({ client_gravatar, include_custom_profile_fields }) => {
    try {
      const result = await zulipClient.getUsers({
        client_gravatar,
        include_custom_profile_fields
      });
      
      return createSuccessResponse(JSON.stringify({
        user_count: result.members.length,
        users: result.members.map(user => ({
          id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          is_active: user.is_active,
          is_bot: user.is_bot,
          role: user.is_owner ? 'owner' : 
                user.is_admin ? 'admin' : 
                user.is_moderator ? 'moderator' : 
                user.is_guest ? 'guest' : 'member',
          date_joined: user.date_joined,
          timezone: user.timezone,
          avatar_url: user.avatar_url
        }))
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error listing users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "edit-message",
  "Edit an existing message's content or topic.",
  EditMessageSchema.shape,
  async ({ message_id, content, topic }) => {
    try {
      await zulipClient.updateMessage(message_id, { content, topic });
      return createSuccessResponse(`Message ${message_id} updated successfully!`);
    } catch (error) {
      return createErrorResponse(`Error updating message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "delete-message",
  "Delete a message by its ID.",
  DeleteMessageSchema.shape,
  async ({ message_id }) => {
    try {
      await zulipClient.deleteMessage(message_id);
      return createSuccessResponse(`Message ${message_id} deleted successfully!`);
    } catch (error) {
      return createErrorResponse(`Error deleting message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "add-emoji-reaction",
  "Add an emoji reaction to a message.",
  AddReactionSchema.shape,
  async ({ message_id, emoji_name, emoji_code, reaction_type }) => {
    try {
      await zulipClient.addReaction(message_id, {
        emoji_name,
        emoji_code,
        reaction_type
      });
      return createSuccessResponse(`Reaction ${emoji_name} added to message ${message_id}!`);
    } catch (error) {
      return createErrorResponse(`Error adding reaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-user-by-email",
  "Find a user by their email address.",
  GetUserByEmailSchema.shape,
  async ({ email, client_gravatar, include_custom_profile_fields }) => {
    try {
      const result = await zulipClient.getUserByEmail(email, {
        client_gravatar,
        include_custom_profile_fields
      });
      
      return createSuccessResponse(JSON.stringify({
        user: {
          id: result.user.user_id,
          email: result.user.email,
          full_name: result.user.full_name,
          is_active: result.user.is_active,
          is_bot: result.user.is_bot,
          role: result.user.is_owner ? 'owner' : 
                result.user.is_admin ? 'admin' : 
                result.user.is_moderator ? 'moderator' : 
                result.user.is_guest ? 'guest' : 'member',
          date_joined: result.user.date_joined,
          timezone: result.user.timezone,
          avatar_url: result.user.avatar_url,
          profile_data: result.user.profile_data
        }
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error getting user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-topics-in-channel",
  "Get all topics in a specific stream/channel.",
  GetStreamTopicsSchema.shape,
  async ({ stream_id }) => {
    try {
      const result = await zulipClient.getStreamTopics(stream_id);
      
      return createSuccessResponse(JSON.stringify({
        stream_id,
        topic_count: result.topics.length,
        topics: result.topics.map(topic => ({
          name: topic.name,
          max_id: topic.max_id
        }))
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error getting stream topics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "upload-file",
  "Upload a file or image to Zulip.",
  UploadFileSchema.shape,
  async ({ filename, content, content_type }) => {
    try {
      const result = await zulipClient.uploadFile(filename, content, content_type);
      return createSuccessResponse(JSON.stringify({
        success: true,
        uri: result.uri,
        message: `File uploaded successfully! Use this URI in messages: ${result.uri}`
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-message-read-receipts",
  "Get list of users who have read a specific message.",
  GetMessageReadReceiptsSchema.shape,
  async ({ message_id }) => {
    try {
      const result = await zulipClient.getMessageReadReceipts(message_id);
      return createSuccessResponse(JSON.stringify({
        message_id,
        read_by_count: result.user_ids.length,
        user_ids: result.user_ids
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error getting read receipts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "create-scheduled-message",
  "Schedule a message to be sent at a future time.",
  CreateScheduledMessageSchema.shape,
  async ({ type, to, content, topic, scheduled_delivery_timestamp }) => {
    try {
      const result = await zulipClient.createScheduledMessage({
        type,
        to,
        content,
        topic,
        scheduled_delivery_timestamp
      });
      return createSuccessResponse(JSON.stringify({
        success: true,
        scheduled_message_id: result.scheduled_message_id,
        delivery_time: new Date(scheduled_delivery_timestamp * 1000).toISOString(),
        message: `Message scheduled successfully! ID: ${result.scheduled_message_id}`
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error creating scheduled message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "edit-scheduled-message",
  "Modify a scheduled message before it's sent.",
  EditScheduledMessageSchema.shape,
  async ({ scheduled_message_id, type, to, content, topic, scheduled_delivery_timestamp }) => {
    try {
      await zulipClient.editScheduledMessage(scheduled_message_id, {
        type,
        to,
        content,
        topic,
        scheduled_delivery_timestamp
      });
      return createSuccessResponse(`Scheduled message ${scheduled_message_id} updated successfully!`);
    } catch (error) {
      return createErrorResponse(`Error editing scheduled message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-drafts",
  "Retrieve all saved message drafts.",
  {},
  async () => {
    try {
      const result = await zulipClient.getDrafts();
      return createSuccessResponse(JSON.stringify({
        draft_count: result.drafts.length,
        drafts: result.drafts.map(draft => ({
          id: draft.id,
          type: draft.type,
          to: draft.to,
          topic: draft.topic,
          content: draft.content,
          timestamp: new Date(draft.timestamp * 1000).toISOString()
        }))
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error getting drafts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "edit-draft",
  "Update an existing message draft.",
  EditDraftSchema.shape,
  async ({ draft_id, type, to, topic, content, timestamp }) => {
    try {
      await zulipClient.editDraft(draft_id, {
        type,
        to,
        topic,
        content,
        timestamp
      });
      return createSuccessResponse(`Draft ${draft_id} updated successfully!`);
    } catch (error) {
      return createErrorResponse(`Error editing draft: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-subscribed-channels",
  "Get channels/streams the user is subscribed to.",
  GetSubscribedChannelsSchema.shape,
  async ({ include_subscribers }) => {
    try {
      const result = await zulipClient.getSubscriptions(include_subscribers);
      return createSuccessResponse(JSON.stringify({
        subscription_count: result.subscriptions.length,
        subscriptions: result.subscriptions.map(stream => ({
          id: stream.stream_id,
          name: stream.name,
          description: stream.description,
          invite_only: stream.invite_only,
          is_archived: stream.is_archived,
          is_announcement_only: stream.is_announcement_only
        }))
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error getting subscribed channels: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-channel-id",
  "Get the ID of a channel by its name.",
  GetChannelIdSchema.shape,
  async ({ stream_name }) => {
    try {
      const result = await zulipClient.getStreamId(stream_name);
      return createSuccessResponse(JSON.stringify({
        stream_name,
        stream_id: result.stream_id
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error getting channel ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-channel-by-id",
  "Get detailed information about a channel by its ID.",
  GetChannelByIdSchema.shape,
  async ({ stream_id, include_subscribers }) => {
    try {
      const result = await zulipClient.getStream(stream_id, include_subscribers);
      return createSuccessResponse(JSON.stringify({
        stream: {
          id: result.stream.stream_id,
          name: result.stream.name,
          description: result.stream.description,
          invite_only: result.stream.invite_only,
          is_web_public: result.stream.is_web_public,
          is_archived: result.stream.is_archived,
          is_announcement_only: result.stream.is_announcement_only,
          date_created: new Date(result.stream.date_created * 1000).toISOString()
        }
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error getting channel by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "update-status",
  "Update user status message and availability.",
  UpdateStatusSchema.shape,
  async ({ status_text, away, emoji_name, emoji_code }) => {
    try {
      await zulipClient.updateStatus({
        status_text,
        away,
        emoji_name,
        emoji_code
      });
      return createSuccessResponse(`Status updated successfully!${status_text ? ` Message: "${status_text}"` : ''}${away !== undefined ? ` Away: ${away}` : ''}`);
    } catch (error) {
      return createErrorResponse(`Error updating status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-user-groups",
  "Get all user groups in the organization.",
  {},
  async () => {
    try {
      const result = await zulipClient.getUserGroups();
      return createSuccessResponse(JSON.stringify({
        group_count: result.user_groups.length,
        user_groups: result.user_groups.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          member_count: group.members.length,
          is_system_group: group.is_system_group
        }))
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error getting user groups: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Use stderr for logging to avoid interfering with stdio transport
  console.error("Zulip MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});