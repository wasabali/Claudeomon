# Cloud Quest — Planned Issues

Create these issues in the repository to track game development. Each issue maps to a self-contained, independently runnable chunk of the game.

---

## Issue 1 — `[Game] Scaffold + GameBoy Color shell`

**Labels:** `game`, `setup`

### Description
Set up the Vite + Phaser 3 project, create the GameBoy Color browser shell, and wire up the initial scene pipeline.

### Deliverable
Title screen visible in browser inside a pixel-perfect GameBoy Color frame.

### Files
- `index.html` — GameBoy Color CSS shell (border, speaker grilles, D-pad, buttons)
- `package.json` — vite + phaser dependencies
- `src/main.js` — Phaser game config, scene registry
- `src/config.js` — constants: `GAME_WIDTH=160`, `GAME_HEIGHT=144`, `SCALE=4`, GBC palette, tile size
- `src/scenes/BootScene.js` — preload placeholder assets
- `src/scenes/TitleScene.js` — "CLOUD QUEST" title, "New Game / Load Save" menu

### Acceptance criteria
- [ ] Game renders at 160×144 scaled to 640×576
- [ ] GameBoy Color frame surrounds the canvas (CSS)
- [ ] "Press Start 2P" font renders correctly
- [ ] Title screen shows game name and menu options
- [ ] Scene transitions to a stub world scene on "New Game"

---

## Issue 2 — `[Game] GameState + stateless save/load system`

**Labels:** `game`, `core`

### Description
Implement the single `GameState` object, `SaveManager` (export/import/checksum), and the save/load UI styled as a git terminal.

### Deliverable
Export a `.cloudquest` file, reload the page, import it — player is back where they left off.

### Files
- `src/state/GameState.js` — single mutable state object with `_session` (not persisted)
- `src/state/SaveManager.js` — `export()`, `import()`, `computeChecksum()`, `stripSession()`
- `src/utils/crypto.js` — SHA-256 via Web Crypto API
- `src/utils/fileIO.js` — `download(filename, content)`, `openFilePicker(accept)`
- `src/scenes/SaveScene.js` — git-terminal styled commit/checkout UI
- `src/ui/HUD.js` — 💾 unsaved indicator (blinks when `_session.isDirty`)

### Acceptance criteria
- [ ] `SaveManager.export()` triggers `.cloudquest` file download
- [ ] File contains valid JSON with checksum
- [ ] `SaveManager.import()` reads file, validates checksum, loads state
- [ ] Tampered file triggers warning dialog ("Someone's been poking around the config")
- [ ] HUD shows blinking 💾 when state is dirty
- [ ] `beforeunload` fires warning if dirty on tab close

---

## Issue 3 — `[Game] Overworld — Localhost Town + NPC dialog`

**Labels:** `game`, `world`

### Description
Build the first overworld map (Localhost Town) using Tiled, add player movement, NPC interaction, and the typewriter dialog system.

### Deliverable
Player walks around Localhost Town, enters a house with ❓, talks to Old Margaret, dialog typewriter plays out.

### Files
- `src/scenes/BaseScene.js` — `showDialog()`, `fadeIn/Out()`, `playSound()`, `markDirty()`
- `src/scenes/WorldScene.js` — Tiled map rendering, player sprite, collision, NPC interaction
- `src/ui/DialogBox.js` — typewriter text box, advance on keypress
- `assets/maps/localhost_town.tmj` — Tiled map export
- `assets/sprites/` — player spritesheet, NPC sprites (GBC style)
- `src/data/story.js` — Old Margaret dialog tree

### Acceptance criteria
- [ ] Player moves in 4 directions with collision
- [ ] NPC interaction triggers on walk-up + A key
- [ ] Dialog box renders with typewriter effect
- [ ] Houses with ❓ trigger quest dialog
- [ ] Old Margaret quest: pick correct answer → reward granted

---

## Issue 4 — `[Game] Data layer — skills, items, trainers, emblems`

**Labels:** `game`, `data`

### Description
Implement all data registries using the Registry pattern. Pure definitions, no logic.

### Deliverable
All data accessible via `getSkill(id)`, `getItem(id)`, `getTrainer(id)`, `getEmblem(id)`. Console-testable.

### Files
- `src/data/skills.js` — all skill definitions with `effect` function refs
- `src/data/items.js` — all item definitions across 5 bag tabs
- `src/data/trainers.js` — good trainers + all 10 cursed technique trainers
- `src/data/emblems.js` — 8 emblem definitions with grime descriptions + passive bonuses
- `src/data/quests.js` — quest stages, rewards, follow-up flags
- `src/data/encounters.js` — encounter tables per region (probabilities)

