# Issue 8 — [Game] Random Encounters + Status Effects

## Context

Walking through the world should feel alive and unpredictable. This issue wires up the encounter system — random battles that trigger as you explore — and fully implements all 7 status conditions that affect battle behaviour.

Unlike Pokémon's wild Pokémon encounters, Cloud Quest encounters are **people and situations**: lost interns, rival engineers, incident reports, pushy sales reps, and emergency on-call alerts.

See `docs/GAME_DESIGN.md` → *Random Encounters* and *Status Conditions* sections.

---

## Depends On

- Issue 3 (WorldScene — encounters trigger while walking)
- Issue 4 (data layer — encounter tables from `encounters.js`)
- Issue 5 (BattleEngine + BattleScene — encounters launch battles)

---

## Files to Create

```
src/engine/
├── EncounterEngine.js   # Region-based encounter probability + type selection
└── StatusEngine.js      # Status effect application, stacking, and decay
```

---

## Encounter Types

| Type | Who | What Happens |
|------|-----|-------------|
| `rival_trainer` | A named cloud engineer | Full turn-based skill battle |
| `incident_report` | A floating error log | Scenario puzzle — pick correct skill to resolve |
| `lost_intern` | A confused junior dev | Quiz: explain concept correctly → teach them a skill → gain XP |
| `senior_engineer` | Rare. Experienced dev | Answer their question correctly → learn an advanced skill |
| `sales_rep` | Azure sales person | Mini-dialogue — decline correctly or lose budget |
| `on_call_alert` | Flashing red ❗ | Time-limited battle with SLA meter — resolve before uptime hits 0 |

---

## `EncounterEngine.js`

```js
export class EncounterEngine {
  // Roll for encounter on each tile step
  // Returns null (no encounter) or an encounter definition
  static roll(regionId, stepCount) { }

  // Select encounter type from region's weighted table
  static selectType(regionId) { }

  // Build a full encounter object for a given type
  static buildEncounter(type, regionId) { }
}
```

### Encounter probability per region

| Region | Base Rate | Notes |
|--------|-----------|-------|
| `localhost_town` | 0% | Safe starting area |
| `pipeline_pass` | 15% per 4 steps | Medium danger |
| `jira_dungeon` | 25% per 3 steps | High danger, ticket-themed |
| `production_plains` | 20% per 3 steps | Incidents spike here |
| `kubernetes_colosseum` | 30% per 2 steps | Most dangerous |

Rate increases slightly with higher act number.

### Encounter Type Weights

Defined in `src/data/encounters.js` (Issue 4). `EncounterEngine` reads this table and uses weighted random selection:

```js
// Pipeline Pass encounter table
[
  { type: 'rival_trainer',    weight: 40 },
  { type: 'incident_report',  weight: 35 },
  { type: 'lost_intern',      weight: 20 },
  { type: 'senior_engineer',  weight: 5  },
]
```

---

## Encounter Flows

### `rival_trainer`
1. Screen flash transition
2. Trainer sprite slides in from right
3. Trainer greeting dialog (from `trainers.js`)
4. Launch `BattleScene` with trainer as opponent
5. On win: XP granted, trainer teaches their signature skill

### `incident_report`
1. Red alert overlay flashes
2. Dialog: error message appears (e.g., `"503 Service Unavailable — upstream timed out"`)
3. Three skill choices shown (one correct, two wrong)
4. Correct: incident resolved, +XP, +reputation
5. Wrong: HP damage, incident escalates (higher difficulty next attempt)

### `lost_intern`
1. Dialog: intern describes confusion (`"What even is a container?"`)
2. Player chooses explanation from 3 options
3. Correct: intern learns, player gains +XP and sometimes a new basic skill
4. Wrong: intern remains confused, no reward

### `senior_engineer`
1. Dialog: senior asks a domain-specific question
2. Player picks answer
3. Correct: senior teaches an advanced skill (tier 2+)
4. Wrong: senior sighs and leaves

### `sales_rep`
1. Sales rep pitches an unnecessary Azure service
2. Options: `"No thanks"` / `"Tell me more"` / `"That sounds amazing!"`
3. `"No thanks"`: dismissed, no effect
4. `"Tell me more"`: lose 10 budget (their time costs money)
5. `"That sounds amazing!"`: lose 50 budget and gain a useless `stale_pr` junk item

