#!/usr/bin/env node

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
  CreateScheduledMessageSchema,
  GetUserByEmailSchema,
  UpdateStatusSchema,
  CreateDraftSchema,
  GetUserSchema,
  GetMessageSchema
} from "./types.js";

// Environment validation
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

// Initialize Zulip client
const config = validateEnvironment();
const zulipClient = new ZulipClient(config);

// Create MCP server
const server = new McpServer({
  name: "zulip-mcp-server",
  version: "1.0.0"
});

// Resources
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

## Zulip-Specific Formatting

### Mentions
- User mention: @**Full Name** (notifies user)
- Silent mention: @_**Full Name**_ (no notification)
- Group mention: @*group-name*
- Channel mentions: @**all**, @**everyone**, @**channel**, @**topic**

### Code Blocks
\`\`\`python
def hello():
    print("Hello, Zulip!")
\`\`\`

### Special Links
- Channel link: #**channel-name**
- Topic link: #**channel-name>topic-name**
- Message link: Include message ID for context

### Other Features
- Spoiler text: ||spoiler content||
- Math: $$LaTeX math$$
- Emoji: :smile: or custom emoji names
- Tables, lists, quotes supported

### Best Practices
- Use mentions sparingly to avoid notification spam
- Format code blocks with appropriate language for syntax highlighting
- Use channel/topic links for cross-references
- Silent mentions (@_name_) for informational references
`
    }]
  })
);

