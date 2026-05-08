# Player Sprite — Reference

## Runtime loading convention

**BootScene loads the player sprite by `PLAYER_SPRITE_KEY` from `src/data/trainers.js`.**

```
PLAYER_SPRITE_KEY = 'player_default'
→ loads from assets/sprites/characters/player_default.png
```

This directory (`assets/sprites/player/`) is a **staging area** for the real LPC-generated player sprite
before copying to `assets/sprites/characters/`. `player_default.png` is a colour-coded
placeholder stub (144×192px, 3-col × 4-row walk-cycle sheet, 48×48px per frame).

## Source

**LPC (Liberated Pixel Cup) Spritesheet Generator** — https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/  
License: CC-BY-SA 3.0 (Creative Commons Attribution-ShareAlike 3.0).  
Style target: Pokémon FireRed/HeartGold overworld trainer — solid outline, ~16-colour palette, no anti-aliasing.  
Character concept: Young cloud engineer, laptop bag on back, hoodie.

## Integration steps

1. Visit https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
2. Customise the player character (hoodie, laptop bag, cloud-engineer vibe).
3. Export as PNG — the generator outputs a walk-cycle sheet natively at 48×48px per frame.
4. Copy it to `assets/sprites/characters/player_default.png`.

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
