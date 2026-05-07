# 🚀 Getting Started

Welcome to Cloud Quest. You start with no idea what you're doing — which is accurate to the profession.

---

## Controls

| Button | Action |
|---|---|
| Arrow Keys / D-Pad | Move in the overworld |
| Z / A | Confirm / Interact |
| X / B | Cancel / Back |
| Hold Z while moving | Run (2× speed — requires `sudo Running Shoes`) |
| Enter | Open menu |
| Start / Escape | Pause |

In battle, you navigate menus with arrow keys and confirm with Z.

---

## Your First Steps

You wake up in **Localhost Town** with three things: a laptop, a starter deck of skills, and a vague anxiety about production.

### Starter Deck

You begin with these skills:

| Skill | Domain | Effect |
|---|---|---|
| `az webapp deploy` | Cloud | 30 damage |
| `kubectl rollout restart` | Kubernetes | Remove all enemy buffs |
| `blame DNS` | Linux | Confuse (50% chance, affects self too) |
| `read the docs` | Observability | Reveals enemy weaknesses |

They're not the greatest skills in the world, but they'll get you through Act 1.

---

## Tutorial: Old Margaret's Bakery

Your first quest comes from **Old Margaret** in Localhost Town. Her bakery website keeps going down. She will teach you the basics of the battle system, quest choices, and solution quality tiers.

**Key lesson:** How you solve problems matters. Using the *right* skill earns more XP and reputation. Using a nuclear technique will earn you shame and a very disappointed Margaret.

See [Quests](quests.md) for the full quest breakdown.

---

## Your First Gym: Terminal Gym

The **Terminal Gym** is inside Localhost Town. Talk to the trainers outside to get a feel for battle before challenging the gym leader.

**Gym Leader:** Tux the Terminal Wizard (Linux, 80 HP, Difficulty 2)

Win to earn the **Tux Emblem** and progress to Pipeline Pass.

---

## The Battle Basics

When you encounter an incident or engineer:

1. **Check the domain.** Use the [Combat Guide](combat-guide.md) matchup cycle to pick a favourable skill.
2. **Observe first.** Observability skills like `read the docs` reveal weaknesses — use them early.
3. **Watch the SLA timer.** Incidents have an SLA countdown. If it hits zero, you take a reputation hit and budget damage.
4. **Win optimally.** Diagnosing the problem first (using an observability skill) before dealing damage earns Optimal tier XP — 2× the reward.

---

## Budget: Your Second HP Bar

Every player starts with **500 budget** (Azure Credits). Some skills cost budget to use. Running out of budget doesn't end battles, but it forces you to use only free skills.

Budget restores partially after each battle. You can also find items and quests that top it up.

---

## Saving the Game

Use an **Azure Terminal** (fast travel point, found in most regions) to save your progress. The save file exports as a `.cloudquest` file — keep it somewhere safe.

---

## Progression Path

```
Localhost Town → Pipeline Pass → Jira Dungeon (Act 1 boss)
              ↓                  
         Azure Town → Production Plains → Kubernetes Colosseum
                    ↓
              3am Tavern (Act 2 hub, danger zone)
```

Full world details: [World Map](world-map.md)

---

## Quick Tips for New Players

- **Talk to everyone.** NPCs drop hints, sell items, and sometimes teach skills.
- **Lose on purpose sometimes.** The `Incident Postmortem` item gives 20 XP when read after a loss.
- **Don't skip the tutorials.** Professor Pedersen in Localhost Town explains mechanics clearly.
- **The domain cycle is everything.** Learn `Linux → Security → Serverless → Cloud → IaC → Containers → Kubernetes → Linux` and you'll always know your advantage.
- **Save often.** The Azure Terminals are there for a reason.

---

*Next: [Combat Guide](combat-guide.md)*