server.resource(
  "organization-info",
  "zulip://organization",
  async (uri) => {
    try {
      const [serverSettings, realmInfo, customEmoji] = await Promise.all([
        zulipClient.getServerSettings(),
        zulipClient.getRealmInfo(),
        zulipClient.getCustomEmoji()
      ]);
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            server: serverSettings,
            realm: realmInfo,
            custom_emoji: customEmoji
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        contents: [{
          uri: uri.href,
          text: `Error fetching organization info: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

server.resource(
  "user-groups",
  "zulip://user-groups",
  async (uri) => {
    try {
      const result = await zulipClient.getUserGroups();
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            user_groups: result.user_groups.map(group => ({
              id: group.id,
              name: group.name,
              description: group.description,
              member_count: group.members.length,
              is_system_group: group.is_system_group
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        contents: [{
          uri: uri.href,
          text: `Error fetching user groups: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
    }
  }
);

// Tools - Message Operations
server.tool(
  "send-message",
  "Send a message to a Zulip channel or direct message to users. Use this when you need to communicate information, ask questions, or respond to conversations. Messages support full Markdown formatting including mentions, code blocks, and links.",
  SendMessageSchema.shape,
  async ({ type, to, content, topic }) => {
    console.log('🎯 MCP Tool - send-message called with:', { type, to, content, topic });
    
    try {
      if (type === 'stream' && !topic) {
        console.log('❌ Stream message missing topic');
        return {
          content: [{
            type: "text",
            text: "Error: Topic is required for stream messages"
          }],
          isError: true
        };
      }

      // Validate direct message recipients
      if (type === 'direct') {
        const recipients = to.split(',').map(email => email.trim());
        console.log('📧 Validating direct message recipients:', recipients);
        
        for (const email of recipients) {
          if (!email.includes('@')) {
            console.log(`❌ Invalid email format: ${email}`);
            return {
              content: [{
                type: "text",
                text: `Error: Invalid email format for direct message recipient: ${email}`
              }],
              isError: true
            };
          }
        }
      }

      console.log('🚀 Calling Zulip API...');
      const result = await zulipClient.sendMessage({ type, to, content, topic });
      console.log('✅ Message sent successfully:', result);
      
      return {
        content: [{
          type: "text",
          text: `Message sent successfully! Message ID: ${result.id}\n\nDebug info: Check server logs for detailed API interaction.`
        }]
      };
    } catch (error) {
      console.error('💥 Error in send-message tool:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          response: (error as any).response?.data,
          status: (error as any).response?.status
        });
      }
      
      return {
        content: [{
          type: "text",
          text: `Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck server logs for detailed error information.`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-messages",
  "Retrieve messages from Zulip with advanced filtering options. Use this to read conversation history, search for specific content, or catch up on channel activity. Can fetch recent messages or search around specific message IDs.",
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
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
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
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error retrieving messages: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "upload-file",
  "Upload a file or image to Zulip for sharing in messages. Files are hosted by Zulip and can be referenced in messages. Useful for sharing documents, images, or other attachments with users.",
  UploadFileSchema.shape,
  async ({ filename, content, content_type }) => {
    try {
      const result = await zulipClient.uploadFile(filename, content, content_type);
      
      return {
        content: [{
          type: "text",
          text: `File uploaded successfully! URL: ${result.uri}\n\nYou can reference this file in messages using: [${filename}](${result.uri})`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "edit-message", 
  "Edit an existing message's content or topic. Use this to correct mistakes, update information, or move messages to different topics. Only works for messages you sent or if you have admin permissions.",
  EditMessageSchema.shape,
  async ({ message_id, content, topic }) => {
    try {
      if (!content && !topic) {
        return {
          content: [{
            type: "text",
            text: "Error: Must provide either content or topic to edit"
          }],
          isError: true
        };
      }

      await zulipClient.updateMessage(message_id, { content, topic });
      
      return {
        content: [{
          type: "text",
          text: `Message ${message_id} updated successfully!`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error editing message: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "delete-message",
  "Permanently delete a message from Zulip. Use this to remove inappropriate content, spam, or messages sent in error. This action cannot be undone. Requires appropriate permissions.",
  {
    message_id: z.number().describe("Unique ID of the message to delete")
  },
  async ({ message_id }) => {
    try {
      await zulipClient.deleteMessage(message_id);
      
      return {
        content: [{
          type: "text",
          text: `Message ${message_id} deleted successfully!`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error deleting message: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-message-read-receipts",
  "Check who has read a specific message. Useful for following up on important announcements or ensuring key stakeholders have seen critical information. Only works if read receipts are enabled in the organization.",
  {
    message_id: z.number().describe("ID of the message to check read receipts for")
  },
  async ({ message_id }) => {
    try {
      const result = await zulipClient.getMessageReadReceipts(message_id);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            message_id,
            users_who_read: result.user_ids,
            read_count: result.user_ids.length
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting read receipts: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "add-emoji-reaction",
  "Add an emoji reaction to a message. Use this to acknowledge messages, show agreement, or provide quick feedback without sending a full reply. Supports Unicode emoji and custom organization emoji.",
  AddReactionSchema.shape,
  async ({ message_id, emoji_name, emoji_code, reaction_type }) => {
    try {
      await zulipClient.addReaction(message_id, {
        emoji_name,
        emoji_code,
        reaction_type
      });
      
      return {
        content: [{
          type: "text",
          text: `Reaction "${emoji_name}" added to message ${message_id} successfully!`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error adding reaction: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "create-scheduled-message",
  "Schedule a message to be sent at a future time. Useful for announcements, reminders, or sending messages across time zones. Messages are sent automatically at the specified time.",
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
      
      const scheduledDate = new Date(scheduled_delivery_timestamp * 1000).toISOString();
      
      return {
        content: [{
          type: "text",
          text: `Scheduled message created successfully! ID: ${result.scheduled_message_id}\nWill be sent at: ${scheduledDate}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error creating scheduled message: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "edit-scheduled-message",
  "Modify a scheduled message before it's sent. Use this to update content, change timing, or redirect to different recipients. Only works for messages that haven't been sent yet.",
  {
    scheduled_message_id: z.number().describe("ID of the scheduled message to edit"),
    type: z.enum(["stream", "direct"]).optional().describe("New message type"),
    to: z.string().optional().describe("New recipients"),
    content: z.string().optional().describe("Updated message content"),
    topic: z.string().optional().describe("New topic for stream messages"),
    scheduled_delivery_timestamp: z.number().optional().describe("New delivery time (Unix timestamp)")
  },
  async ({ scheduled_message_id, type, to, content, topic, scheduled_delivery_timestamp }) => {
    try {
      await zulipClient.editScheduledMessage(scheduled_message_id, {
        type,
        to,
        content,
        topic,
        scheduled_delivery_timestamp
      });
      
      return {
        content: [{
          type: "text",
          text: `Scheduled message ${scheduled_message_id} updated successfully!`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error editing scheduled message: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-drafts",
  "Retrieve saved message drafts. Use this to continue working on unsent messages, review draft content, or clean up old drafts. Drafts are automatically saved when composing messages.",
  {},
  async () => {
    try {
      const result = await zulipClient.getDrafts();
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            draft_count: result.drafts.length,
            drafts: result.drafts.map(draft => ({
              id: draft.id,
              type: draft.type,
              content: draft.content.substring(0, 100) + (draft.content.length > 100 ? '...' : ''),
              topic: draft.topic,
              last_edit: new Date(draft.timestamp * 1000).toISOString()
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error retrieving drafts: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "edit-draft",
  "Update a saved message draft. Use this to modify draft content, change recipients, or update topics before sending. Drafts are useful for preparing complex messages or saving work in progress.",
  {
    draft_id: z.number().describe("ID of the draft to edit"),
    type: z.enum(["stream", "direct"]).describe("Message type for the draft"),
    to: z.array(z.number()).describe("Recipient user IDs"),
    topic: z.string().describe("Topic for stream message drafts"),
    content: z.string().describe("Updated draft content with Markdown formatting"),
    timestamp: z.number().optional().describe("Last edit timestamp (Unix seconds)")
  },
  async ({ draft_id, type, to, topic, content, timestamp }) => {
    try {
      await zulipClient.editDraft(draft_id, {
        type,
        to,
        topic,
        content,
        timestamp
      });
      
      return {
        content: [{
          type: "text",
          text: `Draft ${draft_id} updated successfully!`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error editing draft: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

// Channel/Stream Tools
server.tool(
  "get-subscribed-channels",
  "List all channels the current user is subscribed to. Use this to understand what conversations you have access to, check subscription status, or discover available channels for messaging.",
  {
    include_subscribers: z.boolean().optional().describe("Include the full subscriber list for each channel")
  },
  async ({ include_subscribers }) => {
    try {
      const result = await zulipClient.getSubscriptions(include_subscribers);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            subscription_count: result.subscriptions.length,
            channels: result.subscriptions.map(stream => ({
              id: stream.stream_id,
              name: stream.name,
              description: stream.description,
              invite_only: stream.invite_only,
              is_archived: stream.is_archived,
              is_announcement_only: stream.is_announcement_only,
              message_retention_days: stream.message_retention_days
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting subscribed channels: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-channel-id",
  "Get the numeric ID for a channel by its name. Use this when you need the channel ID for other API calls or to reference channels programmatically. Channel names are not case-sensitive.",
  {
    stream: z.string().describe("Name of the channel (case-insensitive)")
  },
  async ({ stream }) => {
    try {
      const result = await zulipClient.getStreamId(stream);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            channel_name: stream,
            stream_id: result.stream_id
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting channel ID: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-channel-by-id",
  "Get detailed information about a specific channel using its ID. Use this to check channel settings, permissions, subscriber count, or description before sending messages or managing subscriptions.",
  {
    stream_id: z.number().describe("Numeric ID of the channel"),
    include_subscribers: z.boolean().optional().describe("Include the complete list of channel subscribers")
  },
  async ({ stream_id, include_subscribers }) => {
    try {
      const result = await zulipClient.getStream(stream_id, include_subscribers);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            stream: {
              id: result.stream.stream_id,
              name: result.stream.name,
              description: result.stream.description,
              invite_only: result.stream.invite_only,
              is_archived: result.stream.is_archived,
              is_announcement_only: result.stream.is_announcement_only,
              creator_id: result.stream.creator_id,
              date_created: new Date(result.stream.date_created * 1000).toISOString(),
              message_retention_days: result.stream.message_retention_days,
              history_public_to_subscribers: result.stream.history_public_to_subscribers
            }
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting channel details: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-topics-in-channel",
  "List recent topics in a specific channel. Use this to understand ongoing conversations, find relevant topics to join, or see what subjects are being discussed in a channel.",
  {
    stream_id: z.number().describe("ID of the channel to get topics from")
  },
  async ({ stream_id }) => {
    try {
      const result = await zulipClient.getStreamTopics(stream_id);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            stream_id,
            topic_count: result.topics.length,
            topics: result.topics.map(topic => ({
              name: topic.name,
              latest_message_id: topic.max_id
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting channel topics: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

// User Tools
server.tool(
  "get-user-by-email",
  "Find a user's profile and details by their email address. Use this to get user IDs for direct messaging, check user roles and permissions, or verify user existence before mentioning them.",
  GetUserByEmailSchema.shape,
  async ({ email, client_gravatar, include_custom_profile_fields }) => {
    try {
      const result = await zulipClient.getUserByEmail(email, {
        client_gravatar,
        include_custom_profile_fields
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
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
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting user: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-users",
  "Get a list of all users in the organization. Use this to browse available users for messaging, check team membership, or build user directories. Includes active users and optionally bots and inactive users.",
  {
    client_gravatar: z.boolean().optional().describe("Include Gravatar URLs for profile images"),
    include_custom_profile_fields: z.boolean().optional().describe("Include custom profile fields defined by the organization")
  },
  async ({ client_gravatar, include_custom_profile_fields }) => {
    try {
      const result = await zulipClient.getUsers({
        client_gravatar,
        include_custom_profile_fields
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
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
              date_joined: user.date_joined
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting users: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "update-status",
  "Update your user status message and availability. Use this to communicate your current state (away, busy, available), set status messages, or add status emoji. Helps teammates understand your availability.",
  UpdateStatusSchema.shape,
  async ({ status_text, away, emoji_name, emoji_code }) => {
    try {
      await zulipClient.updateStatus({
        status_text,
        away,
        emoji_name,
        emoji_code
      });
      
      return {
        content: [{
          type: "text",
          text: "Status updated successfully!"
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error updating status: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-user-groups",
  "List all user groups in the organization. Use this to understand team structures, find groups for mentions (@*group-name*), or see available groups for permissions and notifications.",
  {},
  async () => {
    try {
      const result = await zulipClient.getUserGroups();
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            group_count: result.user_groups.length,
            user_groups: result.user_groups.map(group => ({
              id: group.id,
              name: group.name,
              description: group.description,
              member_count: group.members.length,
              is_system_group: group.is_system_group,
              members: group.members
            }))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting user groups: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

// New Tools - Draft, User, and Message APIs
server.tool(
  "create-draft",
  "Create a new message draft for later editing or sending. Use this to prepare messages, save work in progress, or compose complex messages that need review before sending. Drafts are saved on the server and can be accessed from any Zulip client.",
  CreateDraftSchema.shape,
  async ({ type, to, topic, content, timestamp }) => {
    try {
      const result = await zulipClient.createDraft({
        type,
        to,
        topic,
        content,
        timestamp
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            draft_ids: result.ids,
            message: `Draft created successfully! Draft IDs: ${result.ids.join(', ')}`
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error creating draft: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-user",
  "Get detailed information about a specific user by their user ID. Use this to retrieve user profiles, check permissions, get contact information, or verify user details when working with user IDs from other API calls.",
  GetUserSchema.shape,
  async ({ user_id, client_gravatar, include_custom_profile_fields }) => {
    try {
      const result = await zulipClient.getUser(user_id, {
        client_gravatar,
        include_custom_profile_fields
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
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
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting user: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  "get-message",
  "Retrieve a specific message by its ID with full details including content, metadata, and formatting. Use this to inspect message content, check edit history, get message context, or analyze message data for processing.",
  GetMessageSchema.shape,
  async ({ message_id, apply_markdown, allow_empty_topic_name }) => {
    try {
      const result = await zulipClient.getMessage(message_id, {
        apply_markdown,
        allow_empty_topic_name
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            message: {
              id: result.message.id,
              sender_id: result.message.sender_id,
              sender_full_name: result.message.sender_full_name,
              sender_email: result.message.sender_email,
              timestamp: new Date(result.message.timestamp * 1000).toISOString(),
              content: result.message.content,
              content_type: result.message.content_type,
              type: result.message.type,
              stream_id: result.message.stream_id,
              topic: result.message.topic || result.message.subject,
              recipient_id: result.message.recipient_id,
              reactions: result.message.reactions,
              edit_history: result.message.edit_history
            }
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting message: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // This will keep the server running
  console.error("Zulip MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});