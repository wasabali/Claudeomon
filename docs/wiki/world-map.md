# 🗺️ World Map

Cloud Quest is divided into regions you unlock as you progress through the story. Each region has a dominant domain, its own encounter pool, and trainers to battle.

---

## Progression Overview

```
[Localhost Town] → [Pipeline Pass] → [Azure Town] → [Production Plains]
                         ↓                                    ↓
                  [Staging Valley]              [Kubernetes Colosseum]
                         ↓
              [Jira Dungeon 1 → 2 → 3]
                         ↓
                [Architecture District]
```

Hidden areas branch off from specific trigger points. See [Hidden Areas](hidden-areas.md).

---

## Main Regions

### 🏠 Localhost Town
- **Act:** 1 (starting area)
- **Domain:** Linux
- **Trainers:** Ola the Ops Guy, Tux the Terminal Wizard (Tutorial Gym)
- **Encounters:** `404_not_found`, `missing_semicolon`, `port_conflict` (common) · `failed_pipeline`, `npm_install_hang` (rare)
- **Notes:** Safe starting zone. No cursed encounters. Margaret's bakery quest starts here.

---

### 🏗️ Pipeline Pass
- **Act:** 1
- **Domain:** IaC / Serverless
- **Trainers:** Bjørn the Build Breaker (Gym 1), Fatima the Function Witch, DevOps Dave
- **Encounters:** `failed_pipeline`, `merge_conflict`, `yaml_syntax_error`, `dependency_hell`, `circular_dependency`
- **Notes:** First gym. Flaky test quest from DevOps Dave. Connects to Staging Valley.

---

### 🌙 Staging Valley
- **Act:** 1
- **Domain:** Cloud
- **Trainers:** Scale Set Sven, Startup Steve
- **Encounters:** `environment_mismatch`, `config_drift`, `wrong_env_var`, `feature_flag_forgotten`
- **Notes:** "Works in staging" trauma zone. Steve's storage quest starts here.

---

### ☁️ Azure Town
- **Act:** 1–2
- **Domain:** Cloud
- **Trainers:** Captain Nines (Gym 2), Cloud Costas, Grafana Gerd
- **Encounters:** `quota_exceeded`, `subscription_limit`, `orphaned_resource`, `cost_spike`
- **Notes:** Resource marketplace open. Budget management tutorial.

---

### 🏭 Production Plains
- **Act:** 2
- **Domain:** Cloud / Observability
- **Trainers:** Metrics Maja, Alert Anders, Nervous Nancy
- **Encounters:** `high_error_rate`, `latency_spike`, `database_timeout`, `memory_leak`, `runaway_process`, `prod_incident` (rare)
- **Notes:** Nancy's security breach quest. SLA pressure ramps up here.

---

### 📋 Jira Dungeon (3 floors)
- **Act:** 2
- **Domain:** IaC / Containers
- **Trainers:** Story Point Søren, Layer Lars, Pipeline Per, Trigger Trude, Manifest Magnus
- **Encounters:** `ticket_limbo`, `sprint_overflow`, `blocked_story`, `scope_creep`, `unassigned_forever`
- **Notes:** Three-floor dungeon. OldCorp Basement hidden entrance on floor 3 (ignore 3 warnings).

---

### 🚢 Container Yard
- **Act:** 2
- **Domain:** Containers
- **Trainers:** Docker Dag (Gym 4), Docker Diana
- **Encounters:** `image_too_large`, `port_already_bound`, `container_oom`, `missing_volume`, `orphaned_layer` (rare)
- **Notes:** Supply Chain Security quest available.

---

### 🌐 Helm Repository
- **Act:** 2
- **Domain:** Kubernetes / Containers
- **Trainers:** Helm Hansen, Replica Set Ragnhild
- **Encounters:** `chart_not_found`, `values_override_missing`, `deprecated_api_version`, `tiller_ghost` (rare)
- **Notes:** Optional detour. Helm skills taught here.

---

### ⛵ Kubernetes Colosseum
- **Act:** 3
- **Domain:** Kubernetes
- **Trainers:** The Kube-rnetes Master (Gym 5), Kubectl Karen (sub-leader in outer ring; also appears at Three AM Tavern as Shame ≥ 2), YOLO Yaml Ylva (inner ring, Shame ≥ 3)
- **Encounters:** `crashloopbackoff`, `evicted_pod`, `pending_forever`, `node_pressure`, `delete_all_pods` (rare), `sev1_at_3am` (cursed)
- **Notes:** Inner ring is a hidden area. See [Hidden Areas](hidden-areas.md).

---

### 🔒 Security Vault
- **Act:** 3
- **Domain:** Security
- **Trainers:** Ingrid the IAM Inspector (Gym 6), Firewall Frida, .env Erik (hidden, Shame ≥ 3)
- **Encounters:** `secret_exposed`, `permission_denied`, `expired_cert`, `overprivileged_role`, `supply_chain_attack` (rare)
- **Notes:** Certificate Authority Island puzzle unlocks vault skills.

---

### 🏛️ Architecture District
- **Act:** 3
- **Domain:** Observability
- **Trainers:** Scrum Siri (Gym 3 — retrospective format), The Solutions Oracle (Gym 7), Architect Aleksander, Logging Lena
- **Encounters:** `alert_storm`, `dashboard_too_late`, `missing_runbook`, `slo_breached`, `black_box` (rare)
- **Notes:** Final act hub. Oracle teaches Grafana Dashboard (Optimal). Whiteboard Summit Gym 7 unlocks credits.

---

## Gyms

| # | Gym | Location | Gym Leader | Domain | Reward |
|---|---|---|---|---|---|
| Tutorial | Terminal Gym | Localhost Town | Tux the Terminal Wizard | Linux | Starter emblem |
| 1 | Pipeline Dojo | Pipeline Pass | Bjørn the Build Breaker | IaC | Pipeline Emblem |
| 2 | Uptime Arena | Azure Town | Captain Nines | Cloud | Cloud Emblem |
| 3 | Sprint Sanctum | Architecture District | Scrum Siri | Observability | SRE Emblem |
| 4 | Container Yard | Container Yard | Docker Dag | Containers | Container Emblem |
| 5 | Cluster Ring | Kubernetes Colosseum | The Kube-rnetes Master | Kubernetes | Helm Emblem |
| 6 | Security Vault | Security Vault | Ingrid the IAM Inspector | Security | Vault Emblem |
| 7 | Whiteboard Summit | Architecture District | The Solutions Oracle | Observability | FinOps Emblem |

---

## 🔴 Three AM Tavern

- **Unlock:** Shame ≥ 1 (a door appears in Localhost Town)
- **Domain:** Mixed (cursed techniques)
- **Trainers:** The Force Pusher, Hotfix Håkon, Merge Magda, The Root Whisperer, kubectl Karen, Skip-Tests Sigrid, Hardcode Henrik, The Rebase Reverend, rm-rf Rune, The Downtime Dealer
- **Notes:** Not a standard gym. High shame = more trainers available. Cursed skills only.

---

## Special Locations

| Location | Access | Purpose |
|---|---|---|
| Certificate Authority Island | Security Vault puzzle | Unlocks `certbot renew`, `nmap -sV` |
| DNS Swamp | Hidden, Production Plains | Fork bomb + advanced Linux |
| The Standby Zone | Serverless area edge | Infinite loop cold start techniques |
| npm Registry Market | Helm Repository | Shops, `docker prune` skill |

---

*See [Hidden Areas](hidden-areas.md) for the 6 secret zones.*
