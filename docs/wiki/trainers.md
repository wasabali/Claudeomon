# 🧑‍💻 Trainers

Every named character who'll battle you, teach you, or judge your life choices. From the friendly tutorial gym leader to the shadowy engineers lurking at 3am — here they all are.

---

## 🏆 Gym Leaders

The eight domain masters. Beat them for emblems, XP, and the right to say "I read the docs" with a straight face.

| Leader | Domain | HP | Gym | Mechanic | Signature Skill | Location |
|---|---|---|---|---|---|---|
| Tux the Terminal Wizard | Linux | 80 | The Legacy Terminal | `legacy_only` — only legacy commands work | `grep "ERROR" /var/log/*` | Terminal Gym, Localhost Town |
| Bjørn the Build Breaker | IaC | 80 | The Broken Pipeline | `flaky_pipeline` — 30% chance any skill fails | `az pipelines run` | Jira Dungeon 1, Pipeline Pass |
| Captain Nines | Cloud | 90 | 3am Incident Response | `sla_timer` — SLA countdown pressure | `blue-green deploy` | Production Plains |
| Fatima the Function Witch | Serverless | 80 | Cold Start Gauntlet | `cold_start` — first non-Observability skill is blocked (Observability clears it) | `az functionapp deploy` | Pipeline Pass |
| Ingrid the IAM Inspector | Security | 90 | Entra Misconfiguration | `rbac_deny` — skills randomly denied by IAM policies | `ssh-keygen` | Security Vault Gym |
| The Kube-rnetes Master | Kubernetes | 120 | Pod Crasher | `respawn` — leader immediately respawns at 50% HP (3 times) | `kubectl apply -f` | Kubernetes Colosseum |
| The Solutions Oracle | Observability | 100 | Azure Bill Spiral | `cost_spiral` — HP and attack grow each turn | `az monitor alert create` | Architecture District |
| The CTO | Cloud | 75 (Phase 1) + 65 (Phase 2) + 55 (Phase 3) | The CTO Office | `all_domains` — uses skills from every domain | varies | Production Plains |

> 💡 Each gym has a unique **mechanic** that changes battle rules. Prepare accordingly! See [Combat Guide](combat-guide.md).

---

## 🎖️ Gym Sub-Leaders

Sub-leaders guard the inner rooms before you reach the gym leader. Think of them as the warm-up act that's somehow harder than you expected.

| Sub-Leader | Domain | HP | Gym | Teaches |
|---|---|---|---|---|
| Logging Lena | Linux | 50 | Terminal Gym | `tail -f /var/log/syslog` |
| Alert Anders | Cloud | 60 | 3am Incident Response | `az monitor alert create` |
| Pipeline Per | IaC | 55 | Broken Pipeline | `az pipelines run` |
| Trigger Trude | Serverless | 55 | Cold Start Gauntlet | `set trigger` |
| Manifest Magnus | Kubernetes | 70 | Pod Crasher | `kubectl apply -f` |
| Policy Pål | Security | 60 | Entra Misconfiguration | `az role assignment create` |
| Metrics Maja | Observability | 60 | Azure Bill Spiral | `az monitor metrics list` |
| Deploy Diana | Cloud | 80 | CTO Office | `blue-green deploy` |
| Incident Ivan | Observability | 80 | CTO Office | `canary release` |
| SLA Signe | Cloud | 60 | 3am Incident Response | — |
| Story Point Søren | Observability | 55 | Sprint Sanctum | — |
| Layer Lars | Containers | 70 | Container Yard | — |
| Replica Set Ragnhild | Kubernetes | 65 | Cluster Ring | — |
| Architect Aleksander | Observability | 70 | Whiteboard Summit | — |

---

## 🌍 Field Trainers

Trainers you encounter in the overworld — not in gyms. They teach valuable skills and occasionally share questionable life advice.

