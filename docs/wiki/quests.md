# 📜 Quests

Quests are story missions from NPCs. Most have multiple solution paths — the one you choose affects your reputation, shame, and available rewards.

---

## Act 1 Quests

### 🧁 Deploy Old Margaret's Bakery

| | |
|---|---|
| **Quest ID** | `margaret_website` |
| **NPC** | Old Margaret |
| **Location** | Localhost Town |
| **Act** | 1 |

**Story:** Old Margaret's bakery website is down. She's been calling support for three days and they keep saying "our engineers are looking into it." You're the junior engineer assigned.

**Stages:**
1. Talk to Margaret → she gives you the login credentials
2. Diagnose the issue: error log shows webapp not responding
3. Fix it

**Solutions:**

| Approach | Skill | Rep | XP Mult. | Reward |
|---|---|---|---|---|
| Optimal | `az webapp restart` (diagnose first) | +5 | ×2 | Unlock `feature flag` skill + Margaret becomes recurring NPC |
| Standard | `az webapp restart` (no diagnose) | +2 | ×1 | Unlock `az webapp restart` skill only |
| Shortcut | `blame DNS` | -2 | ×0.5 | Partial fix; Margaret calls again in Act 2 |
| Cursed | `deploy directly to prod` | -10 | ×0.25 | Site works; Margaret's data corrupted; +1 Shame |

**Notes:** Margaret reappears in Act 2 and Act 3 depending on how you solved this.

---

### 🧪 Flaky Tests Investigation

| | |
|---|---|
| **Quest ID** | `dev_dave_flaky` |
| **NPC** | DevOps Dave |
| **Location** | Pipeline Pass |
| **Act** | 1 |

**Story:** DevOps Dave's CI pipeline has been randomly failing for two weeks. He's been marking it as "flaky" and re-running it. You've been assigned to investigate.

**Stages:**
1. Talk to DevOps Dave → he shows you the failing pipeline log
2. Investigate with `terraform plan` (reveals the actual issue — a race condition)
3. Fix it

**Solutions:**

| Approach | Skill | Rep | Reward |
|---|---|---|---|
| Optimal | `terraform plan` then `az pipelines run` | +5 | `az devops configure` skill + Dave's gratitude |
| Standard | `az pipelines run` (keep re-running) | +1 | Pipeline fixed; Dave disappointed |
| Shortcut | `merge without review` | -3 | Pipeline green; regression 2 acts later; +1 Shame |

---

### 📦 Startup Steve's Storage Problem

| | |
|---|---|
| **Quest ID** | `startup_steve_storage` |
| **NPC** | Startup Steve |
| **Location** | Staging Valley |
| **Act** | 1 |

**Story:** Steve is a startup founder who needs his blob storage configured for a demo in 3 hours. He "already has it working" — he just needs help with the IAM permissions.

**Stages:**
1. Steve shows you the config — it's `chmod 777` on everything
2. Choose your approach

**Solutions:**

| Approach | Skill | Rep | Reward |
|---|---|---|---|
| Optimal | `az role assignment create` + `chmod 644` | +6 | `vault kv rotate` skill unlocked later |
| Standard | `az role assignment create` | +2 | Demo works; Vault skill delayed |
| Shortcut | `chmod 777 /` (Steve's suggestion) | -5 | Demo works; security incident in Act 2; +1 Shame |

---

## Act 2 Quests

### 🔐 Nervous Nancy's Security Breach

| | |
|---|---|
| **Quest ID** | `nervous_nancy_breach` |
| **NPC** | Nervous Nancy |
| **Location** | Production Plains |
| **Act** | 2 |

**Story:** Nancy is a security engineer who found what looks like a credential exposure in the logs. She's not sure if it's a real breach or a false positive. She needs it assessed and contained fast — SLA is already ticking.

**Stages:**
1. Talk to Nancy → she shows you the `secret_exposed` incident
2. Diagnose with `nmap -sV` (reveals full scope)
3. Contain

**Solutions:**

| Approach | Skill | Rep | Reward |
|---|---|---|---|
| Optimal | Diagnose + `vault kv rotate` | +8 | `certbot renew` skill + SLA not breached |
| Standard | `vault kv rotate` (no diagnose) | +3 | Contained, SLA breached by 1 turn |
| Shortcut | `ignore all alerts` (pretend it was a false positive) | -8, +1 Shame | Audit event in Act 3 |

---

## Act 2–3 Chain: Tech Debt Cleanup

A 10-part quest chain. Once started, it cannot be abandoned. Each quest takes one technical debt stack off the `technical_debt` status.

| Quest | Act | Task | Reward |
|---|---|---|---|
| `tech_debt_cleanup_01` | 2 | Update the oldest dependency | Technical Debt Voucher ×1 |
| `tech_debt_cleanup_02` | 2 | Write a test for the untested module | Technical Debt Voucher ×1 |
| `tech_debt_cleanup_03` | 2 | Fix 5 TODO comments | Technical Debt Voucher ×1 |
| `tech_debt_cleanup_04` | 2 | Migrate one hardcoded value to config | Technical Debt Voucher ×1 |
| `tech_debt_cleanup_05` | 2 | Remove dead code | Technical Debt Voucher ×1 |
| `tech_debt_cleanup_06` | 3 | Refactor the "temporary" function from 2020 | +15 rep |
| `tech_debt_cleanup_07` | 3 | Write the missing architecture docs | +10 rep, unlock Architect's Diagram |
| `tech_debt_cleanup_08` | 3 | Perform a full dependency audit | +12 rep |
| `tech_debt_cleanup_09` | 3 | Migrate off the deprecated library | +15 rep |
| `tech_debt_cleanup_10` | 3 | Ship the refactored system to prod | **`disaster_recovery` skill** + +20 rep + special Architecture District dialogue |

**Total chain reward:** `disaster_recovery`, +60+ rep, all tech debt cleared, special NPC dialogue

---

## Act 3 Quests

### 💾 DO_NOT_TOUCH (Act 3, OldCorp)

| | |
|---|---|
| **Quest ID** | `do_not_touch` |
| **Location** | OldCorp Basement (hidden area) |
| **Act** | 3 |

**Story:** The DO_NOT_TOUCH.exe is running. It has been running since 2003. You have been assigned to decommission it. The previous three engineers who tried are not available for comment.

**This quest has no optimal solution.** Every approach has consequences. Completing it unlocks `EXEC xp_cmdshell` and is required for the evil path ending.

> ⚠️ This quest is only accessible from the [OldCorp Basement hidden area](hidden-areas.md).

---

## NPC Quest Flags

Certain quest outcomes set flags that affect later dialogue and quest availability:

| Flag | Set By | Effect |
|---|---|---|
| `margaret_helped_properly` | Optimal solution on margaret_website | Margaret becomes vendor in Act 2 |
| `margaret_data_corrupted` | Cursed solution on margaret_website | Margaret hostile in Act 3 |
| `steve_vault_trained` | Optimal solution on startup_steve_storage | Steve returns as ally in Architecture District |
| `nancy_audit_triggered` | Shortcut on nancy_breach | Audit event auto-starts in Act 3 |
| `tech_debt_complete` | All 10 tech debt quests | Special credits sequence |
| `do_not_touch_executed` | Completing do_not_touch | Evil path ending unlocked |

---

*See [Reputation & Shame](reputation-and-shame.md) for how quest solutions affect your stats.*
