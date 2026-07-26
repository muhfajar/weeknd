# weeknd.dev

A curated directory of indie software, built by makers for makers.

## What is this?

weeknd.dev collects indie-built apps into a searchable, filterable directory. Each app lives as a markdown file in `apps/` — add a file, the directory updates. No database, no API, no build pipeline for content.

## Tech Stack

- **React 19** + **TypeScript 5.8**
- **Vite 6** — dev server + build
- **Tailwind CSS 4** — styling via `@tailwindcss/vite`
- **react-markdown** — renders app descriptions
- **js-yaml** — parses YAML frontmatter
- **lucide-react** — icons
- **motion** — animations

## Features

- Search by name, developer, or description
- Filter by platform (web, iOS, Android, macOS, Windows, Linux)
- Filter by category (AI, Productivity, Travel, etc.)
- Sort by newest or alphabetical
- Pagination with configurable page size
- Deep-linkable app detail views (`?app=slug`)
- Theme toggle with localStorage persistence
- Submit app workflow — generates PR-ready markdown

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/your-username/weeknd.git
cd weeknd
npm install
```

### Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # TypeScript type check
```

## Project Structure

```
weeknd/
├── apps/                  # App listings (one markdown file each)
│   ├── _featured.md       # Featured app slugs
│   ├── ooo-club.md
│   ├── typedream.md
│   └── ...
├── src/
│   ├── components/        # UI components
│   ├── lib/               # Markdown parsing, app catalog logic
│   ├── types/             # TypeScript types
│   ├── App.tsx            # App shell
│   └── main.tsx           # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

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

Example file for app live in `apps/weeknd-dev.md`

### Adding a developer profile

1. Fork the repo
2. Create a new markdown file in `dev/` named after your name/username (e.g., `muhfajar.md`)
3. Use this template:

```markdown
---
name: Your name 
bio: Short description of who you are. 
avatar: https://example.com/avatar.png 
website: https://mypersonalweb.id
twitter: https://x.com/username
instagram: https://instagram.com/username
threads: https://www.threads.com/@username
mastodon: https://mastodon.social/@username 
nostr: https://primal.net/p/nprofileUsername 
bluesky: https://bsky.app/profile/username.bsky.social 
linkedin: https://www.linkedin.com/in/username/ 
---

### About

Anything description you want to add to your profile detail, or a long description of you if you want
```

Example file for profile live in `apps/muhfajar.md`

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
