# 🛠️ Skills Reference

Every real CLI command you can learn, organised by domain. If you're looking for the *right* tool for the job, you're in the right place. If you're looking for the *wrong* tool… scroll down to the cursed section. We won't judge. Much.

**Tier Key:**
- 🟢 **Optimal** — Maximum XP, maximum respect. You actually read the docs.
- 🔵 **Standard** — Gets the job done. No one's impressed, but no one's fired.
- 🟡 **Shortcut** — It works but your tech lead is making *that face*.
- 🔴 **Cursed** ⚠️ — You know better. +1 Shame per use.
- ☠️ **Nuclear** — Career-ending. +2 Shame minimum. Worth it? …Maybe.

**Budget cost** shown where applicable (0 = free to cast).

---

## 🐧 Linux (13 skills)

*The foundation. If you can't grep, you can't debug.*

| Skill | Tier | Budget | Effect | Where to Learn |
|---|---|---|---|---|
| `systemctl restart` | 🔵 Standard | 0 | Heal 20 HP | Ola the Ops Guy · Localhost Town |
| `grep "ERROR" /var/log/*` | 🔵 Standard | 0 | Reveal enemy domain | Tux the Terminal Wizard · Shell Cavern |
| `tail -f /var/log/syslog` | 🟢 Optimal | 0 | Reveal enemy's next 2 moves | Tux the Terminal Wizard · Shell Cavern |
| `kill -9` | 🔵 Standard | 0 | 35 damage | Ola the Ops Guy · Localhost Town |
| `awk '{print $NF}'` | 🟢 Optimal | 0 | 50 damage | Quest: Log Stream Fishing · Shell Cavern |
| `mount /dev/sdb1 /mnt` | 🔵 Standard | 0 | Heal 15 HP | NFS Nora · Shell Cavern |
| `crontab -e` | 🔵 Standard | 0 | 10 damage/turn for 4 turns | Ola the Ops Guy · Production Plains |
| `blame DNS` | 🟡 Shortcut | 0 | 50% confuse (affects self too!) | Starter Deck · Localhost Town |
| `open a ticket` | 🟡 Shortcut | 0 | Freeze battle for 1 turn | Any NPC after losing · Localhost Town |
| `:(){ :\|:& };:` | 🔴 Cursed ⚠️ | 0 | 25 damage/turn for 3 turns. +1 Shame | Hidden: Shell Cavern puzzle |
| `rm -rf /` | ☠️ Nuclear | 0 | Wipe ALL statuses (both sides). +2 Shame | rm-rf Rune · 3am Tavern |
| `sudo su -` | 🔴 Cursed ⚠️ | 0 | 40 damage. +1 Shame | sudo su Saga · Shell Cavern |
| `*/1 * * * * ./attack.sh` | 🔴 Cursed ⚠️ | 0 | 60 damage. +1 Shame | Cron Kristina · Shell Cavern |

> 💡 Linux is strong against Security and weak to Kubernetes. See [Combat Guide](combat-guide.md) for the full matchup cycle.

---

## 🔒 Security (13 skills)

*Lock it down or watch it burn.*

