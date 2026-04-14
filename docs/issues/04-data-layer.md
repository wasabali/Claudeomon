# Issue 4 — [Game] Data Layer — Skills, Items, Trainers, Emblems

## Context

All game content — skills, items, trainers, quests, emblems, encounters — is defined as **pure data** in `src/data/`. No logic, no Phaser imports, no side effects. Just plain JavaScript objects that describe what things are.

Every data module exports a `getById()` helper using the Registry pattern so consumers never iterate arrays. This keeps data access O(1) and consistent across the entire codebase.

See `docs/GAME_DESIGN.md` → *Core Skill Domains*, *Inventory System*, *Cursed Technique Trainers*, *Certification Emblems* sections.

---

## Depends On

- Issue 1 (config.js for any shared constants)

---

## Files to Create

```
src/data/
├── skills.js       # All skill definitions
├── items.js        # All item definitions across 5 bag tabs
├── trainers.js     # Good trainers + 10 cursed technique trainers
├── emblems.js      # 8 emblem definitions
├── quests.js       # Quest stages, rewards, flags
└── encounters.js   # Encounter tables per region
```

---

## Registry Pattern (apply to ALL data modules)

```js
// Every module follows this exact shape
const DATA = {
  some_id: { id: 'some_id', ...fields },
}
export const getById   = (id) => DATA[id]
export const getAll    = () => Object.values(DATA)
export const getBy     = (field, value) => getAll().filter(x => x[field] === value)
```

---

## `skills.js`

Skill domains: `linux` | `devops` | `cicd` | `kubernetes` | `azure`
Skill tiers: `1` (Novice) | `2` (Practitioner) | `3` (Expert) | `4` (Master)

Each skill:
```js
{
  id: 'kubectl_rollout_restart',
  name: 'kubectl rollout restart',
  domain: 'kubernetes',
  tier: 1,
  description: 'Reset opponent buffs. Fix CrashLoopBackOff.',
  battleEffect: 'reset_opponent_buffs',   // key into BattleEffects map
  budgetCost: 0,
  learnedFrom: 'trainer:kube_master',     // source reference
  isCursed: false,
}
```

Skills to include (minimum — expand freely):

| ID | Name | Domain | Tier | Effect |
|----|------|--------|------|--------|
| `systemctl_restart` | systemctl restart | linux | 1 | Heal 20 HP |
| `grep_logs` | grep logs | linux | 1 | Reveal opponent weakness |
| `chmod_fix` | chmod fix | linux | 1 | Remove Denied status |
| `git_revert` | git revert | devops | 1 | Undo last turn damage |
| `blue_green_deploy` | blue-green deploy | devops | 2 | No-downtime swap, prevent next status |
| `feature_flag` | feature flag | devops | 2 | Hide a skill from opponent for 2 turns |
| `pipeline_run` | az pipelines run | cicd | 1 | Deal damage, 30% fail chance |
| `docker_build` | docker build | cicd | 1 | Boost next skill damage 1.5x |
| `helm_upgrade` | helm upgrade | cicd | 2 | Apply buff that lasts 3 turns |
| `kubectl_rollout_restart` | kubectl rollout restart | kubernetes | 1 | Reset opponent buffs |
| `kubectl_apply` | kubectl apply -f | kubernetes | 2 | Build up; powerful next turn |
| `helm_install` | helm install | kubernetes | 2 | Summon persistent shield for 2 turns |
| `az_webapp_deploy` | az webapp deploy | azure | 1 | Standard damage |
| `bicep_deploy` | bicep deploy | azure | 2 | Slow but powerful (skip 1 turn, deal 2x) |
| `az_monitor_alert` | az monitor alert | azure | 1 | Reveal + tag weakness |
| `scale_out` | scale out | azure | 2 | Boost max HP for 3 turns (costs budget) |
| `cost_optimization` | cost optimization scan | azure | 2 | Drain opponent budget each turn |
| `blame_dns` | blame DNS | devops | 1 | 50% confuse all, including self |
| `open_a_ticket` | open a ticket | devops | 1 | Freeze battle 1 turn |
| `read_the_docs` | read the docs | linux | 1 | Reveal opponent weaknesses |
| `disaster_recovery` | disaster recovery failover | azure | 3 | Full heal, costs 2 turns |

**Cursed skills** (isCursed: true):

