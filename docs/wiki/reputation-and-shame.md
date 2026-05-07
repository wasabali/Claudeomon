# ⚖️ Reputation & Shame

Cloud Quest tracks two independent character stats that shape your experience: **Reputation** (rebuildable) and **Shame** (permanent). Together they determine NPC treatment, shop pricing, content access, and which ending you get.

---

## Reputation

**Range:** −100 to 100  
**Default start:** 50  
**Effect:** Shop prices scale inversely with Reputation.

### Reputation Thresholds

| Reputation | Title | Shop Modifier |
|---|---|---|
| 90–100 | Distinguished Engineer | −20% (significant discount) |
| 80–89 | Senior Engineer | −10% |
| 60–79 | Competent | No change |
| 40–59 | Adequate | No change |
| 20–39 | Liability | +20% (prices rise) |
| 0–19 | Walking Incident | +50% |
| −25–−1 | Known Incident | +50% |
| −50–−26 | Do Not Pair With | +50% |
| −100–−51 | The Reason We Have Runbooks | +50% |

### How Reputation Changes

| Action | Rep Change |
|---|---|
| Optimal solution (incident) | +++ |
| Standard solution | + |
| Shortcut solution | − |
| Cursed technique | −− |
| Nuclear technique | −−− |
| Win a trainer battle | + |
| Lose a trainer battle | − |
| SLA breach | −− |
| Complete a quest (good path) | +++ |

Reputation can be rebuilt by completing quests, winning battles with optimal solutions, and using Coffee & Apology items.

---

## Shame

**Range:** 0 to ∞ (never decremented by normal means)  
**Default start:** 0  
**Effect:** Permanent — gates evil path content, affects endings.

Shame accumulates slowly and cannot be undone. The **Vault Emblem** reduces each Shame gain by 1 (minimum 0).

### Shame Thresholds

| Shame | Title | World Effect |
|---|---|---|
| 1 | It Was Like That When I Got Here | NPCs remember |
| 3 | Cowboy Coder | Some shop items cost more |
| 5 | The Shortcutter | Gym Leaders become wary; may add extra conditions |
| 7 | Person of Interest | THROTTLEMASTER references you in dialog |
| 10 | Shadow Engineer | Passive unlocks, cursed content gates open |
| 15 | The Other Principal | Fork the Company ending becomes available |

### Shadow Engineer (Shame ≥ 10)

Reaching Shadow Engineer status unlocks a passive skill set modification:

| Effect | Detail |
|---|---|
| Optimal skills | +10 budget cost |
| Cursed skills | −5 budget cost |
| Heal items | −20% effectiveness |
| Auto-learn | `exec_xp_cmdshell` |
| Grime rate | Doubles (0.05 → 0.10 per Shame Point) |
| Gym Leaders | May refuse to teach at Shame ≥ 10 |

---

## The Evil Path

> ⚠️ **Spoiler section** — this covers content you may prefer to discover yourself.

Using cursed and nuclear techniques accumulates Shame. The path gradually changes the world:

- **Shame 1–4:** Cosmetic — some NPCs react differently
- **Shame 5–9:** Wary Gym Leaders, some NPC dialog trees branch
- **Shame 10–14:** Shadow Engineer passive activates; Three AM Tavern regulars respect you; THROTTLEMASTER's crew becomes accessible
- **Shame 15+:** The Outcast Network is fully open; Fork the Company ending unlocks

### Ending Conditions

| Ending | Requirement |
|---|---|
| Shadow Post-Mortem | Shame 10–14, defeat the CTO |
| Fork the Company | Shame ≥ 15, accept THROTTLEMASTER's recruitment |
| Certified Engineer (good) | Defeat all 8 Gym Leaders, Shame < 5 |
| The Grind Never Ends | Complete the game without defeating the CTO |

---

## Shame Reduction

Shame is permanent, but two items can directly reduce it:

| Method | Effect |
|---|---|
| **Vault Emblem** | –1 to every Shame gain (minimum 0) |
| **Coffee and an Apology** | Immediately reduces Shame by 1 |
| **Published Post-Mortem** | Immediately reduces Shame by 1 |

---

See [Items & Inventory](items-and-inventory.md) for item details. See [Hidden Areas](hidden-areas.md) for Outcast Network content.
