# 🛠️ Skills Reference

All skills grouped by domain. Every real CLI command, its tier, effect, and where you learn it.

**Tiers:** Optimal · Standard · Shortcut · Cursed ⚠️ · Nuclear ☠️  
**Budget cost shown** where applicable (0 = free).

---

## 🐧 Linux

*The foundation. If you can't grep, you can't debug.*

| Skill | Tier | Budget | Effect | Learn From |
|---|---|---|---|---|
| `systemctl restart` | Standard | 0 | Heals 20 HP. Works 60% of the time, every time. | Ola the Ops Guy |
| `grep "ERROR" /var/log/*` | Standard | 0 | Reveals enemy domain. | Tux the Terminal Wizard |
| `tail -f /var/log/syslog` | Optimal | 0 | Reveals enemy's next 2 moves. | Tux the Terminal Wizard |
| `kill -9` | Standard | 0 | 35 damage, no questions asked. | Ola the Ops Guy |
| `awk '{print $NF}'` | Optimal | 0 | 50 damage. Write-once, read-never. | Quest: Log Stream Fishing |
| `mount /dev/sdb1 /mnt` | Standard | 0 | Heals 15 HP. Everything is a file. | NFS Nora |
| `crontab -e` | Standard | 0 | 10 damage/turn for 4 turns (DoT). | Ola the Ops Guy |
| `blame DNS` | Shortcut | 0 | Confuse (50% chance, may affect self). | Starter Deck |
| `open a ticket` | Shortcut | 0 | Freeze battle for 1 turn. | Any NPC after losing |
| `:(){ :|:& };:` | Cursed ⚠️ | 0 | DoT 25 damage/turn for 3 turns. +1 Shame, -10 rep. | Hidden: DNS Swamp |
| `rm -rf /` | Nuclear ☠️ | 0 | Wipes ALL statuses and buffs (both sides). +2 Shame, -18 rep. | rm-rf Rune |
| `sudo su -` | Cursed ⚠️ | 0 | 40 damage. +1 Shame, -10 rep. | sudo su Saga |
| `*/1 * * * * ./attack.sh` | Cursed ⚠️ | 0 | 60 damage immediately. +1 Shame, -8 rep. | Cron Kristina |

---

## 🔒 Security

*Lock it down or watch it burn.*

| Skill | Tier | Budget | Effect | Learn From |
|---|---|---|---|---|
| `chmod 644` | Standard | 0 | Clears "denied" status. | Ingrid the IAM Inspector |
| `ssh-keygen` | Standard | 0 | +10 defence for 2 turns. | Ingrid the IAM Inspector |
| `vault kv rotate` | Optimal | 0 | Cleanse all debuffs + 15 defence for 3 turns. | Quest: The Vault Audit |
| `nmap -sV` | Standard | 0 | Reveals all enemy stats. | Certificate Authority Island puzzle |
| `ufw deny incoming` | Optimal | 0 | Immune to damage for 2 turns. | Quest: Zero Trust Initiative |
| `az network nsg rule create` | Optimal | 5 | 40% damage reduction for 3 turns. | Firewall Frida |
| `certbot renew` | Standard | 0 | Heal 15 HP + prevent 'expired' status for 3 turns. | Certificate Authority Island puzzle |
| `az role assignment create` | Optimal | 0 | 40 damage. Grant access via least privilege. | Ingrid the IAM Inspector |
| `sudo chmod 777 /` | Cursed ⚠️ | 0 | Removes permission statuses. Defence drops to 0. +1 Shame, -12 rep. | The Root Whisperer |
| `hardcode the secret` | Cursed ⚠️ | 0 | Solves auth challenge. +1 Shame, **-20 rep** (permanent). | Hardcode Henrik |
| `ufw disable` | Nuclear ☠️ | 0 | 80 damage. +2 Shame, -20 rep. Removes all defence for 5 battles. | The Root Whisperer (Shame 3+) |
| `git add .env && git commit` | Nuclear ☠️ | 0 | 80 damage. +2 Shame, -20 rep. Triggers audit. | .env Erik |

---

## ⚡ Serverless

*Pay per invocation. Die per timeout.*

