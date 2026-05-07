# 🚀 Getting Started

Welcome to Cloud Quest! You're a junior cloud engineer in Localhost Town, armed with a starter deck of CLI commands and a dream of one day reaching Principal Engineer. The road is paved with 503 errors and passive-aggressive YAML.

---

## Your Starter Deck

You begin with these skills equipped:

| Skill | Domain | Effect |
|---|---|---|
| `az webapp deploy` | Cloud | 30 damage — bread-and-butter deployment |
| `kubectl rollout restart` | Kubernetes | Removes all enemy buffs |
| `blame DNS` | Linux | 50% chance to confuse *everyone* (including yourself) |
| `read the docs` | Observability | Reveals enemy weaknesses |
| `feature flag` | Cloud | Hides one enemy skill for 2 turns |

You can hold up to **6 active skills** at a time. Swap them in your inventory as you learn new ones.

---

## Your First Quest: Margaret's Website

**NPC:** Old Margaret, Localhost Town  
**Goal:** Fix Margaret's bakery website, which keeps going down.

The quest has multiple solution tiers — the better your fix, the better the reward:

| Solution | Tier | Reward |
|---|---|---|
| Use `az monitor logs` + `az webapp deploy` | Optimal | ×2 XP, +10 rep, Incident Postmortem item |
| Use `az webapp restart` | Standard | ×1 XP, +3 rep, Cold Coffee |
| Use `az webapp stop` | Shortcut | ×0.5 XP, -5 rep, nothing |
| Use `rm -rf /` on her server | Nuclear | ×0 XP, -30 rep, +2 shame, Scorched Server |

Aim for Optimal on your first run. The follow-up rewards are worth it.

**Base reward:** 50 XP + 1× Azure Credit Voucher

---

## The Basics

### Battles

There are two kinds of battles:

- **Incidents** — technical problems with a visible *symptom* but hidden root cause. An SLA timer ticks down each turn. Diagnose fast, fix correctly.
- **Engineer Battles** — PvP against named engineers. They telegraph their next move. Use domain matchups to counter.

### Budget

Budget is Azure Credits — your in-game currency. Some skills cost budget to use. Running out of budget is bad. Very bad. Starting budget: **500 Credits**.

You earn credits by:
- Winning incident battles (Optimal: 40, Standard: 25, Shortcut: 15, Cursed: 5, Nuclear: 0)
- Winning trainer battles: 30 credits
- Completing quests
- Using `Azure Credit Voucher` items

### Levelling Up

Defeat enemies and complete quests to earn XP. Your solution quality multiplies XP:

| Quality | XP Multiplier |
|---|---|
| Optimal | ×2 |
| Standard | ×1 |
| Shortcut | ×0.5 |
| Cursed | ×0.25 |
| Nuclear | ×0 |

### Learning New Skills

Win engineer battles at **Optimal quality** to learn their signature skill. Some skills are locked behind quests or hidden areas. See [Skills Reference](skills-reference.md) for the full list.

---

## Where to Go Next

Start with **Localhost Town** — it has no random encounters (encounter rate: 0%), so you can explore safely. Then head to **Pipeline Pass** to start Gym 1 with Bjørn the Build Breaker.

See the [World Map](world-map.md) for the full region overview.

---

> *"Have you tried restarting it?"* — `systemctl restart`, learned from Ola the Ops Guy
