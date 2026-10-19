# AmA Studio — social media plan

Serious about fun. This plan covers setting up the pages, what to post, how often, and how to make every post with Claude Code (or Codex) inside this project.

Goal for now: **build a small, real audience before Kinfold launches**, so launch day has people waiting. Every post points to one of three actions: follow, pre-register / wishlist (when store links exist), or join the newsletter on the site.

---

## 1. Platforms and what each one is for

| Platform | Role | Main formats | Priority |
|---|---|---|---|
| **Instagram** | Main home of the brand. Gameplay Reels, puzzle posts, studio life. | Reels (9:16), carousels (4:5), Stories | 1 |
| **TikTok** | Biggest reach for casual mobile games. Short gameplay and "can you solve it?" clips. | 9:16 video, 15–30s | 1 |
| **Facebook** | Very big in Egypt. Reach families and casual players; share into gaming groups. | Same Reels + 4:5 posts, Arabic captions | 2 |
| **YouTube** | Trailer, Shorts (re-use TikTok clips), devlogs later. | Shorts 9:16, trailer 16:9 | 2 |
| **LinkedIn** | The studio as a business: launches, milestones, hiring, partners, and later the services (event games, AR/VR). | 1.91:1 image or 4:5, short text posts | 3 (1 post/week) |
| X / Threads | Optional. Reserve the handle; post launches only. | Image + one line | Later |

**One handle everywhere.** Check availability for `@amastudio`, `@ama.studio`, `@amastudios` (matches `amastudios.net`) and pick the first that is free on Instagram, TikTok, Facebook and YouTube. Same name, same picture, same bio everywhere.

## 2. Setting up the pages (one afternoon)

1. **Profile picture:** the AmA logo on yellow. Generate it: `npm run social -- profile-picture` → `marketing/out/profile-picture/avatar.png`. It is safe for circle crops.
2. **Covers / banners:** `npm run social -- page-covers` makes the Facebook cover, LinkedIn cover and X header; `npm run social -- youtube-banner` makes the YouTube banner (kept inside the strip phones show). Channel setup: `marketing/youtube-channel.md`.
3. **Name:** AmA Studio. **Category:** Video game developer (Facebook / LinkedIn: "Computer games").
4. **Bio (EN):** `Game studio from Cairo. Small, bright games for everyday breaks. Serious about fun.`
   **Bio (AR):** `استوديو ألعاب من القاهرة. ألعاب صغيرة ومبهجة لاستراحتك اليومية.`
5. **Link:** `https://amastudios.net/` (later: a link with `?utm_source=instagram` etc. so you can see visits per platform).
6. **Contact:** `info@amastudios.net`. Location: Cairo, Egypt.
7. **LinkedIn company page:** add the studio description from `site.json`, website, industry "Computer Games", size, and link your personal profile as the founder.
8. **When the pages exist:** put the URLs in `src/data/site.json → socials` (and add a Facebook entry) so the site links to them. Ask Claude: *"Add my social links to the site: Instagram ..., TikTok ..., Facebook ..., LinkedIn ..., YouTube ..."*.

## 3. Content pillars (what to post)

Rotate these five. Each one has a ready template in the generator.

1. **Play it** — real Kinfold gameplay: a level being cleared, a satisfying card drop, a tricky board. *(template: `clip`)*
2. **Can you solve it?** — a board or a set of Egyptian picture cards; "Which group does this card belong to?" Answer in the comments, reveal next day in Stories. Best for comments and shares. *(template: `screens` or `game`)*
3. **Made in Cairo** — behind the scenes: the Unity editor, sketches, the team, the desk, a bug that made you laugh. Honest and small. *(template: `announce` + your own photos or screen captures)*
4. **Studio news** — announcements: new game, beta invites, release date, launch, updates. *(template: `announce` / `game`)*
5. **Egypt in cards** — a short post about one card's subject (a food, a place, an object) and why it's in the game. Bilingual. *(template: `game`)*

Never post fake gameplay, invented numbers, fake reviews or "most downloaded" claims. App stores and Meta both punish misleading ads, and it breaks the brand voice.

## 4. How often (a rhythm you can keep)

Small studio, small team: consistency beats volume.

| Day | Post | Where |
|---|---|---|
| Sun | **Play it** clip (Reel / TikTok / Short) | IG, TikTok, FB, YT Shorts |
| Tue | **Can you solve it?** (post), answer in Stories on Wed | IG, FB |
| Thu | **Made in Cairo** or **Egypt in cards** | IG, TikTok, FB |
| Weekly | One studio update | LinkedIn |
| Most days | 1–3 Stories: polls, work in progress, re-shares | IG, FB |

Egypt's weekend is Friday–Saturday; evenings (about 8–11 pm Cairo time) usually do best for players. Check each platform's insights after a month and move the times to what your audience actually does.

