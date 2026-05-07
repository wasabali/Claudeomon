# 💡 Tips & Tricks

Practical advice for surviving Cloud Quest — from your first `az webapp deploy` to your last `helm upgrade`.

---

## Early Game

**Always diagnose before attacking.**  
Use `grep "ERROR" /var/log/*` or another Observability skill on the first turn against any incident you haven't seen before. Dealing ×2 damage (strong matchup) is better than swinging blind with the wrong domain.

**Learn the domain cycle.**  
Linux → Security → Serverless → Cloud → IaC → Containers → Kubernetes → Linux. Tattoo it on your brain. One lap around the table and you're golden.

**Don't let the SLA timer hit zero.**  
SLA breach deals a big Reputation penalty on top of any HP loss. If you can't one-shot an incident, use your fastest high-damage skill rather than a perfect-but-slow one.

**Keep `az webapp deploy` in your active deck.**  
Cloud is one of the most common encounter domains in the early game. A 30-damage Cloud skill is your bread and butter.

---

## Combat

**Optimal > Standard > Shortcut.**  
Optimal gives ×2 XP and maximum Reputation gain. If you can identify the domain first, always use the matching domain — even if the damage number is slightly lower than a mismatched skill.

**Budget matters.**  
Every skill use costs budget. Cursed skills are cheaper but cost Shame. Keep an eye on your budget bar — running out mid-battle means your last few turns are free skills only.

**Status effects are real.**  
`tech_debt_active` reduces all your skill damage by 25%. `on_call` drains HP each turn. Clear status conditions before they compound.

**Boss incidents telegraph their next move.**  
Watch the top-right corner of the battle screen during boss turns — the message tells you what they'll do next turn. Plan accordingly.

---

## Exploration

**Talk to every NPC twice.**  
Most NPCs have a second dialog on the second interaction. Vendors may reveal a discount, NPCs may hint at hidden areas.

**Encounter cooldown is 4 steps.**  
After a random encounter you get 4 free steps. Use them to reach the next safe zone or town.

**The Jira Dungeon is slow but worth it.**  
Its Rare encounters include Scope Creep and Infinite Sprint — beating them gives above-average XP and unique items.

---

## Progression

**Defeat Gym Leaders in order.**  
Each emblem's passive bonus makes the next region easier. The intended order is: Rex → Cipher → Evie → CloudChad → TerraMax → Dock → Kube → Dashia.

**Learn cursed skills from the Outcast Network only if you accept the consequences.**  
Each use adds Shame. Once you hit Shadow Engineer (Shame 10), several costs change permanently.

**Save often.**  
The `.cloudquest` save format is portable — you can export it and import on any device. Use `git commit` as the metaphor: commit before risky encounters.

---

## Resource Management

**Budget resets partially after each battle.**  
Win = 15% budget restored. Lose = 5% restored. Optimal win bonus = +25 credits. Keeping your Reputation above 80 unlocks the Senior Engineer shop discount (−10%), which compounds over time.

**Healing items are limited.**  
`stack_overflow_thread` (heal 25 HP) is common but `post_mortem_doc` (heal 50 HP) is rare. Don't burn post-mortems on anything less than a boss fight.

**Budget Injections are finite.**  
You get a fixed number of `budget_injection` items per act. Hoard them for boss battles.

---

## Secrets

- Something special happens between 2:57am and 3:05am real-world time.
- NPCs who say "don't do this" sometimes mean exactly the opposite.
- The Rubber Duck item gives a context-sensitive hint when used from the overworld.
- Losing to the same incident five times in a row changes its dialog.

---

See [Combat Guide](combat-guide.md) for detailed mechanics and [Hidden Areas](hidden-areas.md) for spoilers.
