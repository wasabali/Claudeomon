# 🎒 Items & Inventory

Your inventory has five tabs. Press `I` to open it during the overworld, or use items in battle from the bag menu.

---

## 🔧 Tools Tab

Consumable use items. Most can be used in battle.

| Item | Effect | Battle Use? | Quantity |
|---|---|---|---|
| Energy Drink | Restore 30 HP immediately | ✅ | Stackable |
| Premium Energy Drink | Restore 60 HP immediately | ✅ | Stackable |
| Backup Script | Prevent KO once (full HP restore on death) | ✅ | Stackable |
| Cold Brew | +20 budget for this battle | ✅ | Stackable |
| Debug Mode | Reveal enemy domain, HP, and next move | ✅ | 1 per battle |
| Pair Programming | Doubles skill effect this turn | ✅ | Rare |
| Rubber Duck | Unstick yourself from "blocked" status | ✅ | Stackable |
| Code Review Pass | Skip enemy's next attack | ✅ | Rare |

---

## 🗝️ Key Items Tab

Quest items and permanent upgrades. Cannot be discarded.

| Item | Effect | Notes |
|---|---|---|
| Mystery node_modules | Enters node_modules Maze hidden area | Use at a directory with `node_modules/` visible |
| SSH Key: Decommissioned Server | Enters Server Graveyard | Obtained: quest from Deprecated Dagfinn's ghost note |
| Architect's Diagram | Reveals Architecture District map | Given by Architect Aleksander |
| Old Margaret's Bakery Login | Required for `az webapp restart` quest | Quest item |
| DO_NOT_TOUCH.exe | Triggers OldCorp Basement sequence (irreversible) | Jira Dungeon floor 3 |
| Cloud Console API Key | Unlocks The Cloud Console endgame area | Final act key item |

---

## 🏅 Credentials Tab

Unlocked after passing identity checks. Some are required to enter regions.

| Credential | Unlocks | Source |
|---|---|---|
| Azure CLI Auth Token | Azure Town, Production Plains | Completing Azure Town intro quest |
| Kubernetes Cluster Admin | Kubernetes Colosseum | Beat Gym 4 (Docker Dag) |
| Vault Root Token | Security Vault | Beat Gym 6 (Ingrid) |
| GitHub PAT | Pipeline Pass deep area | Bjørn the Build Breaker reward |
| 3AM Pass | Three AM Tavern | Shame ≥ 1 (automatic) |

---

## 📄 Docs Tab

Passive reference items that unlock new mechanics or dialogue.

| Doc | Effect | Source |
|---|---|---|
| Runbook: Restart Sequence | `follow the runbook` skill unlocked | Quest: Write Your First Runbook |
| SLO Contract | `define SLIs` skill unlocked | Quest: Define Your SLOs |
| Architecture Decision Record | Extra dialogue with Architect Aleksander | Whiteboard Summit |
| On-Call Schedule | Reveals upcoming On-Call status turns | Quest: On-Call Survival Training |
| Post-Mortem Published | **-1 Shame** | Craft from any incident you resolved as Optimal |

---

## 🗑️ Junk Tab

Useless items with flavour text. Sell them to vendors for pocket change.

| Item | Flavour | Sell Price |
|---|---|---|
| Legacy Powerpoint Deck | "This is still relevant, right?" | 5 💰 |
| Expired SSL Cert | "It was fine until it wasn't." | 2 💰 |
| Outdated Dependency Lock | "Nobody knows what it does." | 3 💰 |
| Meeting Agenda (Blank) | "Sent 2 minutes before the meeting." | 1 💰 |
| Stack Overflow Printout | "Just in case the internet goes down." | 4 💰 |

---

## ☕ Special Items

| Item | Effect | Source |
|---|---|---|
| Coffee & Apology | **-1 Shame** (max once per act) | Buy at Three AM Tavern for 50 💰 |
| Post-Mortem Published | **-1 Shame** | Craft from resolved incident |
| Technical Debt Voucher | Clears 1 stack of `technical_debt` status | Tech Debt Cleanup quest reward |

> ⚠️ Shame items are rare. **Shame never goes below 0** and cannot be reduced below your current act floor (Act 2 min: 0, Act 3 min: 1).

---

## Inventory Limits

| Tab | Max Slots |
|---|---|
| Tools | 20 |
| Key Items | Unlimited (quest items auto-added) |
| Credentials | 10 |
| Docs | 10 |
| Junk | 10 |

---

*See [Reputation & Shame](reputation-and-shame.md) for how shame reduction items work.*
