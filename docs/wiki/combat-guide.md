# ⚔️ Combat Guide

Cloud Quest battles are turn-based. Choose the right CLI command for the right situation — wrong domain means half damage, right domain means double. Using cursed techniques earns you Shame. Breaching SLA timers costs you reputation.

---

## Domain Matchup Cycle

```
Linux → Security → Serverless → Cloud → IaC → Containers → Kubernetes → Linux
```

Each domain deals **×2 damage** to the domain it beats, and **×0.5 damage** to the domain that beats it. Neutral matchups deal ×1.

### Full Matchup Table

| Domain | Beats (×2) | Loses To (×0.5) |
|---|---|---|
| Linux | Security | Kubernetes |
| Security | Serverless | Linux |
| Serverless | Cloud | Security |
| Cloud | IaC | Serverless |
| IaC | Containers | Cloud |
| Containers | Kubernetes | IaC |
| Kubernetes | Linux | Containers |
| **Observability** | *(special — see below)* | *(no cycle)* |

---

## Observability: The Support Domain

Observability skills **deal no direct damage**. Instead, they **reveal information** — enemy domain, HP, status effects, upcoming moves. Use them early to diagnose before committing to a strategy.

In Incident battles, using Observability first qualifies your solution for **Optimal** quality (if you then pick the correct domain fix). Skipping diagnosis and fixing correctly still earns Standard. Wrong domain that somehow works: Shortcut.

Observability is especially powerful against **SEV1 at 3am** — the only incident with `null` optimal fix. You *have* to diagnose it first.

---

## Solution Quality Tiers

Your solution quality determines XP multiplier, reputation change, and shame gain:

| Tier | When | XP | Rep | Shame |
|---|---|---|---|---|
| **Optimal** | Correct domain + diagnosed first | ×2 | +++ | 0 |
| **Standard** | Correct domain, no diagnosis | ×1 | + | 0 |
| **Shortcut** | Wrong domain but worked | ×0.5 | − | 0 |
| **Cursed** | Cursed technique used | ×0.25 | −− | +1 |
| **Nuclear** | Nuclear technique used | ×0 | −−− | +2 |

Cursed and Nuclear techniques are marked with `⚠` in battle menus. You'll be warned before using them.

---

## SLA Timers

Incident battles have an SLA (Service Level Agreement) timer — a countdown of turns before a breach. Each turn that ticks down without resolution increases pressure.

**What happens on breach:**
- HP penalty: -30
- Reputation penalty: -15
- (Based on `sla_timer` gym mechanic config)

Some skills interact with SLA timers:
- `PagerDuty acknowledge` — pauses the SLA timer for 2 turns
- Observability skills that reveal the root cause help you pick the right fix faster

Breach thresholds by incident:

| SLA | What it means |
|---|---|
| 5 turns | Comfortable. Diagnose first. |
| 4 turns | Standard pace. Don't dawdle. |
| 3 turns | Tight. Pick your fix quickly. |
| 2 turns | Emergency. Use your best skill immediately. |

---

## Phase Order (Per Turn)

Each turn resolves in this order — phases cannot be reordered or skipped:

1. **StatusTickPhase** — existing status effects tick/expire
2. **SkillPhase** — your selected skill resolves and applies damage/effects
3. **SlaTickPhase** — SLA timer decrements; breach fires if it hits 0
4. **EnemyPhase** — enemy resolves their move (Engineer battles only)
5. **TurnEndPhase** — win/lose conditions checked, XP awarded if applicable

---

## Status Effects

These can be applied to you or enemies during battle:

| Status | Effect | Duration |
|---|---|---|
| Throttled | Only 1 skill every 2 turns | 3 turns |
| Cold Start | Skip first turn of battle | 1 turn |
| Deprecated | Skills at 50% effectiveness | 4 turns |
| On Call | Random encounters after each battle | 5 turns |
| Cost Alert | Budget drains 2× faster | 3 turns |
| Technical Debt | Max HP reduced by 2 per stack | Permanent |
| In Review | Cannot act for 1–3 turns | Random |
| Shadow Fatigue | Alters costs and healing (Shadow Engineers only) | Permanent |

---

## Battle Backgrounds by Region

| Region | Arena Style |
|---|---|
| Localhost Town | Plains |
| Pipeline Pass | Construction |
| Jira Dungeon | Cave |
| Production Plains | Factory |
| Kubernetes Colosseum | Stadium |
| Three AM Tavern | Abyss |
| Server Graveyard | Ruins |
| Node_modules Maze | Forest |
| /dev/null Void | Space |
| Deprecated Azure Region | Wasteland |

---

## Engineer Battle Special Rules

Named engineers (gym leaders, field trainers) always **telegraph their next move** before executing it. Use this to switch to the right defensive domain or counter-attack accordingly.

Gym leaders have unique **battle mechanics** that change the rules:

| Mechanic | Effect |
|---|---|
| `sla_timer` | Turn limit with rep penalty on breach |
| `respawn` | Enemy respawns up to 3 times at 50% HP |
| `flaky_pipeline` | 30% chance skills fail; 40% on replay |
| `layered_defence` | 3 defence layers to punch through |
| `review_board` | Must answer architecture trivia before dealing damage |
| `rbac_deny` | 25% chance skills are blocked by permissions |
| `cost_spiral` | Enemy gains HP and attack every turn |
| `legacy_only` | Cloud and Serverless skills blocked |
| `all_domains` | Enemy cycles through every domain; goes into Executive Mode at 25% HP |
| `kanban_tracker` | Enemy gains attack bonus if you idle |

---

> *"No SIGTERM. No negotiation. Just execution."* — `kill -9`

See [Skills Reference](skills-reference.md) for the full skill list or [Trainers](trainers.md) for gym leader details.
