# 🧑‍💻 Trainers

All named trainers in Cloud Quest. Beat them for emblems, XP, and skill unlocks.

---

## 🏆 Gym Leaders

| Name | Location | Domain | HP | Difficulty | Signature Skill | Teach Condition |
|---|---|---|---|---|---|---|
| Tux the Terminal Wizard | Terminal Gym, Localhost Town | Linux | 80 | Tutorial | `grep "ERROR" /var/log/*` | Complete tutorial battle |
| Bjørn the Build Breaker | Pipeline Dojo, Pipeline Pass | IaC | 80 | ★★ | `az pipelines run` | Beat Gym 1 |
| Captain Nines | Uptime Arena, Production Plains | Cloud | 90 | ★★★ | `blue-green deploy` | Beat Gym 2 |
| Scrum Siri | Sprint Sanctum, Jira Dungeon | Observability | 85 | ★★★ | `az monitor alert create` | Beat Gym 3 |
| Docker Dag | Container Yard, Helm Repository | Containers | 100 | ★★★★ | `docker build` | Beat Gym 4 |
| The Kube-rnetes Master | Cluster Ring, Kubernetes Colosseum | Kubernetes | 120 | ★★★★ | `kubectl apply -f` | Beat Gym 5 |
| Ingrid the IAM Inspector | Security Vault | Security | 90 | ★★★★ | `ssh-keygen` | Beat Gym 6 |
| The Solutions Oracle | Whiteboard Summit, Architecture District | Observability | 100 | ★★★★★ | `az monitor alert create` | Beat Gym 7 |

---

## 🎖️ Sub-Leaders

Sub-leaders guard inner rooms before the gym leader. Beat them to unlock the final door.

| Name | Location | Domain | HP | Signature |
|---|---|---|---|---|
| SLA Signe | Uptime Arena ante-room | Observability | 200 | Pause SLA timer |
| Story Point Søren | Sprint Sanctum gate | IaC | 190 | Sprint overflow debuff |
| Layer Lars | Container Yard gate | Containers | 210 | Layer squash attack |
| Replica Set Ragnhild | Cluster Ring ante-room | Kubernetes | 230 | Scale to zero |
| Architect Aleksander | Whiteboard Summit gate | Observability | 250 | Whiteboard stun |
| Logging Lena | Architecture District patrol | Observability | 180 | Log flood DoT |
| Alert Anders | Production Plains checkpoint | Observability | 200 | Alert fatigue debuff |
| Pipeline Per | Jira Dungeon floor 2 | IaC | 200 | YAML syntax error |
| Trigger Trude | Jira Dungeon floor 2 | Serverless | 190 | Event storm |
| Manifest Magnus | Jira Dungeon floor 3 | Kubernetes | 220 | Manifest conflict |
| Policy Pål | Security Vault lobby | Security | 210 | IAM deny |
| Metrics Maja | Production Plains | Observability | 175 | Metric reveal |
| Deploy Diana | Azure Town edge | Cloud | 185 | Rapid deploy |
| Incident Ivan | Production Plains late | Cloud | 230 | SLA countdown (3 turns) |

---

## 🌍 Field Trainers

Trainers you encounter in the overworld — not in gyms. Beat them for skills and lore.

| Name | Location | Domain | HP | Notes |
|---|---|---|---|---|
| Ola the Ops Guy | Localhost Town | Linux | 120 | First trainer encounter; teaches `systemctl restart` |
| Fatima the Function Witch | Pipeline Pass | Serverless | 200 | Teaches Serverless fundamentals |
| Helm Hansen | Helm Repository | Kubernetes | 240 | Teaches `helm install`, `helm upgrade`, `kubectl logs -f` |
| Lambda Lars | Staging Valley | Serverless | 180 | Teaches `az functionapp function invoke` |
| Docker Diana | Container Yard | Containers | 190 | Teaches `docker run`, `az acr push` |
| Terraform Tore | Architecture District | IaC | 280 | Teaches `terraform plan` |
| Firewall Frida | Security Vault approach | Security | 260 | Teaches `az network nsg rule create` |
| Grafana Gerd | Azure Town | Observability | 160 | Teaches `az monitor metrics list --detailed` |
| CI Carl | Pipeline Pass | IaC | 170 | Teaches `git commit -m` |
| Cloud Costas | Azure Town | Cloud | 220 | Teaches `az vm create` |
| NFS Nora | Localhost Town outskirts | Linux | 140 | Teaches `mount /dev/sdb1 /mnt` |
| DevOps Dave | Pipeline Pass | IaC | 200 | Gives flaky test quest; teaches `az devops configure` |
| Scale Set Sven | Staging Valley | Cloud | 210 | Teaches scaling patterns |

