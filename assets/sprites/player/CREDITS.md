# Player Sprite — Reference

## Runtime loading convention

**BootScene loads the player sprite by `PLAYER_SPRITE_KEY` from `src/data/trainers.js`.**

```
PLAYER_SPRITE_KEY = 'ninja_hero'
→ loads from assets/sprites/characters/ninja_hero.png
```

This directory (`assets/sprites/player/`) is a **staging area** for real Kenney Micro Roguelike sprites
before renaming and copying to `assets/sprites/characters/`. `player_default.png` is a colour-coded
placeholder stub (144×192px, 3-col × 4-row walk-cycle sheet, 48×48px per frame).

## Source

**Kenney Micro Roguelike** — https://kenney.nl/assets/micro-roguelike  
License: CC0 1.0 Universal (Public Domain). No attribution required; credited anyway.  
Modifications: 3× nearest-neighbor upscale from 16×16px to 48×48px.

## Integration steps

1. Download **Kenney Micro Roguelike** from https://kenney.nl/assets/micro-roguelike
2. Upscale 3×:
   ```bash
   node scripts/upscale-assets.js \
     --input /tmp/kenney-packs/micro-roguelike \
     --output /tmp/kenney-upscaled
   ```
3. Identify the hero/player character sheet in the upscaled output.
4. Copy it to `assets/sprites/characters/ninja_hero.png` (or update `PLAYER_SPRITE_KEY` in `src/data/trainers.js` to use a different key, then copy to `assets/sprites/characters/<new_key>.png`).

## Sprite sheet layout

Each sprite sheet is a **4-row × 3-column** grid at 48×48 px per frame:

| Row | Direction |
|-----|-----------|
| 0   | Down (south) |
| 1   | Left (west) |
| 2   | Right (east) |
| 3   | Up (north) |

Columns 0–2 are the three walk-cycle frames per direction.
Total sheet size: 144×192 px.
