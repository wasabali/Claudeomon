# Visual Assets

This document describes every external asset source used in Cloud Quest, how each is licensed, and how assets are mapped into the project's folder structure.

---

## Asset Directory Structure

```
assets/
├── arenas/          # Battle background art (panoramic, 1920×1080)
├── audio/           # BGM and SFX
├── maps/            # Tiled .tmj exports
├── sprites/
│   ├── characters/  # Player and NPC walk-cycle sheets (LPC format)
│   ├── effects/     # Spell, particle, and UI effects
│   ├── items/       # Item icons
│   ├── monsters/    # Enemy sprite sheets
│   ├── portraits/   # DialogBox talking-head portraits
│   └── ui/          # HUD panels, cursors, button frames
└── ui/              # Full-screen UI backgrounds
```

---

## Spritesheets

Phaser is configured to load character sheets with `frameWidth: 48, frameHeight: 48`.
LPC-generated sheets export at 64×64 px per frame by default — scale down to 48×48 using
nearest-neighbor interpolation before placing files in `assets/sprites/characters/`.

Never hardcode 16 px or 64 px frame sizes in scene or engine code.

---

# Visual Assets Specification

Cloud Quest uses a pixel-art style drawing on the [Ninja Adventure](https://pixel-boy.itch.io/ninja-adventure-asset-pack) asset pack for world sprites and audio, and the [Kenney UI Pack](https://kenney.nl/assets/ui-pack) for all UI chrome.
All sprites are scaled 3× from their source resolution for consistent clarity at 1920×1080.

---

## Source Resolution

| Source | Native size | In-game size | Scale |
|---|---|---|---|
| LPC character sheets | 48×48px | 48×48px | 1× (no upscale) |
| Kenney Tiny Town portraits | varies | 48×48px | scaled |
| Kenney UI Pack panels | varies | 48×48px+ | scaled |
| Kenney Space Kit tiles | 16×16px | 48×48px | 3× |
| Kenney RPG Urban Pack tiles | 16×16px | 48×48px | 3× |
| PokeRogue battle backgrounds | native | native | 1× |

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
| Player portrait | 48×48px | Kenney Micro Roguelike, 3× upscale |
| Trainer portrait | 48×48px | Kenney Micro Roguelike, 3× upscale |

**Why 48×48px:** Kenney Micro Roguelike sprites are 16×16px native. A 3× upscale gives 48×48px, which matches
the tile grid and all other in-game sprites. See [Kenney Micro Roguelike](#kenney-micro-roguelike) below for the
download URL and upscale instructions.

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

| Tile set | Purpose | Region(s) | Sheet dimensions |
|---|---|---|---|
| `stub_tiles.png` | Dev placeholder (5 tiles) | All (fallback) | 240×48px |
| `kenney_tech_office.png` | Tech / office / server-room biome (50 tiles) | `oldcorp_basement`, `sre_command_center`, `server_graveyard` | 240×480px |
| `void_tiles.png` | Space / void biome (12 tiles) | `dev_null_void` | 576×48px |
| `wasteland_tiles.png` | Wasteland / ruined infrastructure biome (12 tiles) | `deprecated_azure_region` | 576×48px |

All tileset PNGs live in `assets/tiles/`. Matching `.tsj` (Tiled JSON) descriptor files live alongside them.

### Kenney Space Kit — void biome

`void_tiles.png` is adapted from the [Kenney Space Kit](https://kenney.nl/assets/space-kit) (CC0).  
Source tiles are 16×16px, upscaled 3× to 48×48px using nearest-neighbor interpolation.

| Tile index | Tile name | Layer role |
|---|---|---|
| 0 | `void_ground` | Ground |
| 1 | `void_ground_corrupted` | Ground |
| 2 | `void_platform` | Objects |
| 3 | `void_platform_edge_l` | Objects |
| 4 | `void_platform_edge_r` | Objects |
| 5 | `void_star_dense` | Ground |
| 6 | `void_debris` | Objects |
| 7 | `void_glitch_h` | Overlay |
| 8 | `void_glitch_v` | Overlay |
| 9 | `void_dissolution` | Overlay |
| 10 | `void_portal_glow` | Objects |
| 11 | `void_wall` | Collision |

**Palette:** near-black void (`#0a0a1a`), corruption purple (`#7c00ff`), glitch cyan (`#00ffc8`), portal glow (`#b030f0`).  
Full spec: `assets/maps/TILE_SPECS.md §1`.

### Kenney RPG Urban Pack — wasteland biome

`wasteland_tiles.png` is adapted from the [Kenney RPG Urban Pack](https://kenney.nl/assets/rpg-urban-pack) (CC0).  
Source tiles are 16×16px, upscaled 3× to 48×48px and recoloured to a rust/decay palette.

| Tile index | Tile name | Layer role |
|---|---|---|
| 0 | `waste_ground` | Ground |
| 1 | `waste_ground_heavy` | Ground |
| 2 | `waste_concrete` | Ground |
| 3 | `waste_rubble` | Objects |
| 4 | `waste_dead_grass` | Objects |
| 5 | `waste_rusted_pipe` | Objects |
| 6 | `waste_server_rack` | Objects |
| 7 | `waste_caution_tape` | Objects |
| 8 | `waste_warning_sign` | Objects |
| 9 | `waste_azure_logo` | Objects |
| 10 | `waste_wire_fence` | Overlay |
| 11 | `waste_wall` | Collision |

**Palette:** cracked earth (`#a07820`), rust (`#8b3a1a`), concrete (`#9a9a8a`), caution yellow (`#ffcc00`), faded Azure blue (`#2060a0`).  
Full spec: `assets/maps/TILE_SPECS.md §2`.

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
| Player + trainer characters | [LPC Spritesheet Generator](https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/) — CC-BY-SA 3.0 | CC-BY-SA 3.0 |
| Battle portraits | [Kenney Tiny Town](https://kenney.nl/assets/tiny-town) — Kenney | CC0 (public domain) |
| UI chrome (panels, dialog frames) | [Kenney UI Pack](https://kenney.nl/assets/ui-pack) — Kenney | CC0 (public domain) |
| Battle backgrounds | [PokeRogue](https://github.com/pagefaultgames/pokerogue) — pagefaultgames | CC-BY-NC-SA-4.0 |
| Font | [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) — CodeMan38 | OFL-1.1 |

See `assets/arenas/CREDITS.md` and `assets/ui/CREDITS.md` for per-file attribution.
# Visual Assets

This document describes every external asset source used in Cloud Quest, how each is licensed, and how assets are mapped into the project's folder structure.

---

## Asset Strategy

Cloud Quest uses a **multi-source asset strategy**:

| Source | Role | License |
|--------|------|---------|
| **LPC Spritesheet Generator** | Player sprite, trainer/NPC walk-cycle sheets | CC-BY-SA 3.0 |
| **Kenney Tiny Town** | Battle portraits (talking-head box portraits) | CC0 1.0 (Public Domain) |
| **Kenney RPG Audio** | BGM tracks and SFX | CC0 1.0 (Public Domain) |
| **Kenney Game Icons** | Item icons | CC0 1.0 (Public Domain) |
| **Kenney UI Pack** | UI chrome — dialog panels, menus, HUD window frames | CC0 1.0 (Public Domain) |
| **Kenney RPG Urban** | Supplemental tech/urban tiles | CC0 1.0 (Public Domain) |
| **PokeRogue** | Battle backgrounds | CC-BY-NC-SA-4.0 |

---

## LPC Spritesheet Generator

### Overview

Player and trainer walk-cycle sheets are generated with the **Universal LPC Spritesheet Character Generator** by Sander Frenken. Each export is a standard LPC walk-cycle sheet, customisable per character role.

```
LPC Spritesheet Generator
- Tool:    https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
- License: CC-BY-SA 3.0 (Creative Commons Attribution-ShareAlike 3.0)
- Usage:   Player sprite (player_default) + all trainer/NPC character sheets
- Format:  4-row × 3-col walk-cycle, 64×64 px per frame (scale down to 48×48 for Cloud Quest)
```

### What's Included

| Category | Cloud Quest folder |
|----------|-------------------|
| Player sprite (`player_default.png`) | `assets/sprites/characters/` |
| Trainer/NPC sprite sheets (by `spriteKey`) | `assets/sprites/characters/` |

### Integration Notes

The LPC generator exports at **64×64 px per frame** by default. Cloud Quest uses **48×48 px per frame**, so each exported sheet must be scaled down before use.

1. Visit https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
2. Customise the character for the role (e.g. hoodie + laptop bag for the player)
3. Export as PNG — the generator outputs a walk-cycle spritesheet at 64×64 px per frame
4. Scale down to 48×48 px per frame (total sheet: 144×192 px) using nearest-neighbor interpolation:
   ```bash
   convert lpc_export.png -filter point -resize 144x192 assets/sprites/characters/player_default.png
   ```
5. Verify frame boundaries with `frameWidth: 48, frameHeight: 48` in Phaser

**Player sprite:** BootScene loads `PLAYER_SPRITE_KEY` (`'player_default'`) from `assets/sprites/characters/player_default.png`.  
**Trainer sprites:** Each trainer in `src/data/trainers.js` has a `spriteKey` field. BootScene loads it from `assets/sprites/characters/<spriteKey>.png`.

### License

CC-BY-SA 3.0 — attribution and share-alike required. Cloud Quest must credit the LPC contributors and any derived character assets must carry the same CC-BY-SA 3.0 license.

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

## Kenney Micro Roguelike

### Overview

[Kenney Micro Roguelike](https://kenney.nl/assets/micro-roguelike) by [Kenney](https://kenney.nl) provides the primary character, trainer, and incident sprites for Cloud Quest.

```
Kenney Micro Roguelike
- Author:  Kenney (kenney.nl)
- Source:  https://kenney.nl/assets/micro-roguelike
- License: CC0 1.0 Universal (Public Domain Dedication)
- Usage:   Player sprites, trainer NPCs, incident/monster sprites
- Modifications: 3× nearest-neighbor upscale from 16×16px to 48×48px
```

### Folder Mapping

| Kenney Micro Roguelike source | Cloud Quest folder |
|-------------------------------|-------------------|
| `Tilemap/` characters | `assets/sprites/player/` |
| `Tilemap/` characters (NPCs) | `assets/sprites/trainers/` |
| `Tilemap/` enemies/monsters | `assets/sprites/incidents/` |

### Integration Notes

All Kenney Micro Roguelike sprites are **16×16px**. Run the upscale pipeline (3×) to produce 48×48px outputs:

```bash
node scripts/upscale-assets.js \
  --input /tmp/kenney-packs/micro-roguelike \
  --output /tmp/kenney-upscaled
```

After upscaling, copy and rename sprites to match the game's loading convention:

- **Player sprite** → `assets/sprites/characters/player_default.png`  
  (or update `PLAYER_SPRITE_KEY` in `src/data/trainers.js` and copy to the matching key path)
- **Trainer sprites** → `assets/sprites/characters/<spriteKey>.png`  
  (one file per trainer; the filename must match the `spriteKey` field in `src/data/trainers.js`)
- **Incident sprites** → `assets/sprites/incidents/<encounter_id>.png`  
  (the filename must match the `id` of the encounter in `src/data/encounters.js`)

### License

CC0 1.0 Universal — public domain. No attribution required; credited anyway.

---

## Kenney RPG Audio

### Overview

[Kenney RPG Audio](https://kenney.nl/assets/rpg-audio) by [Kenney](https://kenney.nl) provides all BGM tracks and SFX for Cloud Quest.

```
Kenney RPG Audio
- Author:  Kenney (kenney.nl)
- Source:  https://kenney.nl/assets/rpg-audio
- License: CC0 1.0 Universal (Public Domain Dedication)
- Usage:   BGM tracks and SFX
- Modifications: None — OGG files used directly
```

### Folder Mapping

| Kenney RPG Audio source | Cloud Quest folder |
|--------------------------|-------------------|
| `Audio/Background/` | `assets/audio/bgm/` |
| `Audio/SFX/` | `assets/audio/sfx/` |

### Integration Notes

```bash
cp /tmp/kenney-packs/rpg-audio/Audio/Background/*.ogg assets/audio/bgm/
cp /tmp/kenney-packs/rpg-audio/Audio/SFX/*.ogg assets/audio/sfx/
```

Rename the files to match the expected track IDs listed in `assets/audio/CREDITS.md`.

### License

CC0 1.0 Universal — public domain. No attribution required; credited anyway.

---

## Kenney Game Icons

### Overview

[Kenney Game Icons](https://kenney.nl/assets/game-icons) by [Kenney](https://kenney.nl) provides item icons for inventory items, tools, key items, and consumables.

```
Kenney Game Icons
- Author:  Kenney (kenney.nl)
- Source:  https://kenney.nl/assets/game-icons
- License: CC0 1.0 Universal (Public Domain Dedication)
- Usage:   Item icons (48×48px)
- Modifications: Scaled to 48×48px using nearest-neighbor interpolation
```

### Folder Mapping

| Source | Cloud Quest folder |
|--------|--------------------|
| Kenney Game Icons PNG | `assets/sprites/items/` |

### License

CC0 1.0 Universal — public domain. No attribution required; credited anyway.

---

## Kenney UI Pack

### Overview

[Kenney UI Pack](https://kenney.nl/assets/ui-pack) by [Kenney](https://kenney.nl) provides the UI chrome for Cloud Quest — dialog box frames, menu backgrounds, and all 9-slice window panels.

```
Kenney UI Pack
- Author:  Kenney (kenney.nl)
- Source:  https://kenney.nl/assets/ui-pack
- License: CC0 1.0 Universal (Public Domain Dedication)
- Usage:   9-slice window panels, dialog frames, menu backgrounds
```

### Usage

Download the pack from https://kenney.nl/assets/ui-pack and place a suitable panel PNG at `assets/ui/window.png`. `BootScene` loads it as `'ui_window'`; `BaseScene.createPanel()` uses it automatically when present, falling back to a procedural dark-navy stub otherwise.

Scale the sprite to match the Cloud Quest tile grid (48×48px) using `scripts/upscale-assets.js` with nearest-neighbor interpolation.

### License

CC0 1.0 Universal — public domain. No attribution required; credited anyway.

---

## Kenney Micro Roguelike

### Overview

[Kenney Micro Roguelike](https://kenney.nl/assets/micro-roguelike) by [Kenney](https://kenney.nl) provides
the battle portrait sprites for the player and all trainer NPCs.

```
Kenney Micro Roguelike
- Author:  Kenney (kenney.nl)
- Source:  https://kenney.nl/assets/micro-roguelike
- License: CC0 1.0 Universal (Public Domain Dedication)
- Usage:   Battle portraits — player and trainer HUD portraits
```

### Usage

1. Download the pack from https://kenney.nl/assets/micro-roguelike
2. Select a suitable 16×16px character tile for each portrait
3. Upscale 3× using nearest-neighbor interpolation:
   ```bash
   convert source.png -filter point -resize 300% output.png
   ```
4. Name the output file to match the portrait key convention:
   - Player: `player.png`
   - Trainer `<id>`: `<id>.png` (e.g. `ola_ops.png`, `tux_wizard.png`)
5. Place the 48×48px PNGs in `assets/sprites/portraits/`

Portrait files are **optional** — `BattleScene` renders the portrait slot blank when a file
is absent, so missing portraits never cause a runtime error.

### License

CC0 1.0 Universal — public domain. No attribution required; credited anyway.

---

## Asset Categories

### Sprites (`assets/sprites/`)

| Subfolder | Source | Notes |
|-----------|--------|-------|
| `characters/` | Ninja Adventure | **Game-loaded path.** Player sprite (`ninja_hero.png`) and all trainer sprites (named by `spriteKey`) live here. 3× upscaled from 16×16. |
| `incidents/` | Kenney Micro Roguelike | Incident/enemy sprites; 3× upscaled from 16×16; named by encounter `id` |
| `items/` | Kenney Game Icons | Item icon stubs; scaled to 48×48 |
| `monsters/` | Ninja Adventure | Supplemental enemy sprites; 3× upscaled from 16×16 |
| `vfx/` | Ninja Adventure | Hit sparks, magic rings, explosions; 3× upscaled |
| `player/` | — | Staging area only — copy finalized player sprite to `characters/ninja_hero.png` |
| `trainers/` | — | Staging area only — copy finalized trainer sprites to `characters/<spriteKey>.png` |
| `portraits/` | Kenney Micro Roguelike | Battle portraits; 3× upscaled from 16×16 |

### Maps & Tilesets (`assets/maps/`)

| Subfolder | Source | Notes |
|-----------|--------|-------|
| `tilesets/ninja/` | Ninja Adventure | Primary overworld + dungeon tiles |
| `tilesets/kenney/` | Kenney RPG Urban | Supplemental tech/urban indoor tiles |

### UI (`assets/ui/`)

| Asset | Source | Notes |
|-------|--------|-------|
| `window.png` | Kenney UI Pack | 9-slice window panel for dialog boxes, menus, HUD |

### Audio (`assets/audio/`)

| Subfolder | Source | Notes |
|-----------|--------|-------|
| `bgm/` | Kenney RPG Audio | Background music tracks (OGG + MP3 fallback) |
| `sfx/` | Kenney RPG Audio | Sound effects (attacks, UI, ambient) |

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
