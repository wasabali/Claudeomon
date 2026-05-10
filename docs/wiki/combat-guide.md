# ⚔️ Combat Guide

Everything you need to know about how fights work — from domain matchups to SLA timers to that terrifying moment you accidentally type `rm -rf /` and watch your HP evaporate.

---

## Battle Types

Cloud Quest has two kinds of encounters, and they play very differently.

### 🔴 Incidents

Technical problems that arrive **symptom-first**. You see the smoke before you see the fire. Incidents have a **root cause** hidden behind the symptom, an **SLA timer** counting down, and an **optimal fix** — the skill that solves the problem cleanly.

**Optimal play:** Use an Observability skill (like `read the docs`) to reveal the root cause, *then* strike with the matching domain skill. That earns you Optimal tier — 2× XP and maximum reputation.

### 🔵 Engineer Battles

Named engineers who stand on the path and challenge you to a fight. They **telegraph their next move** so you can counter with the right domain. Win to earn XP, budget, and sometimes a new skill.

Engineer battles don't have SLA timers, but they *do* have trainers with custom decks, signature skills, and some truly devastating move combos.

---

## Domain Matchup Cycle

This is the most important thing in the game. Tattoo it on your forearm if you have to.

```
Linux → Security → Serverless → Cloud → IaC → Containers → Kubernetes → Linux
  ↑___________________________________________________________|
```

Eight domains. Seven of them form a cycle. One is special.

| Domain | Beats | Loses To |
|---|---|---|
| 🐧 Linux | Security | Kubernetes |
| 🔒 Security | Serverless | Linux |
| ⚡ Serverless | Cloud | Security |
| ☁️ Cloud | IaC | Serverless |
| 🏗️ IaC | Containers | Cloud |
| 📦 Containers | Kubernetes | IaC |
| ⛵ Kubernetes | Linux | Containers |
| 👁️ Observability | *(no matchup)* | *(no matchup)* |

- **Strong matchup:** ×2.0 damage
- **Weak matchup:** ×0.5 damage
- **Neutral:** ×1.0 damage

### Observability: The Support Domain

Observability skills deal **no damage** in the traditional sense. Instead, they **reveal** — enemy domain, stats, weaknesses, next moves, or all of the above. Using an Observability skill before attacking is how you achieve Optimal tier. Think of it as doing your homework before the exam.

---

## Solution Quality Tiers

How you win determines what you earn. This isn't a game where brute force is always the answer.

| Tier | XP Multiplier | Reputation | Shame | When |
|---|---|---|---|---|
| **Optimal** | ×2 | +++ | 0 | Right domain, diagnosed first (used Observability) |
| **Standard** | ×1 | + | 0 | Right domain, no diagnosis |
| **Shortcut** | ×0.5 | − | 0 | Wrong domain but scraped through |
| **Cursed** | ×0.25 | −− | +1 | Used a cursed technique |
| **Nuclear** | ×0 | −−− | +2 | Used a nuclear technique |

**Pro tip:** At reputation ≥ 80 (Senior Engineer or above), trainers teach their signature skill on *any* win — not just Optimal. Being good at your job has perks.

---

## Phase-Based Turn System

Each battle turn processes in strict phase order. No phase is ever skipped. No two phases fire at once.

| Phase | What Happens |
|---|---|
| 1. **Status Tick** | Active status effects tick down or apply their per-turn effect |
| 2. **Skill Phase** | You use a skill; damage and effects resolve |
| 3. **SLA Tick** | The SLA timer decrements by 1 (incidents only) |
| 4. **Enemy Phase** | The opponent acts (engineer battles only) |
| 5. **Turn End** | Win/loss conditions checked, XP awarded if battle ends |

This phase system means status effects always resolve *before* your skill, and the SLA always ticks *after* your action. Plan accordingly.

---

## SLA Timers

Incidents come with an SLA (Service Level Agreement) — a countdown measured in turns. When it hits zero:

- You take an **HP penalty**
- You take a **reputation penalty**
- The battle outcome suffers

Some gym mechanics amplify SLA pressure. The 3am Incident Response gym, for example, runs a 6-turn SLA with a 30 HP and 15 reputation penalty on breach.

