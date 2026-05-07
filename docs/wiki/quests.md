# Quests

Quests are conversations and multi-stage tasks given by NPCs across the world. Unlike battles, quests are solved through **dialog choices** — the quality of your answer determines your reward tier (Optimal, Standard, Shortcut, Cursed, or Nuclear).

---

## Quest Reward Tiers

| Tier | XP Multiplier | Rep Delta | Shame | Notes |
|---|---|---|---|---|
| Optimal | ×2 | +++ | 0 | Best outcome, sometimes unlocks follow-up content |
| Standard | ×1 | + | 0 | Gets the job done |
| Shortcut | ×0.5 | − | 0 | Technically works, frowned upon |
| Cursed | ×0.25 | −− | +1 | Why would you do that |
| Nuclear | ×0 | −−− | +2 | Catastrophic outcome |

---

## Main Story Quests

### Margaret's Website *(Localhost Town · Act 1)*

**NPC:** Old Margaret — the bakery owner whose Azure App Service keeps going down.

| Tier | Skills Used | Outcome |
|---|---|---|
| Optimal | `az monitor logs`, `az webapp deploy` | +10 Rep, drops `incident_postmortem`, unlocks `margaret_will_send_gift` |
| Standard | `az webapp restart` | +3 Rep, drops `cold_coffee` |
| Shortcut | `az webapp stop` | −5 Rep, closes Margaret's quest line |
| Nuclear | `rm -rf /` | −30 Rep, +2 Shame, drops `scorched_server`, Margaret flees |

**Reward:** 50 XP + 1× Azure Credit Voucher

---

### Do Not Touch *(OldCorp Basement · Act 3)*

**NPC:** Dagny the DBA — guarding a legacy VB6 billing service that has not been touched in seven years.

**Requires:** flags `act_3_started` + `oldcorp_entered`

This is a **branch quest** — two paths:

#### Branch A — Open it anyway
Triggers the `vb6_billing_horror` encounter.
- **Win:** +1 Shame, learn `exec_xp_cmdshell`, sets flag `do_not_touch_opened`
- **Lose:** −20 HP, −10 Rep, invoices broken for months

#### Branch B — Migrate it properly
Choose your migration strategy:
| Answer | Result | XP |
|---|---|---|
| Rewrite in Python and YOLO deploy | Wrong — −50 Budget | 0 |
| Lift and shift to Azure App Service | Standard | 80 |
| Strangler fig pattern — migrate incrementally | **Optimal** — drops `legacy_migration_badge` | 150 |

---

## Side Quests

### Dev Dave: Flaky Tests *(Pipeline Pass · Act 1)*

**NPC:** Dev Dave — his pipeline fails randomly.

| Answer | Tier | Reward |
|---|---|---|
| Delete the failing test | Wrong | −20 Budget |
| Add retry logic | Standard | 75 XP |
| Find the race condition and fix it | **Optimal** | 120 XP + `skip_tests_scroll` |

**Completion Reward:** +5 Reputation

---

### Startup Steve: Disk Full *(Staging Valley · Act 1)*

**NPC:** Startup Steve — ran out of disk space and the app is crashing.

| Answer | Tier | Reward |
|---|---|---|
| Delete the logs folder | Shortcut | 30 XP, −5 Rep |
| Mount a bigger volume | Standard | 60 XP + `ssh_key_staging` |
| Identify and clean up old artifacts | **Optimal** | 90 XP + `ssh_key_staging` |

**Completion Reward:** +5 Reputation

---

### Nervous Nancy: Security Breach *(Production Plains · Act 2)*

**NPC:** Nervous Nancy — someone is in the database.

| Answer | Tier | Reward |
|---|---|---|
| Change your passwords | Standard | 80 XP, −5 Rep |
| Rotate all credentials and revoke access | **Optimal** | 120 XP |
| Don't worry, it's probably fine | Nuclear | 0 XP, +2 Shame, −30 Rep, triggers `leaked_secret` encounter |

**Completion Reward:** +10 Reputation

---

### Budget Barry: The Azure Bill *(Azure Town · Act 2)*

**NPC:** Budget Barry — Azure bill jumped from €200 to €600 overnight.

| Answer | Tier | Reward |
|---|---|---|
| Call Microsoft and yell at them | Wrong | −15 Rep |
| Enable cost alerts and investigate | **Optimal** | 100 XP + `azure_credit_voucher` |
| Delete everything and start over | Cursed | 25 XP, +1 Shame, −30 Rep |

**Completion Reward:** +5 Reputation

---

### Intern Ivan: Roaming Lessons *(Roaming · Acts 1–5)*

**NPC:** Intern Ivan — a new intern with increasingly philosophical questions. He appears in five regions across the game.

| Location | Question | Optimal Answer | XP |
|---|---|---|---|
| Pipeline Pass | What is a container? | A sandboxed process with its own filesystem | 30 |
| Staging Valley | What is a Kubernetes? | Container orchestration platform | 40 |
| Jira Dungeon | What is the cloud? | Distributed computing resources on demand | 50 |
| Architecture District | What is a computer? | A machine that follows instructions | 60 |
| Cloud Console | What is infrastructure? | Everything under the application | 100 |

**Completion Reward:** +15 Reputation, drops `dockertle_treat` on final stage

---

### Architect Alice: System Design *(Architecture District · Act 2+)*

**NPC:** Architect Alice — a multi-stage architecture review that spans the whole late game.

Each stage **requires specific world progress** before it unlocks. Only one correct answer per stage — wrong answers reset the stage.

| Stage | Unlock Requirement | Optimal Answer | Reward |
|---|---|---|---|
| 1 — Load Handling | `architecture_district_entered` | Auto-scaling + load balancer | `blueprint_v1` |
| 2 — Security | `security_vault_cleared` | Zero-trust + IAM roles | `blueprint_v2` |
| 3 — Containers | `kube_master_defeated` | Docker + K8s with resource limits | `blueprint_v3` |
| 4 — Full Presentation | All 3 blueprints + `gym_7_complete` | Scaled, secured, containerised with limits | Principal-level recognition |

**Completion Reward:** 200 XP, +20 Reputation

---

## Tech Debt Cleanup Chain *(Runbook Library · Act 2+)*

**NPC:** The Tech Debt Auditor — a 10-quest chain that clears your `technicalDebt` counter one stack at a time. Complete all 10 to earn the **Clean Slate** emblem variant.

| Quest | Task | Correct Answer | XP | Debt Cleared |
|---|---|---|---|---|
| 1 | Dead imports | Remove unused imports | 30 | 1 |
| 2 | Orphaned feature flags | Audit and remove stale flags | 35 | 1 |
| 3 | CVE-ridden dependency | Upgrade with tested migration path | 40 | 1 |
| 4 | Hardcoded credentials | Rotate credentials, move to key vault | 45 | 1 |
| 5 | 800-line function | Extract into focused modules | 50 | 1 |
| 6 | Flaky 45-min CI | Quarantine flaky tests, parallelize | 55 | 1 |
| 7 | Shared database microservices | Define service boundaries, add API contracts | 60 | 1 |
| 8 | Catch-all error handling | Implement structured error handling and alerting | 65 | 1 |
| 9 | 14-step manual deploy | Automate the pipeline end-to-end | 70 | 1 |
| 10 | 6-year-old monolith | Strangler fig pattern — extract and replace | 100 | 1 |

**Total:** 550 XP, 10 Technical Debt cleared, Clean Slate emblem variant

---

*Auto-generated from `src/data/quests.js`*
