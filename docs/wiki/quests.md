# 📜 Quests

Quests are story missions from NPCs. Most have multiple solution paths — the one you choose affects your reputation, shame, and available rewards. Choose wisely. Or don't. We're not your manager.

---

## Act 1 Quests

### 🧁 Deploy Old Margaret's Bakery

| | |
|---|---|
| **Quest ID** | `margaret_website` |
| **NPC** | Old Margaret |
| **Location** | Localhost Town |
| **Act** | 1 |
| **Base Reward** | 50 XP, Azure Credit Voucher ×1 |

**Story:** Old Margaret's bakery website is down. She's been calling support for three days and they keep saying "our engineers are looking into it." You're the junior engineer assigned.

**Stages:**
1. Talk to Margaret → she explains the problem
2. Choose your approach to fix the website

**Solutions:**

| Approach | Skills Used | XP Mult. | Rep | Shame | Item Drop | Consequence |
|---|---|---|---|---|---|---|
| Optimal | `az monitor logs` → `az webapp deploy` | ×2 | +10 | 0 | Incident Postmortem | Margaret sends a gift later; sets `margaret_will_send_gift` flag |
| Standard | `az webapp restart` | ×1 | +3 | 0 | Cold Coffee | Website fixed, basic outcome |
| Shortcut | `az webapp stop` | ×0.5 | −5 | 0 | — | Quest line closed forever (`margaret_quest_line_closed`) |
| Nuclear | `rm -rf /` | ×0 | −30 | +2 | Scorched Server | Margaret flees Localhost Town (`margaret_fled`) |

**Completion dialog:** *"The website's been running for 3 days! Best week ever."*

**Notes:** Margaret reappears in Act 2 and Act 3 depending on how you solved this. The Optimal path makes her a recurring vendor. The Nuclear path… well, she's gone.

---

### 🧪 Flaky Tests Investigation

| | |
|---|---|
| **Quest ID** | `dev_dave_flaky` |
| **NPC** | DevOps Dave |
| **Location** | Pipeline Pass |
| **Act** | 1 |
| **Requires** | `act_1_started` flag |
| **Base Reward** | +5 Reputation |

**Story:** DevOps Dave's CI pipeline has been randomly failing for two weeks. He's been marking it as "flaky" and re-running it. You've been assigned to investigate.

**Solutions:**

| Approach | Choice | XP | Reward |
|---|---|---|---|
| Wrong | Delete the failing test | 0 | −20 budget penalty |
| Standard | Add retry logic to the test | 75 | Pipeline more stable, not fixed |
| Optimal | Find the race condition and fix it | 120 | `skip_tests_scroll` item ×1, sets `dave_quest_optimal` flag |

**Follow-up dialog:** *"That fix held up in prod. You're the real MVP."*

---

### 📦 Startup Steve's Storage Problem

| | |
|---|---|
| **Quest ID** | `startup_steve_storage` |
| **NPC** | Startup Steve |
| **Location** | Staging Valley |
| **Act** | 1 |
| **Requires** | `act_1_started` flag |
| **Base Reward** | +5 Reputation |

**Story:** Steve ran out of disk space. The app is crashing. He needs a fix before the demo in 3 hours.

**Solutions:**

| Approach | Choice | XP | Rep | Reward |
|---|---|---|---|---|
| Shortcut | Delete the logs folder | 30 | −5 | Space freed temporarily |
| Standard | Mount a bigger volume | 60 | — | `ssh_key_staging` item ×1 |
| Optimal | Identify and clean up old artifacts | 90 | — | `ssh_key_staging` item ×1, sets `steve_quest_optimal` flag |

---

## Act 2 Quests

### 🔐 Nervous Nancy's Security Breach

| | |
|---|---|
| **Quest ID** | `nervous_nancy_breach` |
| **NPC** | Nervous Nancy |
| **Location** | Production Plains |
| **Act** | 2 |
| **Requires** | `act_2_started` flag |

**Story:** Nancy is a security engineer who found what looks like a credential exposure in the logs. She's not sure if it's a real breach or a false positive. She needs it assessed and contained fast — SLA is already ticking.

**Solutions:**

| Approach | Skill | Rep | Reward |
|---|---|---|---|
| Optimal | Diagnose + `vault kv rotate` | +8 | `certbot renew` skill + SLA not breached |
| Standard | `vault kv rotate` (no diagnose) | +3 | Contained, SLA breached by 1 turn |
| Shortcut | `ignore all alerts` (pretend false positive) | −8, +1 Shame | Audit event triggers in Act 3 |

---

### 🔧 Tech Debt Cleanup Chain (10 Parts)

A 10-part quest chain available from Act 2 onward. Given by the **Tech Debt Auditor** in the Runbook Library. Once started, it cannot be abandoned. Each quest clears 1 stack of `technical_debt` status.

