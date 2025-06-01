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
  CreateScheduledMessageSchema,
  GetUserByEmailSchema,
  UpdateStatusSchema,
  CreateDraftSchema,
  GetUserSchema,
  GetMessageSchema
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

### Best Practices
- Use mentions sparingly to avoid notification spam
- Format code blocks with appropriate language for syntax highlighting
- Use channel/topic links for cross-references`
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
  "create-draft",
  "Create a new message draft for later editing or sending.",
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
      
      return createSuccessResponse(JSON.stringify({
        success: true,
        draft_ids: result.ids,
        message: `Draft created successfully! Draft IDs: ${result.ids.join(', ')}`
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error creating draft: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-user",
  "Get detailed information about a specific user by their user ID.",
  GetUserSchema.shape,
  async ({ user_id, client_gravatar, include_custom_profile_fields }) => {
    try {
      const result = await zulipClient.getUser(user_id, {
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
      return createErrorResponse(`Error getting user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

server.tool(
  "get-message",
  "Retrieve a specific message by its ID with full details.",
  GetMessageSchema.shape,
  async ({ message_id, apply_markdown, allow_empty_topic_name }) => {
    try {
      const result = await zulipClient.getMessage(message_id, {
        apply_markdown,
        allow_empty_topic_name
      });
      
      return createSuccessResponse(JSON.stringify({
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
      }, null, 2));
    } catch (error) {
      return createErrorResponse(`Error getting message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Zulip MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});