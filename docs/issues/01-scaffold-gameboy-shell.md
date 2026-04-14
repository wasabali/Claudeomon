# Issue 1 — [Game] Scaffold + GameBoy Color shell

## Context

This is the foundation issue. Every other issue depends on this being in place. The goal is a running Vite + Phaser 3 project that looks and feels like a GameBoy Color game from the first pixel.

The game is called **Cloud Quest** — a Pokémon GBC-style RPG about the life of a cloud engineer. See `docs/GAME_DESIGN.md` for the full design document.

---

## Visual Spec (must match exactly)

| Property | Value |
|----------|-------|
| Native resolution | 160×144 px |
| Display resolution | 640×576 px (scaled 4x — no interpolation) |
| Colours per sprite | 4 (strict GBC palette) |
| Total colours on screen | Max 56 |
| Font | "Press Start 2P" (Google Fonts, free) |
| Tile size | 16×16 px |
| Player sprite | 16×24 px |
| Animations | 2–4 frame flips only — no smooth tweening |

The browser page should look like a physical GameBoy Color:
- Canvas centred on a dark background
- Pixel-art GBC shell border around the canvas (CSS only — no image needed)
- Speaker grille dots on the right, D-pad shape on the left, A/B buttons
- "CLOUD QUEST" branding below the screen

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Vite | latest | Dev server + bundler |
| Phaser 3 | latest | Game engine |
| "Press Start 2P" | via Google Fonts | Pixel font |

No other dependencies. Keep it lean.

---

## Files to Create

```
cloud-quest/
├── index.html           # GBC shell frame — CSS border, buttons, layout
├── package.json         # vite + phaser, scripts: dev / build / preview
├── src/
│   ├── main.js          # Phaser game config + scene registry — nothing else
│   ├── config.js        # ALL constants live here — no magic numbers elsewhere
│   ├── scenes/
│   │   ├── BootScene.js # Preload assets (placeholders OK for now)
│   │   └── TitleScene.js# Title screen with menu
```

### `src/config.js` must export:
```js
export const GAME_WIDTH = 160
export const GAME_HEIGHT = 144
export const SCALE = 4
export const TILE_SIZE = 16
export const PLAYER_WIDTH = 16
export const PLAYER_HEIGHT = 24
export const MAX_ACTIVE_SKILLS = 6
export const FONT = 'Press Start 2P'
export const PALETTE = {
  black:     '#0f380f',
  darkGreen: '#306230',
  lightGreen:'#8bac0f',
  white:     '#9bbc0f',
}
```

### `TitleScene.js` must show:
- Game title: `CLOUD QUEST`
- Subtitle: `A Cloud Engineer's Journey`
- Blinking prompt: `PRESS START`
- Two menu items: `NEW GAME` / `LOAD SAVE`
- Cursor that moves between options with up/down keys
- Enter/Space/Z selects — transitions to a stub `WorldScene`

---

## Acceptance Criteria

- [ ] `npm run dev` starts without errors
- [ ] Game renders at 160×144 scaled to 640×576 (no blurring)
- [ ] GameBoy Color shell frame visible around canvas in browser
- [ ] "Press Start 2P" font loads and renders correctly
- [ ] Title screen shows game name, subtitle, and blinking prompt
- [ ] Cursor navigates between NEW GAME and LOAD SAVE
- [ ] Selecting NEW GAME transitions to a stub WorldScene (blank green screen is fine)
- [ ] No magic numbers outside `src/config.js`

---

## Coding Standards

- DRY: nothing duplicated, all constants in `config.js`
- `main.js` only contains the Phaser config object and scene list — no logic
- `BootScene` only preloads — no game logic
- `TitleScene` is self-contained — reads from `config.js`, no hardcoded values
- Files stay under 200 lines