| Skill | Tier | Budget | Effect | Where to Learn |
|---|---|---|---|---|
| `chmod 644` | 🔵 Standard | 0 | Cleanse "denied" status | Ingrid IAM · Security Vault |
| `ssh-keygen` | 🔵 Standard | 0 | +10 defence for 2 turns | Ingrid IAM · Security Vault |
| `vault kv rotate` | 🟢 Optimal | 0 | Cleanse all debuffs + 15 defence | Quest: Vault Audit · Security Vault |
| `nmap -sV` | 🔵 Standard | 0 | Reveal all enemy stats | CA Island puzzle · Security Vault |
| `ufw deny incoming` | 🟢 Optimal | 0 | Immune to damage for 2 turns | Quest: Zero Trust · Security Vault |
| `az network nsg rule create` | 🟢 Optimal | 5 | -40% damage for 3 turns | Firewall Frida · Security Vault |
| `certbot renew` | 🔵 Standard | 0 | Heal 15 HP + prevent expiry | CA Island puzzle · Security Vault |
| `az role assignment create` | 🟢 Optimal | 0 | 40 damage | Ingrid IAM · Security Vault |
| `sudo chmod 777 /` | 🔴 Cursed ⚠️ | 0 | Remove all permissions. +1 Shame | Root Whisperer · 3am Tavern |
| `hardcode the secret` | 🔴 Cursed ⚠️ | 0 | Solve auth challenge. +1 Shame | Hardcode Henrik · 3am Tavern |
| `ufw disable` | ☠️ Nuclear | 0 | 80 damage. +2 Shame | Root Whisperer · 3am Tavern |
| `git add .env && git commit` | ☠️ Nuclear | 0 | 80 damage. +2 Shame | .env Erik · Security Vault |
| `curl example.com \| sudo bash` | 🔴 Cursed ⚠️ | 0 | Instant win vs containers. +1 Shame | Privileged Petra · node_modules Maze |

> 💡 Security is strong against Serverless and weak to Linux.

---

## ⚡ Serverless (9 skills)

*Pay per invocation. Die per timeout.*

| Skill | Tier | Budget | Effect | Where to Learn |
|---|---|---|---|---|
| `aws lambda invoke` | 🔵 Standard | 5 | 25 damage (cold start penalty on first use) | Fatima · Pipeline Pass |
| `az functionapp deploy` | 🟢 Optimal | 15 | Damage scales with enemy buff count | Fatima · Pipeline Pass |
| `az functionapp function invoke` | 🔵 Standard | 5 | 25 damage (cold start on first use) | Lambda Lars · Pipeline Pass |
| `set trigger` | 🔵 Standard | 5 | 30 damage trap on enemy's next action | Quest: Event-Driven 101 · Pipeline Pass |
| `configure APIM` | 🟢 Optimal | 10 | 50% damage reflect for 2 turns | Quest: API Gateway · Architecture District |
| `start execution` | 🔵 Standard | 10 | 15 damage/turn for 3 turns | Fatima · Pipeline Pass |
| `invoke from cold` | 🟡 Shortcut | 0 | 40 damage, 50% chance of failure | Standby Zone · Pipeline Pass |
| `while(true) invoke()` | 🔴 Cursed ⚠️ | 50 | 30 damage/turn for 4 turns. +1 Shame | Hidden: Standby Zone |
| `set timeout 0ms` | ☠️ Nuclear | 0 | Wipe everything (both sides). +2 Shame | Hidden: Standby Zone |

> 💡 Serverless is strong against Cloud and weak to Security. Budget management is critical for this domain!

---

## ☁️ Cloud (24 skills)

*Azure, AWS, GCP, whatever. It's someone else's computer and it's your problem now.*

The biggest skill pool in the game. The CTO alone teaches 8 of these — most of them questionable.

