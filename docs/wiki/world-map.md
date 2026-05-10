# 🗺️ World Map

Welcome to the Cloud Quest world — a sprawling network of regions, gyms, dungeons, and suspiciously named taverns. Navigate from your Localhost apartment all the way to the Architecture District, battling engineers, solving incidents, and discovering that production is always on fire somewhere.

---

## Progression Overview

```
                        ┌──────────────┐
                        │ Jira Dungeon │
                        │  (3 floors)  │
                        └──────┬───────┘
                               │ north
[Your Apartment]          ┌────┴────────┐         ┌──────────────────┐
      ↓                   │             │  east   │                  │
┌─────────────┐   east    │  Pipeline   │────────→│ Production       │
│  Localhost   │─────────→│  Pass       │         │ Plains           │
│  Town       │           │             │         │                  │
└──────┬──────┘           └─────────────┘         └────────┬─────────┘
       │ south                                             │ south
       ↓                                                   ↓
┌──────────────┐          east           ┌─────────────────────────┐
│  Azure Town  │────────────────────────→│ Kubernetes Colosseum    │
│              │                         │                         │
└──────────────┘                         └─────────────────────────┘
```

Hidden areas branch off from specific trigger points. See [Hidden Areas](hidden-areas.md).

---

## Main Regions

| Region | Domain | Act | Fast Travel | Description |
|---|---|---|---|---|
| 🏠 Localhost Town | — | 1 | ✅ | Starting town and tutorial area. Margaret's bakery, Professor Pedersen's lab, your apartment. Safe zone — no cursed encounters. |
| 🏗️ Pipeline Pass | IaC | 1 | ✅ | The route between Localhost Town and the wider world. Multiple field trainers and the Cold Start Gauntlet gym. Connects north to Jira Dungeon (which houses Bjørn's gym). |
| ☁️ Azure Town | Cloud | 1 | ✅ | Azure-themed hub city. Marketplace, budget tutorials, and Captain Nines' gym. Gateway south from Localhost Town. |
| 🏭 Production Plains | Cloud | 2 | ✅ | Where things get real. SLA pressure ramps up. Multiple gym leaders and field trainers patrol this area. East of Pipeline Pass. |
| ⛵ Kubernetes Colosseum | Kubernetes | 2 | ✅ | The arena district. K8s battles, Helm Repository access, and the fearsome Kube-rnetes Master. South of Production Plains, east of Azure Town. |
| 🌙 3am Tavern | — | 2 | ❌ | *A door appears in Localhost Town when Shame ≥ 1.* Cursed trainers only. No fast travel — you walk here in shame. |

---

## 🏆 Gyms

Eight gyms, eight domains, eight gym leaders who will make you regret not reading the docs.

| Gym | Domain | Region | Gym Name | Leader |
|---|---|---|---|---|
| Terminal Gym | Linux | Localhost Town | The Legacy Terminal | Tux the Terminal Wizard |
| Jira Dungeon 1 | IaC | Pipeline Pass | The Broken Pipeline | Bjørn the Build Breaker |
| Production Plains | Cloud | Production Plains | 3am Incident Response | Captain Nines |
| Pipeline Pass | Serverless | Pipeline Pass | Cold Start Gauntlet | Fatima the Function Witch |
| Kubernetes Colosseum | Kubernetes | Kubernetes Colosseum | Pod Crasher | The Kube-rnetes Master |
| Security Vault Gym | Security | Azure Town | Entra Misconfiguration | Ingrid the IAM Inspector |
| Architecture District | Observability | Architecture District | Azure Bill Spiral | The Solutions Oracle |
| Production Plains | Cloud | Production Plains | The CTO Office | The CTO |

> Each gym has sub-leaders guarding inner rooms. Beat them before you face the leader. See [Trainers](trainers.md) for the full roster.

---

## 🏰 Dungeon Rooms

### Jira Dungeon (3 floors) — accessed from Pipeline Pass

| Floor | Name | Domain | Act |
|---|---|---|---|
| 1 | Backlog Cavern | Observability | 1 |
| 2 | Sprint Corridor | IaC | 1 |
| 3 | The Board Room | IaC | 1 |

> 💀 Ignore three warnings on floor 3 to discover the OldCorp Basement entrance. See [Hidden Areas](hidden-areas.md).

### Cloud Console (2 floors) — accessed from Azure Town

| Floor | Name | Domain | Act |
|---|---|---|---|
| 1 | Portal Lobby | Cloud | 2 |
| 2 | Resource Group Chamber | Cloud | 2 |

---

## 🏠 Building Interiors (Localhost Town)

| Building | Notes |
|---|---|
| Margaret's Bakery | Tutorial quest starts here. Old Margaret teaches `az webapp restart`. |
| Professor Pedersen's Lab | Starter Deck selection. Lore dump. |
| Your Apartment | Save point. Where it all begins (and where you'll retreat to). |

---

## 🔗 Region Connections

The world is connected by routes. Some require story progression (Act gates) to unlock.

| From | Direction | To | Gate |
|---|---|---|---|
| Localhost Town | → east | Pipeline Pass | — |
| Localhost Town | ↓ south | Azure Town | — |
| Pipeline Pass | ← west | Localhost Town | — |
| Pipeline Pass | → east | Production Plains | Act 2 |
| Pipeline Pass | ↑ north | Jira Dungeon 1 | — |
| Azure Town | ↑ north | Localhost Town | — |
| Azure Town | → east | Kubernetes Colosseum | Act 2 |
| Production Plains | ← west | Pipeline Pass | — |
| Production Plains | ↓ south | Kubernetes Colosseum | — |
| Kubernetes Colosseum | ↑ north | Production Plains | — |
| Kubernetes Colosseum | ← west | Azure Town | — |

---

## 🔒 Hidden Areas

Five secret zones await the bold, the reckless, and the over-shamed. Each is accessed through special triggers — not normal routes.

| Area | How to Access |
|---|---|
| Server Graveyard | SSH to decommissioned terminal |
| node_modules Maze | Use Mystery node_modules junk item |
| /dev/null Void | Pipe output 3 times in battle |
| Deprecated Azure Region | Select greyed-out region at Azure Terminal |
| OldCorp Basement | Open despite 3 warnings in Jira Dungeon |

For full details on hidden area trainers, encounters, and loot, see [Hidden Areas](hidden-areas.md).

---

## 🛒 Shops

| Shop | Location | Price Mod | Notable Stock |
|---|---|---|---|
| Azure Marketplace | Azure Town | ×1.0 | Red Bull, Rollback Potion, Azure Credit Voucher, Skip Tests Scroll |
| CI/CD Vending Machine | Pipeline Pass | ×1.15 | Red Bull, Rollback Potion, Cold Coffee |
| Suspicious Vending Machine | 3am Tavern | ×0.80 | Scorched Server, Cold Coffee, Skip Tests Scroll (Shame ≥ 3 required) |

> 📉 Your [Reputation](reputation-and-shame.md) affects shop prices. Higher rep = better deals.

---

*See [Trainers](trainers.md) for who you'll fight in each region.*
*See [Encounters](encounters.md) for what you'll stumble into.*
*See [Hidden Areas](hidden-areas.md) for the 5 secret zones.*