| # | Quest | Task | XP | Special Reward |
|---|---|---|---|---|
| 1 | Dead Imports | Remove unused imports | 30 | −1 tech debt |
| 2 | Orphaned Feature Flags | Audit and remove stale flags | 35 | −1 tech debt |
| 3 | Ancient Dependency | Upgrade dependency with 47 CVEs | 40 | −1 tech debt |
| 4 | Hardcoded Credentials | Rotate credentials, move to key vault | 45 | −1 tech debt |
| 5 | 800-Line Function | Extract into focused modules | 50 | −1 tech debt |
| 6 | Flaky Test Suite | Quarantine flaky tests, parallelize | 55 | −1 tech debt |
| 7 | Shared Database | Define service boundaries, add API contracts | 60 | −1 tech debt |
| 8 | Silent Error Handling | Implement structured error handling | 65 | −1 tech debt |
| 9 | 14-Step Manual Deploy | Automate the pipeline end-to-end | 70 | −1 tech debt |
| 10 | The 6-Year Monolith | Strangler fig pattern — extract and replace | 100 | −1 tech debt, **Clean Slate** |

**Total chain reward:** All 10 tech debt stacks cleared, `disaster_recovery` skill, +60 rep, special Architecture District dialogue, and the satisfaction of cleaning up someone else's mess.

**Wrong answers hurt:** Each quest has a tempting-but-wrong option that costs 5–10 HP. The auditor does not mince words.

| Quest | Wrong Answer | Auditor Response |
|---|---|---|
| #1 | "Add more imports to balance it out" | *"That is not how technical debt works."* |
| #5 | "Add region comments to organize it" | *"Region comments are a cry for help, not a solution."* |
| #6 | "Skip CI on this branch" | *"Skipping CI is how fires start."* |
| #9 | "Document the manual steps in a wiki" | *"A wiki nobody reads is not automation."* |
| #10 | "Rewrite from scratch in a weekend" | *"Nobody has ever successfully rewritten from scratch in a weekend. Nobody."* |

---

## Act 3 Quests

### 💾 DO_NOT_TOUCH.exe

| | |
|---|---|
| **Quest ID** | `do_not_touch` |
| **NPC** | Dagny DBA |
| **Location** | OldCorp Basement ([hidden area](hidden-areas.md)) |
| **Act** | 3 |
| **Requires** | `act_3_started` + `oldcorp_entered` flags |
| **Type** | Branching quest |

**Story:** A legacy VB6 billing service has been running in the basement for seven years. Nobody has touched it. It runs the company's invoices. Dagny DBA warns you, but here you are anyway.

*"There's a legacy billing service in the corner. Nobody has touched it in seven years. It runs on VB6 and pays the company's invoices. What do you want to do with it?"*

**Branches:**

#### Option A: Open it anyway
Triggers the **VB6 Billing Horror** encounter (80 HP, Linux domain, immune to Cloud/IaC/Kubernetes/Containers).

| Outcome | Reward | Penalty |
|---|---|---|
| Win | Learn `EXEC xp_cmdshell` (999 damage, nuclear tier) | +1 Shame, sets `do_not_touch_opened` |
| Lose | — | −20 HP, −10 Reputation |

The loser dialog: *"The invoices will be wrong for months."*

#### Option B: Migrate it properly
A quiz about migration strategy:

| Answer | Result | Reward |
|---|---|---|
| "Rewrite it in Python and YOLO deploy" | Wrong | −50 budget |
| "Lift and shift to Azure App Service" | Standard | 80 XP |
| "Strangler fig pattern — migrate incrementally" | Optimal | 150 XP + Legacy Migration Badge |

Optimal dialog: *"That's exactly right. Take this — you've earned it. The migration badge. Wear it with pride."*

#### Option C: Leave it alone
The safe option. No reward, no penalty. The VB6 service continues running. As it has. Since 1998.

> ⚠️ This quest is only accessible from the [OldCorp Basement hidden area](hidden-areas.md). It has permanent consequences — `EXEC xp_cmdshell` cannot be unlearned.

---

## *Planned* Quests

The following quests are described in design documents but not yet fully implemented:

- **The Architecture Review** — Act 3, Architecture District. A full system review that tests your knowledge of all 8 domains.
- **The Post-Mortem** — Act 4. Write a blameless post-mortem for the final incident. Your choices throughout the game affect the available options.
- **Vendor Lock-In** — Act 2, Azure Town. A procurement NPC tries to lock you into a 3-year contract. Your budget management skills are tested.

---

## NPC Quest Flags

Certain quest outcomes set flags that affect later dialogue and quest availability:

| Flag | Set By | Effect |
|---|---|---|
| `margaret_will_send_gift` | Optimal solution on Margaret's Bakery | Margaret becomes vendor in Act 2 |
| `margaret_fled` | Nuclear solution on Margaret's Bakery | Margaret hostile/absent in Act 3 |
| `margaret_quest_line_closed` | Shortcut solution on Margaret's Bakery | No further Margaret quests |
| `dave_quest_optimal` | Optimal on Flaky Tests | Dave returns as ally later |
| `steve_quest_optimal` | Optimal on Steve's Storage | Steve returns in Architecture District |
| `do_not_touch_opened` | Opening DO_NOT_TOUCH.exe | Evil path content unlocked |
| `do_not_touch_migrated_optimal` | Optimal migration on DO_NOT_TOUCH | Legacy Migration Badge earned |
| `do_not_touch_resolved` | Completing any DO_NOT_TOUCH branch | Quest complete flag |

---

*See [Reputation & Shame](reputation-and-shame.md) for how quest solutions affect your stats.*
*See [Hidden Areas](hidden-areas.md) for how to reach OldCorp Basement.*
*See [Encounters](encounters.md) for the VB6 Billing Horror encounter stats.*