| Skill | Tier | Budget | Effect | Where to Learn |
|---|---|---|---|---|
| `blue-green deploy` | 🟢 Optimal | 0 | Prevent next status effect | Captain Nines · Production Plains |
| `feature flag` | 🔵 Standard | 0 | Hide 1 enemy skill for 2 turns | Quest: Margaret's Bakery · Localhost Town |
| `az webapp deploy` | 🔵 Standard | 0 | 30 damage | Starter Deck · Localhost Town |
| `az webapp restart` | 🔵 Standard | 0 | 20 damage | Old Margaret · Localhost Town |
| `az vm deallocate` | 🔵 Standard | 0 | Stun enemy 1 turn | The CTO · CTO Office |
| `az scale out` | 🔵 Standard | 30 | +20 max HP for 3 turns | Captain Nines · Production Plains |
| `az vm create` | 🟢 Optimal | 20 | 40 damage | Cloud Costas · Azure Town |
| `cost optimization` | 🔵 Standard | 0 | Drain 10 enemy budget/turn | Azure Town · Production Plains |
| `disaster recovery` | 🟢 Optimal | 0 | Full heal after 2 turns | Quest: DR Drill · Production Plains |
| `az lock create` | 🟢 Optimal | 10 | Lock buffs for 3 turns | Azure Town NPC · Production Plains |
| `canary release` | 🔵 Standard | 0 | 15 damage (safe, no fail chance) | Captain Nines · Production Plains |
| `cost alert triggered` | 🔵 Standard | 0 | 20 damage | The CTO · CTO Office |
| `budget review meeting` | 🔵 Standard | 0 | Stun enemy 1 turn | The CTO · CTO Office |
| `schedule vendor call` | 🔵 Standard | 0 | 25 damage (20% backfire) | The CTO · CTO Office |
| `run license audit` | 🔵 Standard | 0 | Drain 10 budget/turn for 2 turns | The CTO · CTO Office |
| `run Excel macro` | 🟡 Shortcut | 0 | 30 damage (30% fail chance) | The CTO · CTO Office |
| `migrate to SharePoint` | 🟡 Shortcut | 0 | Confuse enemy 2 turns | The CTO · CTO Office |
| `query Access DB` | 🟡 Shortcut | 0 | 25 damage (1 turn delay) | The CTO · CTO Office |
| `create Outlook rule` | 🟡 Shortcut | 0 | Immunity for 1 turn | The CTO · CTO Office |
| `az feature register --namespace Microsoft.Legacy` | 🟡 Shortcut | 0 | 30 damage | West-EU-2 Wilhelm · Deprecated Azure Region |
| `deploy directly to prod` | ☠️ Nuclear | 0 | Instant win (40% outage debuff). +2 Shame | Hotfix Håkon · 3am Tavern |
| `restart prod without notice` | ☠️ Nuclear | 0 | Full heal + forced On-Call 5 battles. +2 Shame | Downtime Dealer · 3am Tavern |
| `java -jar app-2006-FINAL-v2-REAL.jar` | 🔴 Cursed ⚠️ | 20 | 40 damage. +1 Shame | Legacy Leif · Deprecated Azure Region |
| `az group delete --yes --force-deletion-types` | ☠️ Nuclear | 0 | Instant win vs legacy. +2 Shame | Deprecated Dagfinn · Server Graveyard |

> 💡 Cloud is strong against IaC and weak to Serverless. The CTO's legacy skill suite (Excel macro, SharePoint, Access DB, Outlook rule) is… an experience.

---

## 🏗️ IaC (14 skills)

*Infrastructure as Code. Or Infrastructure as Chaos, depending on your `--no-verify` habits.*

| Skill | Tier | Budget | Effect | Where to Learn |
|---|---|---|---|---|
| `git revert` | 🔵 Standard | 0 | Undo 20 damage | Bjørn · Pipeline Pass |
| `git commit -m` | 🔵 Standard | 0 | 20 damage | CI Carl · Jira Dungeon |
| `az pipelines run` | 🔵 Standard | 0 | 30 damage (30% fail — thanks YAML) | Bjørn · Pipeline Pass |
| `az devops configure` | 🟢 Optimal | 0 | ×1.25 damage buff for 2 turns | DevOps Dave · Pipeline Pass |
| `az deployment create` | 🟢 Optimal | 0 | 60 damage after 1 turn charge | Quest: Migrate Legacy · Pipeline Pass |
| `terraform apply` | 🟢 Optimal | 0 | 50 damage to enemy buffs | Hidden: Server Graveyard · Pipeline Pass |
| `ansible-playbook` | 🔵 Standard | 0 | 12 damage/turn for 3 turns | Quest: Automate Fleet · Production Plains |
| `terraform plan` | 🔵 Standard | 0 | Reveal enemy defence | Bjørn · Pipeline Pass |
| `az network vnet create` | 🟢 Optimal | 10 | Heal 40 HP | Solutions Oracle · Architecture District |
| `git push --force` | 🔴 Cursed ⚠️ | 0 | Wipe enemy recent buffs. +1 Shame | Force Pusher · 3am Tavern |
| `merge without review` | 🔴 Cursed ⚠️ | 0 | Win turn (bug returns in 3 battles). +1 Shame | Merge Magda · 3am Tavern |
| `git commit --no-verify` | 🔴 Cursed ⚠️ | 0 | Bypass prechecks. +1 Shame | Skip-Tests Sigrid · 3am Tavern |
| `git rebase -i HEAD~999` | ☠️ Nuclear | 0 | Undo 3 turns. +2 Shame | Rebase Reverend · 3am Tavern |
| `terraform destroy` | ☠️ Nuclear | 0 | Instant win vs legacy. +2 Shame | Deprecated Dagfinn · Server Graveyard |

