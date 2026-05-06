# Visual Assets Specification

Cloud Quest uses a pixel-art style based on the [Ninja Adventure](https://pixel-boy.itch.io/ninja-adventure-asset-pack) asset pack.
All sprites are scaled 3× from their source resolution for consistent clarity at 1920×1080.

---

## Source Resolution

| Source | Native size | In-game size | Scale |
|---|---|---|---|
| Ninja Adventure tiles | 16×16px | 48×48px | 3× |
| Ninja Adventure characters | 16×16px | 48×48px | 3× |
| Ninja Adventure facesets | 16×16px | 48×48px | 3× |
| PokeRogue battle backgrounds | native | native | 1× |
| PokeRogue UI chrome | native | native | 1× |

---

## Canvas & Tile Grid

- **Canvas:** 1920×1080px, `Phaser.Scale.FIT` — fills browser, preserves aspect ratio
- **Tile size:** 48×48px
- **Viewport:** 40 tiles wide × ~22 tiles tall

---

## Character Sprites

Character walk cycles are 3-frame animations (idle, step-left, step-right).

| Sprite type | Size | Animation frames |
|---|---|---|
| Player character | 48×48px | 3 frames (idle + 2 walk) |
| Trainer NPC | 48×48px | 3 frames (idle + 2 walk) |
| Overworld enemy | 48×48px | 2 frames (idle blink) |

Walk animation: swap between step frames at 8 fps. No sub-pixel movement.

---

## Battle Sprites

Battle sprites face the player from the right side of the screen.

| Sprite type | Size | Notes |
|---|---|---|
| Player back sprite | 48×48px | Back-facing, standing |
| Trainer front sprite | 48×48px | Front-facing, standing |
| Incident sprite | 48×48px | Symbolic icon for the incident type |

### Battle Portraits

Small static portraits shown next to HP bars during battle.

| Portrait type | Size | Source |
|---|---|---|
| Player portrait | 48×48px | Ninja Adventure faceset, 3× upscale |
| Trainer portrait | 48×48px | Ninja Adventure faceset, 3× upscale |

**Why 48×48px:** Ninja Adventure facesets are 16×16px native. A 3× upscale gives 48×48px, which matches
the tile grid and all other in-game sprites. A 6× upscale (96×96px) would make each source pixel a 6×6 block
and look too blocky at the game's resolution.

---
---

## Incident Sprites

All incident sprites are **horizontal spritesheets** — frames laid left to right.

| Property | Value |
|---|---|
| Frame size | 48×48 px |
| Layout | Horizontal strip |
| Frames per sprite | 2–3 |
| Sheet width | `frameCount × 48` |
| Sheet height | `48` |
| File path | `assets/sprites/incidents/{incident_id}.png` |

### Phaser Load Call

```js
this.load.spritesheet('incident_404_not_found', 'assets/sprites/incidents/404_not_found.png', {
  frameWidth: 48,
  frameHeight: 48,
})
```

### Phaser Animation

```js
this.anims.create({
  key: 'incident_404_not_found_idle',
  frames: this.anims.generateFrameNumbers('incident_404_not_found', { start: 0, end: 1 }),
  frameRate: 2,
  repeat: -1,
})
```

### Animation Rules

| Rule | Requirement |
|---|---|
| Frame count | 2–3 frames maximum |
| Frame rate | 2 fps (slow wobble) to 4 fps (fast spin) |
| Loop | always `repeat: -1` |
| Movement | frame swaps only — no tween x/y/scale/alpha |
| Easing | none — instant frame change |

### Incident Sprite Design Principles

1. **Silhouette first** — the shape alone should hint at the incident type
2. **Tech iconography** — use real tech symbols (server racks, cables, semicolons, error codes)
3. **Facial expression** — incidents have "faces" to make them memorable and slightly comic
4. **Motion hint in frame 2** — the animation should reinforce the incident's behaviour (wobble for confusion, spin for hang, drip for leak)

### Priority 1 — Starter Region Encounters

| Incident ID | File | Frames | Animation |
|---|---|---|---|
| `404_not_found` | `incidents/404_not_found.png` | 2 | Wobble left/right |
| `missing_semicolon` | `incidents/missing_semicolon.png` | 2 | Blink in/out |
| `port_conflict` | `incidents/port_conflict.png` | 2 | Cable tug left/right |
| `npm_install_hang` | `incidents/npm_install_hang.png` | 2 | Spinner rotation |
| `503_error` | `incidents/503_error.png` | 2 | Smoke puff grow |
| `merge_conflict` | `incidents/merge_conflict.png` | 3 | Approach → collision → sparks |
| `failed_pipeline` | `incidents/failed_pipeline.png` | 2 | Data drip fall |

### Priority 2 — Later Region Encounters

These can ship without a sprite until custom art is created. Do not set a placeholder `spriteKey`; if no sprite asset exists yet, leave `spriteKey` absent and the game will no-op rather than load a fallback image.

| Incident ID | Visual Concept |
|---|---|
| `stale_ticket` | Dusty JIRA ticket with cobwebs |
| `scope_creep` | Amorphous blob that grows each frame |
| `infinite_sprint` | Hamster wheel with exhausted engineer |
| `config_drift` | Compass spinning wildly |
| `flaky_ci_pipeline` | Pipeline that cracks and reforms |


## Tile Sets

All tile sets use 48×48px tiles on a single-row sprite sheet.

| Tile set | Purpose | Sheet dimensions |
|---|---|---|
| `stub_tiles.png` | Dev placeholder (5 tiles) | 240×48px |
| *(production tiles TBD)* | Overworld terrain | TBD |

---

## UI Elements

| Element | Size | Notes |
|---|---|---|
| 9-slice panel corners | 8×8px | Scaled up via Phaser 9-slice |
| Dialog box | 640×80px | 2 lines of text, Press Start 2P |
| HP/Budget bars | variable×4px | Drawn programmatically |
| Menu cursor arrow | 8×8px | Blinking, from UI sprite sheet |

---

## Emblem Icons

| Size | Sheet layout | Notes |
|---|---|---|
| 48×48px each | 8 icons per sheet row | One icon per emblem ID |

---

## Battle Backgrounds

Battle backgrounds are sourced from **PokeRogue** (CC-BY-NC-SA-4.0) and used at their native resolution.
Each region maps to a PokeRogue arena ID via `BATTLE_BACKGROUNDS` in `src/config.js`.

---

## Font

**Press Start 2P** (Google Fonts, free/OFL) is the only font used. All text rendering goes through
`CONFIG.FONT` in `src/config.js`. No other fonts are permitted.

---

## Colour Palette

Core colours are defined in `COLORS` in `src/config.js`:

| Name | Hex | Used for |
|---|---|---|
| Background | `#0b1020` | Scene backgrounds |
| Title | `#f8f8f8` | Primary text |
| Subtitle | `#9bc5ff` | Secondary text, domain labels |
| Prompt | `#f8f8f8` | Input prompts |
| Menu arrow | `#ffe066` | Cursor / selection highlight |

HP bar colours are rendered programmatically: green (`#00cc44`) > 50%, yellow (`#ffe066`) > 25%, red (`#ff3300`) otherwise.

---

## Asset Credits

| Asset | Source | Licence |
|---|---|---|
| Tiles, characters, facesets | [Ninja Adventure](https://pixel-boy.itch.io/ninja-adventure-asset-pack) — Pixel-Boy & AAA | CC0 (public domain) |
| Battle backgrounds, UI chrome | [PokeRogue](https://github.com/pagefaultgames/pokerogue) — pagefaultgames | CC-BY-NC-SA-4.0 |
| Font | [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) — CodeMan38 | OFL-1.1 |

See `assets/arenas/CREDITS.md` and `assets/ui/CREDITS.md` for per-file attribution.
# Visual Assets

This document describes every external asset source used in Cloud Quest, how each is licensed, and how assets are mapped into the project's folder structure.

---

## Asset Strategy

Cloud Quest uses a **multi-source asset strategy**:

| Source | Role | License |
|--------|------|---------|
| **Ninja Adventure** | Primary — characters, monsters, tiles, VFX, items, UI, BGM, SFX | CC0 1.0 (Public Domain) |
| **PokeRogue** | Battle backgrounds and UI chrome | CC-BY-NC-SA-4.0 |
| **Kenney RPG Urban** | Supplemental tech/urban tiles | CC0 1.0 (Public Domain) |

---

## Ninja Adventure Asset Pack

### Overview

[Ninja Adventure](https://pixel-boy.itch.io/ninja-adventure-asset-pack) by **pixel-boy (AAA)** is the primary visual source for Cloud Quest. It is released under the **CC0 1.0 Universal** license — no restrictions, no attribution required — but we attribute anyway.

```
## Ninja Adventure Asset Pack
- Author:        pixel-boy (AAA)
- Source:        https://pixel-boy.itch.io/ninja-adventure-asset-pack
- License:       CC0 1.0 Universal (Public Domain Dedication)
- Usage:         Characters, monsters, world tiles, VFX, items, UI elements, BGM, SFX
- Modifications: 3× nearest-neighbor upscale from 16×16 to 48×48px
```

### What's Included

| Category | Ninja Adventure folder | Cloud Quest folder |
|----------|------------------------|-------------------|
| Player & NPC characters | `Actor/Characters/` | `assets/sprites/characters/` |
| Monster sprites | `Actor/Monsters/` | `assets/sprites/monsters/` |
| World / overworld tiles | `TileSet/` | `assets/maps/tilesets/` |
| VFX (magic, explosions) | `FX/` | `assets/sprites/vfx/` |
| Item icons | `Items/` | `assets/sprites/items/` |
| UI elements | `HUD/` | `assets/ui/` |
| Background music | `BGM/` | `assets/audio/bgm/` |
| Sound effects | `SFX/` | `assets/audio/sfx/` |

### License

CC0 1.0 Universal — these assets are dedicated to the public domain. No attribution is legally required.

We attribute anyway because it's the right thing to do.

### Integration Notes

All Ninja Adventure source sprites are **16×16px**. Cloud Quest uses a **3× nearest-neighbor upscale** to reach the 48×48px tile size. See [Asset Pipeline](#asset-pipeline) below for the upscale script.

---

## PokeRogue Assets

### Overview

Battle backgrounds and UI chrome (9-slice window panels, cursor, HP/XP bars, stat overlays) are adapted from [PokeRogue](https://github.com/pagefaultgames/pokerogue) by [pagefaultgames](https://github.com/pagefaultgames).

Source: `https://github.com/pagefaultgames/pokerogue-assets`

### License

CC-BY-NC-SA-4.0 — **this license propagates to any derived assets and restricts Cloud Quest to non-commercial use**.

- **Attribution** — Credit PokeRogue / pagefaultgames
- **Non-commercial** — Cloud Quest must remain non-commercial
- **Share-alike** — Derived assets must use the same license

### Asset Categories

#### Battle Backgrounds (`assets/arenas/`)

Each arena has `_a` and `_b` layers for parallax depth.

| Cloud Quest region | PokeRogue arena |
|--------------------|----------------|
| Localhost Town | `plains` |
| Pipeline Pass | `construction` |
| Jira Dungeon | `cave` |
| Production Plains | `factory` |
| Kubernetes Colosseum | `stadium` |
| 3am Tavern | `abyss` |
| Server Graveyard | `ruins` |
| node_modules Maze | `forest` |
| /dev/null Void | `space` |
| Deprecated Azure Region | `wasteland` |

#### UI Chrome (`assets/ui/`)

| Asset | Used for |
|-------|---------|
| `window_1` – `window_5` (normal/thin/xthin) | Dialog boxes, menu frames, battle info panels, HUD overlays |
| Cursor / selection indicator | Menu cursor in all scenes |
| Ability bars, health/exp labels | Battle HUD, HP bar, XP bar |
| Battle stat overlays | Stat change indicators in battle |

---

## Kenney RPG Urban

### Overview

[Kenney RPG Urban Pack](https://kenney.nl/assets/rpg-urban-pack) by [Kenney](https://kenney.nl) provides supplemental tiles for technology-themed environments (server rooms, data centres, office corridors).

```
## Kenney RPG Urban
- Author:  Kenney (kenney.nl)
- Source:  https://kenney.nl/assets/rpg-urban-pack
- License: CC0 1.0 Universal (Public Domain Dedication)
- Usage:   Supplemental tech/urban tiles for indoor maps
```

### Usage

Kenney tiles supplement Ninja Adventure tiles where tech-flavoured interiors are needed. They are placed in `assets/maps/tilesets/kenney/` and referenced from Tiled map files.

### License

CC0 1.0 Universal — public domain. No attribution required; credited anyway.

---

## Asset Categories

### Sprites (`assets/sprites/`)

| Subfolder | Source | Notes |
|-----------|--------|-------|
| `characters/` | Ninja Adventure | Player and NPC sprites; 3× upscaled from 16×16 |
| `monsters/` | Ninja Adventure | Enemy sprites; 3× upscaled from 16×16 |
| `items/` | Ninja Adventure | Item icons; 3× upscaled from 16×16 |
| `vfx/` | Ninja Adventure | Hit sparks, magic rings, explosions; 3× upscaled |

### Maps & Tilesets (`assets/maps/`)

| Subfolder | Source | Notes |
|-----------|--------|-------|
| `tilesets/ninja/` | Ninja Adventure | Primary overworld + dungeon tiles |
| `tilesets/kenney/` | Kenney RPG Urban | Supplemental tech/urban indoor tiles |

### UI (`assets/ui/`)

| Source | Assets |
|--------|--------|
| PokeRogue | 9-slice window panels, cursor, HP/XP/stat bars |
| Ninja Adventure | Additional HUD icons and status indicators |

### Audio (`assets/audio/`)

| Subfolder | Source | Notes |
|-----------|--------|-------|
| `bgm/` | Ninja Adventure | Background music tracks |
| `sfx/` | Ninja Adventure | Sound effects (attacks, UI, ambient) |

### Battle Backgrounds (`assets/arenas/`)

| Source | Assets |
|--------|--------|
| PokeRogue | All arena backgrounds (`_a` / `_b` parallax layers) |

---

## Sprite Style Guide

### Origin

Most character, monster, item, and VFX sprites originate from Ninja Adventure at **16×16px native resolution** and have been upscaled **3× to 48×48px** using nearest-neighbor interpolation to match Cloud Quest's tile size.

### Rules

- All sprites must be **48×48px** (or a power-of-two multiple for larger multi-tile objects).
- Use **nearest-neighbor scaling only** — no bilinear or bicubic filtering.
- No sub-pixel movement. All animations are 2–4 frame sprite flips.
- Press Start 2P is the only font; no anti-aliasing on text.
- Phaser config: no `pixelArt: true`, no `antialias: false` — rendering at full canvas resolution, not upscaling at draw time.

---

### Reference Palette

These colours are used across all Cloud Quest sprites for consistency. You may add up to 4 additional colours per sprite for its unique identity.

| Name | Hex | Usage |
|---|---|---|
| Outline | `#141414` | All dark outlines |
| White | `#F8F8F8` | Highlights, eyes, UI elements |
| Light gray | `#C8C8D2` | Metal surfaces, light panels |
| Mid gray | `#8C8C96` | Neutral surfaces |
| Dark gray | `#3C3C46` | Shadow faces, dark panels |
| Red | `#DC3232` | Errors, X eyes, danger |
| Orange | `#E69632` | Warnings, smoke, sparks |
| Yellow | `#FFDC3C` | Sparks, alerts |
| Green | `#3CC864` | Data flow, success, health |
| Teal | `#3CB4C8` | Network cables, data streams |
| Blue | `#5082DC` | Code, semicolons, UI |
| Dark blue | `#283C78` | Deep shadows, backgrounds |
| Purple | `#9650C8` | Git branches (purple) |
| Pink | `#E678A0` | Rare encounters |

### Colour Rules

- **Palette size:** 16–32 colours per sprite (not including transparency)
- **Transparency:** always `[0, 0, 0, 0]` — never a "magic" colour key
- **Outlines:** all sprites must have a dark outline (`#141414` recommended)
- **No anti-aliasing:** hard pixel edges only
- **No gradients:** solid flat colours only; 2–3 shades of each hue maximum


## Asset Pipeline

### 3× Upscale Script

Ninja Adventure sprites ship at 16×16px. If you need to batch-upscale a directory locally, you can save the following example Node.js snippet as a script and run it with nearest-neighbor scaling:

```js
// Example script: save as scripts/upscale.js locally if needed
// Example usage after saving this snippet locally: node scripts/upscale.js <inputDir> <outputDir>
// Requires: npm install sharp

import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'fs'
import { join, extname, basename } from 'path'

const [,, inputDir, outputDir] = process.argv
mkdirSync(outputDir, { recursive: true })

for (const file of readdirSync(inputDir)) {
  if (extname(file) !== '.png') continue
  await sharp(join(inputDir, file))
    .resize({ width: null, height: null, kernel: 'nearest' })
    .resize({ factor: 3, kernel: 'nearest' })
    .toFile(join(outputDir, basename(file)))
}
```

> **Note:** Replace the double `resize` with a single call using `sharp`'s `factor` option once the API stabilises, or use ImageMagick: `magick mogrify -scale 300% *.png`.

### Folder Conventions

After upscaling, drop files into the matching Cloud Quest folder according to the [Ninja Adventure folder mapping](#whats-included).

---

## Adding New Assets

1. Prefer CC0 sources to avoid license conflicts with the existing PokeRogue CC-BY-NC-SA-4.0 assets.
2. Document the source and license in the nearest `CREDITS.md` (subfolder or root).
3. Run the upscale pipeline if the source is 16×16px.
4. Update this file with the new source entry.

---

## Incident Sprite Contribution Checklist

Before submitting any incident sprite:

- [ ] Designed at 16×16, exported at 48×48 (3× nearest-neighbour)
- [ ] Horizontal spritesheet with 2–3 frames
- [ ] Dark outline on all visible edges
- [ ] Transparent background (`alpha = 0`)
- [ ] No anti-aliasing
- [ ] Palette ≤ 32 colours total
- [ ] Lossless PNG (not JPEG)
- [ ] File named `{incident_id}.png` matching the encounter registry key
- [ ] `spriteKey` field added to the encounter in `src/data/encounters.js`
