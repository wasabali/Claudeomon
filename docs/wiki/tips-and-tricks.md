# 💡 Tips & Tricks

Practical advice for new and returning Cloud Quest players. Whether you're a fresh intern or a Distinguished Engineer doing a cursed-only run, there's something here for you.

---

## 🗺️ Domain Matchup Cheatsheet

The cycle: **Linux → Security → Serverless → Cloud → IaC → Containers → Kubernetes → Linux**

| Your Skill Domain | Hits Hard Against (×2) | Weak Against (×0.5) |
|---|---|---|
| 🐧 Linux | Security | Kubernetes |
| 🔒 Security | Serverless | Linux |
| ⚡ Serverless | Cloud | Security |
| ☁️ Cloud | IaC | Serverless |
| 🏗️ IaC | Containers | Cloud |
| 📦 Containers | Kubernetes | IaC |
| ⎈ Kubernetes | Linux | Containers |
| 🔭 Observability | *(no damage cycle)* | *(not weak to anything)* |

Observability skills don't deal damage — they **reveal the enemy's domain and root cause**, which is how you get Optimal tier solutions.

**Tip:** Use `read the docs` or `grep "ERROR" /var/log/*` first to reveal the enemy's domain before committing to a skill.

---

## ⚔️ Combat Strategy

### Always diagnose first against incidents
Incidents don't show their domain until you use an Observability skill. One turn invested in `az monitor alert create` or `read the docs` can mean the difference between a ×2 hit and a ×0.5 one. Diagnosed + correct domain = **Optimal tier** (×2 XP, maximum reputation).

### Know the solution quality tiers

| Tier | XP Multiplier | Rep Change | Shame | How to Get It |
|---|---|---|---|---|
| Optimal | ×2 | +++ | 0 | Diagnose first, then use correct domain skill |
| Standard | ×1 | + | 0 | Correct domain, no diagnosis |
| Shortcut | ×0.5 | − | 0 | Wrong domain but it still worked |
| Cursed | ×0.25 | −− | +1 | Used a cursed technique |
| Nuclear | ×0 | −−− | +2 | Used a nuclear technique |

### Watch the SLA timer
Incidents start with SLA timers (typically 3–5 turns). When the timer hits 0, you take **30 HP damage** and **-15 reputation** — and if the incident is still alive, you **lose**. `PagerDuty acknowledge` buys 2 extra turns. Don't ignore the clock.

### Build a balanced deck
You can carry a maximum of **6 active skills**. Aim for:
- At least 2 different domains for matchup coverage
- 1 Observability skill for diagnosis
- 1 heal or utility skill
- Your strongest damage dealer for emergencies

### Domain matchup gives ×2 damage — ALWAYS try to match
This is the single biggest damage multiplier in the game. A 30-damage skill hitting a weak domain does 60 damage. The same skill against a strong domain does 15. That's a 4× swing. Match your domains.

---

## 🏛️ Gym-Specific Tips

| Gym | Leader | Mechanic | Strategy |
|---|---|---|---|
| Legacy Terminal | Tux the Terminal Wizard | Cloud and Serverless skills **blocked** | Bring Linux and IaC skills. Your `az webapp deploy` won't work here. |
| 3am Incident Response | Ingrid Incident Commander | **SLA timer: 6 turns**, breach costs 30 HP and 15 rep | Use `PagerDuty acknowledge` early. Fast, high-damage skills. Don't waste turns. |
| Broken Pipeline | Bjørn the Build Breaker | **30% chance** any skill fails (40% on replay) | Bring reliable, repeatable damage. Don't depend on one big skill. |
| Cold Start Gauntlet | Freja the Function Queen | Skip first turn (cold start status) | Your first turn is wasted — plan accordingly. Open with a buff or diagnosis. |
| Pod Crasher | Kube Master Konrad | Respawns **3 times** at 50% HP | Conserve resources. 4 total health bars to burn through. Don't blow your budget early. |
| Entra Misconfiguration | Sigrun the Security Auditor | **25% chance** skills are denied (RBAC) | Bring extra skills. If one gets denied, you need a backup. |
| Azure Bill Spiral | Fadi the FinOps Boss | HP grows **+5/turn**, attack grows **+3/turn**. Spirals at turn 8. | End it fast. Every turn the fight gets harder. Front-load your damage. |
| CTO Office | Einar the CTO | Domain switches **every 2 turns**. Executive mode at 25% HP (×1.5 damage). | Keep versatile skills across multiple domains. Don't over-invest in one domain. |

---

## 💰 Economy Tips

### Budget Basics
- **Starting budget:** 500 Azure Credits
- **Per-level bonus:** +25 credits per level-up
- **Optimal win bonus:** +25 credits (on top of regular rewards)
- **Battle rewards (incidents):** Optimal 40, Standard 25, Shortcut 15, Cursed 5, Nuclear 0
- **Battle rewards (trainers):** Win 30, Lose 0

### Reputation Affects Prices

| Rep Level | Status | Shop Price Modifier |
|---|---|---|
| ≥ 90 | Distinguished Engineer | −20% discount |
| ≥ 80 | Senior Engineer | −10% discount |
| 40–79 | Competent / Adequate | Base price |
| 20–39 | Liability | +20% surcharge |
| < 20 | Walking Incident or worse | +50% surcharge |

### Budget Debt — Danger Zone

