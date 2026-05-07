# 🛠️ Skills Reference

All skills are real CLI commands used as battle moves. You can carry up to **6 active skills** at once. Skills are grouped by domain below.

> For domain matchup rules, see [Combat Guide](combat-guide.md).

---

## 🐧 Linux

*The foundation. If you can't grep, you can't debug.*

| Skill | Tier | Effect | Budget Cost | Where to Learn |
|---|---|---|---|---|
| `systemctl restart` | Standard | Heals 20 HP | Free | Ola the Ops Guy |
| `grep "ERROR" /var/log/*` | Standard | Reveals enemy domain | Free | Tux the Terminal Wizard |
| `tail -f /var/log/syslog` | Optimal | Reveals enemy's next 2 moves | Free | Tux the Terminal Wizard |
| `kill -9` | Standard | 35 damage | Free | Ola the Ops Guy |
| `awk '{print $NF}'` | Optimal | 50 damage | Free | Quest: The Log Stream Fishing Challenge |
| `mount /dev/sdb1 /mnt` | Standard | Heals 15 HP | Free | NFS Nora |
| `crontab -e` | Standard | 10 damage/turn for 4 turns | Free | Ola the Ops Guy |
| `blame DNS` | Shortcut | 50% chance to confuse — both sides | Free | Starter Deck |
| `open a ticket` | Shortcut | Freeze battle for 1 turn | Free | Any NPC after losing a battle |
| `:(){ :|:& };:` | ⚠️ Cursed | 25 damage/turn for 3 turns | Free | Hidden: DNS Swamp bash history puzzle |
| `rm -rf /` | ☠️ Nuclear | Wipes all statuses and buffs (both sides) | Free | rm-rf Rune |
| `sudo su -` | ⚠️ Cursed | 40 damage | Free | sudo su Saga |
| `*/1 * * * * ./attack.sh` | ⚠️ Cursed | 60 damage immediately | Free | Cron Kristina |

---

## 🔒 Security

*Lock it down or watch it burn.*

| Skill | Tier | Effect | Budget Cost | Where to Learn |
|---|---|---|---|---|
| `chmod 644` | Standard | Clears "denied" status | Free | Ingrid the IAM Inspector |
| `ssh-keygen` | Standard | +10 defence for 2 turns | Free | Ingrid the IAM Inspector |
| `vault kv rotate` | Optimal | Cleanse all debuffs + +15 defence for 3 turns | Free | Quest: The Vault Audit |
| `nmap -sV` | Standard | Reveals all enemy stats | Free | Certificate Authority Island puzzle |
| `ufw deny incoming` | Optimal | Immune to damage for 2 turns | Free | Quest: Zero Trust Initiative |
| `az network nsg rule create` | Optimal | 40% damage reduction for 3 turns | 5 | Firewall Frida |
| `certbot renew` | Standard | Heal 15 HP + prevent expiry status for 3 turns | Free | Certificate Authority Island puzzle |
| `az role assignment create` | Optimal | 40 damage | Free | Ingrid the IAM Inspector |
| `sudo chmod 777 /` | ⚠️ Cursed | Removes all permissions — own defence drops to 0 | Free | The Root Whisperer |
| `hardcode the secret` | ⚠️ Cursed | Solves auth challenge | Free | Hardcode Henrik |
| `ufw disable` | ☠️ Nuclear | 80 damage — all defence gone for 5 battles | Free | The Root Whisperer (3+ shame) |
| `git add .env && git commit` | ☠️ Nuclear | 80 damage + triggers audit | Free | .env Erik |
| `EXEC xp_cmdshell` | ☠️ Nuclear | 999 damage | Free | Hidden: OldCorp basement DO_NOT_TOUCH terminal |

---

## ⚡ Serverless

*Pay per invocation. Die per timeout.*

| Skill | Tier | Effect | Budget Cost | Where to Learn |
|---|---|---|---|---|
| `aws lambda invoke` | Standard | 25 damage (cold start penalty on first use) | 5 | Fatima the Function Witch |
| `az functionapp deploy` | Optimal | Damage scales with enemy buff count | 15 | Fatima the Function Witch |
| `az functionapp function invoke` | Standard | 25 damage (cold start penalty on first use) | 5 | Lambda Lars |
| `set trigger` | Standard | 30 damage trap on enemy's next action | 5 | Quest: Event-Driven Architecture 101 |
| `configure APIM` | Optimal | 50% damage reflection for 2 turns | 10 | Quest: The API Gateway Gauntlet |
| `start execution` | Standard | 15 damage/turn for 3 turns | 10 | Fatima the Function Witch |
| `invoke from cold` | Shortcut | 40 damage — 50% chance of timeout failure | Free | Random encounter in The Standby Zone |
| `while(true) invoke()` | ⚠️ Cursed | 30 damage/turn for 4 turns (budget keeps draining) | 50 | Hidden: The Standby Zone infinite loop puzzle |
| `set timeout 0ms` | ☠️ Nuclear | Kills all active processes on both sides | Free | Hidden: Complete The Standby Zone without skills |

