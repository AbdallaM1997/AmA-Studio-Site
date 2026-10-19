# AmA Studio — YouTube channel kit

Everything to type and upload, in the order YouTube asks for it.
Pictures and videos are in `marketing/out/youtube-channel/` (make them again with `npm run social -- profile-picture youtube-banner youtube-watermark kinfold-gameplay-reel hello-from-ama-studio`, then copy).

| File | Where it goes |
|---|---|
| `01-profile-picture.png` | Channel picture (same as Instagram and Facebook) |
| `02-banner.png` | Banner image (2560×1440; logo and slogan sit in the middle strip phones show) |
| `03-watermark.png` | Video watermark (the small logo in the corner of every video) |
| `04-short-kinfold-gameplay.mp4` | First Short |
| `05-short-hello.mp4` | Second Short |

---

## 1. Create the channel
Do this on a computer at https://www.youtube.com, signed in with the studio Google account (one tied to `info@amastudios.net` if you can, not a personal Gmail).

1. Click your picture (top right) → **Settings** → **Add or manage your channel(s)** → **Create a channel**.
   This makes a channel with its own name that you can later share with other people as managers. Don't use "Create a channel" on your personal channel, which would use your own name.
2. **Name:**
   ```
   AmA Studio
   ```
3. **Handle:** try `@amastudio.games` (same as Instagram and Facebook). If it's taken, try `@amastudio` or `@amastudios`.
4. Click **Create**.

## 2. Verify the channel
https://www.youtube.com/verify → enter a phone number → type the code.
This unlocks custom thumbnails, videos longer than 15 minutes and live streams.

## 3. Branding
YouTube Studio (https://studio.youtube.com) → **Customization** → **Branding**.

| Field | File | Notes |
|---|---|---|
| Picture | `01-profile-picture.png` | Shown as a circle; the logo stays inside. |
| Banner image | `02-banner.png` | Click **Upload**, keep the crop as it is, **Done**. The preview shows TV, desktop and phone; the logo should be whole in all three. |
| Video watermark | `03-watermark.png` | Display time: **Entire video**. |

Click **Publish** (top right).

## 4. Basic info
Same page → **Basic info**.

- **Name:** `AmA Studio`
- **Handle:** the one you chose.
- **Description** (max 1,000 characters):
  ```
  AmA Studio is a game studio from Cairo, Egypt. AmA stands for AmAzing.
  We make small, bright games for everyday breaks: easy to learn in a minute, fun for months.

  Our first game, Kinfold, is coming soon to iOS and Android. Look at the cards, drop each one into its group, clear the board. Play in English or Arabic.

  Here you'll find trailers, gameplay Shorts and, later, devlogs about how we make our games.

  Serious about fun.

  استوديو ألعاب من القاهرة. بنعمل ألعاب صغيرة ومبهجة لاستراحتك اليومية.
  ```
- **Links** (click **Add link**):
  | Title | URL |
  |---|---|
  | `Website` | `https://amastudios.net/?utm_source=youtube` |
  | `Instagram` | `https://www.instagram.com/amastudio.games/` |
  | `Facebook` | `https://www.facebook.com/amastudio.games/` |

  Turn on **Links on banner** for the first one (shows `amastudios.net` on the banner).
- **Contact info:** `info@amastudios.net`

Click **Publish**.

## 5. Settings worth doing once
YouTube Studio → **Settings** (bottom left).

- **Channel → Basic info:** Country `Egypt`. Keywords:
  ```
  AmA Studio, Kinfold, indie game, mobile game, puzzle game, game dev, Egypt, Cairo, Unity
  ```
- **Channel → Advanced settings → Audience:** choose whether your videos are made for kids. Trailers and devlogs for a general audience are usually **No**; if you aim a game at children, ask again for that game.
- **Upload defaults:** Title `| AmA Studio` at the end, Visibility `Public`, Category `Gaming`, the website link at the bottom of the description, Language `English`.
- **Permissions:** invite a second trusted person as **Manager** so the channel never depends on one login.
- On the Google account: turn on **2-Step Verification** (https://myaccount.google.com/security) and save the login in your password manager.

## 6. First uploads
**Create** (top right) → **Upload videos**. A vertical video under 3 minutes becomes a **Short** automatically.

### Short 1 — Kinfold gameplay
File: `04-short-kinfold-gameplay.mp4`. Add music from YouTube's sound library in the YouTube app if you like.
- **Title:**
  ```
  One card, one group, one clear board. Kinfold #shorts
  ```
- **Description:**
  ```
  Kinfold is our first game: look at the cards, drop each one into its group, clear the board. Every card shows something from Egypt.
  Coming soon to iOS and Android. Follow the channel to see it first.

  كارت واحد، مجموعة واحدة، ولوحة فاضية. Kinfold جاية قريب.

  https://amastudios.net/?utm_source=youtube
  #Kinfold #PuzzleGame #MobileGames #IndieGame
  ```

### Short 2 — Hello (a day or two later)
File: `05-short-hello.mp4`
- **Title:**
  ```
  Hello from Cairo. We're AmA Studio #shorts
  ```
- **Description:**
  ```
  We're AmA Studio, a game studio from Cairo. AmA stands for AmAzing.
  We make small, bright games for everyday breaks. Our first game is on its way. Subscribe to see it first.

  أهلاً من القاهرة إحنا AmA Studio.

  https://amastudios.net/?utm_source=youtube
  #AmAStudio #SeriousAboutFun #IndieGame #GameDev #MadeInEgypt
  ```

### Later
- **Trailer:** when the Kinfold trailer is ready, upload it as a normal (16:9) video, then **Customization → Layout → Channel trailer for people who haven't subscribed**.
- **Shorts:** re-use every TikTok and Reel here (`npm run social -- <id>` → `story.mp4`). Two a week is plenty.
- **Devlogs:** a short video about how a level or a feature was made. Record the Unity editor with OBS.

## 7. Tell people
- Send the channel link (`https://www.youtube.com/@<handle>`) to Claude and ask: *"Add my YouTube link to the site"*. The footer "Follow" column will show it.
- Add the channel to the Instagram and Facebook links.
