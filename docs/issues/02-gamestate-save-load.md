# Issue 2 — [Game] GameState + Stateless Save/Load System

## Context

Cloud Quest has **zero backend** — no server, no database, no localStorage as primary storage. All game progress lives in a single `.cloudquest` file the player downloads and re-imports themselves. The app is completely stateless between sessions.

> Fitting lore: *"Even your save file is infrastructure-as-code."*

This issue implements the entire persistence layer: the state object, the save/load logic, the file I/O utilities, and the in-game save UI.

See `docs/GAME_DESIGN.md` → *Save System* section for full design rationale.

---

## Architecture

```
GameState (singleton, in-memory only)
    │
    ├── SaveManager.export()  →  .cloudquest file downloaded
    └── SaveManager.import()  ←  .cloudquest file uploaded by player
```

**Rule:** `GameState` is the only mutable object in the entire app. Everything else is read-only data or pure functions.

---

## Files to Create

```
src/
├── state/
│   ├── GameState.js      # Single mutable object — the only mutable state in the app
│   └── SaveManager.js    # export / import / checksum — zero Phaser dependency
├── utils/
│   ├── crypto.js         # SHA-256 via Web Crypto API (no library needed)
│   └── fileIO.js         # download() and openFilePicker() browser helpers
├── scenes/
│   └── SaveScene.js      # Git-terminal styled save/load UI
└── ui/
    └── HUD.js            # HP bar, budget meter, 💾 unsaved changes indicator
```

---

## `GameState.js` Shape

```js
export const GameState = {
  player: {
    name: '',
    title: 'Intern',
    level: 1,
    xp: 0,
    hp: 100,
    maxHp: 100,
    budget: 500,
    reputation: 100,
    shamePoints: 0,
    location: 'localhost_town',
    playtime: 0,         // seconds
  },
  skills: {
    active: [],          // max 6 skill IDs
    learned: [],         // all known skill IDs
    tiers: {},           // { skill_id: 1|2|3|4 }
    cursed: [],          // unlocked cursed technique IDs
  },
  inventory: {
    tools:       [],     // [{ id, qty }]
    keyItems:    [],     // [id, ...]  — cannot drop
    credentials: [],
    docs:        [],
    junk:        [],
  },
  emblems: {
    tux:      { earned: false, shine: 0, grime: 0 },
    pipeline: { earned: false, shine: 0, grime: 0 },
    container:{ earned: false, shine: 0, grime: 0 },
    cloud:    { earned: false, shine: 0, grime: 0 },
    vault:    { earned: false, shine: 0, grime: 0 },
    helm:     { earned: false, shine: 0, grime: 0 },
    finops:   { earned: false, shine: 0, grime: 0 },
    sre:      { earned: false, shine: 0, grime: 0 },
  },
  story: {
    act: 1,
    completedQuests: [],
    flags: {},
  },
  stats: {
    battlesWon: 0,
    battlesLost: 0,
    incidentsResolved: 0,
    cursedTechniquesUsed: 0,
    totalDeployments: 0,
    longestUptime: 0,
  },
  // _session is NEVER written to file
  _session: {
    isDirty: false,
    lastSavedAt: null,
  },
}
```

---

## `.cloudquest` File Format

Plain JSON. Human-readable. Players can open it in a text editor.

```json
{
  "version": "1.0",
  "savedAt": "2025-03-23T02:47:00Z",
  "commitMessage": "Beat the Pipeline Gym, finally",
  "checksum": "sha256:a3f9c1...",
  "player": { ... },
  "skills": { ... },
  "inventory": { ... },
  "emblems": { ... },
  "story": { ... },
  "stats": { ... }
}
```

`_session` is stripped before writing. `checksum` is a SHA-256 of the JSON payload excluding the checksum field itself.

---

## `SaveManager.js` API

```js
export const SaveManager = {
  // Serialise GameState → download file
  async export(gameState, commitMessage = '') { },

  // Read file → validate → return parsed state (throws on fatal error)
  async import(file) { },

  // SHA-256 of payload string (uses Web Crypto API)
  async computeChecksum(payloadString) { },

  // Return copy of state with _session removed
  stripSession(gameState) { },
}
```

---

## Save UI — `SaveScene.js`

Styled as a `git commit` terminal:
- Monospace font, dark background, green text
- Prompt: `$ git commit -m "`  followed by blinking cursor input
- Player types an optional commit message
- On confirm: file downloads, confirmation message appears:
  `"Progress committed. Don't forget to back it up."`
- On load: file picker opens, checksum validated, state loaded
- Mismatch warning: `"Save file checksum mismatch. Someone's been poking around the config. Load anyway? [Y/N]"`

---

## HUD — `HUD.js`

Persistent overlay shown during WorldScene and BattleScene:
- HP bar (green → yellow → red)
- Budget meter
- 💾 icon — blinks when `GameState._session.isDirty === true`
- Hovering/focusing 💾 shows tooltip: `"You have uncommitted changes."`

---

## `beforeunload` Warning

In `main.js` or `WorldScene`:
```js
window.addEventListener('beforeunload', (e) => {
  if (GameState._session.isDirty) {
    e.preventDefault()
    e.returnValue = ''
  }
})
```

---

## Acceptance Criteria

- [ ] `SaveManager.export()` downloads a valid `.cloudquest` file
- [ ] File is valid JSON, human-readable, contains all state sections
- [ ] `checksum` field is present and correct SHA-256
- [ ] `_session` is NOT present in the exported file
- [ ] `SaveManager.import()` restores full state from file
- [ ] Tampered file (manual JSON edit) shows mismatch warning dialog
- [ ] Player can choose to load anyway after mismatch warning
- [ ] HUD 💾 icon blinks when `isDirty` is true
- [ ] `isDirty` is set to `true` whenever `GameState` is modified
- [ ] `beforeunload` fires browser warning when `isDirty` is true
- [ ] Save UI styled as git terminal with commit message input

---

## Coding Standards

- `SaveManager` has zero Phaser imports — pure JS, testable in Node
- `crypto.js` uses `window.crypto.subtle` — no third-party crypto library
- `GameState` is a plain object, not a class — mutate directly
- `stripSession` returns a deep copy — never mutates the original