| Skill | Tier | Budget | Effect | Learn From |
|---|---|---|---|---|
| `aws lambda invoke` | Standard | 5 | 25 damage. First use has cold start penalty. | Fatima the Function Witch |
| `az functionapp deploy` | Optimal | 15 | Damage scales with enemy buff count (20 + 15 per buff). | Fatima the Function Witch |
| `az functionapp function invoke` | Standard | 5 | 25 damage. Cold start on first use. | Lambda Lars |
| `set trigger` | Standard | 5 | Trap: 30 damage on enemy's next action. | Quest: Event-Driven Architecture 101 |
| `configure APIM` | Optimal | 10 | 50% damage reflection for 2 turns. | Quest: The API Gateway Gauntlet |
| `start execution` | Standard | 10 | 15 damage/turn for 3 turns. | Fatima the Function Witch |
| `invoke from cold` | Shortcut | 0 | 40 damage, 50% chance of timeout (miss). | Random encounter, The Standby Zone |
| `while(true) invoke()` | Cursed ⚠️ | 50 | 30 DoT damage/turn for 4 turns. +1 Shame, -8 rep. Budget drain for 3 battles. | Hidden: Standby Zone infinite loop |
| `set timeout 0ms` | Nuclear ☠️ | 0 | Wipes all statuses and buffs (both sides). +2 Shame, -15 rep. All skills on 2-turn cooldown. | Hidden: Complete Standby Zone without skills |

---

## ☁️ Cloud

*Azure, AWS, whatever. It's someone else's computer.*

