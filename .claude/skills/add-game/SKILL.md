---
name: add-game
description: Add a new AmA Studio game to the website (games list, home page card and its own game page). Use when the user wants to add, list or announce a game.
---

# Add a game

1. Ask for anything missing (only what you can't fill sensibly): title, one-line tagline, genre, status (`coming-soon`, `live`, `in-lab`), platforms, price, 3 "how to play" steps, 2–4 features, store links if live.
2. Add an object to `src/data/games.json`, copying the shape of the existing entries exactly:
   - `slug`: lowercase, hyphens, unique (becomes `/games/<slug>/`)
   - `theme`: `red`, `yellow` or `black` (key-art panel color)
   - `featured`: `true` puts it in the big card on the home page. Only one game should be featured; ask before changing which one.
   - Leave media fields as `""` / `[]` if there are no files yet. Placeholders are shown automatically.
3. Media: put files in `public/images/games/<slug>/` (key art 1600×1000 jpg/webp, screenshots 1080×2160 portrait, trailer as short muted mp4 under ~6 MB) and reference them as `/images/games/<slug>/file.jpg`.
4. Follow the brand voice in `CLAUDE.md`: short sentences, each ending with a full stop, no invented numbers.
5. Run `npm run check:data && npm run build`, then mention the new page path to the user.