### Acceptance criteria
- [ ] `getSkill('kubectl_rollout_restart')` returns correct definition
- [ ] `getSkillsByDomain('kubernetes')` returns filtered list
- [ ] All 10 cursed trainers defined with `isCursed: true` + `sideEffect`
- [ ] All 8 emblems defined with `grimeDescription` + `passiveBonus`
- [ ] No skill/item/trainer IDs duplicated

---

## Issue 5 — `[Game] Battle engine + battle scene`

**Labels:** `game`, `battle`

### Description
Implement the pure `BattleEngine` (no Phaser) and the `BattleScene` that renders it. One full trainer fight must be completable.

### Deliverable
Encounter Ola the Ops Guy → turn-based battle → win/lose → return to overworld with state updated.

### Files
- `src/engine/BattleEngine.js` — `useSkill()`, `applyTurnEffects()`, `checkWinCondition()` → returns `BattleEvent[]`
- `src/engine/SkillEngine.js` — skill effect application, tier multipliers, XP accumulation
- `src/engine/StatusEngine.js` — status effect application + decay per turn
- `src/scenes/BattleScene.js` — renders events from BattleEngine, drives animations
- `src/ui/Menu.js` — D-pad navigable menu (reused for battle skill select + bag)

### Acceptance criteria
- [ ] Player can select from active skill deck (up to 6 skills)
- [ ] Damage, heal, and status effects resolve correctly
- [ ] Cursed technique triggers warning dialog before use
- [ ] Using cursed technique adds Shame Point to GameState
- [ ] Win → XP granted, state marked dirty
- [ ] Lose → dialog, return to overworld at reduced HP

---

## Issue 6 — `[Game] Inventory bag (5 tabs)`

**Labels:** `game`, `ui`

### Description
Build the full Bag inventory screen with all 5 tabs, item usage, and key item gating.

### Deliverable
Open bag mid-battle → switch to Tools tab → use Red Bull → HP restored → return to battle.

### Files
- `src/scenes/InventoryScene.js` — tabbed UI, item list, use/examine/drop actions

### Acceptance criteria
- [ ] All 5 tabs navigate correctly (Tools, Key Items, Credentials, Docs, Junk)
- [ ] Items show name, quantity, description
- [ ] Using Red Bull mid-battle restores 30 HP
- [ ] Key Items cannot be dropped
- [ ] Mystery node_modules shows "47,000 files. Does nothing. Can't delete." and cannot be deleted

---

## Issue 7 — `[Game] Emblem case + drag-to-polish minigame`

**Labels:** `game`, `ui`

### Description
Implement the Emblem Case screen and the mouse-drag polishing mechanic inspired by HG/SS badge polishing.

### Deliverable
Open emblem case → click earned emblem → drag mouse over it → shine meter fills → emblem sparkles.

### Files
- `src/scenes/EmblemScene.js` — 4×2 grid of emblem slots, zoom-in on click, drag detection
- `src/ui/ShineEffect.js` — sparkle/pulse animation for polished emblems, grime overlay rendering

### Acceptance criteria
- [ ] Unearned emblems show as dark/locked
- [ ] Earned emblems show grime overlay matching their flavour text
- [ ] Mouse drag over emblem increases `shine` value in GameState
- [ ] At `shine = 1.0` emblem plays sparkle animation
- [ ] Passive bonus tooltip shown for fully polished emblems
- [ ] Emblems from cursed technique usage show permanent dark stain

---

## Issue 8 — `[Game] Random encounters + status effects`

**Labels:** `game`, `battle`

### Description
Wire up the encounter system so walking through world regions triggers random battles based on encounter tables. Implement all status conditions.

### Deliverable
Walk through Pipeline Pass → random encounter triggers → "Rival Trainer" battle → Throttled status applied → skill skipped correctly.

### Files
- `src/engine/EncounterEngine.js` — region-based probability table, encounter type selection
- `src/engine/StatusEngine.js` — full implementation of all 7 status conditions

### Status conditions to implement
| Status | Effect |
|--------|--------|
| Throttled | Only 1 skill every 2 turns |
| Cold Start | Skip first turn |
| Deprecated | Skills 50% effective |
| On-Call | Random forced encounters during rest |
| Cost Alert | Budget drains 2x |
| Technical Debt | Accumulates; reduces max HP |
| In Review | Skip turns until peer review check passes |

### Acceptance criteria
- [ ] Walking in each region triggers encounters at correct probability
- [ ] Lost Intern encounter → quiz mechanic → correct answer teaches skill
- [ ] Sales Rep encounter → wrong choice drains budget
- [ ] On-Call Alert → time-limited battle with SLA meter
- [ ] All 7 status conditions apply and decay correctly per turn
