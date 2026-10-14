---
name: launch-game
description: Switch an AmA Studio game from "coming soon" to live on the website — store links, status, launch post. Use when a game is released or store links are ready.
---

# Launch a game

1. In `src/data/games.json`, for that game: set `status` to `live`, fill `stores.appStore` and/or `stores.googlePlay` with the real store URLs the user gives you (never guess a URL), and set `releaseDate` (`YYYY-MM-DD`).
2. Check the game has key art and screenshots; if not, tell the user which files are still missing.
3. Check `src/pages/privacy.astro` lists the SDKs the game really uses (ads, analytics, purchases). The app stores require the privacy policy URL: `https://<domain>/privacy/`. Flag any `[bracketed]` parts still left in it.
4. Offer to write a launch post with the `add-news-post` skill.
5. Run `npm run check:data && npm run build`.
