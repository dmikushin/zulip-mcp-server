# Development Guidelines

## Code Quality & Commit Practices

### 📦 Dependency Management
- **Always commit package-lock.json** when package.json changes
- Run `npm audit fix` regularly to address security vulnerabilities
- Use exact versions for production dependencies when possible
- Document any peer dependency requirements

### 🔧 Development Workflow
1. **Before making changes**:
   ```bash
   npm install
   npm audit fix
   npm run lint
   npm run typecheck
   ```

2. **During development**:
   ```bash
   npm run dev  # For live development
   npm test     # Run tests before committing
   ```

3. **Before committing**:
   ```bash
   npm run build    # Ensure build succeeds
   npm run lint     # Fix linting issues
   npm run typecheck # Ensure type safety
   ```

### 📝 Commit Message Standards
Follow conventional commit format:

```
<type>(<scope>): <description>

<body>

<footer>
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(tools): add search-users helper tool for LLM usability

fix(env): resolve dotenv loading issue causing startup errors

docs(readme): update setup instructions for environment variables

chore(deps): update package-lock.json and fix security vulnerabilities
```

### 🏷️ Versioning & Releases
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Update package.json version before creating releases
- Always commit package-lock.json with version changes
- Create comprehensive release notes
- Tag releases with `v` prefix (e.g., `v1.5.0`)

### 🔍 Code Review Checklist
- [ ] Tests pass (`npm test`)
- [ ] Builds successfully (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] package-lock.json updated if dependencies changed
- [ ] Documentation updated if API changed
- [ ] Commit messages follow conventional format
- [ ] No security vulnerabilities (`npm audit`)

### 🛡️ Security Practices
- Never commit API keys or sensitive data
- Use environment variables for configuration
- Run `npm audit` regularly and fix vulnerabilities
- Keep dependencies updated
- Review third-party packages before adding

### 📚 Documentation Requirements
- Update README.md for new features
- Document API changes in CLAUDE.md
- Include examples for new tools/resources
- Update .env.example for new environment variables
- Add inline code comments for complex logic

### 🧪 Testing Standards
- Write tests for new tools and features
- Test MCP tool schemas and responses
- Include integration tests for Zulip API calls
- Test error handling and edge cases
- Validate environment variable handling

### 🚀 Release Process
1. Update version in package.json
2. Run `npm install` to update package-lock.json
3. Run `npm audit fix` to address security issues
4. Commit both files together
5. Create release with comprehensive changelog
6. Tag as latest if it's a stable release

### 📋 Pre-commit Checklist
- [ ] Code builds without errors
- [ ] Tests pass
- [ ] Linting passes
- [ ] TypeScript compilation succeeds
- [ ] package-lock.json committed if dependencies changed
- [ ] Environment variables documented
- [ ] Commit message follows convention
- [ ] No TODO/FIXME comments left in production code

### 🤝 MCP-Specific Guidelines
- Tool descriptions should be clear and actionable
- Include parameter examples in tool schemas
- Provide helpful error messages with next steps
- Test tools with actual MCP clients (Claude Desktop)
- Document usage patterns in resources
- Follow MCP specification strictly