### `on_call_alert`
1. Phone vibrate effect (screen shake)
2. Red banner: `"⚠️ PRODUCTION IS DOWN — SLA BREACH IN 3 TURNS"`
3. Launch `BattleScene` in On-Call mode:
   - Uptime meter counts down each turn
   - Player must win before uptime hits 0
   - If uptime hits 0: automatic loss, reputation -10

---

## `StatusEngine.js`

Handles all 7 status conditions. Applied during `BattleEngine.applyTurnEffects()`.

```js
export class StatusEngine {
  // Apply a status to target ('player' | 'opponent')
  static apply(state, target, statusId) { }

  // Remove a specific status
  static remove(state, target, statusId) { }

  // Decay all statuses by 1 turn — remove if duration hits 0
  static decayAll(state, target) { }

  // Check if target has a specific status
  static has(state, target, statusId) { }
}
```

### All 7 Status Conditions

| Status | Applied By | Duration | Effect | Removal |
|--------|-----------|----------|--------|---------|
| **Throttled** | Throttlemaster, some incidents | 3 turns | Player can only act every 2nd turn | Decay |
| **Cold Start** | Serverless encounters | 1 turn | Skip first turn entirely | Auto-removes after trigger |
| **Deprecated** | Legacy battles | 4 turns | All skill effects × 0.5 | Decay |
| **On-Call** | on_call_alert encounter | Until battle ends | Uptime meter active; lose if it hits 0 | Battle end |
| **Cost Alert** | Azure Bill boss | 3 turns | Budget drains 2× per turn | Decay |
| **Technical Debt** | Accumulates across battles | Permanent | Max HP -5 per stack (max 5 stacks) | Cannot be removed |
| **In Review** | Security gym encounters | 2 turns | Must pass 2-option peer review check before acting | Decay or pass check |

### Status Stacking Rules

- **Throttled**, **Deprecated**, **Cost Alert**: only 1 instance at a time; re-applying resets duration
- **Technical Debt**: stacks up to 5 times (each battle lost adds 1 stack)
- **Cold Start**: always 1-turn, cannot stack
- **On-Call**: replaces any existing On-Call instance

### Status Icons in HUD

Each active status shows a small pixel icon in the HUD during battle. `HUD.js` reads from `GameState`'s battle state snapshot.

---

## WorldScene Integration

`WorldScene.js` (Issue 3) must be updated to:

```js
// Called every time player moves to a new tile
onPlayerStep(regionId) {
  const encounter = EncounterEngine.roll(regionId, this.stepCount)
  if (encounter) this.triggerEncounter(encounter)
}

triggerEncounter(encounter) {
  // screen flash
  // launch appropriate encounter flow
}
```

---

## Acceptance Criteria

- [ ] Walking in Pipeline Pass triggers encounters at ~15% rate per 4 steps
- [ ] Localhost Town never triggers encounters
- [ ] Encounter type selected from weighted table for current region
- [ ] `rival_trainer` encounter launches full BattleScene with correct trainer
- [ ] `incident_report` shows error message + 3 skill choices; correct resolves, wrong deals HP damage
- [ ] `lost_intern` quiz: correct answer awards XP and teaches a basic skill
- [ ] `sales_rep` encounter: "That sounds amazing!" drains 50 budget and adds junk item
- [ ] `on_call_alert` launches timed battle with working uptime meter
- [ ] Uptime hitting 0 causes automatic loss with reputation penalty
- [ ] All 7 status conditions apply and remove correctly
- [ ] Throttled: player can only act every 2nd turn
- [ ] Deprecated: skill effects halved
- [ ] Technical Debt: accumulates across battles, max HP reduced
- [ ] Technical Debt cannot be removed or decayed
- [ ] In Review: player must pass 2-option check before acting
- [ ] Status icons shown in HUD during battle

---

## Coding Standards

- `EncounterEngine` is a static utility class — no constructor, no state
- `StatusEngine` is a static utility class — pure functions, no state
- Encounter flows (intern quiz, sales rep dialogue) are defined in `data/encounters.js`, not in the engine
- Encounter probability and region tables come entirely from `data/encounters.js`
- `WorldScene` calls `EncounterEngine.roll()` — never rolls its own random numbers
