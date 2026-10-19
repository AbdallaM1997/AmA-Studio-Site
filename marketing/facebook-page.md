# AmA Studio — Facebook Page kit

Everything to type and upload, in the order Facebook asks for it.
Pictures are in `marketing/out/facebook-page/` (make them again with `npm run social -- profile-picture facebook-cover hello-from-ama-studio kinfold-is-coming kinfold-gameplay-reel`, then copy).

---

## 1. Create the Page
Facebook → Menu → **Pages** → **Create new Page**.

**Page name**
```
AmA Studio
```

**Category** (type and pick the closest match; names differ a little by region)
1. `Video game company` or `Video game developer` (type "video game")
2. `Software company`

**Bio** (the short intro, max 101 characters; this one is 83)
```
Game studio from Cairo. Small, bright games for everyday breaks. Serious about fun.
```

## 2. Pictures

| Upload as | File | Size |
|---|---|---|
| Profile picture | `01-profile-picture.png` | 1080×1080 (Facebook shows it as a circle; the logo stays inside) |
| Cover photo | `02-cover-photo.png` | 1640×624 (made by `npm run social -- facebook-cover`: the bottom middle stays empty for the profile picture, and phones crop the sides) |

When you upload the profile picture or cover, Facebook may make a post of it. Leave the text empty, or use:
```
Hello from Cairo.
```

**Cover photo description** (click the cover → Edit description), helps people who use screen readers:
```
AmA Studio logo next to the words Serious about fun.
```

## 3. Contact and details
Page → **Edit details** / **About** → **Contact and basic info**.

| Field | What to put |
|---|---|
| Website | `https://amastudios.net/` |
| Email | `info@amastudios.net` |
| Phone | Leave empty unless you have a studio number. |
| Location / address | City only: `Cairo, Egypt`. Don't add a street address unless people can visit. |
| Hours | `No hours available`. |
| Price range | Skip. |
| Social links | Instagram: `https://www.instagram.com/amastudio.games/`. Add TikTok, LinkedIn and YouTube when they exist. |

**Username** (Settings → Username). Use the Instagram one so people find you the same way everywhere:
```
amastudio.games
```
If it is taken on Facebook, try `amastudios`, then `amastudioeg`.

**Longer description** (if Facebook shows an "About" / "Additional information" box):
```
AmA Studio is a game studio based in Cairo, Egypt. AmA stands for AmAzing, and that is the bar we set for every game.

We make small, bright games for everyday breaks: easy to learn in a minute, fun for months. Built in Unity and tested until they feel just right.

Our first game, Kinfold, is a category card puzzle set in Egypt, coming to iOS and Android.

Players, press and partners: info@amastudios.net

استوديو ألعاب من القاهرة. بنعمل ألعاب صغيرة ومبهجة لاستراحتك اليومية: تتعلمها في دقيقة وتفضل تلعبها شهور. أول لعبة لينا Kinfold، لغز كروت من مصر، جاية قريب على iOS و Android.
```

## 4. Action button
Page → **Add action button** (or Edit button):
- **Now:** `Send email` → `info@amastudios.net`, or `Learn more` → `https://amastudios.net/`
- **When Kinfold has store links:** change it to `Use app` / `Play game` → the store link.

## 5. First posts
Post these before you invite people, so the Page isn't empty. The captions are also in each post's `captions.md`.

### Post 1 — Hello (pin it to the top: ··· → Pin post)
Picture: `03-post-hello.png` (or the video `03-post-hello.mp4`)
```
Hello from Cairo. We're AmA Studio: a new game studio making small, bright games for everyday breaks.
Our first game is on its way. Follow the page to see it first.

أهلاً من القاهرة! إحنا AmA Studio، استوديو ألعاب جديد بيعمل ألعاب صغيرة ومبهجة لاستراحتك اليومية. أول لعبة جاية قريب، تابع الصفحة علشان تعرف أول واحد.

#AmAStudio #SeriousAboutFun #IndieGame #GameDev #MadeInEgypt
```

### Post 2 — Kinfold is coming (next day)
Picture: `04-post-kinfold.png` (4:5, best size for the feed)
```
Meet Kinfold, our first game: a bright category card puzzle set in Egypt. Match every card to its group and clear the board.
Coming to iOS and Android, in English and Arabic.

دي Kinfold، أول لعبة لينا: لغز كروت مبهج من مصر. حط كل كارت في مجموعته وفضّي اللوحة. جاية قريب على iOS و Android.

#Kinfold #AmAStudio #PuzzleGame #MobileGames #MadeInEgypt
```

### Post 3 — Gameplay Reel (2–3 days later)
Video: `05-reel-gameplay.mp4` (post as a **Reel**, add a sound from Facebook's music library)
```
One card, one group, one clear board. Kinfold is coming to iOS and Android.

كارت واحد، مجموعة واحدة، ولوحة فاضية. Kinfold جاية قريب.

#Kinfold #PuzzleGame #MobileGames #IndieGame
```

## 6. Invite people
After the 3 posts are up: Page → **Invite friends**. Then share Post 1 to your personal profile with:
```
I started a game studio. AmA Studio makes small, bright games for everyday breaks, and our first game is coming soon. Follow the page if you'd like to see it first.

بدأت استوديو ألعاب! AmA Studio بيعمل ألعاب صغيرة ومبهجة، وأول لعبة جاية قريب. تابعوا الصفحة علشان تشوفوها الأول.
```

## 7. Settings worth doing once
- Turn on **two-factor authentication** for your own Facebook account (it protects the Page).
- Add a second admin you trust, so you never lose access.
- Connect the Page to the Instagram account in **Meta Business Suite**, so you can post to both at once.
- When the Page has the URL, ask Claude: *"Add my Facebook page to the site: https://facebook.com/..."*.
