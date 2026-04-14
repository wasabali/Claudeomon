# Issue 5 — [Game] Battle Engine + Battle Scene

## Context

The battle system is the core gameplay loop. It is split into two layers:

1. **`BattleEngine`** — pure JavaScript logic, zero Phaser dependency. Fully unit-testable. Takes a player state snapshot and an opponent definition, returns an event log.
2. **`BattleScene`** — Phaser scene that drives the engine and renders each event as a pixel animation.

This separation means the battle rules can be tested without a browser, and the scene only handles visuals.

See `docs/GAME_DESIGN.md` → *Battle System*, *Cursed Technique Mechanics*, *Boss Battles* sections.

---

## Depends On

- Issue 1 (scaffold)
- Issue 2 (GameState — XP, HP, budget, shame points all written here)
- Issue 4 (data layer — skills, trainers)

---

## Files to Create

```
src/
├── engine/
│   ├── BattleEngine.js    # Pure battle logic — no Phaser
│   └── SkillEngine.js     # Skill effect resolution, tier multipliers, XP
├── scenes/
│   └── BattleScene.js     # Renders engine events as GBC animations
└── ui/
    └── Menu.js            # Reusable D-pad navigable list menu
```

---

## Player Stats in Battle

| Stat | Description |
|------|-------------|
| HP | Drops when incidents go unresolved. Battle lost at 0. |
| Budget | Azure Credits. Some skills cost budget per use. |
| Reputation | Long-term score. Damaged permanently by some actions. |
| Uptime | SLA meter. Drops during timed battles. Loss if it hits 0. |

---

## `BattleEngine.js`

```js
export class BattleEngine {
  constructor(playerSnapshot, opponentDef) { }

  // Player uses a skill from their active deck
  // Returns array of BattleEvents
  useSkill(skillId) { }

  // Apply end-of-turn status effects (Throttled, Cold Start, etc.)
  // Returns array of BattleEvents
  applyTurnEffects() { }

  // Returns 'player' | 'opponent' | null
  checkWinCondition() { }

  // Opponent takes their turn (AI)
  // Returns array of BattleEvents
  opponentTurn() { }
}
```

### BattleEvent shape

```js
// Every action produces one or more events — BattleScene renders them in sequence
{
  type: 'damage',        // 'damage' | 'heal' | 'status_apply' | 'status_remove'
                         // | 'budget_drain' | 'shame' | 'dialog' | 'win' | 'lose'
  target: 'player',     // 'player' | 'opponent'
  payload: {
    amount: 25,          // for damage/heal/budget
    status: 'throttled', // for status events
    message: '...',      // for dialog events
    shamePoints: 1,      // for shame events
  }
}
```

### Skill Effect Resolution

`SkillEngine.js` maps `skill.battleEffect` strings to pure functions:

```js
const BATTLE_EFFECTS = {
  restore_hp_30:          (state) => ({ type: 'heal', target: 'player', payload: { amount: 30 } }),
  reset_opponent_buffs:   (state) => ({ type: 'status_remove', target: 'opponent', payload: { all: true } }),
  reveal_weakness:        (state) => ({ type: 'dialog', payload: { message: `Opponent is weak to ${state.opponent.weakness}` } }),
  // ... etc
}
```

Tier multipliers: tier 2 = 1.25x, tier 3 = 1.5x, tier 4 = 2.0x.

---

## Status Conditions

Implemented in `engine/StatusEngine.js` (Issue 8), but `BattleEngine` must respect them:

| Status | Effect in BattleEngine |
|--------|----------------------|
| Throttled | Player can only act every 2 turns |
| Cold Start | Player skips first turn |
| Deprecated | All skill effects × 0.5 |
| On-Call | Random battle trigger (handled in EncounterEngine) |
| Cost Alert | Budget drains 2× per turn |
| Technical Debt | Max HP reduced by 5 each battle |
| In Review | Player must pass a 2-option check before acting |