---

## ☁️ Cloud

*Azure, AWS, whatever. It's someone else's computer.*

| Skill | Tier | Effect | Budget Cost | Where to Learn |
|---|---|---|---|---|
| `az webapp deploy` | Standard | 30 damage | Free | Starter Deck |
| `az webapp restart` | Standard | 20 damage | Free | Old Margaret (quest reward) |
| `blue-green deploy` | Optimal | Prevents next status effect | Free | Captain Nines (Gym 2) |
| `feature flag` | Standard | Hides one enemy skill for 2 turns | Free | Quest: Deploy Old Margaret's Bakery |
| `canary release` | Standard | 15 damage (never fails) | Free | Captain Nines (Gym 2) |
| `az scale out` | Standard | +20 max HP for 3 turns | 30 | Captain Nines (Gym 2) |
| `az vm create` | Optimal | 40 damage | 20 | Cloud Costas |
| `az vm deallocate` | Standard | Stuns enemy for 1 turn | Free | The CTO |
| `cost optimization` | Standard | Drain 10 enemy budget/turn for 3 turns | Free | Azure Town shop tutorial |
| `disaster recovery` | Optimal | Full heal after 2 turns | Free | Quest: The DR Drill |
| `az lock create` | Optimal | Locks your buffs for 3 turns | 10 | Azure Town governance NPC |
| `cost alert triggered` | Standard | 20 damage | Free | The CTO |
| `budget review meeting` | Standard | Stuns enemy for 1 turn | Free | The CTO |
| `schedule vendor call` | Standard | 25 damage (20% chance backfire) | Free | The CTO |
| `run license audit` | Standard | Drain 10 enemy budget/turn for 2 turns | Free | The CTO |
| `run Excel macro` | Shortcut | 30 damage (30% fail chance) | Free | The CTO |
| `migrate to SharePoint` | Shortcut | Confuses enemy for 2 turns | Free | The CTO |
| `query Access DB` | Shortcut | 25 damage after 1 turn delay | Free | The CTO |
| `create Outlook rule` | Shortcut | 1 turn immunity | Free | The CTO |
| `az feature register --namespace Microsoft.Legacy` | Shortcut | 30 damage | Free | Hidden: West-EU-2 Wilhelm |
| `java -jar app-2006-FINAL-v2-REAL.jar` | ⚠️ Cursed | 40 flat damage | 20 | Legacy Leif |
| `deploy directly to prod` | ☠️ Nuclear | Instant win — 40% outage chance for next 3 battles | Free | Hotfix Håkon |
| `restart prod without notice` | ☠️ Nuclear | Full heal now — forced On-Call for 5 battles | Free | The Downtime Dealer |
| `az group delete --yes --force-deletion-types` | ☠️ Nuclear | Instant win vs legacy / -40 HP vs modern | Free | Hidden: Deprecated Dagfinn |

---

## 🏗️ IaC (Infrastructure as Code)

*Infrastructure as Code. Or Infrastructure as Chaos.*

| Skill | Tier | Effect | Budget Cost | Where to Learn |
|---|---|---|---|---|
| `git revert` | Standard | Undo damage (+20 HP) | Free | Bjørn the Build Breaker |
| `git commit -m` | Standard | 20 damage | Free | CI Carl |
| `az pipelines run` | Standard | 30 damage (30% fail on YAML tabs) | Free | Bjørn the Build Breaker (Gym 1) |
| `az devops configure` | Optimal | ×1.25 damage buff for 2 turns | Free | DevOps Dave |
| `az deployment create` | Optimal | 60 damage (delayed 1 turn) | Free | Quest: Migrate the Legacy Stack |
| `terraform apply` | Optimal | Damages all enemy buffs for 50 | Free | Hidden: Server Graveyard |
| `ansible-playbook` | Standard | 12 damage/turn for 3 turns | Free | Quest: Automate the Fleet |
| `terraform plan` | Standard | Reveals enemy defence values | Free | Bjørn the Build Breaker |
| `az network vnet create` | Optimal | Heals 40 HP | 10 | The Solutions Oracle |
| `git push --force` | ⚠️ Cursed | Wipes enemy recent buffs (3 turns) | Free | The Force Pusher |
| `merge without review` | ⚠️ Cursed | Win current turn — bug returns in 3 battles | Free | Merge Magda |
| `git commit --no-verify` | ⚠️ Cursed | Bypass pre-commit checks — 50% next skill fails | Free | Skip-Tests Sigrid |
| `git rebase -i HEAD~999` | ☠️ Nuclear | Undo 3 turns — 30% chance own deck corrupts | Free | The Rebase Reverend |
| `terraform destroy` | ☠️ Nuclear | Instant win vs legacy / -40 HP vs modern | Free | Hidden: Deprecated Dagfinn |

---

## 📦 Containers

*It works on my machine. Ship the machine.*