| ID | Name | Effect | Side Effect |
|----|------|--------|-------------|
| `force_push` | git push --force | Wipe opponent last 3 turns | Delete random teammate work |
| `deploy_to_prod` | deploy directly to prod | Instant win, no rollback | 40% outage next battle |
| `merge_no_review` | merge without review | Win current turn | Bug surfaces 3 battles later |
| `chmod_777` | sudo chmod 777 / | Remove all permission errors | Drop own defences to 0 |
| `delete_all_pods` | kubectl delete pod --all | Clear all opponent buffs | Restart own services, lose 1 turn |
| `no_verify` | --no-verify commit | Bypass all pre-checks | 50% next skill fails silently |
| `hardcode_secret` | hardcode the secret | Solve auth instantly | Reputation -20 permanent |
| `rebase_999` | git rebase -i HEAD~999 | Rewrite battle history | 30% corrupt own skill deck |
| `rm_rf` | rm -rf / | Wipe all opponent statuses | Wipe own statuses too |
| `restart_no_notice` | restart prod without notice | Full self-heal | On-Call forced for 5 battles |

---

## `items.js`

Tabs: `tools` | `keyItems` | `credentials` | `docs` | `junk`

Each item:
```js
{
  id: 'red_bull',
  name: 'Red Bull',
  tab: 'tools',
  stackable: true,
  usableInBattle: true,
  description: '3am fuel. Restores 30 HP.',
  effect: 'restore_hp_30',
  canDrop: true,
}
```

Items to include:

| ID | Name | Tab | Effect |
|----|------|-----|--------|
| `red_bull` | Red Bull | tools | Restore 30 HP |
| `rollback_potion` | Rollback Potion | tools | Undo last failed skill |
| `azure_credit_voucher` | Azure Credit Voucher | tools | Restore 50 Budget |
| `skip_tests_scroll` | Skip Tests Scroll | tools | Bypass skill check (cursed feel) |
| `ssh_key_staging` | SSH Key (Staging) | keyItems | Unlock staging server doors |
| `staging_env_token` | Staging Env Token | keyItems | Required to enter Staging Valley |
| `on_call_phone` | On-Call Phone | keyItems | Activates On-Call status |
| `az_sp_cert` | Azure Service Principal Cert | credentials | Auth token for Azure battles |
| `outdated_runbook` | Outdated Runbook | docs | Read for +5 XP (half the steps are wrong) |
| `incident_postmortem` | Incident Postmortem | docs | Study after loss for +20 XP bonus |
| `terraform_state` | Terraform State File | docs | Don't touch it. Don't move it. |
| `root_password_note` | Root Password (sticky note) | junk | Found in Margaret's house. Useless. Horrifying. |
| `mystery_node_modules` | Mystery node_modules | junk | 47,000 files. Does nothing. Can't delete. |
| `stale_pr` | Stale PR | junk | Open since 2019. Nobody will merge it. |

---

## `trainers.js`

Each trainer:
```js
{
  id: 'ola_ops',
  name: 'Ola the Ops Guy',
  domain: 'linux',
  isCursed: false,
  location: 'localhost_town',
  greeting: "You call that a grep? Let me show you something.",
  defeatDialog: "Fine. Take systemctl. Use it wisely.",
  signatureSkill: 'systemctl_restart',
  rewardSkill: 'systemctl_restart',
  difficulty: 1,
}
```

Good trainers:

| ID | Name | Domain | Location | Signature Skill |
|----|------|--------|----------|----------------|
| `ola_ops` | Ola the Ops Guy | linux | localhost_town | systemctl_restart |
| `tux_wizard` | Tux the Terminal Wizard | linux | shell_cavern | grep_logs |
| `fatima_witch` | Fatima the Function Witch | azure | pipeline_pass | az_webapp_deploy |
| `bjorn_breaker` | Bjørn the Build Breaker | cicd | jira_dungeon | pipeline_run |
| `ingrid_iam` | Ingrid the IAM Inspector | azure | security_vault | chmod_fix |
| `kube_master` | The Kube-rnetes Master | kubernetes | kubernetes_colosseum | kubectl_apply |
| `helm_hansen` | Helm Hansen | kubernetes | helm_repository | helm_install |
| `oracle_alice` | The Solutions Oracle | azure | architecture_district | az_monitor_alert |

Cursed trainers (`isCursed: true`) — each teaches one cursed skill on defeat:

