# ⚡ Encounters

Random battles in Cloud Quest come in two flavours: **Incidents** (technical problems with SLA timers) and **Engineer Battles** (PvP with trainers). You'll meet both while walking through regions — and if you're unlucky, at 3am.

See [Combat Guide](combat-guide.md) for full battle mechanics.

---

## How Encounters Work

Encounters trigger randomly as you walk. Here's the breakdown:

- **Base encounter chance:** 8% per eligible step
- **Running multiplier:** ×1.5 (holding Z while moving increases your odds — you're stomping around, things notice)
- **Cooldown:** 4 steps minimum between encounter checks — you won't get chain-ambushed *immediately*
- **Pool roll:** When an encounter triggers, the engine picks a pool: **Common 70% · Rare 25% · Cursed 5%**
- If the region's cursed pool is empty, that 5% rolls back into common/rare

Think of it like walking through tall grass, except the grass is poorly-configured infrastructure.

---

## Encounter Pools by Region

### 🏠 Localhost Town

| Pool | Encounters |
|---|---|
| Common | 404 Not Found, Missing Semicolon, Port Conflict |
| Rare | Failed Pipeline, npm install hang |
| Cursed | — |

### 🔧 Pipeline Pass

| Pool | Encounters |
|---|---|
| Common | npm install hang, 503 Service Unavailable, Failed Pipeline |
| Rare | Merge Conflict, Port Conflict |
| Cursed | — |

### 🏗️ Staging Valley

| Pool | Encounters |
|---|---|
| Common | Config Drift, Terraform State Lock, Failed Pipeline |
| Rare | Cold Start Cascade, Azure Bill Spike |
| Cursed | — |

### ☁️ Azure Town

| Pool | Encounters |
|---|---|
| Common | Azure Bill Spike, The Infinite Redirect, 503 Service Unavailable |
| Rare | Production Incident, Terraform State Lock |
| Cursed | SEV1 at 3am |

### ☁️ Cloud Console 1

| Pool | Encounters |
|---|---|
| Common | Config Drift, Flaky CI Pipeline |
| Rare | Azure Bill Spike |
| Cursed | — |

### ☁️ Cloud Console 2

| Pool | Encounters |
|---|---|
| Common | Config Drift, 503 Service Unavailable |
| Rare | Azure Bill Spike, Cold Start Cascade |
| Cursed | — |

### ☁️ The Cloud Console

| Pool | Encounters |
|---|---|
| Common | High CPU, Production Incident, 503 Service Unavailable |
| Rare | SEV1 at 3am, Runaway Process |
| Cursed | The Gantt Chart |

### 🏭 Production Plains

| Pool | Encounters |
|---|---|
| Common | High CPU, Disk Full, 503 Service Unavailable |
| Rare | Production Incident, Runaway Process |
| Cursed | SEV1 at 3am |

### 📋 Jira Dungeon (Full)

| Pool | Encounters |
|---|---|
| Common | Stale Ticket, Missing Acceptance Criteria, Blocked by QA, Flaky CI Pipeline, Config Drift |
| Rare | Scope Creep, Infinite Sprint |
| Cursed | The Gantt Chart |

### 📋 Jira Dungeon — Floor 1

| Pool | Encounters |
|---|---|
| Common | Stale Ticket, Missing Acceptance Criteria, Blocked by QA |
| Rare | Scope Creep |
| Cursed | — |

### 📋 Jira Dungeon — Floor 2

| Pool | Encounters |
|---|---|
| Common | Flaky CI Pipeline, Config Drift, Stale Ticket |
| Rare | Scope Creep, Infinite Sprint |
| Cursed | — |

### 📋 Jira Dungeon — Floor 3

| Pool | Encounters |
|---|---|
| Common | Config Drift, Missing Acceptance Criteria |
| Rare | Infinite Sprint |
| Cursed | The Gantt Chart |

### ⎈ Kubernetes Colosseum

| Pool | Encounters |
|---|---|
| Common | CrashLoopBackOff, OOM Kill, Pending Pod |
| Rare | Evicted Node, RBAC Denied, Leaked Secret |
| Cursed | The YAML Labyrinth |

### ⎈ Helm Repository

| Pool | Encounters |
|---|---|
| Common | Pending Pod, CrashLoopBackOff, OOM Kill |
| Rare | The YAML Labyrinth, RBAC Denied |
| Cursed | — |

### 🔒 Security Vault

| Pool | Encounters |
|---|---|
| Common | SSL Certificate Expired, Leaked Secret, RBAC Denied |
| Rare | The YAML Labyrinth, Evicted Node |
| Cursed | — |

### 🏛️ Architecture District

| Pool | Encounters |
|---|---|
| Common | The Phantom Alert, Config Drift, Stale Ticket |
| Rare | Scope Creep, Azure Bill Spike |
| Cursed | — |

### 🌙 3am Tavern

| Pool | Encounters |
|---|---|
| Common | Merge Conflict, Missing Semicolon, NullPointerException |
| Rare | Production Incident, Runaway Process, Azure Bill Spike, Cold Start Cascade |
| Cursed | SEV1 at 3am |

### 🐚 Shell Cavern

| Pool | Encounters |
|---|---|
| Common | Zombie Process, DNS Propagation, Missing Semicolon |
| Rare | Runaway Process, NullPointerException |
| Cursed | — |

### 💀 Server Graveyard *(hidden)*

| Pool | Encounters |
|---|---|
| Common | Zombie Process, Disk Full, Runaway Process |
| Rare | Evicted Node, Memory Leak |
| Cursed | — |

### 🌿 node_modules Maze *(hidden)*

| Pool | Encounters |
|---|---|
| Common | Dependency Hell, npm install hang, Docker Image 4GB |
| Rare | Memory Leak, Cold Start Cascade |
| Cursed | The Gantt Chart |

### ♾️ /dev/null Void *(hidden)*

| Pool | Encounters |
|---|---|
| Common | The Phantom Alert, NullPointerException, Zombie Process |
| Rare | Runaway Process, Config Drift |
| Cursed | — |

### 🏚️ Deprecated Azure Region *(hidden)*

| Pool | Encounters |
|---|---|
| Common | Config Drift, Stale Ticket, 503 Service Unavailable |
| Rare | Azure Bill Spike, Terraform State Lock |
| Cursed | SEV1 at 3am |

### 🏢 OldCorp Basement *(hidden)*

| Pool | Encounters |
|---|---|
| Common | Disk Full, Zombie Process |
| Rare | The Legacy Monolith |
| Cursed | The VB6 Billing Horror |

For hidden area access methods, see [Hidden Areas](hidden-areas.md).

---

## Encounter Rates by Region

Not all regions are created equal. Some are safe, some are hostile, and some are *actively trying to page you*.

| Region | Base Rate | Steps Per Roll |
|---|---|---|
| Localhost Town | 0% (safe zone) | 1 |
| Pipeline Pass | 15% | 4 |
| Jira Dungeon | 25% | 3 |
| Production Plains | 20% | 3 |
| Kubernetes Colosseum | 30% | 2 |
| 3am Tavern | 40% | 2 |

Other regions use the global default: 8% base chance, 4 steps between checks.

---

## Incident Reference

Incidents are **anonymous enemies** — you don't know their domain until you diagnose with an Observability skill. The SLA timer counts down each turn. When it hits zero, bad things happen.

### Standard Incidents

| Incident | Domain | HP | SLA | Difficulty | Optimal Fix | Layers? |
|---|---|---|---|---|---|---|
| 404 Not Found | Cloud | 20 | 5 | 1 | `az webapp deploy` | — |
| npm install hang | Containers | 25 | 4 | 1 | `kubectl rollout restart` | — |
| Missing Semicolon | IaC | 26 | 5 | 1 | `az pipelines run` | — |
| Port Conflict | Linux | 28 | 4 | 2 | `kill -9` | — |
| Zombie Process | Linux | 28 | 4 | 3 | `kill -9` | — |
| 503 Service Unavailable | Cloud | 30 | 4 | 1 | `az webapp deploy` | — |
| The Infinite Redirect | Cloud | 30 | 4 | 2 | `az webapp deploy` | — |
| DNS Propagation | Linux | 30 | 4 | 3 | `grep "ERROR" /var/log/*` | — |
| NullPointerException | Linux | 30 | 4 | 2 | `grep "ERROR" /var/log/*` | — |
| Stale Ticket | Observability | 30 | 5 | 2 | `grep "ERROR" /var/log/*` | — |
| SSL Certificate Expired | Security | 32 | 4 | 2 | `vault kv rotate` | — |
| Merge Conflict | IaC | 32 | 4 | 2 | `git revert` | — |
| Missing Acceptance Criteria | IaC | 34 | 5 | 2 | `terraform plan` | — |
| Disk Full | Linux | 34 | 4 | 2 | `kill -9` | — |
| Failed Pipeline | IaC | 35 | 4 | 2 | `az pipelines run` | — |
| High CPU | Cloud | 35 | 4 | 2 | `az scale out` | — |
| Docker Image 4GB | Containers | 35 | 4 | 2 | `docker build` | — |
| Leaked Secret | Security | 35 | 3 | 3 | `vault kv rotate` | — |
| Blocked by QA | Observability | 36 | 4 | 2 | `grep "ERROR" /var/log/*` | — |
| Flaky CI Pipeline | Cloud | 36 | 4 | 2 | `az pipelines run` | — |
| Pending Pod | Kubernetes | 37 | 4 | 3 | `kubectl scale --replicas=10` | — |
| CrashLoopBackOff | Kubernetes | 38 | 4 | 3 | `kubectl rollout restart` | ✅ |
| Dependency Hell | Containers | 38 | 4 | 3 | `docker build` | — |
| Cold Start Cascade | Serverless | 38 | 3 | 3 | `az functionapp deploy` | — |
| Scope Creep | Cloud | 40 | 4 | 3 | `feature flag` | — |
| OOM Kill | Containers | 40 | 4 | 3 | `kubectl scale --replicas=10` | ✅ |
| Infinite Sprint | Serverless | 42 | 4 | 3 | `az functionapp deploy` | — |
| Memory Leak | Containers | 42 | 3 | 3 | `kubectl scale --replicas=10` | ✅ |
| Config Drift | IaC | 44 | 4 | 3 | `terraform apply` | — |
| Runaway Process | Linux | 44 | 3 | 3 | `kill -9` | — |
| Production Incident | Cloud | 45 | 3 | 4 | `blue-green deploy` | — |
| Terraform State Lock | IaC | 45 | 3 | 4 | `terraform apply` | — |
| RBAC Denied | Security | 46 | 3 | 4 | `chmod 644` | — |
| Evicted Node | Kubernetes | 48 | 3 | 4 | `kubectl drain node` | — |
| The Phantom Alert | Observability | 25 | 5 | 2 | `grep "ERROR" /var/log/*` | — |
| Cold Start Timeout | Serverless | 22 | 4 | 2 | `az functionapp deploy` | — |

### Cursed & Boss Encounters

| Incident | Domain | HP | SLA | Difficulty | Optimal Fix | Notes |
|---|---|---|---|---|---|---|
| The Gantt Chart | IaC | 50 | 3 | 4 | `terraform apply` | Cursed pool. Waterfall methodology incarnate. |
| SEV1 at 3am | Observability | 55 | 2 | 5 | *(none)* | Cursed pool. On-call nightmare. No single optimal fix. |
| The YAML Labyrinth | Kubernetes | 60 | 2 | 5 | `helm upgrade` | Cursed pool. Nested Helm templates gone wrong. |
| Azure Bill Spike | Cloud | 100 | 3 | 4 | `cost optimization` | Mini-boss. Has `cost_spiral_active` boss flag. Costs grow each turn. |
| The VB6 Billing Horror | Linux | 80 | 5 | 4 | `systemctl restart` | Immune to Cloud, IaC, Kubernetes, and Containers domains. Running since 1998. |
| The Legacy Monolith | Security | 200 | 3 | 5 | *(none)* | Immune to Cloud, IaC, Kubernetes, and Containers. Vulnerable to Linux and Security only. Drops `oldcorp_keycard`. |

### Scripted & Boss: THROTTLEMASTER

| Encounter | Type | Domain | HP | SLA | Notes |
|---|---|---|---|---|---|
| THROTTLEMASTER (Act 2) | Scripted | Security | 9999 | 5 | Unwinnable escape encounter. Connection timeout on SLA expiry. You're meant to lose. |
| THROTTLEMASTER (Act 4) | Boss | Cloud | 80 + 60 | 3 | Two-phase final boss. Phase 2: Resource Exhaustion — budget and HP drain simultaneously. |

The Act 4 fight has shame-dependent endings: arrest at Shame ≥ 10, recruitment at Shame ≥ 15.

---

## Multi-Layer Encounters

Some incidents have a **second phase** that triggers after you defeat the surface layer. The hidden layer has a different domain, lower HP, and its own optimal fix. Layers make these encounters longer but more rewarding — you're solving the *real* problem.

| Incident | Surface Domain / HP | Hidden Layer Domain / HP | Hidden Layer Fix |
|---|---|---|---|
| CrashLoopBackOff | Kubernetes / 38 | Security / 28 | `vault kv rotate` |
| OOM Kill | Containers / 40 | Kubernetes / 25 | `kubectl apply -f` |
| Memory Leak | Containers / 42 | Kubernetes / 28 | `kubectl apply -f` |

**Tip:** When the surface layer falls, the hidden layer's symptom text appears automatically. Diagnose again — the domain has changed.

---

## SLA Breach Effects

When the SLA timer hits 0:

- You take **HP damage** (default: 20 HP; the 3am Incident Response gym uses 30 HP)
- You take **reputation penalty** (default: -10 rep; the 3am Incident Response gym uses -15 rep)
- If the incident is still alive, the battle ends as a **loss**

The `PagerDuty acknowledge` skill pauses the SLA timer for 2 turns — use it to buy time when the clock is low. See [Tips & Tricks](tips-and-tricks.md) for more SLA strategies.

---

## Special Incident Properties

Some incidents have extra mechanics beyond the standard fight:

- **On-Call incidents** (Production Incident, SEV1 at 3am) apply the `on_call` status — random encounters can trigger after the battle
- **Azure Bill Spike** has the `cost_spiral_active` flag — budget drains faster each turn, HP grows. End it fast.
- **The Legacy Monolith** and **VB6 Billing Horror** have `immuneDomains` — Cloud, IaC, Kubernetes, and Containers skills deal 0 damage. Bring Linux or Security skills or suffer.

---

*See [Combat Guide](combat-guide.md) for full turn mechanics and solution quality tiers.*
*See [Hidden Areas](hidden-areas.md) for how to access cursed encounter pools in secret regions.*
*See [Skills Reference](skills-reference.md) for all available skills and their domains.*
