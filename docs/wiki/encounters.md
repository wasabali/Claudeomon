# ⚡ Encounters

Random battles in Cloud Quest come in two flavours: **Incidents** (technical problems with SLA timers) and **Engineer Battles** (PvP with trainers).

See [Combat Guide](combat-guide.md) for full battle mechanics.

---

## Encounter Pools by Region

Each region has three pools. When you step on a battle tile, the engine rolls: **common 70% · rare 25% · cursed 5%**.

| Region | Common | Rare | Cursed |
|---|---|---|---|
| Localhost Town | `404_not_found`, `missing_semicolon`, `port_conflict` | `failed_pipeline`, `npm_install_hang` | *(none)* |
| Pipeline Pass | `npm_install_hang`, `503_error`, `failed_pipeline` | `merge_conflict`, `port_conflict` | *(none)* |
| Staging Valley | `config_drift`, `terraform_state_lock`, `failed_pipeline` | `cold_start_cascade`, `azure_bill_spike` | *(none)* |
| Azure Town | `azure_bill_spike`, `infinite_redirect`, `503_error` | `prod_incident`, `terraform_state_lock` | `sev1_at_3am` |
| Production Plains | `high_cpu`, `disk_full`, `503_error` | `prod_incident`, `runaway_process` | `sev1_at_3am` |
| Jira Dungeon | `stale_ticket`, `missing_acceptance_criteria`, `blocked_by_qa`, `flaky_ci_pipeline`, `config_drift` | `scope_creep`, `infinite_sprint` | `the_gantt_chart` |
| Helm Repository | `pending_pod`, `crashloopbackoff`, `oom_kill` | `the_yaml_labyrinth`, `rbac_denied` | *(none)* |
| Kubernetes Colosseum | `crashloopbackoff`, `oom_kill`, `pending_pod` | `evicted_node`, `rbac_denied`, `leaked_secret` | `the_yaml_labyrinth` |
| Security Vault | `ssl_certificate_expired`, `leaked_secret`, `rbac_denied` | `the_yaml_labyrinth`, `evicted_node` | *(none)* |
| Architecture District | `phantom_alert`, `config_drift`, `stale_ticket` | `scope_creep`, `azure_bill_spike` | *(none)* |
| Three AM Tavern | `merge_conflict`, `missing_semicolon`, `null_pointer_exception` | `prod_incident`, `runaway_process`, `azure_bill_spike`, `cold_start_cascade` | `sev1_at_3am` |

---

## Incident Reference

Incidents are **anonymous enemies** — you don't know their domain until you diagnose with an Observability skill. SLA timers count down each turn; when they reach zero, you take HP and reputation penalties and lose the battle if the incident is still alive.

Below are representative examples from `src/data/encounters.js`:

| ID | Domain | HP | SLA | Symptom |
|---|---|---|---|---|
| `503_error` | Cloud | 30 | 4 turns | "The app is returning 503 errors." |
| `npm_install_hang` | Containers | 25 | 4 turns | "Install stuck at idealTree forever." |
| `failed_pipeline` | IaC | 35 | 4 turns | "CI pipeline fails on deployment step." |
| `merge_conflict` | IaC | 32 | 4 turns | "Branches conflict during release merge." |
| `crashloopbackoff` | Kubernetes | varies | varies | "CrashLoopBackOff. Pod is trying. Pod is failing." |
| `sev1_at_3am` | Cloud | varies | varies | "03:47 AM. PagerDuty. Production down. Sleep is a myth." |

*Full incident stats are in `src/data/encounters.js`. Difficulty and HP scale by region.*

---

## SLA Breach Effects

When the SLA timer reaches 0:

- You take **20 HP damage**
- You take **-10 reputation**
- If the incident is still alive, the battle ends as a **loss** immediately

The `PagerDuty acknowledge` skill pauses the SLA timer for 2 turns — use it to buy time when the clock is low.

---

*See [Combat Guide](combat-guide.md) for full turn mechanics and solution quality tiers.*