**Strategy:** Don't waste turns. Use Observability to reveal the root cause early, then hit with the optimal fix. If you're stalling, you're losing.

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
| `shadow_fatigue` | Shadow Engineer passive — alters costs and healing | Permanent |

`technical_debt` stacks and never goes away naturally. `shadow_fatigue` is applied at Shame ≥ 10 and fundamentally changes your economy. See [Reputation & Shame](reputation-and-shame.md) for details.

---

## Budget (Economy)

Budget is measured in **Azure Credits** — the single currency of Cloud Quest.

| Stat | Value |
|---|---|
| Starting budget | 500 |
| Budget per level | +25 |
| Win restore | 15% of max |
| Lose restore | 5% of max |
| Optimal win bonus | +25 flat |

Some skills cost budget to use. Free skills (0 cost) are always available. Higher-tier skills tend to cost more but deal more damage or have stronger effects.

### Budget Debt

Budget can go **negative**. When it does:

| Threshold | What Happens |
|---|---|
| -100 | `cost_alert` status triggers — budget drains 2× faster |
| -200 | Forced quest to manage debt |
| -300 | Azure subscription suspended — only free skills available |

Don't let it get that bad. The FinOps Emblem (+10% budget restored after each battle) helps if you have it.

---

## Gym Mechanics

Each of the 8 gyms has a unique battle mechanic that changes how the fight works. Knowing the mechanic before you walk in is half the battle.

| # | Gym | Domain | Leader | Mechanic | How It Works |
|---|---|---|---|---|---|
| 1 | The Legacy Terminal | Linux | Tux the Terminal Wizard | `legacy_only` | Blocks Cloud and Serverless skills — Linux or bust |
| 2 | 3am Incident Response | Cloud | Captain Nines | `sla_timer` | 6-turn SLA; breach costs 30 HP and 15 reputation |
| 3 | The Broken Pipeline | IaC | Bjørn the Build Breaker | `flaky_pipeline` | 30% chance any skill simply fails (40% on replay) |
| 4 | Cold Start Gauntlet | Serverless | Fatima the Function Witch | `cold_start` | You skip your first turn entirely |
| 5 | Pod Crasher | Kubernetes | The Kube-rnetes Master | `respawn` | Leader respawns 3 times at 50% HP |
| 6 | Entra Misconfiguration | Security | Ingrid the IAM Inspector | `rbac_deny` | 25% chance your skill is denied (RBAC check failed) |
| 7 | Azure Bill Spiral | Observability | Oracle Alice | `cost_spiral` | Leader gains +5 HP and +3 attack per turn; spiral threshold at turn 8 |
| 8 | The CTO Office | Cloud | The CTO | `all_domains` | Domain switches every 2 turns; at 25% HP, enters Executive Mode (×1.5 damage) |

**The CTO Office** is the final gym and the hardest fight in the standard game. The CTO switches domains every 2 turns, so you need a balanced deck. When the CTO drops below 25% HP, Executive Mode activates — all attacks deal ×1.5 damage. Bring healing items.

---

## Battle Rewards

Credits earned depend on the encounter type and your solution quality:

### Incident Rewards

| Solution Tier | Credits Earned |
|---|---|
| Optimal | 40 |
| Standard | 25 |
| Shortcut | 15 |
| Cursed | 5 |
| Nuclear | 0 |

### Trainer Battle Rewards

| Outcome | Credits Earned |
|---|---|
| Win | 30 |
| Lose | 0 |

Post-game rematches earn ×1.5 XP on top of the base reward.

---

## Combat Tips

1. **Always observe first.** One turn spent on `read the docs` can turn a Standard win into an Optimal win — doubling your XP.
2. **Check the domain before picking skills.** Strong matchups deal ×2 damage. Weak matchups deal ×0.5. The difference is massive.
3. **Watch your budget.** High-cost skills are powerful but drain your credits fast. Going into debt triggers nasty penalties.
4. **Prepare for gym mechanics.** Each gym changes the rules. Read up before walking in blind.
5. **Don't panic about SLA timers.** They're tight but fair. Efficient play (observe → strike) usually beats the timer.
6. **Cursed techniques are tempting but costly.** +1 Shame is permanent. That power comes with a price that never goes away.

---

*See also: [Skills Reference](skills-reference.md) · [Reputation & Shame](reputation-and-shame.md) · [Emblems](emblems.md)*
