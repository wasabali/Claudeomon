# 👾 Encounters

Random encounters come in two flavours: **Incidents** (technical problems) and **Engineers** (trainer battles). This page covers incident pools by region and stats for every incident in the game.

> Encounter pools roll: **Common 70%** · **Rare 25%** · **Cursed 5%** (when pool is non-empty).

---

## Encounter Pools by Region

### Localhost Town
| Pool | Incidents |
|---|---|
| Common | 404 Not Found, Missing Semicolon, Port Conflict |
| Rare | Failed Pipeline, npm install hang |
| Cursed | *(none)* |

### Pipeline Pass (Encounter Rate: 15%)
| Pool | Incidents |
|---|---|
| Common | npm install hang, 503 Service Unavailable, Failed Pipeline |
| Rare | Merge Conflict, Port Conflict |
| Cursed | *(none)* |

### Jira Dungeon (Encounter Rate: 25%)
| Pool | Incidents |
|---|---|
| Common | Stale Ticket, Missing Acceptance Criteria, Blocked by QA, Flaky CI Pipeline, Config Drift |
| Rare | Scope Creep, Infinite Sprint |
| Cursed | The Gantt Chart |

### Production Plains (Encounter Rate: 20%)
| Pool | Incidents |
|---|---|
| Common | High CPU, Disk Full, 503 Service Unavailable |
| Rare | Production Incident, Runaway Process |
| Cursed | SEV1 at 3am |

### Kubernetes Colosseum (Encounter Rate: 30%)
| Pool | Incidents |
|---|---|
| Common | CrashLoopBackOff, OOM Kill, Pending Pod |
| Rare | Evicted Node, RBAC Denied, Leaked Secret |
| Cursed | The YAML Labyrinth |

### Three AM Tavern (Encounter Rate: 40%)
| Pool | Incidents |
|---|---|
| Common | Merge Conflict, Missing Semicolon, NullPointerException |
| Rare | Production Incident, Runaway Process, Azure Bill Spike, Cold Start Cascade |
| Cursed | SEV1 at 3am |

### Server Graveyard
| Pool | Incidents |
|---|---|
| Common | Zombie Process, Disk Full, Runaway Process |
| Rare | Evicted Node, Memory Leak |
| Cursed | *(none)* |

### Node_modules Maze
| Pool | Incidents |
|---|---|
| Common | Dependency Hell, npm install hang, Docker Image 4GB |
| Rare | Memory Leak, Cold Start Cascade |
| Cursed | The Gantt Chart |

### /dev/null Void
| Pool | Incidents |
|---|---|
| Common | The Phantom Alert, NullPointerException, Zombie Process |
| Rare | Runaway Process, Config Drift |
| Cursed | *(none)* |

### Deprecated Azure Region
| Pool | Incidents |
|---|---|
| Common | Config Drift, Stale Ticket, 503 Service Unavailable |
| Rare | Azure Bill Spike, Terraform State Lock |
| Cursed | SEV1 at 3am |

### Staging Valley
| Pool | Incidents |
|---|---|
| Common | Config Drift, Terraform State Lock, Failed Pipeline |
| Rare | Cold Start Cascade, Azure Bill Spike |
| Cursed | *(none)* |

### OldCorp Basement
| Pool | Incidents |
|---|---|
| Common | Disk Full, Zombie Process |
| Rare | The Legacy Monolith |
| Cursed | The VB6 Billing Horror |

### Shell Cavern
| Pool | Incidents |
|---|---|
| Common | Zombie Process, DNS Propagation, Missing Semicolon |
| Rare | Runaway Process, NullPointerException |
| Cursed | *(none)* |

### Helm Repository
| Pool | Incidents |
|---|---|
| Common | Pending Pod, CrashLoopBackOff, OOM Kill |
| Rare | The YAML Labyrinth, RBAC Denied |
| Cursed | *(none)* |

### Security Vault
| Pool | Incidents |
|---|---|
| Common | SSL Certificate Expired, Leaked Secret, RBAC Denied |
| Rare | The YAML Labyrinth, Evicted Node |
| Cursed | *(none)* |

### Architecture District
| Pool | Incidents |
|---|---|
| Common | The Phantom Alert, Config Drift, Stale Ticket |
| Rare | Scope Creep, Azure Bill Spike |
| Cursed | *(none)* |

---

## Incident Stats