---

## 🍺 Cursed Trainers (Three AM Tavern)

Unlocked by Shame level. All teach cursed or nuclear techniques.

| Name | Shame Req. | Domain | HP | Teaches | Note |
|---|---|---|---|---|---|
| The Force Pusher | 1 | IaC | 180 | `git push --force` | First cursed trainer |
| Merge Magda | 1 | IaC | 200 | `merge without review` | Appears with Force Pusher |
| Hardcode Henrik | 1 | Security | 190 | `hardcode the secret` | Appears early |
| The Root Whisperer | 2 | Security | 250 | `sudo chmod 777 /`, `ufw disable` (Shame 3) | Unlocks two cursed skills |
| kubectl Karen | 2 | Kubernetes | 270 | `kubectl delete ns prod` | Hot take energy |
| The Rebase Reverend | 2 | IaC | 230 | `git rebase -i HEAD~999` | Sermonizes while battling |
| Hotfix Håkon | 2 | Cloud | 240 | `deploy directly to prod` | Hidden until Shame ≥ 2 |
| Skip-Tests Sigrid | 4 | IaC | 260 | `git commit --no-verify` | Hidden until Shame ≥ 4 |
| The Downtime Dealer | 6 | Cloud | 300 | `restart prod without notice` | Hidden until Shame ≥ 6 |
| rm-rf Rune | 8 | Linux | 320 | `rm -rf /` | Hidden until Shame ≥ 8 |

---

## 👥 The CTO (Non-combat NPC + Opponent)

The CTO is both a quest giver and a late-game opponent. Teaches the full legacy IT skill suite:
`budget review meeting`, `schedule vendor call`, `run license audit`, `run Excel macro`, `migrate to SharePoint`, `query Access DB`, `create Outlook rule`, `cost alert triggered`.

Appears first in Azure Town. Final battle is optional (Act 3, post-credits path).

---

## 💀 Outcast / Hidden Trainers

Found only in [hidden areas](hidden-areas.md). Not shown on normal maps.

| Name | Hidden Area | Domain | Shame Req. | Teaches |
|---|---|---|---|---|
| Deprecated Dagfinn | Server Graveyard | IaC / Cloud | 0 (area gated) | `terraform apply`, `az group delete --yes` |
| Privileged Petra | node_modules Maze | Containers | 0 (area gated) | `docker run --privileged`, `curl \| sudo bash` |
| The Null Pointer | /dev/null Void | Observability | 0 (area gated) | `history -c` |
| West-EU-2 Wilhelm | Deprecated Azure Region | Cloud | 0 (area gated) | `az feature register --namespace Microsoft.Legacy` |
| YOLO Yaml Ylva | Kubernetes Colosseum inner ring | Kubernetes | ≥ 3 | `kubectl apply -f /dev/stdin` |
| sudo su Saga | Terminal Gym deep passage | Linux | ≥ 2 | `sudo su -` |
| .env Erik | Security Vault hidden corridor | Security | ≥ 3 | `git add .env && git commit` |
| Cron Kristina | Server Graveyard east | Linux | ≥ 3 | `*/1 * * * * ./attack.sh` |
| Legacy Leif | Deprecated Azure Region | Cloud | ≥ 5 | `java -jar app-2006-FINAL-v2-REAL.jar` |

---

*See [World Map](world-map.md) for locations. See [Combat Guide](combat-guide.md) for gym mechanics.*
