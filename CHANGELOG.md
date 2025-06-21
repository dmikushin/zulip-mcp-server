# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2025-06-21

### ⚠️ Breaking Changes
- **Terminology Standardization**: All tools now use "stream" terminology instead of "channel"
  - `get-subscribed-channels` → `get-subscribed-streams`
  - `get-channel-id` → `get-stream-id`
  - `get-channel-by-id` → `get-stream-by-id`
  - `get-topics-in-channel` → `get-topics-in-stream`
  - `channels-directory` resource → `streams-directory`

### 🚀 Added
- **New Helper Tools** (3 new tools, total now 25):
  - `search-users` - Find users by name/email before sending DMs
  - `get-started` - Test connection and get workspace overview
  - `get-user` - Get detailed user information by ID
- **Enhanced Documentation**:
  - Comprehensive "Streams vs Channels" terminology sections
  - Clear migration guidance for users familiar with "channels"
  - Workflow documentation and tool selection guides
- **LLM Usability Features**:
  - Helper tools for discovery and orientation
  - Enhanced error messages with contextual guidance
  - Quick tips and troubleshooting information

### 🔧 Improved
- **Documentation Quality**:
  - Updated all tool descriptions for consistency
  - Added terminology explanations throughout
  - Improved README with accurate tool count (25 vs 22)
  - Enhanced CLAUDE.md with comprehensive implementation guidance
- **Code Quality**:
  - Fixed schema naming inconsistencies
  - Improved TypeScript type safety
  - Better error handling and validation
  - Consistent variable naming throughout codebase
- **Developer Experience**:
  - Enhanced development scripts and quality checks
  - Improved build process reliability
  - Better linting and code formatting

### 🐛 Fixed
- Schema import/export consistency across all stream-related tools
- Environment variable loading and validation
- TypeScript compilation errors
- Variable naming inconsistencies in tool implementations
- Package security vulnerabilities

### 📖 Migration Guide
If you're upgrading from v1.0.0:

1. **Update Tool Names**: Replace any references to old channel-based tool names:
   ```diff
   - get-subscribed-channels
   + get-subscribed-streams
   
   - get-channel-id
   + get-stream-id
   
   - get-channel-by-id
   + get-stream-by-id
   
   - get-topics-in-channel
   + get-topics-in-stream
   ```

2. **Update Resource URIs**: 
   ```diff
   - zulip://channels
   + zulip://streams
   ```

3. **Note**: All functionality remains the same - only names have changed for consistency. In Zulip, "streams" and "channels" refer to the same concept.

## [1.0.0] - 2025-06-01

### 🚀 Added
- Initial release of Zulip MCP Server
- 22 core tools for Zulip API integration
- Message operations (send, get, edit, delete, reactions)
- User management (get users, update status, groups)
- Channel management (subscribe, get info, topics)
- Drafts and scheduled messages
- File uploads and emoji reactions
- MCP resources for users and channels
- Support for Claude Desktop, Cursor IDE, and Raycast
- Comprehensive environment configuration
- TypeScript implementation with Zod validation

### 📖 Documentation
- Complete README with setup instructions
- LLM client configuration examples
- API documentation and usage patterns