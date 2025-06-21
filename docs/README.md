# GitHub Pages Documentation

This directory contains the complete GitHub Pages documentation site for the Zulip MCP Server.

## Site Structure

### Core Pages
- **index.md** - Homepage with project overview and quick start
- **installation.md** - Complete installation and setup guide
- **configuration.md** - LLM client configuration (Claude, Cursor, Raycast)
- **api-reference.md** - Comprehensive API documentation for all 25 tools and 4 resources
- **usage-examples.md** - Practical examples and real-world use cases
- **zulip-terminology.md** - Zulip concepts and terminology reference
- **troubleshooting.md** - Common issues and solutions
- **development.md** - Development guide and contribution instructions
- **changelog.md** - Version history and release notes

### Configuration Files
- **_config.yml** - Jekyll configuration for GitHub Pages
- **_layouts/default.html** - Custom layout with navigation and styling

## GitHub Pages Setup

### 1. Enable GitHub Pages

1. Go to your repository settings
2. Scroll to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/docs" folder
5. Click "Save"

### 2. Access Your Documentation

Your documentation will be available at:
```
https://your-username.github.io/zulip-mcp-server/
```

For this repository:
```
https://avisekrath.github.io/zulip-mcp-server/
```

### 3. Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file in `/docs` with your domain
2. Configure DNS settings at your domain provider
3. Update the `url` in `_config.yml`

## Features

### Navigation
- Responsive navigation menu
- Active page highlighting
- Mobile-friendly design

### Content Features
- Syntax highlighting for code blocks
- Responsive tables
- Custom styling for alerts and callouts
- SEO optimization with meta tags
- Open Graph tags for social sharing

### Jekyll Plugins
- **jekyll-feed** - RSS feed generation
- **jekyll-sitemap** - XML sitemap for SEO
- **jekyll-seo-tag** - Enhanced SEO tags

## Local Development

To test the documentation locally:

```bash
# Install Jekyll (requires Ruby)
gem install bundler jekyll

# Create Gemfile in docs directory
cd docs
cat > Gemfile << EOF
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "jekyll-include-cache", group: :jekyll_plugins
EOF

# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# View at http://localhost:4000/zulip-mcp-server/
```

## Content Updates

### Adding New Pages

1. Create `.md` file in `/docs`
2. Add front matter:
   ```yaml
   ---
   layout: default
   title: "Page Title"
   description: "Page description for SEO"
   ---
   ```
3. Add to navigation in `_config.yml`

### Updating Existing Content

1. Edit the respective `.md` files
2. Follow existing formatting patterns
3. Test locally before committing
4. GitHub Pages will rebuild automatically

## Styling

### Custom CSS

The site uses a custom layout with:
- Professional color scheme
- Responsive design
- Code syntax highlighting
- Table formatting
- Navigation styling

### Key Style Elements

- **Headers**: Gradient background with white text
- **Navigation**: Horizontal menu with hover effects
- **Code blocks**: Light gray background with border
- **Tables**: Striped rows with borders
- **Links**: Blue color scheme with hover effects

## SEO Optimization

### Meta Tags
- Page titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs

### Sitemap
- Automatically generated XML sitemap
- Search engine friendly URLs
- Proper heading hierarchy

### Content Structure
- Clear heading hierarchy (H1 → H6)
- Descriptive page titles
- Comprehensive internal linking
- Keyword-rich content

## Maintenance

### Regular Updates
- Keep changelog current with new releases
- Update API reference when tools change
- Add new usage examples as patterns emerge
- Review and update troubleshooting guide

### Content Review
- Check for broken links
- Verify code examples still work
- Update version numbers
- Refresh screenshots if UI changes

## Analytics (Optional)

To add Google Analytics:

1. Get Google Analytics tracking ID
2. Add to `_config.yml`:
   ```yaml
   google_analytics: GA_TRACKING_ID
   ```
3. The layout will automatically include tracking code

## Support

For documentation issues:
- **Content errors**: Submit GitHub issues
- **Jekyll/GitHub Pages**: Check GitHub Pages documentation
- **Design improvements**: Submit pull requests

---

This documentation site provides comprehensive coverage of the Zulip MCP Server with professional presentation and excellent user experience.