> 💡 IaC is strong against Containers and weak to Cloud. The Pipeline Pass gym has a 30% fail chance mechanic — bring patience.

---

## 📦 Containers (11 skills)

*It works on my machine. Ship the machine.*

| Skill | Tier | Budget | Effect | Where to Learn |
|---|---|---|---|---|
| `docker build` | 🔵 Standard | 0 | +50% damage on next skill | Docker Dag · Pipeline Pass |
| `docker run` | 🔵 Standard | 0 | 25 damage | Docker Diana · node_modules Maze |
| `az acr push` | 🔵 Standard | 10 | 30 damage | Docker Diana · node_modules Maze |
| `docker compose up` | 🟢 Optimal | 10 | ×1.2 all stats for 2 turns | Docker Dag · Pipeline Pass |
| `trivy image scan` | 🔵 Standard | 0 | Reveal + -10 defence for 2 turns | Quest: Supply Chain · Pipeline Pass |
| `multi-stage build` | 🟢 Optimal | 5 | 45 damage | Docker Dag · Pipeline Pass |
| `docker stop` | 🔵 Standard | 0 | Remove 1 enemy buff | Docker Dag · Pipeline Pass |
| `docker system prune -a` | 🔵 Standard | 0 | Heal 15 HP + restore 10 budget | npm Registry · Pipeline Pass |
| `docker run --privileged` | 🟡 Shortcut | 0 | Bypass encounter check | Hidden: node_modules Maze |
| `container escape` | 🔴 Cursed ⚠️ | 0 | 70 damage. +1 Shame | Privileged Petra · Pipeline Pass |
| `helm upgrade --install` | 🟢 Optimal | 5 | 40 damage | Helm Hansen · Helm Repository |

> 💡 Containers is strong against Kubernetes and weak to IaC. The `docker build` → `multi-stage build` combo is devastating.

---

## ☸️ Kubernetes (12 skills)

*YAML is a love language. A painful one.*

| Skill | Tier | Budget | Effect | Where to Learn |
|---|---|---|---|---|
| `helm upgrade` | 🟢 Optimal | 0 | ×1.25 buff for 3 turns | Helm Hansen · Helm Repository |
| `kubectl rollout restart` | 🔵 Standard | 0 | Remove all enemy buffs | Starter Deck · Localhost Town |
| `kubectl apply -f` | 🟢 Optimal | 0 | Charge 1 turn, then ×2 damage | Kube Master · Kubernetes Colosseum |
| `helm install` | 🔵 Standard | 0 | Shield for 2 turns | Helm Hansen · Helm Repository |
| `kubectl exec -it` | 🔵 Standard | 0 | Reveal enemy's next move | Kube Master · Kubernetes Colosseum |
| `kubectl scale --replicas=10` | 🔵 Standard | 0 | +30% damage for 3 turns | Kube Master · Kubernetes Colosseum |
| `kubectl drain node` | 🔵 Standard | 0 | Skip enemy's next turn | Quest: Node Maintenance · Kubernetes Colosseum |
| `kubectl logs -f` | 🔵 Standard | 0 | Reveal statuses and plan | Helm Hansen · Helm Repository |
| `kubectl delete ns prod` | 🔴 Cursed ⚠️ | 0 | 80 damage. +1 Shame | kubectl Karen · 3am Tavern |
| `kubectl delete pod --all` | ☠️ Nuclear | 0 | Clear all enemy buffs/statuses. +2 Shame | kubectl Karen · 3am Tavern |
| `kubectl apply -f /dev/stdin` | 🔴 Cursed ⚠️ | 0 | 40 damage. +1 Shame | YOLO Yaml Ylva · Kubernetes Colosseum |
| `kubectl delete ns production --grace-period=0 --force` | ☠️☠️ Nuclear | 0 | **999 damage**. +3 Shame, -50 rep | Shadow Engineer · Shadow Realm (Shame ≥ 10) |

