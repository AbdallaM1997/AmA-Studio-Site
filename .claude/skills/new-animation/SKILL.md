---
name: new-animation
description: Add or change an animation, interaction or splash look on the AmA Studio website in the brand's motion style. Use for any request about motion, effects, transitions, hover states or the intro splash.
---

# Animations in the AmA style

Read the "Motion rules" and "Splash intro" sections of `CLAUDE.md` first.

The motion language: **things are dropped, popped and stacked like game pieces.**
- Squares land with a little overshoot (`--ease-pop`) and a rotation that settles at 10–20°.
- Text slides or rises in cleanly (`--ease-out`); the red full stop pops in last.
- Blocks build up cell by cell (the checker strip). Short and snappy: 0.3–0.8s per piece, whole sequences under ~3s.
- Playful but tidy: no wobble loops on text, no blur except the night splash, no parallax on text.

How to add:
1. Prefer the existing hooks: `data-reveal`, `data-stagger`, `.float`, `sq-wrap[data-depth]`, `data-toy`, `data-tilt`.
2. New CSS animations go in the component's `<style>` (or `global.css` if shared). New JS behaviour goes in `src/scripts/motion.js` as a `setupX()` function called from `runMotion()`.
3. A new splash look: add markup in `Splash.astro`, CSS under `html[data-splash="<name>"]`, add the name to the `variants` list in `src/layouts/Base.astro`, document it in `CLAUDE.md`.
4. Always add a `prefers-reduced-motion: reduce` fallback.
5. Check it: `npm run build && npm run preview`, open the page (and `/?splash=<name>` for splash work) at desktop and phone widths.
