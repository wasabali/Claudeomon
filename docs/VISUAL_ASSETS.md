# Cloud Quest — Visual Assets Style Guide

> This document defines the visual specification for all game sprites, UI elements, and arena backgrounds. Artists and contributors must follow these rules so every asset looks like it belongs in the same game.

---

## Canvas & Scale

| Property | Value |
|---|---|
| Canvas resolution | 1920×1080 |
| Scale mode | `Phaser.Scale.FIT` (letterboxed) |
| Tile size | 48×48 px |
| Sprite design grid | 16×16 px (rendered at 3× = 48×48) |
| Viewport | ~40 tiles wide × ~22 tiles tall |

All sprites are **designed at 16×16** and displayed at **48×48** (3× nearest-neighbour upscale). Never draw at 48×48 with subpixel details — the pixel grid is 16×16.

---

## Color Rules

- **Palette size:** 16–32 colours per sprite (not including transparency)
- **Transparency:** always `[0, 0, 0, 0]` — never a "magic" colour key
- **Outlines:** all sprites must have a dark outline (`#141414` recommended)
- **No anti-aliasing:** hard pixel edges only
- **No gradients:** solid flat colours only; 2–3 shades of each hue maximum

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

---

## Spritesheet Format

All incident and trainer sprites are **horizontal spritesheets** — frames laid left to right.

```
┌─────────┬─────────┬─────────┐
│ Frame 0 │ Frame 1 │ Frame 2 │   ← one row, all frames same height
└─────────┴─────────┴─────────┘
```

| Property | Value |
|---|---|
| Frame size | 48×48 px |
| Layout | Horizontal strip |
| Frames per sprite | 2–3 |
| Sheet width | `frameCount × 48` |
| Sheet height | `48` |

**Phaser load call:**
```js
this.load.spritesheet('incident_404_not_found', 'assets/sprites/incidents/404_not_found.png', {
  frameWidth: 48,
  frameHeight: 48,
})
```

**Phaser animation:**
```js
this.anims.create({
  key: 'incident_404_not_found_idle',
  frames: this.anims.generateFrameNumbers('incident_404_not_found', { start: 0, end: 1 }),
  frameRate: 2,
  repeat: -1,
})
```

---

## Animation Rules

| Rule | Requirement |
|---|---|
| Frame count | 2–3 frames maximum |
| Frame rate | 2 fps (slow wobble) to 4 fps (fast spin) |
| Loop | always `repeat: -1` |
| Movement | frame swaps only — no tween x/y/scale/alpha |
| Easing | none — instant frame change |

---

## Incident Sprite Guidelines

Every incident sprite must communicate the incident type **at a glance**. Follow these design principles:

1. **Silhouette first** — the shape alone should hint at the incident type
2. **Tech iconography** — use real tech symbols (server racks, cables, semicolons, error codes)
3. **Facial expression** — incidents have "faces" to make them memorable and slightly comic
4. **Motion hint in frame 2** — the animation should reinforce the incident's behaviour (wobble for confusion, spin for hang, drip for leak)

### File naming

```
assets/sprites/incidents/{incident_id}.png
```

Where `incident_id` matches the key in `src/data/encounters.js`.

---

## Incident Sprite Reference

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

These can use a generic placeholder until custom sprites are created. Use `incident_placeholder.png` as the `spriteKey` fallback.

| Incident ID | Visual Concept |
|---|---|
| `stale_ticket` | Dusty JIRA ticket with cobwebs |
| `scope_creep` | Amorphous blob that grows each frame |
| `infinite_sprint` | Hamster wheel with exhausted engineer |
| `config_drift` | Compass spinning wildly |
| `flaky_ci_pipeline` | Pipeline that cracks and reforms |

---

## Arena Backgrounds

Battle arenas are stored in `assets/arenas/`. See `assets/arenas/CREDITS.md` for attribution.

| Arena key | File | Used for |
|---|---|---|
| (placeholder) | — | All battles currently |

---

## UI Elements

UI assets live in `assets/ui/`. See `assets/ui/CREDITS.md` for attribution.

---

## Contribution Checklist

Before submitting any sprite:

- [ ] Designed at 16×16, exported at 48×48 (3× nearest-neighbour)
- [ ] Horizontal spritesheet with 2–3 frames
- [ ] Dark outline on all visible edges
- [ ] Transparent background (`alpha = 0`)
- [ ] No anti-aliasing
- [ ] Palette ≤ 32 colours total
- [ ] Lossless PNG (not JPEG)
- [ ] File named `{incident_id}.png` matching the encounter registry key
- [ ] `spriteKey` field added to the encounter in `src/data/encounters.js`
