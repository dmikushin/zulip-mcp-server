---
title: "Development Guide"
description: "Development guide and contribution instructions for Zulip MCP Server"
---

**Navigation:** [Home](index) | [Installation](installation) | [API Reference](api-reference) | [Configuration](configuration) | [Troubleshooting](troubleshooting)

# Development Guide

Guide for contributing to and extending the Zulip MCP Server.

## Development Setup

### Prerequisites

- **Node.js 18+** with npm
- **TypeScript 5+**
- **Git** for version control
- **Zulip workspace** for testing

### Local Development Environment

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/your-username/zulip-mcp-server.git
   cd zulip-mcp-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your test Zulip credentials
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Development Scripts

```bash
# Development
npm run dev              # Live development server with tsx
npm run build:watch      # TypeScript compilation in watch mode

# Building
npm run build           # Clean build: removes dist/ then compiles TypeScript
npm run clean           # Remove dist/ folder (clear build artifacts)
npm start              # Run compiled server from dist/

# Code Quality
npm run quality        # lint + typecheck + audit
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix ESLint issues
npm run typecheck      # TypeScript compilation check
npm run audit:fix      # Fix npm security vulnerabilities

# Pre-commit
npm run precommit     # lint + typecheck + build
```

---

## Project Architecture

### Directory Structure

```
src/
├── server.ts          # Main MCP server implementation
├── types.ts           # Zod schemas and TypeScript types
└── zulip/
    └── client.ts      # Zulip REST API client

docs/                  # GitHub Pages documentation
├── _config.yml        # Jekyll configuration
├── index.md          # Homepage
├── installation.md   # Installation guide
├── api-reference.md  # API documentation
├── configuration.md  # Client setup
├── usage-examples.md # Examples and tutorials
├── troubleshooting.md # Common issues
└── development.md    # This file
```

### Core Components

#### 1. MCP Server (`src/server.ts`)

The main server implementation that:
- Validates environment variables
- Registers resources and tools
- Handles MCP protocol communication
- Manages error responses

**Key patterns**:
```typescript
// Resource registration
server.resource("resource-name", "uri-template", handler);

// Tool registration  
server.tool("tool-name", SchemaFromTypes.shape, handler);

// Error handling
function createErrorResponse(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true
  };
}
```

#### 2. Type Definitions (`src/types.ts`)

Zod schemas for:
- Input validation for all tools
- TypeScript type generation
- Runtime parameter checking
- API response types

**Schema pattern**:
```typescript
export const ToolNameSchema = z.object({
  param1: z.string().describe("Parameter description"),
  param2: z.number().optional().describe("Optional parameter")
});

export type ToolNameParams = z.infer<typeof ToolNameSchema>;
```

#### 3. Zulip Client (`src/zulip/client.ts`)

HTTP client that:
- Handles Zulip REST API calls
- Manages authentication
- Provides error handling
- Formats requests/responses

**Client pattern**:
```typescript
async methodName(params: ParamsType): Promise<ResponseType> {
  try {
    const response = await this.axios.post('/api/endpoint', params);
    return response.data;
  } catch (error) {
    throw new Error(`Enhanced error message: ${error.message}`);
  }
}
```

---

## Adding New Tools

### Step 1: Define Schema in `types.ts`

```typescript
export const NewToolSchema = z.object({
  required_param: z.string().describe("Description of required parameter"),
  optional_param: z.boolean().optional().describe("Description of optional parameter")
});

export type NewToolParams = z.infer<typeof NewToolSchema>;
```

### Step 2: Add Client Method in `zulip/client.ts`

```typescript
async newOperation(params: NewToolParams): Promise<ResponseType> {
  try {
    const response = await this.axios.post('/api/v1/new-endpoint', {
      // Transform params as needed for Zulip API
      param1: params.required_param,
      param2: params.optional_param
    });
    
    return response.data;
  } catch (error) {
    // Enhance error message for better LLM guidance
    if (error.response?.status === 404) {
      throw new Error(`Resource not found. Use 'list-resources' tool to see available options.`);
    }
    throw new Error(`Error in new operation: ${error.message}`);
  }
}
```

### Step 3: Register Tool in `server.ts`

```typescript
server.tool(
  "new-tool",
  "🔧 TOOL DESCRIPTION: Brief description with emoji for LLM-friendly identification",
  NewToolSchema.shape,
  async (params) => {
    try {
      const result = await zulipClient.newOperation(params);
      return createSuccessResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      return createErrorResponse(`Error in new tool: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);
```

### Step 4: Update Documentation

1. **Add to API Reference** (`docs/api-reference.md`)
2. **Include usage examples** (`docs/usage-examples.md`)
3. **Update tool count** in main documentation

---

## Adding New Resources

### Resource Structure

```typescript
server.resource(
  "resource-name",
  new ResourceTemplate("uri://template?param={param}", { list: undefined }),
  async (uri, { param }) => {
    try {
      const data = await fetchResourceData(param);
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(data, null, 2)
        }]
      };
    } catch (error) {
      return {
        contents: [{
          uri: uri.href,
          text: `Error fetching resource: ${error.message}`
        }]
      };
    }
  }
);
```

### Resource Best Practices

1. **Descriptive URIs**: Use clear, semantic URI schemes
2. **Consistent formatting**: JSON with proper indentation
3. **Error handling**: Always provide fallback content
4. **Documentation**: Include in resource listing

---

## Code Quality Standards

### TypeScript Guidelines

1. **Strict type checking**: No `any` types
2. **Interface consistency**: Use defined interfaces
3. **Error handling**: Always handle async errors
4. **Documentation**: JSDoc for complex functions

### ESLint Configuration

The project uses:
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- Standard TypeScript rules

Run checks:
```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
npm run typecheck     # TypeScript compilation check
```

### Testing Strategy

Currently, the project uses:
- **Manual testing** with MCP Inspector
- **Integration testing** against real Zulip instances
- **Type checking** as compile-time validation

Future testing improvements:
- Unit tests for individual functions
- Mock Zulip API for testing
- Automated integration tests

### Error Handling Patterns

#### 1. Enhanced Error Messages
```typescript
// ❌ Basic error
throw new Error('User not found');

