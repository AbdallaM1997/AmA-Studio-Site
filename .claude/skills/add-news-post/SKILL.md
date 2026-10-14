---
name: add-news-post
description: Write and add a news, devlog or launch post to the AmA Studio website. Use when the user wants to post news, a devlog, an update or an announcement.
---

# Add a news post

1. Get the facts from the user (what happened, which game, date). Never invent features, numbers, dates or quotes.
2. Add an object to `src/data/news.json` with the same keys as the existing posts:
   - `slug` (lowercase-hyphens, unique), `title` (short, no trailing full stop — the page adds the red one), `date` (`YYYY-MM-DD`), `category` (`Studio`, `Games`, `Devlog`, `Launch`, `Behind the scenes`), `theme` (`red`, `yellow` or `black`), `excerpt` (one sentence), `body` (array of short paragraphs).
   - Optional `image`: put the file in `public/images/news/` and use `/images/news/<file>`.
3. Voice: friendly, punchy, 2–5 short paragraphs. End with a clear next step (play, join the newsletter, follow).
4. The home page shows the 3 newest posts automatically.
5. Run `npm run check:data && npm run build`.