| ID | Name | Vibe | Cursed Skill |
|----|------|------|-------------|
| `force_pusher` | The Force Pusher | "Rules are for people who didn't write the code." | force_push |
| `hotfix_hakon` | Hotfix Håkon | Sweating. 14 open tabs. | deploy_to_prod |
| `merge_magda` | Merge Magda | Always rushing. Never reviews PRs. | merge_no_review |
| `root_whisperer` | The Root Whisperer | Runs everything as root. Wears a cape. | chmod_777 |
| `kubectl_karen` | kubectl Karen | "I don't have time for manifests." | delete_all_pods |
| `skip_sigrid` | Skip-Tests Sigrid | "Tests slow me down." Eyes twitch. | no_verify |
| `hardcode_henrik` | Hardcode Henrik | Has API keys in commit history. | hardcode_secret |
| `rebase_reverend` | The Rebase Reverend | Preaches rebase but uses it wrong. | rebase_999 |
| `rmrf_rune` | rm-rf Rune | Smells of burnt servers. | rm_rf |
| `downtime_dealer` | The Downtime Dealer | "Maintenance windows are a myth." | restart_no_notice |

---

## `emblems.js`

Each emblem:
```js
{
  id: 'tux',
  name: 'Tux Emblem',
  icon: '🐧',
  domain: 'Linux Fundamentals',
  gymBoss: 'The Legacy Monolith',
  grimeDescription: 'Terminal scrollback residue',
  passiveBonus: { type: 'skill_effectiveness', domain: 'linux', amount: 0.05 },
  certRequired: null,  // or cert ID
}
```

All 8 emblems:

| ID | Name | Domain | Grime | Passive Bonus |
|----|------|--------|-------|--------------|
| `tux` | 🐧 Tux Emblem | Linux | Terminal scrollback residue | Linux skills +5% effectiveness |
| `pipeline` | ⚙️ Pipeline Emblem | CI/CD | Failed build red ink splatter | CI/CD fail chance -5% |
| `container` | 📦 Container Emblem | Docker | node_modules dust | Docker skills +5% effectiveness |
| `cloud` | ☁️ Cloud Emblem | Azure Core | Azure portal spinner smudges | Budget drain -10% |
| `vault` | 🔒 Vault Emblem | Security | Leaked secret stains | Shame Point gain -1 |
| `helm` | ⎈ Helm Emblem | Kubernetes | CrashLoopBackOff soot | Kubernetes skills +5% effectiveness |
| `finops` | 💰 FinOps Emblem | Architecture | Billing alert residue | Budget restored +10% after each battle |
| `sre` | 🛡️ SRE Emblem | Reliability | 3am coffee ring stains | Max HP +10 |

---

## `quests.js`

Each quest:
```js
{
  id: 'margaret_website',
  npc: 'old_margaret',
  location: 'localhost_town',
  stages: [
    {
      dialog: ["My bakery website keeps going down!", "Can you help?"],
      choices: [
        { text: "Have you tried restarting it?", correct: false, hpLoss: 10 },
        { text: "You need Azure App Service.", correct: true },
        { text: "Buy more RAM.", correct: false, hpLoss: 10 },
      ],
      correctDialog: ["You're a lifesaver! Here, take this."],
      wrongDialog: ["That didn't help..."],
    }
  ],
  rewards: { xp: 50, items: [{ id: 'azure_credit_voucher', qty: 1 }] },
  completedDialog: ["The website's been running for 3 days! Best week ever."],
  followUp: null,
}
```

---

## `encounters.js`

Encounter tables per region:

```js
export const ENCOUNTER_TABLES = {
  localhost_town: [],   // No random encounters in starting town
  pipeline_pass: [
    { type: 'rival_trainer', weight: 40 },
    { type: 'incident_report', weight: 35 },
    { type: 'lost_intern', weight: 20 },
    { type: 'senior_engineer', weight: 5 },
  ],
  production_plains: [
    { type: 'rival_trainer', weight: 30 },
    { type: 'incident_report', weight: 40 },
    { type: 'on_call_alert', weight: 20 },
    { type: 'sales_rep', weight: 10 },
  ],
}
```

---

## Acceptance Criteria

- [ ] `getSkill('kubectl_rollout_restart')` returns correct definition
- [ ] `getSkillsByDomain('kubernetes')` returns all kubernetes skills
- [ ] All 10 cursed trainers defined with `isCursed: true` and valid `sideEffect`
- [ ] All 8 emblems defined with `grimeDescription` and `passiveBonus`
- [ ] All items assigned to correct tab
- [ ] `mystery_node_modules` has `canDrop: false`
- [ ] No duplicate IDs across any data file
- [ ] All data files have zero Phaser imports
- [ ] All data files have zero imports from `engine/` or `scenes/`
