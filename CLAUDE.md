# AmA Studio website

The website for **AmA Studio** (AmA = AmAzing), a game studio in Cairo, Egypt.
Slogan: **"Serious about fun."** Built with [Astro](https://astro.build) as a fully static site.

## Commands

```bash
npm install          # first time only
npm run dev          # local site at http://localhost:4321
npm run build        # production build into dist/
npm run preview      # serve the built site
npm run check:data   # validate src/data/*.json (run after every content edit)
```

Always run `npm run check:data && npm run build` before saying a change is done.

## Where things live

| What | File |
|---|---|
| Studio name, slogan, email, nav, socials, principles, splash settings, services switch | `src/data/site.json` |
| Games (one object per game) | `src/data/games.json` |
| News posts | `src/data/news.json` |
| Brand colors, fonts, buttons, reveal animations | `src/styles/global.css` |
| Splash intro (3 looks) | `src/components/Splash.astro` + `src/scripts/splash.js` |
| Scroll reveals, pointer parallax, "play break" squares toy, card tilt, mobile menu | `src/scripts/motion.js` |
| Logo (built from type, not an image) | `src/components/Logo.astro` |
| Pages | `src/pages/` (home, games, games/[slug], news, news/[slug], support, privacy, terms, 404) |
| Images, videos, favicon | `public/` (reference as `/images/...`) |

**Internal links and media paths:** wrap them in `url()` from `src/lib/url.ts` (e.g. `href={url("/games/")}`) so they work under the GitHub Pages sub-path. JSON keeps plain `/images/...` paths.

**Content changes go in the JSON files, not in the page templates.** Pages read the data and render it.
Use the project skills in `.claude/skills/` for common jobs: adding a game, adding a news post, launching a game, changing the splash.

## Brand rules (follow these on every change)

- **Colors — only these four:** red `#F4473A`, yellow `#FFE783`, black `#181818`, cream `#F8F5EC`. Use the CSS variables (`var(--red)` etc.), never new hex values.
- Ratio: cream ~60% (backgrounds), black ~20% (text, rules), yellow ~10% (panels), red ~10% (calls to action, the full stop, squares). Red stays rare so it stays loud.
- **Fonts:** Anton for headlines (`.display`), Archivo Black for labels/buttons (`.label`, `.btn`), Archivo (variable, width 110%) for body text. No other fonts.
- **The red full stop:** every headline ends with `<span class="dot">.</span>`. On red backgrounds use `dot--cream`, on yellow headlines in red use `dot--black`.
- **Numbered sections:** labels read `NN / NAME` (e.g. `03 / Play Dept.`).
- **The tilted square** is the brand mark: small squares rotated ~10–20°, in red/black/yellow/cream. Never circles, gradients, blobs, drop shadows with blur, or emoji.
- **Borders:** solid 2px black rules (`var(--rule)`). Hard offset shadows (`8px 8px 0 var(--black)`) for hover only.
- **Voice:** short, punchy, friendly. Sentences end with a full stop. No hype words ("revolutionary", "best-in-class"). No invented numbers or reviews.
- Text contrast: never small red or cream text on yellow; red-on-cream only at 24px+.

## Motion rules

- Elements animate in with `data-reveal` (`""`, `"left"`, `"pop"`). Put `data-stagger` on a parent to cascade its children. Delay a single element with `style="--d:.2s"`.
- Floating squares: wrap in `<span class="sq-wrap" data-depth="20">` (pointer parallax) with an inner `<span class="sq sq--red float">`.
- Any area with `data-toy` drops squares where it's clicked. Cards with `data-tilt` tilt toward the pointer.
- Easing tokens: `--ease-pop` (bouncy, for squares and dots), `--ease-out` (smooth, for text).
- **Every animation must respect `prefers-reduced-motion`** — the splash is skipped and reveals show instantly. Keep it that way when adding motion.
- Animate `transform`, `opacity`, `clip-path` and `translate` only (smooth on phones). Don't animate layout properties.

## Splash intro

Set in `site.json → splash`: `variant` is `"pop"` (yellow, bouncy), `"blocks"` (color bars lift away, checker strip) or `"night"` (dark, confetti).
It plays once per browser session on the home page only, can be skipped by click/key/button, and fires `ama:ready` when done (page reveals wait for it).
Preview any look with `/?splash=pop`, `/?splash=blocks`, `/?splash=night`.

## Services (future)

`site.json → services.enabled` is `false` for now: the contact band shows a "coming soon" line. Set it to `true` to show the services list (event games, AR/VR, client games) in the contact section. A full `/work/` page can be added later using the same section patterns.

## Things still to fill in

Search the data and pages for empty strings and `[` brackets: real email and domain (`site.json → email`, `url`), social links, key art / screenshots / trailer / store links for each game, and the `[bracketed]` parts of `privacy.astro` and `terms.astro` (templates, must be reviewed before publishing).

## Deploying (GitHub Pages)

Every push to `main` builds and deploys via `.github/workflows/deploy.yml` to https://abdallam1997.github.io/AmA-Studio-Site/.
The workflow sets the base path automatically; with a custom domain later, add `public/CNAME` and update `site.json → url`.
