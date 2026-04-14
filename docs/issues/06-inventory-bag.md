# Issue 6 — [Game] Inventory Bag (5 Tabs)

## Context

The player carries a **Bag** — a classic tabbed inventory accessible from the pause menu. It can be opened mid-battle (for consumables) or in the overworld. The Bag is a pure UI layer over `GameState.inventory`.

Think Pokémon GBC bag — chunky pixel UI, D-pad navigation, item descriptions at the bottom.

See `docs/GAME_DESIGN.md` → *Inventory System* section.

---

## Depends On

- Issue 1 (scaffold, config)
- Issue 2 (GameState — inventory lives here)
- Issue 4 (data layer — item definitions from `items.js`)
- Issue 5 (BattleScene — bag must be openable mid-battle and return cleanly)

---

## Files to Create

```
src/scenes/
└── InventoryScene.js    # Full bag UI — tabbed navigation, item actions
```

Reuses from previous issues:
- `src/ui/Menu.js` (Issue 5) — for item list navigation
- `src/ui/DialogBox.js` (Issue 3) — for item descriptions and confirmations

---

## The Bag — Tab Structure

| Tab | Icon | Contents | Can Use In Battle |
|-----|------|----------|-------------------|
| **Tools** | 🔧 | Consumable items | Yes |
| **Key Items** | 🔑 | Quest items, SSH keys | No |
| **Credentials** | 🪪 | Certs, access tokens | No |
| **Docs** | 📄 | Runbooks, postmortems | No (read only) |
| **Junk** | 🗑️ | Trash the player accumulates | No |

Tab switching: Left/Right arrow keys. Item navigation: Up/Down. Action: A key. Back: B key.

---

## Screen Layout

```
┌─────────────────────────────────┐
│ 🔧TOOLS  🔑KEY  🪪CRED  📄DOCS  🗑️JUNK │  ← tab bar
│─────────────────────────────────│
│ ► Red Bull               ×3     │
│   Rollback Potion         ×1    │
│   Azure Credit Voucher    ×2    │
│   Skip Tests Scroll       ×1    │
│─────────────────────────────────│
│ "3am fuel. Restores 30 HP."     │  ← item description
└─────────────────────────────────┘
```

Selected item is highlighted. Description auto-updates as cursor moves.

---

## Item Actions

Pressing A on an item opens an action submenu (via `Menu.js`):

| Tab | Available Actions |
|-----|------------------|
| Tools (in battle) | **USE**, EXAMINE |
| Tools (overworld) | EXAMINE, DROP |
| Key Items | EXAMINE (no drop, no use) |
| Credentials | EXAMINE |
| Docs | **READ** (+XP for some), EXAMINE |
| Junk | EXAMINE, DROP (except `mystery_node_modules`) |

### Special cases

- **`mystery_node_modules`**: Drop action shows `"47,000 files. Does nothing. Can't delete."` — action cancelled, item stays
- **`on_call_phone`**: Examine shows `"Activates On-Call mode. Why would you equip this willingly."` — USE triggers On-Call status
- **`terraform_state`**: Examine shows `"Don't touch it. Don't move it. Don't even look at it."` — no other actions
- **`incident_postmortem`**: READ grants +20 XP bonus if player lost their last battle — one-time use

---

## Mid-Battle Bag Access

When opened from `BattleScene`:
- Only the **Tools** tab is accessible (other tabs are greyed out)
- Only items with `usableInBattle: true` can be used
- Using an item calls the item's `effect` function against `GameState`, fires a `BattleEvent`, then returns to battle
- The turn is consumed (opponent will move after item use)

---

## Inventory State in `GameState`

```js
GameState.inventory = {
  tools:       [{ id: 'red_bull', qty: 3 }, { id: 'rollback_potion', qty: 1 }],
  keyItems:    ['ssh_key_staging', 'staging_env_token'],
  credentials: ['az_sp_cert'],
  docs:        ['outdated_runbook', 'incident_postmortem'],
  junk:        ['root_password_note', 'mystery_node_modules'],
}
```

Helper functions to add/remove/check items (put in `GameState.js`):
```js
export const addItem    = (tab, id, qty = 1) => { }
export const removeItem = (tab, id, qty = 1) => { }
export const hasItem    = (tab, id) => { }
```

---

## Acceptance Criteria

- [ ] Bag opens from pause menu in overworld and from battle
- [ ] All 5 tabs render and tab switching works with left/right keys
- [ ] Item list scrolls correctly when more items than fit on screen
- [ ] Item description updates as cursor moves
- [ ] Using Red Bull in battle restores 30 HP and consumes 1 from `GameState`
- [ ] Using Red Bull consumes the turn (opponent acts after)
- [ ] Key Items tab shows no USE or DROP actions
- [ ] `mystery_node_modules` cannot be deleted — shows flavour message
- [ ] `incident_postmortem` READ grants +20 XP if last battle was a loss
- [ ] Docs tab shows READ action (not USE)
- [ ] Mid-battle bag: only Tools tab accessible, other tabs visually disabled
- [ ] Closing bag returns to correct previous scene (WorldScene or BattleScene)
- [ ] `markDirty()` called whenever inventory changes

---

## Coding Standards

- `InventoryScene` reads item definitions from `getItem(id)` in `data/items.js` — never hardcodes item data
- Tab state (which tab is active) is local to the scene, not stored in `GameState`
- Item action effects are pure functions defined in `data/items.js`, not in the scene
- `InventoryScene` reuses `Menu.js` for both tab selection and item list — no custom list rendering
