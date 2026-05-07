# 🧑‍💻 Trainers

Trainers are the engineers you battle in Cloud Quest. Gym Leaders award emblems on defeat. Named trainers teach their signature skill if you win at **Optimal quality**. Cursed trainers require Shame Points to access and teach forbidden techniques.

---

## Gym Leaders

Beat all 7 Gym Leaders to challenge the CTO.

| Name | Location | Domain | Difficulty | HP | Signature Skill | Emblem | Battle Mechanic |
|---|---|---|---|---|---|---|---|
| Bjørn the Build Breaker | Jira Dungeon | IaC | ★★ (2) | 80 | `az pipelines run` | Pipeline Emblem | Build queue (telegraphs 3 moves) |
| Captain Nines | Production Plains | Cloud | ★★★★ (4) | 90 | `blue-green deploy` | Cloud Emblem | SLA timer (8 turns, -15 rep on breach) |
| Scrum Siri | Jira Dungeon | Observability | ★★★ (3) | 85 | `az monitor alert create` | *(none)* | Kanban tracker (idle gives enemy attack bonus) |
| Docker Dag | Helm Repository | Containers | ★★★★ (4) | 100 | `docker build` | Container Emblem | Layered defence (3 layers) |
| The Kube-rnetes Master | Kubernetes Colosseum | Kubernetes | ★★★★★ (5) | 120 | `kubectl apply -f` | Helm Emblem | Respawn (3× at 50% HP) |
| Ingrid the IAM Inspector | Security Vault | Security | ★★★ (3) | 90 | `ssh-keygen` | Vault Emblem | Auth challenge (3 choices, wrong = turn wasted) |
| The Solutions Oracle | Architecture District | Observability | ★★★★ (4) | 100 | `az monitor alert create` | SRE Emblem | Review board (architecture trivia before damage) |

> Gym Leaders with **≥10 Shame** on your record will refuse to teach their signature skill. At **≥5 Shame** they add wary pre-battle dialog.

---

## Named Field Trainers

These trainers are found in the world and can be battled repeatedly. Win at Optimal quality the first time to learn their skill.

| Name | Location | Domain | Difficulty | HP | Signature Skill | Notes |
|---|---|---|---|---|---|---|
| Ola the Ops Guy | Localhost Town | Linux | ★ (1) | 60 | `systemctl restart` | First trainer battle |
| Tux the Terminal Wizard | Shell Cavern | Linux | ★★ (2) | 80 | `grep "ERROR" /var/log/*` | Gym leader of Fundamentals Gym |
| Fatima the Function Witch | Pipeline Pass | Serverless | ★★★ (3) | 80 | `az functionapp deploy` | Gym leader of Developer Gym |
| Helm Hansen | Helm Repository | Containers | ★★★★ (4) | 100 | `helm upgrade --install` | Teaches Helm charts |
| Lambda Lars | Staging Valley | Serverless | ★★ (2) | 70 | `az functionapp deploy` | Proud of 0.3s cold starts |
| Docker Diana | Node_modules Maze | Containers | ★★ (2) | 75 | `docker compose up` | Containerises her lunch |
| Terraform Tore | Staging Valley | IaC | ★★★ (3) | 80 | `terraform plan` | Always plans before apply |
| Firewall Frida | Security Vault | Security | ★★ (2) | 65 | `ufw deny incoming` | Sub-leader of Security Gym |
| Grafana Gerd | Architecture District | Observability | ★★★ (3) | 70 | `az monitor alert create` | If it's not on a dashboard... |
| CI Carl | Pipeline Pass | IaC | ★ (1) | 50 | `az pipelines run` | Always. Commit. Small. |
| Cloud Costas | Azure Town | Cloud | ★★★ (3) | 85 | `az scale out` | Spins up VMs for fun |
| NFS Nora | Shell Cavern | Linux | ★★★ (3) | 75 | `mount /dev/sdb1 /mnt` | Everything is a file |
| DevOps Dave | Pipeline Pass | IaC | ★★ (2) | 65 | `az devops configure` | Automates the automation |
| Scale Set Sven | Production Plains | Cloud | ★★★★ (4) | 95 | `az scale out` | More replicas solve everything |