| Trainer | Domain | HP | Teaches | Location |
|---|---|---|---|---|
| Ola the Ops Guy | Linux | 60 | `systemctl restart` | Localhost Town |
| Helm Hansen | Containers | 100 | `helm upgrade --install` | Helm Repository |
| Lambda Lars | Serverless | 70 | `az functionapp deploy` | Staging Valley |
| Docker Diana | Containers | 75 | `docker compose up` | node_modules Maze |
| Terraform Tore | IaC | 80 | `terraform plan` | Staging Valley |
| Firewall Frida | Security | 65 | `az network nsg rule create` | Security Vault Gym |
| Grafana Gerd | Observability | 70 | `az monitor metrics list --detailed` | Architecture District |
| CI Carl | IaC | 50 | `git commit -m` | Pipeline Pass |
| Cloud Costas | Cloud | 85 | `az vm create` | Azure Town |
| NFS Nora | Linux | 75 | `mount /dev/sdb1 /mnt` | Terminal Gym |
| DevOps Dave | IaC | 65 | `az devops configure` | Pipeline Pass |
| Scale Set Sven | Cloud | 95 | `az scale out` | Production Plains |

> 💡 Some gym leaders (Scrum Siri, Docker Dag) also appear as field encounters in overworld areas before you reach their gym. See the Gym Leaders table above for their full stats.

---

## 👥 World NPCs

Non-battleable characters. They give quests, sell items, or exist purely to make you feel inadequate.

| NPC | Location | Role |
|---|---|---|
| Old Margaret | Localhost Town | Quest giver. Teaches `az webapp restart`. Her bakery is your first mission. |
| Professor Pedersen | Localhost Town | Starter Deck selection. Lore exposition. Will talk for hours if you let him. |
| Random Intern | Localhost Town | Asks you questions you can't answer. Somehow already has more cloud certs than you. |

---

## 💀 Cursed Trainers

<details>
<summary>⚠️ SPOILER WARNING — Click to reveal the 3am Tavern roster and hidden area trainers</summary>

### 3am Tavern Regulars

The Tavern opens when your Shame hits 1. More trainers appear as your Shame grows. They teach powerful but reputation-destroying techniques.

| Trainer | Domain | Location | Shame Required | Teaches |
|---|---|---|---|---|
| The Force Pusher | IaC | 3am Tavern | 1 | `git push --force` |
| Merge Magda | IaC | 3am Tavern | 1 | `merge without review` |
| Hardcode Henrik | Security | 3am Tavern | 1 | `hardcode the secret` |
| Hotfix Håkon | Cloud | 3am Tavern | 2 | `deploy directly to prod` |
| The Root Whisperer | Security | 3am Tavern | 2 | `sudo chmod 777 /` |
| kubectl Karen | Kubernetes | 3am Tavern | 2 | `kubectl delete pod --all` |
| The Rebase Reverend | IaC | 3am Tavern | 2 | `git rebase -i HEAD~999` |
| YOLO Yaml Ylva | Kubernetes | Kubernetes Colosseum | 3 | `kubectl apply -f /dev/stdin` |
| Skip-Tests Sigrid | IaC | 3am Tavern | 4 | `git commit --no-verify` |
| The Downtime Dealer | Cloud | 3am Tavern | 6 | `restart prod without notice` |
| rm-rf Rune | Linux | 3am Tavern | 8 | `rm -rf /` |

### Hidden Area Trainers

These trainers are found in [hidden areas](hidden-areas.md) — no Shame required to meet them, but the areas themselves are gated behind special triggers.

| Trainer | Domain | Location | Teaches |
|---|---|---|---|
| Deprecated Dagfinn | Linux | Server Graveyard | `terraform destroy` |
| Privileged Petra | Containers | node_modules Maze | `curl example.com \| sudo bash` |
| The Null Pointer | Observability | /dev/null Void | `history -c` |
| West-EU-2 Wilhelm | Cloud | Deprecated Azure Region | `az feature register --namespace Microsoft.Legacy` |
| Legacy Leif | Cloud | Deprecated Azure Region | `java -jar app-2006-FINAL-v2-REAL.jar` |

### Cursed Trainers in Regular Gyms

Some cursed trainers hide within normal gyms — you'll only find them if you have enough Shame.

| Trainer | Domain | Location | Shame Required | Teaches |
|---|---|---|---|---|
| sudo su Saga | Linux | Terminal Gym | 2 | `sudo su -` |
| .env Erik | Security | Security Vault Gym | 3 | `git add .env && git commit` |
| Cron Kristina | Linux | Server Graveyard | 3 | `*/1 * * * * ./attack.sh` |

</details>

---

*See [World Map](world-map.md) for locations.*
*See [Skills Reference](skills-reference.md) for what each skill does.*
*See [Combat Guide](combat-guide.md) for gym battle mechanics.*
