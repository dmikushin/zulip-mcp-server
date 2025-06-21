---
title: "Changelog"
description: "Version history and release notes for Zulip MCP Server"
---

**Navigation:** [Home](index) | [Installation](installation) | [API Reference](api-reference) | [Development](development) | [Troubleshooting](troubleshooting)

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

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

---

## [1.0.0] - 2025-06-01

### 🚀 Added
- **Initial release** of Zulip MCP Server
- **22 core tools** for Zulip API integration:
  - Message operations (send, get, edit, delete, reactions)
  - User management (get users, update status, groups)
  - Channel management (subscribe, get info, topics)
  - Drafts and scheduled messages
  - File uploads and emoji reactions
- **4 MCP resources** for contextual data:
  - User directory with roles and status
  - Channels directory with permissions
  - Message formatting guide
  - Common usage patterns
- **Multi-client support**:
  - Claude Desktop configuration
  - Cursor IDE integration
  - Raycast compatibility
- **Comprehensive environment configuration**:
  - Environment variable validation
  - Helpful error messages
  - Development and production modes
- **TypeScript implementation**:
  - Full type safety with Zod validation
  - ES modules support
  - Clean architecture patterns

### 📖 Documentation
- Complete README with setup instructions
- LLM client configuration examples
- API documentation and usage patterns
- Installation and troubleshooting guides

### 🔧 Technical Foundation
- **MCP Protocol v1.0.0** compliance
- **Node.js 18+** support
- **TypeScript 5+** implementation
- **Zulip REST API** integration
- **StdioServerTransport** for CLI usage

---

## Planned Future Releases

### [1.6.0] - Planned

#### 🚀 Potential Additions
- **Enhanced message threading** support for better conversation management
- **File attachment management** tools for advanced file operations
- **Advanced user group operations** for team management
- **Stream administration tools** for moderators and admins
- **Emoji and reaction management** for custom emoji operations
- **Organization settings access** for configuration management

#### 🔧 Technical Improvements
- **Unit test coverage** with Jest testing framework
- **API response caching** for improved performance
- **WebSocket support** for real-time updates
- **Bulk operation optimizations** for large-scale operations
- **Configuration validation** improvements

#### 📖 Documentation Enhancements
- **Video tutorials** for visual setup guides
- **Interactive API explorer** for testing tools
- **More use case examples** across different industries
- **Integration guides** for popular workflow tools

### [2.0.0] - Future Major Release

#### 🔄 Potential Breaking Changes
- **Enhanced MCP protocol** support (when available)
- **Improved tool categorization** and organization
- **Streamlined configuration** options
- **Advanced authentication** methods

#### 🚀 Major Features
- **Plugin architecture** for custom tool development
- **Advanced analytics** and reporting tools
- **Multi-workspace support** for managing multiple Zulip instances
- **AI-powered message suggestions** and automation
- **Integration marketplace** for third-party tools

---

## Version Support Policy

### Current Versions
- **v1.5.x**: Current stable, actively maintained
- **v1.0.x**: Security fixes only until v1.6.0 release

### Compatibility
- **MCP Protocol**: v1.0.0+
- **Node.js**: 18.x, 20.x, 22.x
- **Zulip Server**: 5.0+ (API compatibility)
- **LLM Clients**: Any MCP-compliant client

### Security Updates
- Security patches backported to latest minor version
- Critical vulnerabilities addressed within 48 hours
- Regular dependency updates and audits

---

## Contributing to Releases

### Feature Requests
- Submit via [GitHub Discussions](https://github.com/avisekrath/zulip-mcp-server/discussions)
- Include use case and rationale
- Community voting helps prioritize features

### Bug Reports
- Use [GitHub Issues](https://github.com/avisekrath/zulip-mcp-server/issues)
- Include reproduction steps and environment details
- Critical bugs may trigger patch releases

### Development Process
- Follow [Semantic Versioning](https://semver.org/) for all changes
- Maintain backward compatibility within major versions
- Comprehensive testing before release
- Community feedback integration

---

## Release Notifications

Stay updated on new releases:

- **GitHub Releases**: Watch the repository for release notifications
- **Package Updates**: Follow npm package updates
- **Documentation**: Release notes published on GitHub Pages
- **Breaking Changes**: Always documented with migration guides

---

## Historical Context

The Zulip MCP Server was created to bridge the gap between AI language models and team communication platforms. Key milestones:

- **June 2025**: Initial development started
- **June 2025**: v1.0.0 released with 22 core tools
- **June 2025**: v1.5.0 major enhancement with terminology standardization
- **Future**: Continued evolution based on community needs

---

**Note**: This changelog follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format. Each release includes comprehensive migration guides and compatibility information to ensure smooth upgrades.