| Skill | Tier | Effect | Budget Cost | Where to Learn |
|---|---|---|---|---|
| `docker build` | Standard | Buffs next skill damage by ×1.5 | Free | Docker Dag (Gym 4) |
| `docker run` | Standard | 25 damage | Free | Docker Diana |
| `az acr push` | Standard | 30 damage | 10 | Docker Diana |
| `docker compose up` | Optimal | Buff all stats ×1.2 for 2 turns | 10 | Docker Dag (Gym 4) |
| `trivy image scan` | Standard | Reveal enemy weaknesses + -10 defence debuff for 2 turns | Free | Quest: Supply Chain Security |
| `multi-stage build` | Optimal | 45 damage | 5 | Docker Dag (Gym 4) |
| `docker stop` | Standard | Removes one enemy buff | Free | Docker Dag (Gym 4) |
| `docker system prune -a` | Standard | Heal 15 HP + restore 10 budget | Free | npm Registry Market vendor |
| `docker run --privileged` | Shortcut | Bypass one encounter gate | Free | Hidden: node_modules Maze |
| `helm upgrade --install` | Optimal | 40 damage (auto-rolls back on failure) | 5 | Helm Hansen |
| `container escape` | ⚠️ Cursed | 70 damage | Free | Hidden: Privileged Petra in node_modules Maze |

---

## ☸️ Kubernetes

*YAML is a love language. A painful one.*

| Skill | Tier | Effect | Budget Cost | Where to Learn |
|---|---|---|---|---|
| `kubectl rollout restart` | Standard | Removes all enemy buffs | Free | Starter Deck |
| `kubectl apply -f` | Optimal | Charge 1 turn, then ×2 damage | Free | The Kube-rnetes Master (Gym 5) |
| `kubectl scale --replicas=10` | Standard | +30% damage output for 3 turns | Free | The Kube-rnetes Master (Gym 5) |
| `kubectl drain node` | Standard | Skips enemy's next turn | Free | Quest: Node Maintenance Window |
| `kubectl logs -f` | Standard | Reveals enemy status effects and plan | Free | Helm Hansen |
| `kubectl exec -it` | Standard | Reveals enemy's next move | Free | The Kube-rnetes Master (Gym 5) |
| `helm install` | Standard | Shield for 2 turns | Free | Helm Hansen |
| `helm upgrade` | Optimal | ×1.25 damage buff for 3 turns | Free | Helm Hansen |
| `kubectl delete ns prod` | ⚠️ Cursed | 80 damage | Free | kubectl Karen |
| `kubectl apply -f /dev/stdin` | ⚠️ Cursed | 40 damage (cluster may destabilise) | Free | YOLO Yaml Ylva |
| `kubectl delete pod --all` | ☠️ Nuclear | Clears all enemy buffs and statuses — lose 1 turn | Free | kubectl Karen |
| `kubectl delete ns production --grace-period=0 --force` | ☠️ Shadow | 999 damage | Free | Shadow Engineer title (10 Shame) |

---

## 📊 Observability

*If it's not on a dashboard, it didn't happen.*

> Observability skills deal **no direct damage**. They reveal information and support diagnosis. Critical for Optimal solutions.

| Skill | Tier | Effect | Budget Cost | Where to Learn |
|---|---|---|---|---|
| `read the docs` | Standard | Reveals enemy weaknesses | Free | Starter Deck |
| `az monitor alert create` | Standard | Reveals enemy domain + tags a weakness | Free | The Solutions Oracle |
| `az monitor metrics list` | Standard | Reveals enemy domain + current status effects | Free | Metrics Maja |
| `az monitor metrics list --detailed` | Optimal | Reveals enemy domain + status effects (detailed) | Free | Grafana Gerd |
| `build Grafana dashboard` | Optimal | All enemy stats visible for the rest of battle | 15 | The Solutions Oracle |
| `PagerDuty acknowledge` | Standard | Pauses SLA timer for 2 turns | Free | Quest: On-Call Survival Training |
| `KQL query` | Standard | Reveals enemy's next 3 moves | Free | Azure Town diagnostic NPC |
| `define SLIs` | Optimal | Damage scales with turns observed | Free | Quest: Define Your SLOs |
| `follow the runbook` | Standard | Heals 25 HP | Free | Quest: Write Your First Runbook |
| `ignore all alerts` | ⚠️ Cursed | Blinds both sides for 3 turns (SLA hidden) | Free | Hidden: The Backlog Graveyard ghost |
| `history -c` | ⚠️ Cursed | Reveals enemy type/status — costs -5 reputation | Free | Hidden: The Null Pointer in /dev/null Void |

---

> Skills marked ⚠️ are **Cursed** (earn +1 Shame, lose reputation).  
> Skills marked ☠️ are **Nuclear** (+2 Shame, heavy reputation loss).  
> Skills marked ☠️ Shadow require **10+ Shame** to use.

See [Reputation & Shame](reputation-and-shame.md) for the full consequences of cursed paths.
