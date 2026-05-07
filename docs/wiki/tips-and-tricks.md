# 💡 Tips & Tricks

Practical advice for new and returning Cloud Quest players.

---

## 🗺️ Domain Matchup Cheatsheet

The cycle: **Linux → Security → Serverless → Cloud → IaC → Containers → Kubernetes → Linux**

| Your Skill Domain | Hits Hard Against | Weak Against |
|---|---|---|
| Linux | Security (×2) | Kubernetes (×0.5) |
| Security | Serverless (×2) | Linux (×0.5) |
| Serverless | Cloud (×2) | Security (×0.5) |
| Cloud | IaC (×2) | Serverless (×0.5) |
| IaC | Containers (×2) | Cloud (×0.5) |
| Containers | Kubernetes (×2) | IaC (×0.5) |
| Kubernetes | Linux (×2) | Containers (×0.5) |
| Observability | No damage | Not weak (immune cycle) |

**Tip:** Use `read the docs` or `grep "ERROR" /var/log/*` first to reveal the enemy's domain before committing to a skill.

---

## ⚔️ Combat Strategy

### Always diagnose first against unknown enemies
Incidents don't show their domain until you use an Observability skill. One turn invested in `az monitor alert create` or `read the docs` can mean the difference between a ×2 hit and a ×0.5 one.

### Optimal solution vs. speed
- **Diagnosed + correct domain** = Optimal tier (×2 XP, +3 rep). Worth it for important battles.
- **Rushing straight to damage** = Standard tier (×1 XP, +1 rep). Fine for grinding.

### Watch the SLA timer
Incidents start with SLA timers (3–6 turns). Each turn over the limit adds +20-80% bonus enemy damage. `PagerDuty acknowledge` buys 2 extra turns. Don't ignore the clock.

### Keep at least one heal in your active deck
`systemctl restart` (20 HP), `disaster_recovery` (full heal after 2 turns), and `Energy Drink` items are your lifelines. Gym leaders hit hard in Acts 2–3.

---

## 💰 Budget Management

- Starting budget: 500
- Budget regenerates slowly (5/turn base) — or 10/turn with Cloud Emblem in cloud battles
- **Budget at 0:** You can't use skills with a budget cost. Some optimal skills require budget.
- **Budget under 50:** `cost_alert` status may trigger, causing skill costs to increase by 10% for 3 turns
- **Save expensive skills** for gym leaders, not random encounters

### Budget tips
- `docker system prune -a` restores 10 budget in addition to healing
- `Cold Brew` item adds +20 budget for one battle — use before gym leaders
- `az vm deallocate` stuns enemies without spending budget
- The FinOps Emblem adds +100 to your budget ceiling permanently

---

## 📈 Progression Tips

### Act 1 Priority
1. Grab the Tux Emblem (Tutorial Gym)
2. Complete Old Margaret's bakery quest — unlocks `az webapp restart`
3. Beat Bjørn (Gym 1) — unlocks `az pipelines run` and Pipeline Pass deep area
4. Level to 5 before Pipeline Pass trainers

### Act 2 Priority
1. Use Observability skills before every Production Plains incident — SLA timers are tight here
2. Do DevOps Dave's flaky test quest — free `az devops configure` skill
3. Jira Dungeon has slow battles but high XP — bring DoT skills

### Act 3 Priority
1. Ingrid (Gym 6) is weak to IaC — bring `terraform apply` if you have it
2. The Solutions Oracle (Gym 7) requires diagnosing all 3 of her team before attacking — use Observability
3. Tech Debt Cleanup quest chain (10 parts) unlocks `disaster_recovery`

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

---

## 🧪 Dev Override (if building/modding)

`src/overrides.js` has commented test values for shame level, location, SLA, and starting deck. Never commit uncommented overrides.

---

*See [Combat Guide](combat-guide.md) for the complete mechanics reference.*