// ✅ Enhanced error with guidance
throw new Error('User not found. Use search-users tool to find users by name or email.');
```

#### 2. Contextual Errors
```typescript
if (error.response?.status === 403) {
  throw new Error('Permission denied. Check bot permissions in Zulip organization settings.');
}
```

#### 3. Consistent Error Response Format
```typescript
return createErrorResponse(`Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
```

---

## Contributing Guidelines

### Before Contributing

1. **Check existing issues** for related work
2. **Discuss major changes** in GitHub issues first
3. **Review code style** and patterns in existing code
4. **Test with real Zulip workspace**

### Pull Request Process

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-tool`
3. **Make changes** following project patterns
4. **Test thoroughly** with different scenarios
5. **Update documentation** as needed
6. **Run quality checks**: `npm run quality`
7. **Submit pull request** with clear description

### PR Requirements

- [ ] Code follows TypeScript best practices
- [ ] All quality checks pass (`npm run quality`)
- [ ] New tools include proper error handling
- [ ] Documentation updated (API reference, examples)
- [ ] Changes tested with real Zulip workspace
- [ ] Commit messages are clear and descriptive

### Commit Message Format

```
type(scope): brief description

Longer description if needed, explaining the why and what changed.

- Breaking changes noted
- References to issues: #123
```

Examples:
```
feat(tools): add message search functionality
fix(client): handle rate limiting gracefully  
docs(api): update tool descriptions for clarity
```

---

## Testing

### Manual Testing with MCP Inspector

```bash
# Start inspector with development server
npx @modelcontextprotocol/inspector npm run dev

# Test specific scenarios
1. Connection testing with get-started
2. Tool parameter validation
3. Error handling edge cases
4. Resource data accuracy
```

### Integration Testing

```typescript
// Example test scenarios
const testScenarios = [
  {
    tool: 'send-message',
    params: { type: 'stream', to: 'test', topic: 'test', content: 'test' },
    expected: 'success'
  },
  {
    tool: 'search-users', 
    params: { query: 'nonexistent', limit: 5 },
    expected: 'empty results'
  }
];
```

### Test Environment Setup

1. **Create test Zulip workspace** or use development instance
2. **Set up test bot** with limited permissions
3. **Use separate environment variables** for testing
4. **Document test data requirements**

---

## Release Process

### Version Management

The project follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes to MCP interface
- **MINOR**: New tools or resources added
- **PATCH**: Bug fixes and improvements

### Release Checklist

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new features/fixes
3. **Update server version** in `src/server.ts`
4. **Run full quality check**: `npm run quality`
5. **Test with multiple MCP clients**
6. **Create GitHub release** with release notes
7. **Update documentation** if needed

### Changelog Format

```markdown
## [1.6.0] - 2024-XX-XX

### 🚀 Added
- New tool: `advanced-search` for complex message queries
- Resource: `organization-settings` for workspace configuration

### 🔧 Improved
- Enhanced error messages for better LLM guidance
- Performance optimization for large message retrieval

### 🐛 Fixed
- Fixed rate limiting issues with batch operations
- Corrected timestamp handling in scheduled messages

### 📖 Documentation
- Added advanced usage examples
- Updated troubleshooting guide
```

---

## Debugging

### Development Debugging

```bash
# Enable debug mode
DEBUG=true npm run dev

# Detailed logging
NODE_ENV=development DEBUG=* npm run dev

# TypeScript debugging
npm run build:watch  # Watch for type errors
```

### Client Integration Debugging

```typescript
// Add debug logging to tools
console.error('🔍 DEBUG - Parameters received:', params);
console.error('🔍 DEBUG - API response:', response);
```

### Common Debug Scenarios

1. **Tool not appearing**: Check schema exports and server registration
2. **Parameter validation failing**: Verify Zod schema definitions
3. **API calls failing**: Test with curl or Postman first
4. **Performance issues**: Add timing logs and optimize queries

---

## Future Roadmap

### Planned Features

- **Enhanced message threading** support
- **File attachment management** improvements
- **Advanced user group** operations
- **Stream administration** tools
- **Emoji and reaction** management
- **Organization settings** access

### Technical Improvements

- **Unit test coverage** with Jest
- **API response caching** for performance
- **WebSocket support** for real-time updates
- **Bulk operation** optimizations
- **Configuration validation** improvements

### Documentation Enhancements

- **Video tutorials** for setup
- **Interactive API explorer**
- **More use case examples**
- **Integration guides** for popular workflows

---

## Getting Help

### Development Questions

- **GitHub Discussions**: For feature ideas and questions
- **GitHub Issues**: For bugs and specific problems
- **Code Review**: Submit draft PRs for feedback

### Resources

- **Zulip API Documentation**: [zulip.com/api](https://zulip.com/api/)
- **MCP Specification**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- **TypeScript Handbook**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **Zod Documentation**: [zod.dev](https://zod.dev/)

---

Ready to contribute? Start by exploring the codebase, testing with your own Zulip workspace, and identifying areas for improvement. Every contribution helps make the Zulip MCP Server better for the community!