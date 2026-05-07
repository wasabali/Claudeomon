# Portrait Asset Credits

## Kenney Micro Roguelike (CC0)

Battle portraits for the player and all trainer NPCs are sourced from the
[Kenney Micro Roguelike](https://kenney.nl/assets/micro-roguelike) asset pack
by [Kenney](https://kenney.nl).

| Field | Value |
|---|---|
| Author | Kenney (kenney.nl) |
| Source | https://kenney.nl/assets/micro-roguelike |
| License | [CC0 1.0 Universal — Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) |
| Original size | 16×16px |
| In-game size | 48×48px (3× nearest-neighbor upscale) |

CC0 — no attribution required; credited here as good practice.

---

## Adding Portrait Sprites

1. Download the Kenney Micro Roguelike pack from https://kenney.nl/assets/micro-roguelike
2. Select a suitable 16×16px character tile for each portrait
3. Upscale 3× using nearest-neighbor interpolation:
   ```bash
   node scripts/upscale-assets.js --input <source-dir> --output assets/sprites/portraits
   # or with ImageMagick:
   convert source.png -filter point -resize 300% output.png
   ```
4. Name the output file matching the portrait key convention:
   - Player: `player.png`
   - Trainer `<id>`: `<id>.png` (e.g. `ola_ops.png`, `tux_wizard.png`)
5. Place the 48×48px PNG in this directory (`assets/sprites/portraits/`)

All portrait files in this directory are **optional** — the game renders the portrait slot
blank when a file is absent, so missing portraits never cause runtime errors.
