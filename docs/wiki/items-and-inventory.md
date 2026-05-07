# 🎒 Items & Inventory

Your inventory has five tabs: **Tools**, **Key Items**, **Credentials**, **Docs**, and **Junk**. Most items are found in the world, earned from quests, or dropped by incidents.

---

## 🔧 Tools

Consumable items and usable gear. Most can be used in battle.

| Item | Effect | Usable in Battle? |
|---|---|---|
| Red Bull | Restores 30 HP (3am fuel) | ✅ |
| Rollback Potion | Restores 20 HP (reverts the latest bad deploy) | ✅ |
| Azure Credit Voucher | Restores 50 Budget | ✅ |
| Skip Tests Scroll | Bypass one skill check. Your karma takes the hit. | ✅ |
| On-Call Phone | Applies `on_call` status (random encounters after each battle) | ❌ |
| Coffee (Black) | Restores 15 HP (tastes like 6am) | ✅ |
| Energy Drink (Monster) | Restores 50 HP (your hands are shaking) | ✅ |
| Hot Chocolate | Restores 40 HP (only at the Three AM Tavern) | ✅ |
| Full English Breakfast | Restores HP to full (beans, toast, and a clean build) | ✅ |
| Stack Overflow Printout | +5 XP when read (answer from 2014, still correct) | ❌ |
| Coffee and an Apology | Reduces 1 Shame Point (the apology is genuine. mostly.) | ❌ |

---

## 🗝️ Key Items

Story-critical items, access passes, and permanent gear. Cannot be dropped.

| Item | Description |
|---|---|
| SSH Key (Staging) | Unlocks staging server doors |
| Staging Env Token | Required to enter Staging Valley |
| Terraform State | Don't touch it. Don't move it. |
| Cross-Origin-Opener-Policy | Value: same-origin. Looked important. |
| Cross-Origin-Embedder-Policy | Value: require-corp. Nobody knows why this is needed. |
| sudo Running Shoes | ×2 movement speed while holding Z. Encounter rate +50%. |
| Blueprint v1 — Load Handling | Alice's first design stage: auto-scaling + load balancer |
| Blueprint v2 — Security | Alice's second design stage: zero-trust + IAM roles |
| Legacy Migration Badge | Awarded for choosing the strangler fig pattern |

---

## 🔑 Credentials

Auth tokens and access certificates. Not usable in battle — required for progression gates.

| Item | Description |
|---|---|
| Azure Service Principal Cert | Auth token for Azure battles |
| Cloud Cert | Validates your access level |

---

## 📄 Docs

Readable items that grant XP or story context.

| Item | Effect |
|---|---|
| Outdated Runbook | +5 XP when read (half the steps are wrong, still useful) |
| Incident Postmortem | +20 XP when read — only triggers if you lost your last battle |
| Published Post-Mortem | Reduces 1 Shame Point (you owned your mistakes publicly) |

---

## 🗑️ Junk

Useless items. Or are they?

| Item | Notes |
|---|---|
| Root Password (sticky note) | Found in Margaret's house. Useless. Horrifying. |
| Mystery node_modules | Can't delete (47,000 files). Using it enters the hidden **Node_modules Maze**. |
| Stale PR | Open since 2019. Nobody will merge it. |
| Cold Coffee | Heals 5 HP. Margaret made it while you were distracted. |
| Scorched Server | Cursed salvage. Heals 20 HP. Still smoking. |

---

## Economy Notes

Budget (Azure Credits) is the in-game currency. It's not just for items — many skills cost budget to use. Running the budget negative has consequences:

| Budget Threshold | Consequence |
|---|---|
| -100 | `cost_alert` status applied |
| -200 | Budget payment quest triggered |
| -300 | Subscription suspended encounter fires |

Budget is restored by:
- Winning battles (15% restore on win, 5% on loss)
- Optimal win bonus: +25 credits
- Completing main quests (full restore) or side quests (35% restore)
- `Azure Credit Voucher` items (+50)
- FinOps Emblem passive: +10% after each battle

---

> *"Don't touch it. Don't move it."* — Terraform State, Key Items