---

## Sub-Leaders

Sub-leaders guard the path to each gym leader. No emblem reward, but some teach skills.

| Name | Gym | Domain | Difficulty | HP | Signature Skill |
|---|---|---|---|---|---|
| Logging Lena | Fundamentals Gym (Localhost Town) | Linux | ★ (1) | 50 | `tail -f /var/log/syslog` |
| Pipeline Per | DevOps Gym (Jira Dungeon) | IaC | ★★ (2) | 55 | `az pipelines run` |
| Alert Anders | Admin Gym (Production Plains) | Cloud | ★★ (2) | 60 | `az monitor alert create` |
| SLA Signe | Admin Gym (Production Plains) | Cloud | ★★ (2) | 60 | `az webapp deploy` |
| Story Point Søren | Sprint Sanctum (Jira Dungeon) | Observability | ★★ (2) | 55 | `az monitor alert create` |
| Layer Lars | Container Yard (Helm Repository) | Containers | ★★ (2) | 70 | `docker build` |
| Replica Set Ragnhild | Cluster Ring (Kubernetes Colosseum) | Kubernetes | ★★★ (3) | 65 | `kubectl scale --replicas=10` |
| Manifest Magnus | Cluster Ring (Kubernetes Colosseum) | Kubernetes | ★★★ (3) | 70 | `kubectl apply -f` |
| Policy Pål | Vault Chamber (Security Vault) | Security | ★★ (2) | 60 | `az role assignment create` |
| Architect Aleksander | Whiteboard Summit (Architecture District) | Observability | ★★★ (3) | 70 | `az monitor alert create` |
| Metrics Maja | Whiteboard Summit (Architecture District) | Observability | ★★★ (3) | 60 | `az monitor metrics list` |
| Trigger Trude | Developer Gym (Pipeline Pass) | Serverless | ★★ (2) | 55 | `set trigger` |
| Deploy Diana | CTO Office (Production Plains) | Cloud | ★★★★★ (5) | 80 | `blue-green deploy` |
| Incident Ivan | CTO Office (Production Plains) | Observability | ★★★★★ (5) | 80 | `canary release` |

---

## Cursed Trainers

These trainers are hidden in lawless areas. They require **Shame Points** to access and teach techniques that no respectable engineer would document.

> ⚠️ Teaching and learning from these trainers is not recommended by HR, the CTO, or your own future self.

| Name | Location | Domain | Difficulty | HP | Teaches | Shame Required |
|---|---|---|---|---|---|---|
| The Force Pusher | Three AM Tavern | IaC | ★★★ (3) | 80 | `git push --force` | 1 |
| Merge Magda | Three AM Tavern | IaC | ★★ (2) | 70 | `merge without review` | 1 |
| Hotfix Håkon | Three AM Tavern | Cloud | ★★ (2) | 70 | `deploy directly to prod` | 2 |
| The Root Whisperer | Three AM Tavern | Security | ★★★ (3) | 90 | `sudo chmod 777 /` | *Exploration* |

---

## Rematch Decks

Named trainers have stronger rematch decks when challenged again after post-game. They also get a +5 level bonus and face you with reduced XP rewards (×0.5 multiplier) and a harder SLA timer.

---

## Shame Reactions

Most named trainers notice your Shame Points. Reactions at key thresholds:

| Shame | Trainer Reaction |
|---|---|
| 3 | "I've heard about you…" — wary opener |
| 7 | Personal dig at your reputation |
| 10 | Refuses to teach signature skill after defeat; cryptic comment or silence |

See [Reputation & Shame](reputation-and-shame.md) for more on how Shame affects the world.
