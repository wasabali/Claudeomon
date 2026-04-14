# Issue 3 — [Game] Overworld — Localhost Town + NPC Dialog

## Context

This is where the game world comes alive. Localhost Town is the starting area — the safest place in the game, where nothing ever breaks (yet). The player spawns here after starting a new game and learns the basics of movement, NPC interaction, and the side quest system.

The world is top-down, tile-based, and rendered using a Tiled map exported as `.tmj`. The visual style is strict GameBoy Color — 16×16 tiles, 4-colour palette per sprite.

See `docs/GAME_DESIGN.md` → *World Design* and *NPC Side Quests* sections.

---

## Depends On

- Issue 1 (scaffold + config)
- Issue 2 (GameState — needed to mark dirty on quest completion and store rewards)

---

## World Overview

```
[Dev Region] → [Staging Valley] → [Production Plains] → [Multi-Region Endgame]
```

Localhost Town is the first area of Dev Region. It contains:
- The player's starting house
- Professor Pedersen's lab (story trigger)
- Old Margaret's bakery (❓ side quest house)
- The Azure Terminal (save point, glowing pixel terminal)
- An exit path east toward Pipeline Pass (blocked until Act 1 progresses)

---

## Asset Sources (CC0 / Free)

| Asset | Source |
|-------|--------|
| Tileset | [sonDanielson Gameboy Simple RPG tileset](https://sondanielson.itch.io/gameboy-simple-rpg-tileset) |
| Character sprites | [BitBop 16×16 Top-Down GBC sprites](https://bitbop.itch.io/top-down-characters-gameboy-style) |

Download these and place in `assets/sprites/` and `assets/tilesets/`.

---

## Files to Create

```
src/
├── scenes/
│   ├── BaseScene.js       # Abstract base all scenes extend
│   └── WorldScene.js      # Overworld rendering + logic
├── ui/
│   └── DialogBox.js       # Reusable typewriter dialog component
├── data/
│   └── story.js           # Dialog trees for all NPCs in Localhost Town
assets/
├── maps/
│   └── localhost_town.tmj # Tiled map export
├── sprites/
│   ├── player.png         # 4-frame walk cycle spritesheet (16×24 per frame)
│   └── npcs.png           # NPC sprites
└── tilesets/
    └── gbc_town.png       # GBC town tileset
```

---

## `BaseScene.js` — Shared Utilities

All scenes extend `BaseScene` instead of `Phaser.Scene` directly:

```js
export class BaseScene extends Phaser.Scene {
  showDialog(lines, onDone)      // Renders DialogBox, calls onDone when dismissed
  fadeIn(duration = 300)
  fadeOut(duration = 300, callback)
  playSound(key)                 // Wraps Phaser audio with GBC volume defaults
  markDirty()                    // Sets GameState._session.isDirty = true
}
```

---

## `WorldScene.js` — Overworld

Key responsibilities:
- Load and render Tiled map
- Player movement (4-direction, grid-aligned, 4 frames per direction)
- Collision detection against Tiled collision layer
- NPC detection: walk adjacent to NPC + press A → trigger dialog
- House entry: walk into ❓ house door → trigger quest dialog
- Azure Terminal interaction → launch SaveScene

Player movement speed: 2 tiles/second (chunky, deliberate — no pixel-smooth movement).

---

## `DialogBox.js` — Typewriter Dialog

Reusable component used across WorldScene, BattleScene, and SaveScene:

```js
export class DialogBox {
  constructor(scene, options = {})
  show(lines, onDone)      // lines: string[] — each string is one dialog page
  advance()                // Called on A/Space/Enter keypress
  destroy()
}
```

Visual spec:
- White box, 2px black border, bottom quarter of screen
- Text renders character-by-character (typewriter effect, ~40 chars/sec)
- Player presses A to advance to next line or dismiss
- Blinking `▼` prompt when a page is complete

---

## Old Margaret — Side Quest

Old Margaret lives in the bakery (house with ❓). Her quest:

**Problem:** `"My bakery website keeps going down! I don't know what a server is!"`

**Quiz (pick one of 3):**
1. `"Have you tried restarting it?"` → Wrong. HP -10. `"It still crashes!"`
2. `"You need Azure App Service — it hosts your site and keeps it running automatically."` → **Correct.** +50 XP, +1 Azure Credit Voucher
3. `"Buy more RAM."` → Wrong. HP -10. `"I don't even know what that means!"`

On correct answer:
- Reward granted to `GameState.inventory.tools`
- Quest ID `margaret_website` added to `GameState.story.completedQuests`
- `markDirty()` called
- Follow-up dialog: `"You're a lifesaver! Here, take this."` → item received

On revisit after completion: `"The website's been running for 3 days! My best week ever."`

---

## Azure Terminal (Save Point)

A glowing pixel terminal in the town square. Interacting with it:
1. Dialog: `"AZURE TERMINAL — Commit your progress?"`
2. Options: `[YES]` → launch SaveScene / `[NO]` → dismiss
3. After save: terminal pulses green briefly

---

## Acceptance Criteria

- [ ] Player spawns in Localhost Town and can move in 4 directions
- [ ] Collision prevents walking through walls, buildings, trees
- [ ] Walking adjacent to an NPC and pressing A opens dialog
- [ ] Dialog renders with typewriter effect, advances on A keypress
- [ ] Entering the bakery (❓) triggers Old Margaret's quest dialog
- [ ] Correct quest answer grants XP + item, updates GameState, calls markDirty()
- [ ] Wrong answer reduces HP
- [ ] Completed quest shows follow-up dialog on revisit
- [ ] Azure Terminal interaction opens save prompt
- [ ] Map loads from `assets/maps/localhost_town.tmj`
- [ ] GBC sprite animations play correctly (4-frame walk cycle)

---

## Coding Standards

- `BaseScene` has no game-specific logic — only shared utilities
- `WorldScene` delegates all dialog to `DialogBox` — never renders text directly
- `DialogBox` is stateless between `show()` calls — fully reusable
- NPC dialog content lives in `src/data/story.js`, not in the scene file
- Map JSON (`localhost_town.tmj`) is the source of truth for NPC positions
