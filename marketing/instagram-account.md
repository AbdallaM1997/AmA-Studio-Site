# AmA Studio — Instagram account kit

Everything to type and upload, in the order Instagram asks for it.
Pictures are in `marketing/out/instagram-account/` (make them again with `npm run social -- profile-picture hello-from-ama-studio kinfold-is-coming kinfold-gameplay-reel kinfold-can-you-solve-it`, then copy).

---

## 1. Create the account
Easiest on your phone: Instagram app → **Sign up** (or, if you already use Instagram: your profile → your username at the top → **Add Instagram account** → **Create new account**).

- **Email:** `info@amastudios.net` (a studio email, not a personal one, so the account belongs to the studio).
- **Name** (shown in bold, searchable, max 30 characters):
  ```
  AmA Studio
  ```
- **Username:** `amastudio.games` (taken, live at https://www.instagram.com/amastudio.games/). Use the same one on Facebook and TikTok if it is free there.

If you already have a personal Instagram, you can switch between both accounts in the app.

## 2. Switch to a professional account
Profile → ☰ menu → **Account type and tools** → **Switch to professional account**.

- Type: **Business** (gives a contact button and lets you connect the Facebook Page).
- Category: `Video game` (type "video game"; if missing, `Software company` or `Entertainment`).
- **Display category on profile:** on.
- Contact options: email `info@amastudios.net`. Leave phone and address empty. City: `Cairo, Egypt` (optional).

## 3. Profile
Profile → **Edit profile**.

| Field | What to put |
|---|---|
| Picture | `01-profile-picture.png` (1080×1080; Instagram shows it as a circle and the logo stays inside) |
| Name | `AmA Studio` |
| Pronouns | Leave empty. |
| Bio | see below |
| Links | **Add external link** → `https://amastudios.net/?utm_source=instagram` , title `Website` |
| Gender | Prefer not to say. |

**Bio** (max 150 characters; this one is 124):
```
Game studio from Cairo.
Small, bright games for everyday breaks.
Serious about fun.
Kinfold: coming soon to iOS and Android.
```

Arabic option (swap the last line if most followers write in Arabic):
```
استوديو ألعاب من القاهرة. ألعاب صغيرة ومبهجة لاستراحتك اليومية.
```

When Kinfold has store links, change the last line to `Kinfold is out. Play free:` and add the store link as a second link.

## 4. First posts (before you tell anyone)
Post these first so new visitors see a full row. On the grid Instagram now shows posts as tall 3:4 tiles; the 4:5 images keep their text inside that crop.

Post them in this order (the newest shows first, top left):

### Post 1 — Hello (pin it: ··· → Pin to your profile)
Picture: `02-post-hello.png`
Alt text (··· → Advanced settings → Write alt text): `AmA Studio logo with the words Serious about fun.`
```
Hello from Cairo. We're AmA Studio, and AmA stands for AmAzing.
We make small, bright games for everyday breaks. Easy to learn in a minute, fun for months.
Our first game is on its way. Follow to see it first.

أهلاً من القاهرة إحنا AmA Studio.
بنعمل ألعاب صغيرة ومبهجة لاستراحتك اليومية. أول لعبة جاية قريب، تابعنا علشان تشوفها الأول.

#AmAStudio #SeriousAboutFun #IndieGame #GameDev #MadeInEgypt #Cairo #MobileGames
```

### Post 2 — Kinfold is coming (same day or next day)
Picture: `03-post-kinfold.png`
```
Meet Kinfold, our first game.
Look at the cards, drop each one into its group, clear the board. Every card shows something from Egypt.
Coming to iOS and Android. Play in English or Arabic.

دي Kinfold، أول لعبة لينا
بص على الكروت، حط كل كارت في مجموعته، وفضّي اللوحة. كل كارت فيه حاجة من مصر.
جاية على iOS و Android، بالعربي والإنجليزي.

#Kinfold #AmAStudio #PuzzleGame #MobileGames #IndieGame #MadeInEgypt #Egypt
```

### Post 3 — Gameplay Reel
Video: `04-reel-gameplay.mp4` → post as a **Reel**. Add a sound from Instagram's music (a trending one helps reach). Pick a cover frame that shows the board clearly, and turn on **Also share to Facebook** once the Page is connected.
```
One card, one group, one clear board. Kinfold is coming to iOS and Android.

كارت واحد، مجموعة واحدة، ولوحة فاضية. Kinfold جاية قريب.

#Kinfold #PuzzleGame #MobileGames #IndieGame #Satisfying
```

### Post 4 — Can you solve it? (a few days later, a Tuesday)
Picture: `05-post-can-you-solve-it.png`. Reply to answers, then post the answer in Stories the next day.
```
Can you solve it? Tell us which group each card goes in. Answer in Stories tomorrow.

تقدر تحلها؟ قولنا كل كارت يروح أنهي مجموعة الإجابة بكرة في الستوري.

#Kinfold #PuzzleGame #CanYouSolveIt #Egypt
```

## 5. Stories and Highlights
- Story 1: `06-story-hello.mp4` → add a **Link** sticker to `https://amastudios.net/`.
- Story 2: `07-story-kinfold.png` → add a **Poll** sticker: `Would you play this?` / `Yes` / `Show me more`.
- Save both to a Highlight called `Kinfold`. Later add Highlights `Studio` and `Play`.

## 6. Tell people
- Share Post 1 to your personal Instagram Story with a mention sticker `@<your handle>`.
- Follow 20–30 accounts you really like: Egyptian game devs, indie studios, Unity, puzzle-game players. Comment on their posts as AmA Studio (short, real comments).
- Put the handle on the Facebook Page, LinkedIn and your email signature.

## 7. Settings worth doing once
- **Two-factor authentication:** Accounts Center → Password and security → Two-factor authentication. Use an authenticator app if you can.
- **Connect the Facebook Page:** Accounts Center → **Add accounts** (or in Meta Business Suite), so you can post to both at once and reply to both inboxes in one place.
- Save the login in your password manager, and keep a second trusted person with access through Meta Business Suite.
- The site already links to the account (`src/data/site.json → socials`).
