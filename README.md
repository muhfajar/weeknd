# weeknd.dev

## How to Contribute

### Adding an App

1. Fork the repo
2. Create a new markdown file in `apps/` named after your app (e.g., `my-app.md`)
3. Use this template:

```markdown
---
name: My App
tagline: Short description of what it does.
developer: Your Name
website: https://myapp.com
platform: web
category: Productivity
icon: https://example.com/icon.png
screenshots:
  - https://example.com/screenshot1.png
ios:
android:
github: https://github.com/you/my-app
twitter: https://x.com/you
created_at: 2026-07-26
---

### What is it?

Describe your app in a few sentences.

#### Key Features

- **Feature One**: Description
- **Feature Two**: Description
```

4. Commit and open a PR

### Platform Values

`web`, `ios`, `android`, `macos`, `windows`, `linux`

### Category Values

`AI`, `Productivity`, `Travel`, `Developer Tools`, `Design`, `Finance`, `Health`, `Social`, `Entertainment`, `Education`, `Utilities`

## Frontmatter Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | App display name |
| `tagline` | Yes | One-line description |
| `developer` | Yes | Developer or company name |
| `website` | Yes | App URL |
| `platform` | Yes | Target platform |
| `category` | Yes | App category |
| `icon` | Yes | Icon image URL |
| `screenshots` | No | Array of screenshot URLs |
| `ios` | No | iOS App Store link |
| `android` | No | Google Play link |
| `github` | No | GitHub repo link |
| `twitter` | No | Twitter/X profile link |
| `created_at` | No | Launch date (YYYY-MM-DD) |

## License

MIT — see [LICENSE.md](LICENSE.md)
