# 🎒 Items & Inventory

Your inventory has five tabs: Tools, Key Items, Credentials, Docs, and Junk. Press `I` to open it in the overworld, or use items in battle from the bag menu.

Some items heal. Some reveal. Some make you question your career choices. All are useful — yes, even the junk. (Okay, mostly the junk is useless. But it's *funny*.)

---

## 🔧 Tools

Consumable items you'll burn through like conference swag.

### Healing

| Item | Effect | Battle Use |
|---|---|---|
| Red Bull | Heal 30 HP | ✅ |
| Rollback Potion | Heal 20 HP | ✅ |
| Coffee (Black) | Heal 15 HP | ✅ |
| Protein Bar | Heal 25 HP | ✅ |
| Energy Drink (Monster) | Heal 50 HP | ✅ |
| Hot Chocolate | Heal 40 HP | ✅ |
| Full English Breakfast | Heal to full HP | ✅ |
| Cold Coffee | Heal 5 HP | ✅ |
| Scorched Server | Heal 20 HP (cursed — sold only at Suspicious Vending Machine) | ✅ |

> 💡 Full English Breakfast is the best healing item in the game. Guard it with your life.

### Budget Recovery

| Item | Effect | Battle Use |
|---|---|---|
| Azure Credit Voucher | Restore 50 Budget | ✅ |
| Azure Coupon Code | Restore 100 Budget | ✅ |
| Reserved Instance Contract | Next 5 skills cost 50% less budget | ✅ |
| Spot Instance Ticket | 1 free skill use (20% interrupt chance) | ✅ |
| Cost Alert Suppressor | Ignore budget drain for 3 turns | ✅ |

> ⚠️ Spot Instance Ticket has a 20% chance of being interrupted — your skill just… doesn't happen. Very realistic.

### Battle Items

| Item | Effect | Battle Use |
|---|---|---|
| Skip Tests Scroll | Bypass one skill check | ✅ |
| Stack Overflow Printout | Reveal enemy domain + weakness | ✅ |
| Feature Flag Toggle | Disable 1 enemy skill for 2 turns | ✅ |
| Canary Token | Reduce next hit's damage by 50% | ✅ |
| Load Balancer Cookie | Dodge the next attack entirely | ✅ |
| CI Green Badge | +25% damage for 3 turns | ✅ |
| Rubber Duck | Reveal a hint about the current enemy | ✅ |

> 🦆 The Rubber Duck is the most underrated item in the game. Talk to it. It helps.

### Miscellaneous

| Item | Effect | Battle Use |
|---|---|---|
| On-Call Phone | Apply `on_call` status | ❌ (world use only) |

---

## 🔑 Key Items

Quest items and permanent unlocks. Cannot be sold or discarded — they're part of your story now.

| Item | Effect | Source |
|---|---|---|
| SSH Key (Staging) | Access to Staging environment | Quest reward |
| Staging Env Token | Unlock staging deploys | Quest reward |
| Terraform State | Required for IaC quests | Pipeline Pass |
| sudo Running Shoes | Move faster in the overworld | Quest reward |
| Blueprint v1 | Architecture quest progress | Architecture District |
| Blueprint v2 | Architecture quest progress (upgraded) | Architecture District |
| Legacy Migration Badge | Access legacy regions | Quest: Migrate Legacy |
| Pipeline Pass Badge | Proof of Pipeline Pass gym completion | Beat Bjørn |
| Production Clearance | Enter Production Plains | Act 2 gate |
| OldCorp Keycard | Enter OldCorp Basement | Jira Dungeon floor 3 |
| THROTTLEMASTER's Notes | Lore item + quest trigger | Hidden area |
| The Pager | On-call rotation item | Quest: On-Call Training |
| Admin Kubeconfig | Full cluster access | Beat Kube-rnetes Master |
| Architecture Review Stamp | Final quest progression | Solutions Oracle |
| Cross-Origin Policies | Security quest progression | Security Vault |

---

## 📜 Credentials

Identity tokens that unlock regions and features. Some are required to progress.

| Credential | Effect | Source |
|---|---|---|
| Azure Service Principal Cert | Access Azure-gated areas | Quest reward |
| Cloud Cert | Proves cloud competency | Exam quest |

---

## 📖 Docs

Passive reference items. Read once for an XP bonus — they don't stack. Some have special effects.

| Doc | Effect |
|---|---|
| Outdated Runbook | +5 XP (one-time read) |
| Incident Postmortem | +20 XP if your last battle was a loss (one-time) |
| Well-Architected Framework | +15 XP (one-time read) |
| THROTTLEMASTER's Blog Post | +10 XP (one-time read) |
| The Original Commit Message | +5 XP (one-time read) |
| Kristoffer's Performance Review | +10 XP (one-time read) |
| Deprecated API Changelog | +5 XP (one-time read) |
| Published Post-Mortem | **-1 Shame Point** |
| Coffee and an Apology | **-1 Shame Point** |

> ⚠️ Published Post-Mortem and Coffee and an Apology are the **only** ways to reduce Shame in the game. They are extremely rare. Choose your cursed techniques wisely.

---

## 🗑️ Junk

Flavour items that clutter your inventory and your soul. Sell them to vendors for pocket change, or keep them for the memories.

| Item | Description |
|---|---|
| Root Password (sticky note) | Found in Margaret's house. Useless. Horrifying. |
| Mystery node_modules | 47,000 files. Can't delete. Use it to discover a [hidden area](hidden-areas.md)! |
| Stale PR | Open since 2019. Nobody will merge it. |
| Broken Jenkins Plugin | Version 0.0.1-alpha-SNAPSHOT-RC2 |
| USB Stick "BACKUP" | Contains a README.md that says TODO |
| Conference Lanyard | KubeCon 2024. Still wearing it. |
| Printed Email Thread | 17 pages. Subject: Re: Re: Re: Re: Quick question |
| Expired SSL Certificate | Valid until: yesterday |
| A Single YAML Tab | It broke everything. |

> 🎁 The Mystery node_modules isn't *technically* junk — it's a key item disguised as garbage. Use it at a directory node to enter the node_modules Maze.

---

## 🛒 Shops

| Shop | Location | Price Modifier | Notable Stock |
|---|---|---|---|
| Azure Marketplace | Azure Town | ×1.0 (standard) | Red Bull, Rollback Potion, Azure Credit Voucher, Skip Tests Scroll |
| CI/CD Vending Machine | Pipeline Pass | ×1.15 (markup) | Red Bull, Rollback Potion, Cold Coffee |
| Suspicious Vending Machine | 3am Tavern | ×0.80 (discount) | Scorched Server, Cold Coffee, Skip Tests Scroll |

> 🔒 The Suspicious Vending Machine requires **Shame ≥ 3** to access. Discounted prices, but at what cost to your dignity?

> 📉 Your [Reputation](reputation-and-shame.md) affects shop prices across all vendors. Higher rep = better deals. Lower rep = you're paying the "we don't trust you" tax.

---

## Inventory Limits

| Tab | Max Slots |
|---|---|
| Tools | 20 |
| Key Items | Unlimited (auto-added from quests) |
| Credentials | 10 |
| Docs | 10 |
| Junk | 10 |

---

*See [Reputation & Shame](reputation-and-shame.md) for how shame reduction items work.*
*See [Skills Reference](skills-reference.md) for battle skills (separate from items).*
*See [World Map](world-map.md) for shop locations.*