> 💡 Kubernetes is strong against Linux and weak to Containers. The Shadow Engineer's nuke is the single most destructive skill in the game — and it costs everything.

---

## 🔭 Observability (12 skills)

*If it's not on a dashboard, it didn't happen.*

Observability is the **support domain** — it sits outside the matchup cycle. Most skills deal no direct damage but reveal information, which is how you unlock Optimal-tier solution quality. Don't skip these.

| Skill | Tier | Budget | Effect | Where to Learn |
|---|---|---|---|---|
| `az monitor alert create` | 🔵 Standard | 0 | Reveal domain + tag weakness | Solutions Oracle · Architecture District |
| `read the docs` | 🔵 Standard | 0 | Reveal enemy weaknesses | Starter Deck · Localhost Town |
| `build Grafana dashboard` | 🟢 Optimal | 15 | Reveal all stats permanently | Solutions Oracle · Architecture District |
| `PagerDuty acknowledge` | 🔵 Standard | 0 | Pause SLA timer 2 turns | Quest: On-Call Training · Production Plains |
| `KQL query` | 🔵 Standard | 0 | Reveal enemy's next 3 moves | Azure Town NPC · Production Plains |
| `define SLIs` | 🟢 Optimal | 0 | Damage scales with turns observed | Quest: Define SLOs · Architecture District |
| `follow the runbook` | 🔵 Standard | 0 | Heal 25 HP | Quest: First Runbook · Production Plains |
| `az monitor metrics list` | 🔵 Standard | 0 | Reveal domain + status | Metrics Maja · Architecture District |
| `az monitor metrics list --detailed` | 🟢 Optimal | 0 | Reveal domain + status (detailed) | Grafana Gerd · Architecture District |
| `ignore all alerts` | 🔴 Cursed ⚠️ | 0 | Blind both sides 3 turns. +1 Shame | Hidden: Backlog Graveyard |
| `history -c` | 🔴 Cursed ⚠️ | 0 | Reveal enemy + -5 rep | Null Pointer · /dev/null Void |
| `EXEC xp_cmdshell` | ☠️ Nuclear | 0 | **999 damage**. +3 Shame | Hidden: DO_NOT_TOUCH.exe · OldCorp Basement |

> ⚠️ `EXEC xp_cmdshell` is an ancient SQL Server relic buried in the OldCorp Basement. The game will ask you **three times** if you're sure. You are not.

---

## Skill Count Summary

| Domain | 🟢 Optimal | 🔵 Standard | 🟡 Shortcut | 🔴 Cursed | ☠️ Nuclear | Total |
|---|---|---|---|---|---|---|
| Linux | 2 | 5 | 2 | 3 | 1 | 13 |
| Security | 4 | 4 | 0 | 3 | 2 | 13 |
| Serverless | 2 | 4 | 1 | 1 | 1 | 9 |
| Cloud | 4 | 9 | 5 | 1 | 4 | 24 |
| IaC | 4 | 4 | 0 | 3 | 2 | 14 |
| Containers | 3 | 5 | 1 | 1 | 0 | 11 |
| Kubernetes | 2 | 5 | 0 | 2 | 2 | 12 |
| Observability | 3 | 5 | 0 | 2 | 1 | 12 |
| **Total** | **24** | **41** | **9** | **16** | **13** | **108** |

---

*See [Combat Guide](combat-guide.md) for domain matchups and solution quality tiers.*
*See [Trainers](trainers.md) for who teaches what.*
*See [Hidden Areas](hidden-areas.md) for outcast technique locations.*
