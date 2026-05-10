# 🚀 Getting Started

Welcome to **Cloud Quest** — a browser-based RPG where you play as a junior cloud engineer stumbling your way to Principal Engineer, one `kubectl` command at a time. No downloads, no backend, no excuses. It runs entirely in your browser using Phaser 3 and a dream.

If you've ever deployed to production on a Friday, this game was made for you.

---

## What Is Cloud Quest?

Cloud Quest is a GameBoy Color-style RPG built with Phaser 3. You battle incidents, fight other engineers, and collect real CLI commands as skills. It's funny, educational, and deeply satirical of the cloud engineering industry.

- **Zero backend** — fully stateless, runs in any browser
- **Real commands** — your attacks are actual cloud CLI commands
- **Consequences matter** — how you solve problems affects your reputation, shame, and the entire game world

---

## Controls

| Button | Action |
|---|---|
| Arrow Keys | Move in the overworld |
| Z / Enter | Confirm / Interact |
| X / Backspace | Cancel / Back |
| Hold Z while moving | Run (faster movement) |

In battle, navigate skill menus with arrow keys and confirm with Z or Enter.

---

## Your First Steps in Localhost Town

You wake up in **Localhost Town** — the localhost of all localhosts — with nothing but a laptop, a starter deck of skills, and a vague anxiety about production environments.

### Meeting the Locals

- **Professor Pedersen** — Your mentor. He'll walk you through the basics of battles, domains, and why you should never hardcode secrets. Listen to him. He sighs a lot, but he means well.
- **Old Margaret** — A retired sysadmin turned baker. Her bakery website keeps going down, and guess who gets to fix it? That's right. You.

### Your Starter Deck

You begin the game with four skills across different domains:

| Skill | Domain | Tier | Effect | Description |
|---|---|---|---|---|
| `az webapp deploy` | Cloud | Standard | 30 damage | Push to Azure App Service. Pray the connection string is right. |
| `kubectl rollout restart` | Kubernetes | Standard | Remove all enemy buffs | The Kubernetes equivalent of turning it off and on again. |
| `read the docs` | Observability | Standard | Reveals enemy weaknesses | The bravest move in engineering. Actually read the documentation. |
| `blame DNS` | Linux | Shortcut | 50% chance to confuse (affects self too) | It's always DNS. Confuse everyone, including yourself, half the time. |

They're not the greatest skills in the world — `blame DNS` will literally confuse *you* half the time — but they'll get you through Act 1.

---

## Your First Quest: Margaret's Bakery Website

Old Margaret's bakery website is down (again). This is your tutorial quest, and it teaches you the most important lesson in Cloud Quest: **how you solve a problem matters more than whether you solve it.**

- Use the *right* domain skill? You get Optimal tier rewards — 2× XP.
- Throw a shortcut at it? It works, but your reputation takes a hit.
- Use a nuclear technique? Margaret will be... disappointed. And you'll earn Shame. Permanently.

See [Quests](quests.md) for the full quest breakdown.

---

## Your First Gym: The Legacy Terminal

The **Legacy Terminal** is Localhost Town's gym, and it's your first real challenge. Before charging in, talk to the trainers loitering outside — they'll give you practice battles and hints.

| | Details |
|---|---|
| **Gym Name** | The Legacy Terminal |
| **Domain** | Linux |
| **Leader** | Tux the Terminal Wizard |
| **Mechanic** | `legacy_only` — blocks Cloud and Serverless skills |
| **Required Badges** | 0 |
| **Reward** | 🐧 Tux Emblem (Linux skills +5% effectiveness) |

**Strategy tip:** You can't use `az webapp deploy` here — the gym blocks Cloud domain skills. Lean on your Linux skills and use `read the docs` to scout the leader's weaknesses before striking.

Win to earn the **Tux Emblem** and unlock the path to Pipeline Pass.

---

## Budget: Your Second HP Bar

Every player starts with **500 Azure Credits**. Some skills cost budget to use. You gain +25 budget per level. Running out doesn't end battles, but it forces you to rely on free skills only.

Budget restores partially after each battle — 15% on a win, 5% on a loss. Optimal wins earn a +25 bonus on top.

Be careful: budget can go *negative*. At -100, cost alerts trigger. At -300... well, Azure suspends your subscription. Don't go there.

---

## Progression Path

```
Localhost Town → Pipeline Pass → Jira Dungeon
              ↓
         Production Plains → Kubernetes Colosseum
              ↓
         3am Tavern (danger zone — high Shame required)
```

Full world details: [World Map](world-map.md)

---

## Quick Tips for New Players

1. **Talk to everyone.** NPCs drop hints, sell items, and sometimes teach skills directly.
2. **Observe before you strike.** Using `read the docs` or any Observability skill before attacking earns you Optimal tier — 2× XP and maximum reputation.
3. **Learn the domain cycle.** `Linux → Security → Serverless → Cloud → IaC → Containers → Kubernetes → Linux`. Memorise it. It's the difference between dealing double damage and getting wrecked.
4. **Watch your SLA timer.** Incidents have a countdown. If it hits zero, you lose HP and reputation. Speed matters.
5. **Save often.** The save system exports a `.cloudquest` file. Keep it somewhere safe. There is no cloud save. The irony is intentional.
6. **Don't be afraid to lose.** You still earn some budget back on a loss (5%), and certain items like the Incident Postmortem give XP when read after a defeat.
7. **Shame is permanent.** Think twice before using cursed techniques. That +1 Shame never goes away through normal play.

---

*Ready to fight? Read the [Combat Guide](combat-guide.md) next.*
*Want to explore? Check out the [World Map](world-map.md).*