**Language:** English on the image (the brand fonts are Latin only), **captions in English + Egyptian Arabic** on Instagram, Facebook and TikTok. LinkedIn in English.

## 5. Phases up to and after the Kinfold launch

**Phase 0 — Set up (this week)**
- Reserve the handles, make profile + covers, write bios.
- First 3 posts ready before you announce the pages: *Hello from AmA Studio*, *Kinfold is coming*, one gameplay clip. (`marketing/posts/` already has the first two.)

**Phase 1 — Tease (until store pages exist)**
- 3 posts a week from the pillars. Grow the newsletter: "Get the news first" → site.
- Record lots of short gameplay clips now (see section 7); they are your main content.

**Phase 2 — Pre-register (when Google Play pre-registration / App Store pre-order is live)**
- Pin a post with the store links. Every caption ends with "Pre-register: link in bio".
- Post the trailer everywhere. Announce the release date as soon as it is real.

**Phase 3 — Launch week**
- Day −3, −2, −1 countdown Stories. Launch day: trailer + "Out now" post on every platform, LinkedIn launch post, news post on the site (`/launch-game` skill), newsletter email.
- Reply to every comment for the first days.

**Phase 4 — After launch**
- Keep the rhythm. Share player screenshots (with permission), new levels, updates, thank-you posts.
- Small paid boost later: boost the Reel that already did best organically, targeted at Egypt / MENA. Start small and judge by installs, not likes.

## 6. What to measure (monthly)

Per platform: followers gained, **saves and shares** (better signal than likes), comments, profile → link clicks, newsletter sign-ups, and later pre-registrations / installs. Keep a simple sheet; write down the best 3 posts each month and make more like them.

## 7. Recording gameplay in Unity

The best clips come straight from the game:
- **Unity Recorder** (Package Manager → Unity Recorder): record the Game view at **1080×1920, 30 or 60 fps, MP4**. Set the Game view to a 9:16 resolution first.
- Or record on a real phone with the built-in screen recorder (shows real touch feel).
- Keep each clip short (5–20 s) and about one thing: one level, one combo, one funny moment.
- Save clips in `marketing/clips/` (not published to the site). Then ask Claude to turn them into posts.

---

## 8. Making posts with Claude Code

Everything lives in this repo:

| What | Where |
|---|---|
| Post files (one JSON per post: text, images, captions) | `marketing/posts/` |
| Gameplay clips you record | `marketing/clips/` |
| Brand templates (HTML/CSS, the four colors and three fonts) | `marketing/templates/` |
| Generator | `scripts/social.mjs` → `npm run social` |
| Finished images, videos and captions | `marketing/out/<post-id>/` |
| Instructions Claude follows | `.claude/skills/social-post/SKILL.md` |

Commands:

```bash
npm run social -- kinfold-is-coming     # one post, all its formats
npm run social -- --all                 # every post
npm run social -- kinfold-is-coming --only story --no-video
```

Each post folder gets `square.png` (1:1), `portrait.png` (4:5, best for IG/FB feed), `story.png` (9:16), `landscape.png` (1.91:1, LinkedIn/FB links), the `.mp4` versions you ask for (animated in the brand's motion style), and `captions.md` with a caption per platform.

### Things to tell Claude (copy and change)

- *"Make a social post announcing that Kinfold's release date is 12 December. Square, portrait and story, with a story video. Captions for Instagram, Facebook, TikTok and LinkedIn, English and Egyptian Arabic."*
- *"I put a gameplay clip in marketing/clips/level-12.mp4. Make a 9:16 Reel from second 3 to 15 with the headline 'One move left' and a TikTok/Instagram caption."*
- *"Make a 'Can you solve it?' post from screenshot-03 of Kinfold."*
- *"Plan next week's posts using the content pillars and make all of them."*
- *"Make the profile picture and all page covers."*
- *"Write this month's LinkedIn post about the studio and make the landscape image."*

Claude writes the post JSON, runs the generator, looks at the images to check them, and tells you where the files are. You review and post them yourself (Claude doesn't log in to your social accounts).

### Using Codex too

`AGENTS.md` in the repo root points Codex to the same rules and skill, so you can give Codex the same requests. Good uses:
- A second opinion on captions or a month's content calendar.
- If your ChatGPT/Codex plan includes **image generation**, use it for extra illustration (backgrounds, sketches of Egyptian items) and save them in `marketing/assets/`, then ask Claude or Codex to use them in a post. Keep generated art clearly as art, never as fake gameplay, and keep the brand colors.

Music: add music inside Instagram / TikTok when posting (trending sounds help reach and avoid copyright problems). The generated videos are silent unless a post sets `audio`.