---

## Cursed Technique Flow

When player selects a cursed skill:
1. Battle pauses
2. Warning dialog: `"This will work. But at what cost?"` → `[YES]` / `[NO]`
3. On YES: skill executes (powerful effect), then side effect fires, then `GameState.player.shamePoints += 1`
4. Shame event logged → HUD updates
5. On NO: turn wasted (player chickened out), game respects the choice

---

## Opponent AI (simple for MVP)

```js
opponentTurn() {
  // 1. Pick a random skill from opponent's skill pool
  // 2. Apply effect against player
  // 3. Return BattleEvents
}
```

Boss opponents have a 3-phase pattern defined in their data definition. Phase transitions on HP thresholds.

---

## `BattleScene.js`

### Layout (strict GBC split screen)
```
┌────────────────────────────────┐
│  OPPONENT NAME       HP: ████░  │  ← top half
│  [opponent sprite]              │
│─────────────────────────────────│
│  [player sprite]   HP: ████░   │  ← bottom half
│  BUDGET: 240                    │
│─────────────────────────────────│
│  ► kubectl rollout restart      │  ← skill menu (white box)
│    git revert                   │
│    scale out                    │
│    blame DNS                    │
└────────────────────────────────┘
```

### Scene Flow

```
enter BattleScene
  → show opponent slide-in animation
  → player turn: show skill Menu
  → player selects skill
    → if cursed: show warning dialog
  → BattleEngine.useSkill(id) → events[]
  → render each event in sequence (damage flash, HP bar update, dialog)
  → BattleEngine.applyTurnEffects() → events[]
  → render status effects
  → BattleEngine.checkWinCondition()
    → 'player': show win dialog, grant XP, mark dirty, return to WorldScene
    → 'opponent': show lose dialog, reduce HP, return to WorldScene
    → null: opponent turn → BattleEngine.opponentTurn() → render → loop
```

### `Menu.js` — Reusable D-pad Menu

```js
export class Menu {
  constructor(scene, items, options = {})
  // items: [{ label, value, disabled }]
  // options: { x, y, width, onSelect, onCancel }
  show()
  hide()
  destroy()
}
```

Reused in BattleScene (skill selection), InventoryScene (tab navigation + item list), and SaveScene.

---

## First Trainer Fight (MVP)

For this issue, implement one complete trainer fight:
- **Trainer:** Ola the Ops Guy (linux domain, difficulty 1)
- **Opponent skill pool:** `systemctl_restart` (heal 20 HP), `grep_logs` (reveal weakness)
- **Player starts with:** `git_revert`, `read_the_docs`, `blame_dns`

This is enough to validate the full battle loop end-to-end.

---

## Acceptance Criteria

- [ ] Entering trainer encounter loads BattleScene correctly
- [ ] Skill menu shows up to 6 active skills, cursor navigates with arrow keys
- [ ] Selecting a skill calls `BattleEngine.useSkill()` and renders all returned events
- [ ] HP bars update correctly after damage and heal events
- [ ] Cursed skill triggers warning dialog before executing
- [ ] Using a cursed skill adds 1 Shame Point to `GameState.player.shamePoints`
- [ ] Opponent takes turn after player using simple AI
- [ ] Win condition: opponent HP ≤ 0 → XP granted, `markDirty()`, return to WorldScene
- [ ] Lose condition: player HP ≤ 0 → dialog, return to WorldScene at reduced HP
- [ ] `BattleEngine` has zero Phaser imports and can be imported in a plain Node script
- [ ] `Menu.js` is reusable (no BattleScene-specific logic inside it)

---

## Coding Standards

- `BattleEngine` is a pure class — constructor takes snapshots, never mutates `GameState` directly
- Only `BattleScene` writes to `GameState` (after engine resolves)
- `SkillEngine` effect functions are pure — given state in, events out
- `Menu` has no knowledge of battle — it only calls `onSelect(value)`
