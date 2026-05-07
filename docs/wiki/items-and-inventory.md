# 🎒 Items & Inventory

Your inventory has five tabs. Press `I` to open it during the overworld, or use items in battle from the bag menu.

---

## 🔧 Tools Tab

Consumable use items. Most can be used in battle.

| Item | Effect | Battle Use? |
|---|---|---|
| Red Bull | Restore 30 HP | ✅ |
| Rollback Potion | Restore 20 HP | ✅ |
| Coffee (Black) | Restore 15 HP | ✅ |
| Energy Drink (Monster) | Restore 50 HP | ✅ |
| Hot Chocolate | Restore 40 HP | ✅ |
| Protein Bar | Restore 25 HP | ✅ |
| Full English Breakfast | Restore HP to full | ✅ |
| Azure Credit Voucher | Restore 50 Budget | ✅ |
| Azure Coupon Code | Restore 100 Budget | ✅ |
| Reserved Instance Contract | Next 5 skills cost 50% less budget | ✅ |
| Spot Instance Ticket | One skill costs 0 budget (20% interrupt risk) | ✅ |
| Cost Alert Suppressor | Ignore budget drain for 3 turns | ✅ |
| Stack Overflow Printout | Reveal enemy domain and weakness | ✅ |
| Feature Flag Toggle | Disable one enemy skill for 2 turns | ✅ |
| Canary Token | Reduce next hit's damage by 50% | ✅ |
| Load Balancer Cookie | Dodge next enemy attack | ✅ |
| CI Green Badge | +25% damage for 3 turns | ✅ |
| Rubber Duck | Reveal a hint about the current enemy | ✅ |
| Skip Tests Scroll | Bypass one skill check | ✅ |
| On-Call Phone | Apply `on_call` status | ❌ (world only) |

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
| Published Post-Mortem | **-1 Shame** | Awarded after certain quest resolutions |

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
| Coffee and an Apology | **-1 Shame** | Available at Three AM Tavern |
| Published Post-Mortem | **-1 Shame** | Docs tab — use outside of battle |
| Technical Debt Voucher | Clears 1 stack of `technical_debt` status | Tech Debt Cleanup quest reward |

> ⚠️ Shame items are rare. **Shame never goes below 0.**

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