| Budget Level | Consequence |
|---|---|
| Below −100 | `cost_alert` status — budget drains 2× faster |
| Below −200 | Payment quest triggered — forced to clear debt |
| Below −300 | **Azure subscription suspended** — special encounter, game over if you lose |

### Shopping Tips
- `Azure Credit Voucher` restores 50 budget — use before gym leaders
- `Azure Coupon Code` restores 100 budget — save for emergencies
- `Reserved Instance Contract` makes the next 5 skills 50% cheaper
- The FinOps Emblem adds +10% to budget restored after each battle
- At Rep ≥ 80 (Senior Engineer), trainers teach their signature skill on **any** win, not just Optimal

---

## 📈 Progression Tips

### Act 1 Priority
1. Grab the Tux Emblem (Tutorial Gym)
2. Complete Old Margaret's bakery quest — the Optimal path (diagnose + deploy) gives ×2 XP and +10 rep
3. Beat Bjørn (Gym 1) — unlocks `az pipelines run` and Pipeline Pass deep area
4. Level to 5 before Pipeline Pass trainers

### Act 2 Priority
1. Use Observability skills before every Production Plains incident — SLA timers are tight here
2. Do DevOps Dave's flaky test quest — free `skip_tests_scroll` item on Optimal
3. Jira Dungeon has slow battles but high XP — bring DoT skills

### Act 3 Priority
1. Ingrid (Gym 6) is weak to IaC — bring `terraform apply` if you have it
2. The Solutions Oracle (Gym 7) requires diagnosing all 3 of her team before attacking — use Observability
3. Tech Debt Cleanup quest chain (10 parts) — completing all 10 earns the `disaster_recovery` skill

---

## 🐛 Getting Unstuck

| Problem | Solution |
|---|---|
| Can't enter a region | Check credential requirements (I → Credentials tab) |
| Budget keeps draining | Look for `cost_alert` or `technical_debt` status; use `Technical Debt Voucher` item |
| Losing to gym leaders | Stack Optimal solutions in random battles to grind XP first |
| SLA timer always breaching | Bring `PagerDuty acknowledge` or `Backup Script` — give yourself margin |
| Status effects won't clear | `vault kv rotate` clears all debuffs; `Rubber Duck` clears the `blocked` status |
| Can't find a specific trainer | Check [Trainers](trainers.md) page — some are Shame-gated or hidden |

---

## 🥚 Easter Eggs & Hidden Things

- There's a `blame DNS` skill in your starter deck. It always has a 50% chance to confuse. It's *always* DNS.
- The `open a ticket` skill freezes battle for a full turn. The ticket is never resolved.
- The CTO's `migrate to SharePoint` skill actually works. Nobody knows why.
- Completing the entire Tech Debt Cleanup quest chain (all 10 parts) triggers a special dialogue from the Architecture District NPCs.
- If you use `rm -rf /` on Tux the Terminal Wizard, he respawns. He's seen things.
- Grime per shame point doubles after Shame 10 (from 5% to 10% per shame point). Your emblems will get dirty *fast*.

---

<details>
<summary>😈 Evil Path Tips — SPOILERS</summary>

### The Cursed Technique Advantage

Cursed techniques **bypass domain matchups** — they deal full damage regardless of the enemy's domain. This makes them extremely powerful for speed-running but costs you dearly in Shame and Reputation.

### Shame Milestones

| Shame | Title | What Unlocks |
|---|---|---|
| 1 | It Was Like That When I Got Here | Pedersen sighs. Cursed location markers become visible. |
| 3 | Cowboy Coder | NPC one-liners about your reputation. Suspicious Vending Machine accessible. |
| 5 | The Shortcutter | Full 3am Tavern cursed network active. |
| 7 | Person of Interest | THROTTLEMASTER makes contact. |
| 10 | Shadow Engineer | **Auto-learn `EXEC xp_cmdshell`**. Optimal skills cost +10 budget. Cursed skills cost −5 budget. Healing items restore 20% less. Grime per shame **doubles** (5% → 10%). This is the point of no return. |
| 15 | The Other Principal | Secret ending accessible: **Fork the Company**. |

### Shadow Engineer Penalties (Shame ≥ 10)

Once you hit Shadow Engineer, the game actively punishes you:
- Optimal-tier skills cost **+10 extra budget** (surcharge)
- Cursed-tier skills cost **−5 budget** (discount — the game is encouraging your worst impulses)
- Healing items restore **20% less** HP
- Grime accumulation doubles on all emblems
- You auto-learn `EXEC xp_cmdshell` if you don't have it already
- Gym leaders at Shame ≥ 10 **refuse to teach** their signature skill

### The Outcast Network Clue Chain

Each hidden NPC gives a clue to the next hidden area. Follow the chain: Server Graveyard → node_modules Maze → /dev/null Void → 3am Tavern → OldCorp Basement.

See [Hidden Areas](hidden-areas.md) for the full clue chain.

### Endings

- **Shame 10–14 + CTO defeated:** Shadow Post-Mortem ending
- **Shame ≥ 15 + THROTTLEMASTER recruitment accepted:** Fork the Company ending

Both require specific story flags. You can't just shame-stack — you have to actually play the story.

</details>

---

## 🧪 Dev Override (if building/modding)

`src/overrides.js` has commented test values for shame level, location, SLA, and starting deck. Never commit uncommented overrides.

---

*See [Combat Guide](combat-guide.md) for the complete mechanics reference.*
*See [Encounters](encounters.md) for full encounter stats by region.*
*See [Skills Reference](skills-reference.md) for every skill in the game.*
