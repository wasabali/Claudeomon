# ⭐ Reputation & Shame

Two stats shape who you are in the cloud engineering world. They're independent, they move differently, and only one of them can be rebuilt.

---

## Reputation

Reputation measures how much people trust your work. It ranges from **-100 to 100** and can go up or down.

### Reputation Thresholds

| Score | Title |
|---|---|
| 90+ | Distinguished Engineer |
| 80–89 | Senior Engineer |
| 60–79 | Competent |
| 40–59 | Adequate |
| 20–39 | Liability |
| 0–19 | Walking Incident |
| -25 to -1 | Known Incident |
| -50 to -26 | Do Not Pair With |
| -100 to -51 | The Reason We Have Runbooks |

### Gaining Reputation

| Action | Rep Change |
|---|---|
| Win a battle with Optimal solution | +3 |
| Win a battle with Standard solution | +1 |
| Win a battle with Shortcut solution | -1 |
| Complete a quest (Optimal path) | +5 to +10 |
| Beat a gym leader | +5 |
| Use a cursed technique | -10 to -20 |
| Use a nuclear technique | -15 to -20 |
| Shame breach action | -10 |
| Post-Mortem Published item | +5 |

### Losing Reputation

Reputation loss from cursed/nuclear techniques is **immediate and steep**. You can rebuild it with quests, optimal solutions, and time — but some actions (like `hardcode the secret`) apply a **permanent -20** that stacks with your current value.

---

## Shame

Shame measures how many shortcuts, disasters, and unforgivable things you've done. It **only goes up**. It never declines naturally.

> *"Shame points are permanent. The only way to move forward is to face them."*

### Shame Thresholds

| Shame | Title |
|---|---|
| 0 | *(No title — you're fine)* |
| 1 | It Was Like That When I Got Here |
| 3 | Cowboy Coder |
| 5 | The Shortcutter |
| 7 | Person of Interest |
| 10 | Shadow Engineer |
| 15 | The Other Principal |

### Gaining Shame

| Action | Shame Gain |
|---|---|
| Use any cursed technique | +1 |
| Use any nuclear technique | +2 |
| `kubectl delete ns production --force` | +3 |
| `EXEC xp_cmdshell` | +3 |
| SLA breach (certain incidents) | +1 |

### Reducing Shame (Rare)

| Method | Shame Reduction | Notes |
|---|---|---|
| Coffee & Apology item | -1 | Max once per act. Costs 50 💰 at Three AM Tavern. |
| Post-Mortem Published | -1 | Craft from an incident you solved as Optimal tier. |

> ⚠️ **Shame floor:** You cannot reduce Shame below your current act minimum (Act 1: 0, Act 2: 0, Act 3: 1). It represents choices that can't be taken back.

---

## Shadow Engineer Mode

At **Shame ≥ 10**, you become a **Shadow Engineer**. This permanently changes some mechanics:

| Mechanic | Change |
|---|---|
| Optimal skill budget cost | +10 (costs more to do it right) |
| Cursed skill budget cost | -5 (cheaper to do it wrong) |
| Healing from items/skills | -20% |
| Available trainers (Three AM Tavern) | All trainers now accessible |
| `kubectl delete ns production --force` | Unlocked |

Shadow Engineer status also unlocks alternate dialogue in Architecture District and changes the final act ending.

---

## The Evil Path

Accumulating high Shame isn't just a penalty — it's an alternate route through the game:

- **Shame 1:** Three AM Tavern door appears in Localhost Town
- **Shame 2:** Hidden trainers appear in standard gym areas
- **Shame 3:** YOLO Yaml Ylva appears in Kubernetes Colosseum inner ring; .env Erik in Security Vault
- **Shame 5:** Legacy Leif in Deprecated Azure Region
- **Shame 7:** Person of Interest — certain NPCs refuse to talk to you; others become friendly
- **Shame 10:** Shadow Engineer — cursed economics flip; alternate ending branch opens
- **Shame 15:** The Other Principal — special final act credits sequence

### Outcast Network

Doing things NPCs tell you **not** to do reveals hidden areas with exclusive cursed trainers. These are the most powerful techniques in the game — and the most consequences-heavy. See [Hidden Areas](hidden-areas.md).

---

## Reputation vs. Shame: Summary

| | Reputation | Shame |
|---|---|---|
| Direction | Bidirectional (-100 to 100) | One-way (0+) |
| Rebuilding | ✅ Yes — quests, optimal play | ❌ No — only rare items reduce it |
| Effect on gameplay | Title display, NPC dialogue | Unlocks cursed content, changes economics |
| Reflects | Professional standing | Accumulated bad decisions |

---

*See [Items & Inventory](items-and-inventory.md) for the Coffee & Apology and Post-Mortem Published items.*  
*See [Hidden Areas](hidden-areas.md) for what high Shame unlocks.*
