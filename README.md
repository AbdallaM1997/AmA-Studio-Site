# AmA Studio — website

Good games. Great breaks. The studio site for AmA Studio, built with Astro.

## Run it

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:4321. Try the three intro looks: `/?splash=pop`, `/?splash=blocks`, `/?splash=night`.

## Work on it with Claude Code

Open this folder in Claude Code (`cd ama-studio` then `claude`). It reads `CLAUDE.md` for the brand rules and project map, and has skills for common jobs:

- **add-game** — "add our new game Sandfall, it's an endless runner"
- **add-news-post** — "write a devlog post about Kinfold's new levels"
- **launch-game** — "Kinfold is live, here are the store links"
- **new-animation** — "make the game cards flip when you hover"

## Edit content without code

All text lives in `src/data/`:
- `site.json` — studio info, email, socials, splash look, services switch
- `games.json` — your games
- `news.json` — news posts

After editing, run `npm run check:data` to catch mistakes.

## Publish

`npm run build` creates the finished site in `dist/`. Any static host works:

- **Netlify** or **Cloudflare Pages**: connect the GitHub repo, build command `npm run build`, output folder `dist`.
- **Vercel**: import the repo; it detects Astro automatically.
- **GitHub Pages**: use the official Astro GitHub Action.

Before going live: set your real domain in `site.json → url`, your email, social links, and complete the `[bracketed]` parts of the privacy policy and terms.
