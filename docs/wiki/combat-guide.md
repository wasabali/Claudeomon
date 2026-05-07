# ⚔️ Combat Guide

Everything you need to know about how fights work — from turn phases to SLA timers to the terrifying moment you accidentally type `rm -rf /`.

---

## Battle Types

There are two kinds of encounters:

### 🔴 Incidents
Technical problems that arrive **symptom-first**. You don't know the root cause until you investigate. They have an **SLA timer** — if it expires, you take reputation and budget damage.

Optimal play: use an Observability skill first to reveal the root cause, *then* strike with the matching domain skill. That's the Optimal tier.

### 🔵 Engineer Battles
Named engineers who stand on the path and want to fight. They **telegraph their next move** so you can counter. Win to earn XP, budget, and sometimes a new skill.

---

## The Turn Order

Each turn processes in this order:

1. **Status Tick** — active status effects tick down or apply their effect
2. **Skill Phase** — you use a skill; damage/effects resolve
3. **SLA Tick** — the SLA timer decrements (incidents only)
4. **Enemy Phase** — the opponent acts (engineer battles only)
5. **Turn End** — win/loss conditions checked, XP awarded

Never two phases at once. Never skip phases.

---

## Domain Matchup Cycle

This is the most important thing in the game. Memorise it.

```
Linux → Security → Serverless → Cloud → IaC → Containers → Kubernetes → Linux
  ↑___________________________________________________________|
```

| Domain | Beats | Loses To |
|---|---|---|
| 🐧 Linux | Security | Kubernetes |
| 🔒 Security | Serverless | Linux |
| ⚡ Serverless | Cloud | Security |
| ☁️ Cloud | IaC | Serverless |
| 🏗️ IaC | Containers | Cloud |
| 📦 Containers | Kubernetes | IaC |
| ⛵ Kubernetes | Linux | Containers |
| 👁️ Observability | *(special — no matchup)* | *(special)* |

**Strong matchup:** ×2.0 damage  
**Weak matchup:** ×0.5 damage  
**Neutral:** ×1.0 damage

### Observability: The Support Domain

Observability skills deal **no damage**. Instead, they **reveal** — enemy domain, stats, weaknesses, next moves, or all of the above. Using Observability before attacking is how you achieve Optimal tier.

---

## Solution Quality Tiers

How you win determines what you earn:

| Tier | XP Multiplier | Reputation | Shame | When |
|---|---|---|---|---|
| **Optimal** | ×2 | +++ | 0 | Right domain, diagnosed first (used Observability) |
| **Standard** | ×1 | + | 0 | Right domain, no diagnosis |
| **Shortcut** | ×0.5 | − | 0 | Wrong domain but scraped through |
| **Cursed** | ×0.25 | −− | +1 | Used a cursed technique |
| **Nuclear** | ×0 | −−− | +2 | Used a nuclear technique |

**Pro tip:** Optimal wins also trigger some trainers to teach you their signature skill.

---

## SLA Timers

Incidents have an SLA (Service Level Agreement) timer measured in turns. When it hits zero:

- You take a **20 HP penalty**
- You take a **-10 reputation penalty**
- If the incident is still alive, the battle ends as a **loss**

Some skills interact with SLA:
- `PagerDuty acknowledge` — pauses the SLA timer for 2 turns
- `define SLIs` — damage scales with how many turns you've observed

---

## Status Effects

| Status | Effect | Duration |
|---|---|---|
| `throttled` | Only 1 skill every 2 turns | 3 turns |
| `cold_start` | Skip first turn of battle | 1 turn |
| `deprecated` | Skills 50% effectiveness | 4 turns |
| `on_call` | Random encounters after each battle | 5 turns |
| `cost_alert` | Budget drains 2× faster | 3 turns |
| `technical_debt` | Max HP reduced by 2 per stack | Permanent |
| `in_review` | Cannot act for 1–3 turns | Random |
| `shadow_fatigue` | Alters costs and healing (Shadow Engineer passive) | Permanent |

---

## Skill Tiers Explained

| Tier | Description |
|---|---|
| **Optimal** | Best-in-class. Requires domain knowledge but rewards handsomely. |
| **Standard** | Reliable. Gets the job done. No side effects. |
| **Shortcut** | Risky. May backfire or underdeliver. Rep loss. |
| **Cursed** | Dangerous. +1 Shame per use. Side effects persist. ⚠️ |
| **Nuclear** | Career-threatening. +2 Shame. Massive power, massive consequences. ☠️ |

---

## Budget in Battle

Budget is your Azure Credits. Some skills cost budget:

- **Low-cost skills** (0–10 budget): free to spam
- **Mid-cost skills** (15–30 budget): plan ahead
- **High-cost skills** (30–50 budget): use strategically

If budget goes negative:
- At **-100**: `cost_alert` status triggers (budget drains 2× faster)
- At **-200**: Forced quest to manage debt
- At **-300**: Azure subscription suspended — you can only use free skills

---

## Engineer Battle Mechanics

Each gym has a special mechanic:

| Gym | Leader | Mechanic |
|---|---|---|
| Terminal Gym | Tux the Terminal Wizard | Standard |
| Pipeline Dojo | Bjørn the Build Breaker | Build Queue — telegraphs 3 moves |
| Uptime Arena | Captain Nines | SLA Timer — 8 turn limit, -15 rep if breached |
| Sprint Sanctum | Scrum Siri | Kanban Tracker — idle = +5 ATK |
| Container Yard | Docker Dag | Layered Defence — 3 layers to break |
| Cluster Ring | The Kube-rnetes Master | Respawn — comes back 3× at 50% HP |
| Security Vault | Ingrid the IAM Inspector | Auth Challenge — 3 wrong answers = wasted turn |
| Whiteboard Summit | The Solutions Oracle | Review Board — trivia before damage |

---

## Shame: The Permanent Counter

**Shame** never goes down through normal play. It accumulates when you:
- Use cursed techniques (+1 per use)
- Use nuclear techniques (+2 per use)
- Make certain quest choices

High Shame changes the world:
- Trainers comment on your reputation
- The **3am Tavern** opens new areas and trainers at higher Shame levels
- At **Shame 10**, you become a **Shadow Engineer** (see [Reputation & Shame](reputation-and-shame.md))

---

*See also: [Skills Reference](skills-reference.md) | [Reputation & Shame](reputation-and-shame.md)*
