---
name: social-post
description: Make AmA Studio social media posts (Instagram, Facebook, TikTok, LinkedIn, YouTube, X) — on-brand images, short animated videos, Reels from gameplay clips, profile pictures, page covers and captions. Use when the user wants a post, Reel, story, banner, content calendar or captions for social media.
---

# Make a social post

The strategy (platforms, content pillars, rhythm, phases) is in `marketing/PLAN.md`. Read it when planning more than one post.

## 1. Get the facts
Ask only for what you can't find in `src/data/*.json`: what's being announced, which game, the date, which platforms. **Never invent features, numbers, dates, reviews or quotes.** Never present art or mockups as gameplay.

## 2. Write `marketing/posts/<id>.json`
`<id>` is lowercase-hyphens. Copy the closest existing post. Keys:

| Key | Notes |
|---|---|
| `template` | `announce` (headline only), `game` (one image/video panel), `screens` (1–3 screenshots in phones), `clip` (a gameplay video in a phone), `profile` (logo avatar), `cover` (page banners) |
| `theme` | `cream`, `yellow`, `red` or `black`. Rotate them across the feed. Red is loud: use it for news. |
| `label` | Small top label, e.g. `03 / Devlog`, `Can you solve it?`, `Play it` |
| `headline` | Array of 1–3 short lines (2–4 words each). No full stop; the template adds the red one. |
| `text` | One or two short sentences, ending with a full stop. |
| `cta` | Optional chip: `Coming soon`, `Pre-register now`, `Out now`, `iOS + Android` |
| `image` / `images` / `video` | `/images/...` or `/videos/...` = files in `public/`. Other paths are from the repo root, e.g. `marketing/clips/level-12.mp4`. |
| `videoStart`, `videoEnd` | Seconds in the source clip to use (the clip loops inside that range). |
| `formats` | Stills to make. Default `square, portrait, story, landscape`. Also `avatar`, `fb-cover`, `linkedin-cover`, `youtube-banner`, `x-header`. |
| `videos` | Which formats also get an MP4, e.g. `["story"]` for a Reel/TikTok/Short. |
| `duration`, `fps`, `stillAt` | Video length (default 6s, keep 5–15s), frame rate (30), and the moment used for the PNG (3s). |
| `audio`, `audioStart` | Optional sound track file. Usually leave empty: the user adds music in the app. |
| `squares`, `dot`, `headlineScale` | `false` to hide squares / full stop; `0.8` to shrink the headline. |
| `captions` | One per platform: `instagram`, `facebook`, `tiktok`, `linkedin`, `youtube`, `x`. |
| `hashtags`, `altText` | Hashtags (3–8, no `#` needed) and image description for accessibility. |

**Captions:** brand voice (short, friendly, sentences end with a full stop, no hype words, no emoji). Instagram/Facebook: English then Egyptian Arabic. TikTok: one or two lines. LinkedIn: English, the studio-as-a-business angle, a link to the site page. Always end with one next step (follow, comment, pre-register, link in bio).

## 3. Render
```bash
npm run social -- <id>                 # stills + videos + captions.md
npm run social -- <id> --no-video      # quick stills while iterating
npm run social -- <id> --only story
npm run social -- --list               # posts and formats
```
Output: `marketing/out/<id>/`. The renderer is headless Edge/Chrome; videos need ffmpeg (both auto-detected; override with `CHROME_PATH` / `FFMPEG`). Run it from PowerShell on Windows.

## 4. Check it — look at every image
Open the PNGs with the Read tool. Check: headline fits and reads, nothing cut off, faces/UI in screenshots not covered, text not on top of squares, story text clear of the top 250px and bottom 250px (platform UI). For videos, pull a few frames with ffmpeg and look at them. Fix by shortening the headline, changing `theme` or `headlineScale`, or choosing another image — not by editing the templates, unless a layout is broken for every post.

## 5. Hand over
Tell the user where the files are, which file goes to which platform, and paste the captions. The user posts them; never log in to social accounts or post for them.

## Changing the templates
`marketing/templates/post.css` + `post.js` hold the layouts. Same brand rules as the site (CLAUDE.md): four colors via variables, Anton / Archivo Black / Archivo, tilted squares, red full stop, hard shadows, no gradients, circles, blur or emoji. Re-render all posts (`--all --no-video`) and look at them after any template change.

## Gameplay clips
Ask the user to record in Unity with Unity Recorder (Game view at 1080×1920, MP4) or with a phone screen recorder, and save to `marketing/clips/` (git-ignored). Use the `clip` template, or `game` for a 16:9 clip.
