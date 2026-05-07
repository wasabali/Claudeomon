# Trainer Sprite Credits

## Kenney Micro Roguelike (CC0 1.0)

Trainer NPC sprites are sourced from [Kenney Micro Roguelike](https://kenney.nl/assets/micro-roguelike) by [Kenney](https://kenney.nl).

- **License:** CC0 1.0 Universal (Public Domain Dedication) — no restrictions
- **Source:** https://kenney.nl/assets/micro-roguelike
- **Modifications:** 3× nearest-neighbor upscale from 16×16px to 48×48px

### Sprite sheet layout

Each `.png` is a **4-row × 3-column** grid at 3× scale (48×48 px per frame):

| Row | Direction |
|-----|-----------|
| 0   | Down (south) |
| 1   | Left (west) |
| 2   | Right (east) |
| 3   | Up (north) |

Columns 0–2 are the three walk-cycle frames per direction.

### Obtaining the files

1. Download **Kenney Micro Roguelike** from https://kenney.nl/assets/micro-roguelike
2. Run the upscale script (3×):
   ```bash
   node scripts/upscale-assets.js \
     --input /tmp/kenney-packs/micro-roguelike \
     --output /tmp/kenney-upscaled
   cp -r /tmp/kenney-upscaled/characters/* assets/sprites/trainers/
   ```
3. Name the outputs to match the trainer archetype IDs defined in `src/data/trainers.js`

### Stub files

`trainer_default.png` is a placeholder stub (144×192px sheet — 3 columns × 4 rows of 48×48px frames). Replace with the real Kenney Micro Roguelike sprite after downloading the pack.
