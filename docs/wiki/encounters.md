# ⚡ Encounters

Random battles in Cloud Quest come in two flavours: **Incidents** (technical problems with SLA timers) and **Engineer Battles** (PvP with trainers).

See [Combat Guide](combat-guide.md) for full battle mechanics.

---

## Encounter Pools by Region

Each region has three pools. When you step on a battle tile, the engine rolls: **common 70% · rare 25% · cursed 5%**.

| Region | Common | Rare | Cursed |
|---|---|---|---|
| Localhost Town | 503_error, npm_install_hang, env_not_set, process_zombie | port_conflict, infinite_loop | *(none)* |
| Pipeline Pass | failed_pipeline, merge_conflict, yaml_syntax_error, dependency_hell | circular_dependency, flaky_tests | *(none)* |
| Staging Valley | environment_mismatch, config_drift, wrong_env_var, feature_flag_forgotten | staging_is_prod, haunted_fixture | *(none)* |
| Azure Town | quota_exceeded, subscription_limit, orphaned_resource, cost_spike | budget_alarm, region_outage | *(none)* |
| Production Plains | high_error_rate, latency_spike, database_timeout, memory_leak, runaway_process | prod_incident, cascade_failure | sev1_at_3am |
| Jira Dungeon | ticket_limbo, sprint_overflow, blocked_story, scope_creep | unassigned_forever, zombie_epic | burnout_cascade |
| Container Yard | image_too_large, port_already_bound, container_oom, missing_volume | orphaned_layer, privileged_escape | supply_chain_attack |
| Helm Repository | chart_not_found, values_override_missing, deprecated_api_version | tiller_ghost, helm_rollback_loop | *(none)* |
| Kubernetes Colosseum | crashloopbackoff, evicted_pod, pending_forever, node_pressure | delete_all_pods, oomkilled | sev1_at_3am |
| Security Vault | secret_exposed, permission_denied, expired_cert, overprivileged_role | supply_chain_attack, zero_day | apt_exploit |
| Architecture District | alert_storm, dashboard_too_late, missing_runbook, slo_breached | black_box, escalation_required | silent_failure |
| Three AM Tavern | merge_conflict, missing_semicolon | prod_incident, runaway_process | sev1_at_3am |

---

## Incident Reference

Incidents are **anonymous enemies** — you don't know their domain until you diagnose with an Observability skill. SLA timers count down each turn; breach = bonus enemy damage.

| ID | Domain | HP | SLA | Optimal Fix | Symptom Text |
|---|---|---|---|---|---|
| `503_error` | Cloud | 80 | 5 turns | `az webapp restart` | "Service Unavailable — upstream not responding" |
| `npm_install_hang` | Containers | 60 | 4 turns | `docker system prune -a` | "Installing… 47%… 47%… 47%…" |
| `env_not_set` | Linux | 70 | 5 turns | `grep "ERROR" /var/log/*` | "Key not found: DATABASE_URL" |
| `process_zombie` | Linux | 90 | 6 turns | `kill -9` | "Process won't die. Like, philosophically." |
| `port_conflict` | Linux | 100 | 4 turns | `kill -9` | "Address already in use: 8080" |
| `infinite_loop` | Serverless | 120 | 3 turns | `az functionapp function invoke` | "CPU: 100%. Has been for 3 hours." |
| `failed_pipeline` | IaC | 110 | 5 turns | `az pipelines run` | "Build failed. Again." |
| `merge_conflict` | IaC | 100 | 4 turns | `git revert` | "CONFLICT (content): Merge conflict in everything.js" |
| `yaml_syntax_error` | IaC | 90 | 5 turns | `terraform plan` | "did not find expected key (line 47, col 3)" |
| `dependency_hell` | Containers | 130 | 4 turns | `docker build` | "Peer dependency mismatch: reality vs expectations" |
| `circular_dependency` | IaC | 140 | 3 turns | `git revert` | "Module A requires B which requires A which requires B which requires…" |
| `environment_mismatch` | Cloud | 110 | 5 turns | `az webapp deploy` | "Works in staging. Not in prod. Definitely staging's fault." |
| `config_drift` | IaC | 120 | 4 turns | `terraform apply` | "Manual changes detected. 17 of them." |
| `quota_exceeded` | Cloud | 100 | 4 turns | `cost optimization` | "OperationNotAllowed: Quota exceeded for resource" |
| `cost_spike` | Cloud | 90 | 6 turns | `cost optimization` | "This month's bill: $47,000. Normal month: $3,200." |
| `high_error_rate` | Cloud | 150 | 4 turns | `canary release` | "Error rate: 23%. SLA: 99.9%. You do the math." |
| `latency_spike` | Observability | 130 | 4 turns | `KQL query` | "P99 latency: 47 seconds. Expected: 200ms." |
| `database_timeout` | Cloud | 160 | 3 turns | `disaster_recovery` | "Connection pool exhausted. Every connection." |
| `memory_leak` | Linux | 140 | 5 turns | `tail -f /var/log/syslog` | "Available memory: 47MB. Starting: 32GB." |
| `runaway_process` | Linux | 120 | 4 turns | `kill -9` | "PID 1337 is eating your server. Has been for 6 hours." |
| `prod_incident` | Cloud | 200 | 3 turns | `disaster_recovery` | "Severity 2. Customers calling. Boss calling. Mom calling." |
| `cascade_failure` | Cloud | 240 | 2 turns | `blue-green deploy` | "Service A is down. Service B depends on A. Service C depends on B. You get the idea." |
| `sev1_at_3am` | Cloud | 300 | 2 turns | `disaster_recovery` | "03:47 AM. PagerDuty. Production down. Sleep is a myth." |
| `crashloopbackoff` | Kubernetes | 150 | 4 turns | `kubectl rollout restart` | "CrashLoopBackOff. Pod is trying. Pod is failing. Pod is trying. Pod is failing." |
| `evicted_pod` | Kubernetes | 110 | 5 turns | `kubectl apply -f` | "Evicted: The node ran out of memory. Shocker." |
| `pending_forever` | Kubernetes | 100 | 6 turns | `kubectl scale --replicas=10` | "Pending… Pending… Pending…" |
| `node_pressure` | Kubernetes | 170 | 3 turns | `kubectl drain node` | "MemoryPressure: True. DiskPressure: True. Patience: False." |
| `secret_exposed` | Security | 180 | 3 turns | `vault kv rotate` | "Your AWS credentials are trending on Twitter." |
| `permission_denied` | Security | 130 | 5 turns | `chmod 644` | "403 Forbidden. You are not permitted to perform this action." |
| `expired_cert` | Security | 120 | 4 turns | `certbot renew` | "Your certificate expired 47 days ago. All 47 of them." |

---

## SLA Breach Effects

When the SLA timer reaches 0, the incident gains a damage bonus each subsequent turn:

| Turns Over SLA | Bonus Damage |
|---|---|
| 1 | +20% |
| 2 | +40% |
| 3 | +60% |
| 4+ | +80% (cap) |

The `PagerDuty acknowledge` skill pauses the SLA timer for 2 turns.

---

*See [Combat Guide](combat-guide.md) for full turn mechanics and solution quality tiers.*