| Skill | Tier | Budget | Effect | Learn From |
|---|---|---|---|---|
| `az webapp deploy` | Standard | 0 | 30 damage. | Starter Deck |
| `az webapp restart` | Standard | 0 | 20 damage. | Old Margaret (quest reward) |
| `blue-green deploy` | Optimal | 0 | Prevents next status effect. | Captain Nines (Gym 2) |
| `feature flag` | Standard | 0 | Hides one enemy skill for 2 turns. | Quest: Deploy Old Margaret's Bakery |
| `az vm deallocate` | Standard | 0 | Stuns enemy for 1 turn. | The CTO |
| `az scale out` | Standard | 30 | +20 max HP for 3 turns. | Captain Nines (Gym 2) |
| `az vm create` | Optimal | 20 | 40 damage. Check the SKU first. | Cloud Costas |
| `cost optimization` | Standard | 0 | Drain 10 enemy budget/turn for 3 turns. | Azure Town shop tutorial |
| `disaster recovery` | Optimal | 0 | Full heal after 2 turns. | Quest: The DR Drill |
| `az lock create` | Optimal | 10 | Lock your buffs (enemy can't remove them) for 3 turns. | Azure Town governance NPC |
| `canary release` | Standard | 0 | 15 damage, 0% fail chance. Safe. | Captain Nines (Gym 2) |
| `cost alert triggered` | Standard | 0 | 20 damage. | The CTO |
| `budget review meeting` | Standard | 0 | Stun enemy for 1 turn. | The CTO |
| `schedule vendor call` | Standard | 0 | 25 damage, 20% backfire chance. | The CTO |
| `run license audit` | Standard | 0 | Drain 10 enemy budget/turn for 2 turns. | The CTO |
| `run Excel macro` | Shortcut | 0 | 30 damage, 30% fail chance. | The CTO |
| `migrate to SharePoint` | Shortcut | 0 | Confuse enemy for 2 turns. | The CTO |
| `query Access DB` | Shortcut | 0 | 25 damage after 1-turn delay. | The CTO |
| `create Outlook rule` | Shortcut | 0 | Immunity for 1 turn. | The CTO |
| `az feature register --namespace Microsoft.Legacy` | Shortcut | 0 | 30 damage. | Hidden: West-EU-2 Wilhelm |
| `deploy directly to prod` | Nuclear ☠️ | 0 | Instant win, 40% chance of outage debuff for 3 battles. +2 Shame, -15 rep. | Hotfix Håkon |
| `restart prod without notice` | Nuclear ☠️ | 0 | Full heal now. Forces On-Call for 5 battles. +2 Shame, -16 rep. | The Downtime Dealer |
| `java -jar app-2006-FINAL-v2-REAL.jar` | Cursed ⚠️ | 20 | 40 flat damage. +1 Shame, -6 rep. | Legacy Leif |
| `az group delete --yes --force-deletion-types` | Nuclear ☠️ | 0 | Instant win vs legacy. Backfires on modern targets (-40 to self). +2 Shame, -15 rep. | Hidden: Deprecated Dagfinn |

---

## 🏗️ IaC

*Infrastructure as Code. Or Infrastructure as Chaos.*

| Skill | Tier | Budget | Effect | Learn From |
|---|---|---|---|---|
| `git revert` | Standard | 0 | Undo last damage, +20 HP. | Bjørn the Build Breaker |
| `git commit -m` | Standard | 0 | 20 damage. | CI Carl |
| `az pipelines run` | Standard | 0 | 30 damage, 30% fail chance (YAML tabs). | Bjørn the Build Breaker (Gym 1) |
| `az devops configure` | Optimal | 0 | ×1.25 damage buff for 2 turns. | DevOps Dave |
| `az deployment create` | Optimal | 0 | Delayed heavy hit: 60 damage next turn. | Quest: Migrate the Legacy Stack |
| `terraform apply` | Optimal | 0 | Damage all enemy buffs for 50. | Hidden: Server Graveyard |
| `ansible-playbook` | Standard | 0 | 12 damage/turn for 3 turns. | Quest: Automate the Fleet |
| `terraform plan` | Standard | 0 | Reveals enemy defence values. | Bjørn the Build Breaker |
| `az network vnet create` | Optimal | 10 | Heals 40 HP. | The Solutions Oracle |
| `git push --force` | Cursed ⚠️ | 0 | Wipes enemy's last 3 turns of buffs. +1 Shame, -8 rep. | The Force Pusher |
| `merge without review` | Cursed ⚠️ | 0 | Win the turn. Bug returns in 3 battles as bonus damage. +1 Shame, -10 rep. | Merge Magda |
| `git commit --no-verify` | Cursed ⚠️ | 0 | Bypass prechecks. 50% chance next skill fails silently. +1 Shame, -9 rep. | Skip-Tests Sigrid |
| `git rebase -i HEAD~999` | Nuclear ☠️ | 0 | Undo 3 turns. 30% chance own deck corrupts. +2 Shame, -13 rep. | The Rebase Reverend |
| `terraform destroy` | Nuclear ☠️ | 0 | Instant win vs legacy targets. Backfires on modern cloud (-40 to self). +2 Shame, -15 rep. | Hidden: Deprecated Dagfinn |

---

## 📦 Containers

*It works on my machine. Ship the machine.*

| Skill | Tier | Budget | Effect | Learn From |
|---|---|---|---|---|
| `docker build` | Standard | 0 | Buff: next skill does +50% damage. | Docker Dag (Gym 4) |
| `docker run` | Standard | 0 | 25 damage. | Docker Diana |
| `az acr push` | Standard | 10 | 30 damage. Push to Azure Container Registry. | Docker Diana |
| `docker compose up` | Optimal | 10 | Buff all stats ×1.2 for 2 turns. 27 services. | Docker Dag (Gym 4) |
| `trivy image scan` | Standard | 0 | Reveal enemy weaknesses + -10 defence debuff for 2 turns. | Quest: Supply Chain Security |
| `multi-stage build` | Optimal | 5 | 45 damage. DevOps poetry. | Docker Dag (Gym 4) |
| `docker stop` | Standard | 0 | Remove one enemy buff. | Docker Dag (Gym 4) |
| `docker system prune -a` | Standard | 0 | Heal 15 HP + restore 10 budget. | npm Registry Market vendor |
| `docker run --privileged` | Shortcut | 0 | Bypass one encounter gate. | Hidden: node_modules Maze |
| `helm upgrade --install` | Optimal | 5 | 40 damage. Rolls back automatically on failure. | Helm Hansen |
| `container escape` | Cursed ⚠️ | 0 | 70 damage. +1 Shame, -12 rep. Random encounters +3 battles. | Hidden: Privileged Petra |

---

## ⛵ Kubernetes

*YAML is a love language. A painful one.*

| Skill | Tier | Budget | Effect | Learn From |
|---|---|---|---|---|
| `kubectl rollout restart` | Standard | 0 | Remove ALL enemy buffs. | Starter Deck |
| `kubectl apply -f` | Optimal | 0 | Charge 1 turn, then execute ×2 damage. | The Kube-rnetes Master (Gym 5) |
| `helm install` | Standard | 0 | Shield for 2 turns. | Helm Hansen |
| `helm upgrade` | Optimal | 0 | ×1.25 damage buff for 3 turns. | Helm Hansen |
| `kubectl exec -it` | Standard | 0 | Reveals enemy's next move. | The Kube-rnetes Master (Gym 5) |
| `kubectl scale --replicas=10` | Standard | 0 | +30% damage output for 3 turns. | The Kube-rnetes Master (Gym 5) |
| `kubectl drain node` | Standard | 0 | Skip enemy's next turn. | Quest: Node Maintenance Window |
| `kubectl logs -f` | Standard | 0 | Reveals enemy status effects and plan. | Helm Hansen |
| `kubectl delete ns prod` | Cursed ⚠️ | 0 | 80 damage. +1 Shame, -14 rep. 2-turn recovery penalty. | kubectl Karen |
| `kubectl delete pod --all` | Nuclear ☠️ | 0 | Clear all enemy buffs and statuses. +2 Shame, -14 rep. Lose 1 turn. | kubectl Karen |
| `kubectl apply -f /dev/stdin` | Cursed ⚠️ | 0 | 40 damage. +1 Shame, -8 rep. Cluster may destabilise. | YOLO Yaml Ylva |
| `kubectl delete ns production --grace-period=0 --force` | Nuclear ☠️ ☠️ | 0 | **999 damage**. +3 Shame, -50 rep. Shadow Engineer only (Shame ≥ 10). | Shadow Engineer title |

---

## 👁️ Observability

*If it's not on a dashboard, it didn't happen.*

Observability skills deal **no damage**. They reveal, diagnose, and support. Essential for Optimal tier.

| Skill | Tier | Budget | Effect | Learn From |
|---|---|---|---|---|
| `read the docs` | Standard | 0 | Reveals enemy weaknesses. | Starter Deck |
| `az monitor alert create` | Standard | 0 | Reveal enemy domain + tag weakness. | The Solutions Oracle |
| `build Grafana dashboard` | Optimal | 15 | All enemy stats visible for the rest of battle. | The Solutions Oracle |
| `PagerDuty acknowledge` | Standard | 0 | Pause SLA timer for 2 turns. | Quest: On-Call Survival Training |
| `KQL query` | Standard | 0 | Reveals enemy's next 3 moves. | Azure Town diagnostic NPC |
| `define SLIs` | Optimal | 0 | Damage scales with turns observed (10 + 10/turn). | Quest: Define Your SLOs |
| `follow the runbook` | Standard | 0 | Reliable 25 HP heal. | Quest: Write Your First Runbook |
| `az monitor metrics list` | Standard | 0 | Reveals enemy domain and status effects. | Metrics Maja |
| `az monitor metrics list --detailed` | Optimal | 0 | Reveals enemy domain and status effects. | Grafana Gerd |
| `ignore all alerts` | Cursed ⚠️ | 0 | Both sides cannot see HP for 3 turns. +1 Shame, -10 rep. SLA breach risk. | Hidden: Backlog Graveyard |
| `history -c` | Cursed ⚠️ | 0 | Reveals enemy type and status. -5 rep (no Shame). | Hidden: The Null Pointer |

---

## ⚗️ Hidden / Outcast Techniques

These skills are only learnable from [hidden area](hidden-areas.md) trainers or at extreme Shame levels.

| Skill | Domain | Tier | Effect | Learn From |
|---|---|---|---|---|
| `curl example.com \| sudo bash` | Security | Cursed ⚠️ | Instant win vs containers. Backfires vs security (+1 Shame, security debuff 3 battles). | Hidden: Privileged Petra |
| `EXEC xp_cmdshell` | Security | Nuclear ☠️ | 999 damage. +3 Shame, -20 rep. Game asks 3 times. | Hidden: OldCorp DO_NOT_TOUCH.exe |

---

## Skill Count Summary

| Domain | Optimal | Standard | Shortcut | Cursed | Nuclear | Total |
|---|---|---|---|---|---|---|
| Linux | 2 | 5 | 2 | 3 | 1 | 13 |
| Security | 5 | 4 | 0 | 2 | 2 | 13 |
| Serverless | 2 | 4 | 1 | 1 | 1 | 9 |
| Cloud | 4 | 9 | 5 | 1 | 3 | 22 |
| IaC | 4 | 4 | 0 | 3 | 2 | 13 |
| Containers | 3 | 5 | 1 | 1 | 0 | 10 (+1 helm_upgrade_install) |
| Kubernetes | 2 | 6 | 0 | 2 | 2 | 12 |
| Observability | 2 | 6 | 0 | 2 | 0 | 10 |
| Shadow/Outcast | 0 | 0 | 0 | 1 | 2 | 3 |

*See [Combat Guide](combat-guide.md) for domain matchup details.*
