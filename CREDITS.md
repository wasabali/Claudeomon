# Cloud Quest — Asset Credits

Cloud Quest is built on the shoulders of generous creators. All assets are either public domain (CC0) or used in accordance with their respective licenses.

---

## Ninja Adventure (CC0)

**Primary asset source** for characters, monsters, world tiles, VFX, items, music, and SFX.

| Field | Value |
|---|---|
| Author | pixel-boy and AAA |
| Source | https://pixel-boy.itch.io/ninja-adventure-asset-pack |
| License | [CC0 1.0 Universal — Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) |
| Modifications | All sprites upscaled 3× (16px → 48px) using nearest-neighbor interpolation |

CC0 means no attribution is legally required. We credit the author here as good practice.

### Ninja Adventure assets used

| Category | Cloud Quest location |
|---|---|
| Character sprites (walk/idle/attack) | `assets/sprites/player/`, `assets/sprites/trainers/` |
| Character facesets (battle portraits, 48×48px) | `assets/sprites/portraits/` |
| Monster sprites | `assets/sprites/incidents/` |
| World tilesets | `assets/tilesets/` |
| VFX sprites | `assets/sprites/effects/` |
| Item icons | `assets/sprites/items/` |
| BGM tracks (37 tracks) | `assets/audio/bgm/` |
| SFX (100+ sounds) | `assets/audio/sfx/` |

---

## Kenney UI Pack (CC0)

**UI chrome source** for dialog boxes, menus, HUD panels, and all 9-slice window frames.

| Field | Value |
|---|---|
| Author | Kenney (kenney.nl) |
| Source | https://kenney.nl/assets/ui-pack |
| License | [CC0 1.0 Universal — Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) |
| Modifications | Scaled to match 48×48px tile grid using nearest-neighbor interpolation |

CC0 — no attribution required; credited here as good practice.

### Kenney UI Pack assets used

| Category | Cloud Quest location |
|---|---|
| Window / panel sprites (9-slice) | `assets/ui/window.png` |

---

## PokeRogue (CC-BY-NC-SA-4.0)

**Battle arena backgrounds** and **battle UI chrome** (9-slice panels, HUD elements).

| Field | Value |
|---|---|
| Author | pagefaultgames |
| Source | https://github.com/pagefaultgames/pokerogue |
| Assets source | https://github.com/pagefaultgames/pokerogue-assets |
| License | [CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| Modifications | Recoloured / reframed for Cloud Quest regions and tech theme |

**CC-BY-NC-SA-4.0 requirements:**
- **Attribution** — Credit PokeRogue / pagefaultgames (done here and in `assets/arenas/CREDITS.md`, `assets/ui/CREDITS.md`)
- **Non-commercial** — Cloud Quest must remain non-commercial while these assets are included
- **Share-alike** — Assets derived from PokeRogue must be released under the same license

### PokeRogue assets used

| Asset | Cloud Quest location |
|---|---|
| Arena backgrounds (`plains`, `cave`, `forest`, `factory`, `stadium`, `abyss`, `ruins`, `space`, `wasteland`, `construction`) | `assets/arenas/` |
| 9-slice UI panels (`window_1`–`window_5`) | `assets/ui/` |
| Cursor / selection indicators | `assets/ui/` |
| HP / XP bars, battle stat overlays | `assets/ui/` |

---

## Kenney RPG Urban Pack (CC0)

**Supplemental tiles** for tech/office/server-room regions not covered by Ninja Adventure.

| Field | Value |
|---|---|
| Author | Kenney (kenney.nl) |
| Source | https://kenney.nl/assets/rpg-urban-pack |
| License | [CC0 1.0 Universal — Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) |
| Modifications | Upscaled to match 48×48px tile grid (if sourced from a 16px base) |

CC0 — no attribution required; credited here as good practice.

---

## Press Start 2P (SIL Open Font License)

**Game font** — used for all in-game text.

| Field | Value |
|---|---|
| Author | Cody "CodeMan38" Boisclair |
| Source | https://fonts.google.com/specimen/Press+Start+2P |
| License | [SIL Open Font License 1.1](https://openfontlicense.org/) |
| Modifications | None — loaded from Google Fonts CDN |

---

## Procedural SFX fallback (jsfxr)

When Ninja Adventure SFX files are absent at runtime, BootScene falls back gracefully and the game runs silently. Each SFX entry in `src/data/audio.js` retains a `seed` field for future procedural fallback implementation via [jsfxr](https://github.com/grumdrig/jsfxr).

| Field | Value |
|---|---|
| Library | jsfxr |
| License | MIT |

---

## Open-Source Libraries

| Library | License | Purpose |
|---------|---------|---------|
| [Phaser 3](https://phaser.io) | MIT | Game engine |
| [Vite](https://vitejs.dev) | MIT | Dev server and bundler |

---

## Tools

| Tool | Purpose |
|------|---------|
| [Tiled Map Editor](https://www.mapeditor.org/) | Tile map authoring |

---

*Cloud Quest is a non-commercial fan project. All third-party assets are used in accordance with their respective licenses.*  
*See `docs/VISUAL_ASSETS.md` for the full asset source matrix, upscale pipeline instructions, and gap analysis.*