| Incident | Domain | HP | SLA | Difficulty | Optimal Fix |
|---|---|---|---|---|---|
| 404 Not Found | Cloud | 20 | 5 | 1 | `az webapp deploy` |
| npm install hang | Containers | 25 | 4 | 1 | `kubectl rollout restart` |
| 503 Service Unavailable | Cloud | 30 | 4 | 1 | `az webapp deploy` |
| Missing Semicolon | IaC | 26 | 5 | 1 | `az pipelines run` |
| Port Conflict | Linux | 28 | 4 | 2 | Force-terminate the blocking process |
| Stale Ticket | Observability | 30 | 5 | 2 | `grep "ERROR" /var/log/*` |
| Blocked by QA | Observability | 36 | 4 | 2 | `grep "ERROR" /var/log/*` |
| Missing Acceptance Criteria | IaC | 34 | 5 | 2 | `terraform plan` |
| Failed Pipeline | IaC | 35 | 4 | 2 | `az pipelines run` |
| Merge Conflict | IaC | 32 | 4 | 2 | `git revert` |
| High CPU | Cloud | 35 | 4 | 2 | `az scale out` |
| Disk Full | Linux | 34 | 4 | 2 | Log cleanup or process removal |
| NullPointerException | Linux | 30 | 4 | 2 | `grep "ERROR" /var/log/*` |
| Flaky CI Pipeline | Cloud | 36 | 4 | 2 | `az pipelines run` |
| SSL Certificate Expired | Security | 32 | 4 | 2 | `vault kv rotate` |
| Cold Start Timeout | Serverless | 22 | 4 | 2 | `az functionapp deploy` |
| Docker Image 4GB | Containers | 35 | 4 | 2 | `docker build` |
| Infinite Redirect | Cloud | 30 | 4 | 2 | `az webapp deploy` |
| The Phantom Alert | Observability | 25 | 5 | 2 | `grep "ERROR" /var/log/*` |
| Zombie Process | Linux | 28 | 4 | 3 | Force-terminate |
| DNS Propagation | Linux | 30 | 4 | 3 | `grep "ERROR" /var/log/*` |
| Scope Creep | Cloud | 40 | 4 | 3 | `feature flag` |
| Infinite Sprint | Serverless | 42 | 4 | 3 | `az functionapp deploy` |
| Config Drift | IaC | 44 | 4 | 3 | `terraform apply` |
| CrashLoopBackOff | Kubernetes | 38 | 4 | 3 | `kubectl rollout restart` |
| OOM Kill | Containers | 40 | 4 | 3 | `kubectl scale --replicas=10` |
| Pending Pod | Kubernetes | 37 | 4 | 3 | `kubectl scale --replicas=10` |
| Runaway Process | Linux | 44 | 3 | 3 | Force-terminate |
| Cold Start Cascade | Serverless | 38 | 3 | 3 | `az functionapp deploy` |
| Leaked Secret | Security | 35 | 3 | 3 | `vault kv rotate` |
| Memory Leak | Containers | 42 | 3 | 3 | `kubectl scale --replicas=10` |
| Dependency Hell | Containers | 38 | 4 | 3 | `docker build` |
| Production Incident | Cloud | 45 | 3 | 4 | `blue-green deploy` |
| Evicted Node | Kubernetes | 48 | 3 | 4 | `kubectl drain node` |
| RBAC Denied | Security | 46 | 3 | 4 | `chmod 644` |
| Terraform State Lock | IaC | 45 | 3 | 4 | `terraform apply` |
| The Gantt Chart | IaC | 50 | 3 | 4 | `terraform apply` |
| Azure Bill Spike | Cloud | 100 | 3 | 4 | `cost optimization` |
| The VB6 Billing Horror | Linux | 80 | 5 | 4 | `systemctl restart` |
| The YAML Labyrinth | Kubernetes | 60 | 2 | 5 | `helm upgrade` |
| SEV1 at 3am | Observability | 55 | 2 | 5 | *(diagnose first)* |
| The Legacy Monolith | Security | 200 | 3 | 5 | *(linux/security only)* |

---

## Special Incident Notes

**Azure Bill Spike** (HP 100) — Boss-class. Someone left 47 GPU instances running over the weekend. Frequent budget drain attacks with a `cost_spiral_active` boss flag.

**The VB6 Billing Horror** (HP 80) — Immune to Cloud, IaC, Kubernetes, and Containers. Only Linux and Security work on it. Running since 1998 and did not want to stop.

**The Legacy Monolith** (HP 200) — OldCorp Basement rare encounter. Same immunities as VB6, but 200 HP. A 1994 server rack communicating via BSOD error codes. Drops `oldcorp_keycard`.

**SEV1 at 3am** — No predetermined optimal fix. Use Observability to diagnose the root cause first. SLA is only 2 turns — act immediately. On-Call status applies after.

**Production Incident** — On-Call battle. Reputation drain and budget spike attacks. Losing triggers a cascade.

---

## Multi-Layer Incidents

Some incidents reveal a second phase once the first HP bar is defeated. Domain and root cause shift:

| Incident | Phase 2 Domain | Phase 2 HP | Phase 2 Optimal Fix |
|---|---|---|---|
| CrashLoopBackOff | Security | 28 | `vault kv rotate` |
| OOM Kill | Kubernetes | 25 | `kubectl apply -f` |
| Memory Leak | Kubernetes | 28 | `kubectl apply -f` |

---

> *"Context-dependent — observability required to determine root cause."*  
> — SEV1 at 3am root cause description

See [Combat Guide](combat-guide.md) for SLA timer mechanics and [Skills Reference](skills-reference.md) for optimal fix details.
