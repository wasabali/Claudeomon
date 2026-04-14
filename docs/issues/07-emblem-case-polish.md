# Issue 7 — [Game] Emblem Case + Drag-to-Polish Minigame

## Context

Completing a Gym earns the player a **Certification Emblem** — a physical badge representing domain mastery. The Emblem Case is where they live, displayed in a 4×2 pixel-art grid.

The **polishing mechanic** is inspired directly by the HeartGold/SoulSilver badge polishing minigame on the Nintendo DS — players rub/drag their mouse over an emblem to clean off the grime and make it shine. Fully polished emblems glow, grant passive bonuses, and NPCs comment on them.

See `docs/GAME_DESIGN.md` → *Certification Emblems & The Emblem Case* section.

---

## Depends On

- Issue 1 (scaffold, config)
- Issue 2 (GameState — `emblems` section with `earned`, `shine`, `grime` per emblem)
- Issue 4 (data layer — emblem definitions from `emblems.js`)

---

## Files to Create

```
src/
├── scenes/
│   └── EmblemScene.js     # Emblem case grid + zoom-in + polish minigame
└── ui/
    └── ShineEffect.js     # Sparkle/pulse animation + grime overlay rendering
```

---

## The 8 Emblems

| # | ID | Name | Domain | Grime Flavour | Passive Bonus |
|---|-----|------|--------|--------------|--------------|
| 1 | `tux` | 🐧 Tux Emblem | Linux | Terminal scrollback residue | Linux skills +5% |
| 2 | `pipeline` | ⚙️ Pipeline Emblem | CI/CD | Failed build red ink splatter | CI/CD fail rate -5% |
| 3 | `container` | 📦 Container Emblem | Docker | node_modules dust | Docker skills +5% |
| 4 | `cloud` | ☁️ Cloud Emblem | Azure Core | Azure portal spinner smudges | Budget drain -10% |
| 5 | `vault` | 🔒 Vault Emblem | Security | Leaked secret stains | Shame gain -1 |
| 6 | `helm` | ⎈ Helm Emblem | Kubernetes | CrashLoopBackOff soot | Kubernetes skills +5% |
| 7 | `finops` | 💰 FinOps Emblem | Architecture | Billing alert pop-up residue | Budget +10% after battle |
| 8 | `sre` | 🛡️ SRE Emblem | Reliability | 3am coffee ring stains | Max HP +10 |

---

## Emblem Case Screen — Grid View

```
┌──────────────────────────────────┐
│        CERTIFICATION EMBLEMS      │
│                                   │
│  [🐧]  [⚙️]  [📦]  [☁️]          │
│                                   │
│  [🔒]  [⎈]  [💰]  [🛡️]          │
│                                   │
│  Select an emblem to inspect it.  │
└──────────────────────────────────┘
```

- Earned emblems: full colour, may have grime overlay
- Unearned emblems: dark silhouette, locked icon overlay
- Cursor navigates with D-pad
- A key on earned emblem → zoom into polish view
- B key → return to pause menu

---

## Polish View — Zoom-In Minigame

Selecting an earned emblem fills the screen with a large pixel-art close-up of that emblem:

```
┌──────────────────────────────────┐
│                                   │
│      [  🐧 EMBLEM CLOSE-UP  ]     │
│      [ grime overlay rendered ]   │
│                                   │
│  Shine: ████████░░  80%           │
│  "Terminal scrollback residue"    │
│                                   │
│  [B] Back                         │
└──────────────────────────────────┘
```

### Polishing Mechanic

- Player clicks and drags the mouse over the emblem area
- Each drag movement over the emblem increases `GameState.emblems[id].shine` by a small amount (based on distance dragged)
- The `grime` visual overlay fades out as `shine` increases
- At `shine = 1.0`: emblem plays the full sparkle animation, passive bonus activates
- `markDirty()` is called whenever shine changes

### `ShineEffect.js`

Handles two concerns:

1. **Grime overlay**: A semi-transparent pixel noise texture rendered on top of the emblem. Opacity = `1 - shine`. Each emblem has a unique grime colour/pattern matching its flavour.

2. **Sparkle animation**: When `shine >= 1.0`, render 4–6 small star sprites that pulse in and out around the emblem (2-frame GBC-style animation). The emblem itself pulses with a subtle brightness cycle.

```js
export class ShineEffect {
  constructor(scene, emblemSprite, emblemId)
  update(shine)          // Called whenever shine value changes
  playFullShineAnim()    // Called once when shine first hits 1.0
  destroy()
}
```

---

## Emblem Degradation

Emblems get dirty again over time:
- Each battle adds `grime += 0.02` to all earned emblems
- Each Shame Point adds `grime += 0.05` to the relevant emblem
- Using `rm_rf` cursed skill adds a permanent `scorched: true` flag to the SRE emblem — renders as black scorch marks that never fully clean off (shine can still reach 1.0 but scorch marks remain)
- Using any cursed skill adds `darkStained: true` — a permanent shadow smudge requiring 2× more rubbing to clean

All degradation must be capped at `grime = 1.0` (fully dirty but never erases the emblem).

---

## Overworld HUD Integration

Polished emblems (shine = 1.0) show a small sparkle indicator next to their slot in the HUD emblem strip. This is handled in `HUD.js` (Issue 2) — it reads `GameState.emblems` and renders the appropriate state.

---

## Acceptance Criteria

- [ ] Emblem case opens from pause menu
- [ ] 4×2 grid renders all 8 emblem slots correctly
- [ ] Unearned emblems show as dark silhouettes
- [ ] Earned emblems show grime overlay at correct opacity for their `grime` value
- [ ] Cursor navigates grid with D-pad
- [ ] Pressing A on earned emblem enters polish view
- [ ] Polish view shows large emblem, shine meter, and grime description
- [ ] Mouse drag over emblem increases `shine` in `GameState`
- [ ] Grime overlay fades as shine increases
- [ ] At `shine = 1.0` sparkle animation plays
- [ ] Passive bonus tooltip shows when emblem is fully polished
- [ ] Battles increase grime on all earned emblems
- [ ] Shame Points increase grime on the relevant emblem
- [ ] `rm_rf` cursed skill leaves permanent scorch mark on SRE emblem
- [ ] `markDirty()` called on every shine change

---

## Coding Standards

- `EmblemScene` reads all emblem metadata from `getEmblem(id)` in `data/emblems.js`
- `ShineEffect` is a pure rendering component — it reads shine/grime values, never writes them
- Grime and shine are always clamped to `[0, 1]`
- Drag detection uses Phaser pointer events — no raw DOM `mousemove`
- Sparkle animation uses Phaser's built-in tween system — no external animation library
