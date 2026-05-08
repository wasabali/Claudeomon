# Character Sprite Mapping

Maps every Cloud Quest trainer and the player character to a **LPC (Liberated Pixel Cup)** character archetype.

## How to read this table

- **spriteKey** — the Phaser texture key used in `BootScene.preload()` and referenced in `trainers.js`
- **File** — `assets/sprites/characters/<spriteKey>.png` (48 × 48 px per frame, LPC format)
- **Archetype** — the visual archetype / role-descriptive name

---

## Player Character

| Role | spriteKey | Archetype | Notes |
|------|-----------|-----------|-------|
| Player | `player_default` | Young cloud engineer | Hoodie, laptop bag, 4-direction walk cycle |

---

## Named Trainers — Gym Leaders & Story Bosses

| Trainer ID | Name | Domain | spriteKey | Archetype | Notes |
|------------|------|--------|-----------|-----------|-------|
| `ola_ops` | Ola the Ops Guy | linux | `senior_ops_npc` | Senior ops engineer | Grizzled veteran — been running Linux forever |
| `tux_wizard` | Tux the Terminal Wizard | linux | `devops_npc` | DevOps engineer | Robed wizard — terminal magic |
| `fatima_witch` | Fatima the Function Witch | serverless | `security_engineer_npc` | Security engineer | Female specialist — serverless spells |
| `bjorn_breaker` | Bjørn the Build Breaker | iac | `infra_engineer_npc` | Infra engineer | Large and destructive — breaks pipelines |
| `ingrid_iam` | Ingrid the IAM Inspector | security | `cloud_engineer_npc` | Cloud engineer | Security guardian, principled |
| `kube_master` | The Kube-rnetes Master | kubernetes | `data_engineer_npc` | Data engineer | Disciplined commander, Kubernetes authority |
| `helm_hansen` | Helm Hansen | containers | `staff_engineer_npc` | Staff engineer | Fleet commander — steers the cluster |
| `oracle_alice` | The Solutions Oracle | observability | `principal_engineer_npc` | Principal engineer | Elder seer — knows everything about the system |
| `captain_nines` | Captain Nines | cloud | `senior_engineer_npc` | Senior engineer | Honourable high-availability champion |
| `scrum_siri` | Scrum Siri | observability | `platform_engineer_npc` | Platform engineer | Meditative, counts story points |
| `docker_dag` | Docker Dag | containers | `junior_engineer_npc` | Junior engineer | Container grunt — armoured layers |
| `sla_signe` | SLA Signe | cloud | `frontend_engineer_npc` | Frontend engineer | Precise timing, never misses an SLA |
| `story_point_soren` | Story Point Søren | observability | `backend_engineer_npc` | Backend engineer | Trickster estimation guru |
| `layer_lars` | Layer Lars | containers | `junior_engineer_npc` | Junior engineer | Methodical, one layer at a time |
| `replica_set_ragnhild` | Replica Set Ragnhild | kubernetes | `cloud_engineer_npc` | Cloud engineer | Resilient, always keeps replicas up |
| `architect_aleksander` | Architect Aleksander | observability | `cursed_trainer_npc` | Cursed trainer | Dark observability — sees the whole picture |
| `logging_lena` | Logging Lena | linux | `security_engineer_npc` | Security engineer | Reads every log line, all-knowing |
| `alert_anders` | Alert Anders | cloud | `devrel_npc` | DevRel NPC | Always on edge, fires alerts at will |
| `pipeline_per` | Pipeline Per | iac | `sysadmin_npc` | Sysadmin | Automated CI/CD pipeline embodied |
| `trigger_trude` | Trigger Trude | serverless | `hacker_npc` | Hacker | Event-driven, strikes on trigger |
| `manifest_magnus` | Manifest Magnus | kubernetes | `data_engineer_npc` | Data engineer | Orderly, manifest-driven precision |
| `policy_pal` | Policy Pål | security | `senior_engineer_npc` | Senior engineer | Principled enforcer of policy |
| `metrics_maja` | Metrics Maja | observability | `devops_npc` | DevOps engineer | Metrics conjurer |
| `deploy_diana` | Deploy Diana | cloud | `frontend_engineer_npc` | Frontend engineer | Precise deployment targeting |
| `incident_ivan` | Incident Ivan | observability | `sre_npc` | SRE | Battle-hardened incident responder |

---

## Story / Quest NPCs (non-combat)

These NPCs appear on the overworld for dialog and quest interactions only. They have no battle deck.

| Trainer ID | Name | Location | spriteKey | Archetype | Notes |
|------------|------|----------|-----------|-----------|-------|
| `margaret` | Old Margaret | localhost_town | `cloud_engineer_npc` | Cloud engineer | Bakery owner, quest giver, capable senior |
| `professor_pedersen` | Professor Pedersen | localhost_town | `cto_npc` | CTO | Academic authority, mentor figure |
| `random_intern` | Random Intern | localhost_town | `intern_npc` | Intern | Fresh recruit, no experience |

---

## Gym Apprentices (generic trainers)

Apprentices reuse shared character types. Each gym's apprentices get the domain-appropriate archetype.

| Trainer ID | Name | Domain | spriteKey | Notes |
|------------|------|--------|-----------|-------|
| `fundamentals_apprentice_a` | Apprentice Engineer A | linux | `platform_engineer_npc` | Student archetype |
| `fundamentals_apprentice_b` | Apprentice Engineer B | linux | `backend_engineer_npc` | Student archetype |
| `admin_apprentice_a` | Apprentice Engineer A | cloud | `junior_engineer_npc` | Cloud admin |
| `admin_apprentice_b` | Apprentice Engineer B | cloud | `junior_engineer_npc` | Cloud admin |
| `devops_apprentice_a` | Apprentice Engineer A | iac | `intern_npc` | DevOps student |
| `devops_apprentice_b` | Apprentice Engineer B | iac | `intern_npc` | DevOps student |
| `developer_apprentice_a` | Apprentice Engineer A | serverless | `intern_npc` | Dev student |
| `developer_apprentice_b` | Apprentice Engineer B | serverless | `intern_npc` | Dev student |
| `kubernetes_apprentice_a` | Apprentice Engineer A | kubernetes | `junior_engineer_npc` | Kube trainee |
| `kubernetes_apprentice_b` | Apprentice Engineer B | kubernetes | `junior_engineer_npc` | Kube trainee |
| `security_apprentice_a` | Apprentice Engineer A | security | `senior_engineer_npc` | Security guard |
| `security_apprentice_b` | Apprentice Engineer B | security | `senior_engineer_npc` | Security guard |
| `architecture_apprentice_a` | Apprentice Engineer A | observability | `devops_npc` | Architecture student |
| `architecture_apprentice_b` | Apprentice Engineer B | observability | `devops_npc` | Architecture student |
| `cto_apprentice_a` | Apprentice Engineer A | cloud | `intern_npc` | CTO's hire |
| `cto_apprentice_b` | Apprentice Engineer B | kubernetes | `intern_npc` | CTO's hire |
| `cto_apprentice_c` | Apprentice Engineer C | security | `intern_npc` | CTO's hire |

---

## Mid-Game Trainers

| Trainer ID | Name | Domain | spriteKey | Notes |
|------------|------|--------|-----------|-------|
| `lambda_lars` | Lambda Lars | serverless | `devops_npc` | Serverless spell-caster |
| `docker_diana` | Docker Diana | containers | `cloud_engineer_npc` | Container fighter |
| `terraform_tore` | Terraform Tore | iac | `sre_npc` | IaC terrain former |
| `firewall_frida` | Firewall Frida | security | `security_engineer_npc` | Security barrier |
| `grafana_gerd` | Grafana Gerd | observability | `devops_npc` | Dashboard conjurer |
| `ci_carl` | CI Carl | iac | `junior_engineer_npc` | Automation grunt |
| `cloud_costas` | Cloud Costas | cloud | `intern_npc` | Young cloud traveller |
| `nfs_nora` | NFS Nora | linux | `cloud_engineer_npc` | Linux filesystem fighter |
| `devops_dave` | DevOps Dave | iac | `junior_engineer_npc` | DevOps operator |
| `scale_set_sven` | Scale Set Sven | cloud | `infra_engineer_npc` | Scales everything up aggressively |

---

## Cursed Trainers (hidden areas)

| Trainer ID | Name | Domain | spriteKey | Notes |
|------------|------|--------|-----------|-------|
| `force_pusher` | The Force Pusher | iac | `devrel_npc` | Stealthy bad actor, force pushes to main |
| `hotfix_hakon` | Hotfix Håkon | cloud | `chaos_engineer_npc` | Quick fix opportunist |
| `merge_magda` | Merge Magda | iac | `cloud_engineer_npc` | Merge conflict chaos |
| `root_whisperer` | The Root Whisperer | security | `demon_trainer_npc` | All-access sinister figure |
| `kubectl_karen` | kubectl Karen | kubernetes | `security_engineer_npc` | Demands to speak to the kube-manager |
| `skip_sigrid` | Skip-Tests Sigrid | iac | `hacker_npc` | Skips all the tests, fast and reckless |
| `hardcode_henrik` | Hardcode Henrik | security | `goblin_engineer_npc` | Hardcoded values, primitive approach |
| `rebase_reverend` | The Rebase Reverend | iac | `platform_engineer_npc` | Dogmatic rebase preacher |
| `rmrf_rune` | rm-rf Rune | linux | `legacy_engineer_npc` | Massive destructive brute |
| `downtime_dealer` | The Downtime Dealer | cloud | `demon_trainer_npc` | Sells downtime |
| `deprecated_dagfinn` | Deprecated Dagfinn | linux | `zombie_process_npc` | Ancient deprecated undead |
| `privileged_petra` | Privileged Petra | containers | `senior_engineer_npc` | Over-privileged container runner |
| `null_pointer` | The Null Pointer | observability | `jira_slime_npc` | Formless null entity |
| `west_eu_2_wilhelm` | West-EU-2 Wilhelm | cloud | `compliance_officer_npc` | Region sheriff |
| `yolo_yaml` | YOLO Yaml Ylva | kubernetes | `scrum_master_npc` | Chaotic YAML-slinger |
| `sudo_su_saga` | sudo su Saga | linux | `cloud_engineer_npc` | Full root power |
| `env_var_erik` | .env Erik | security | `backend_engineer_npc` | Makes secrets disappear (into git) |
| `cron_catastrophe` | Cron Kristina | linux | `sysadmin_npc` | Broken scheduled automation |
| `legacy_leif` | Legacy Leif | linux | `zombie_process_npc` | Ancient legacy system undead |

---

## Wild Encounters

| Trainer ID | Name | Domain | spriteKey | Notes |
|------------|------|--------|-----------|-------|
| `lost_intern` | Lost Intern | linux | `intern_npc` | Young, confused, inexperienced |
| `rival_engineer` | Rival Cloud Engineer | (random) | `rival_engineer_npc` | The player's rival — same archetype |
| `sales_rep` | Sales Rep | cloud | `open_source_pirate_npc` | Selling snake oil, 10× the price |
| `senior_engineer` | Senior Engineer | (random) | `sre_npc` | Battle-hardened veteran |

---

## Final Boss

| Trainer ID | Name | Domain | spriteKey | Notes |
|------------|------|--------|-----------|-------|
| `the_cto` | The CTO | (all) | `cto_npc` | Final boss — the authority |

---

## Sprite Sheet Layout Reference

All character sprite sheets follow the **4-row × 3-column** walk-cycle grid (LPC format):

```
Row 0 (y = 0–47):   Facing DOWN  — frames 0, 1, 2
Row 1 (y = 48–95):  Facing LEFT  — frames 0, 1, 2
Row 2 (y = 96–143): Facing RIGHT — frames 0, 1, 2
Row 3 (y = 144–191):Facing UP    — frames 0, 1, 2
```

Sheet size: **144 × 192 px** (3 cols × 4 rows × 48px per frame)

### Phaser frame indices

| Action | Frames |
|--------|--------|
| Idle (down) | 1 |
| Walk down | 0, 1, 2 |
| Walk left | 3, 4, 5 |
| Walk right | 6, 7, 8 |
| Walk up | 9, 10, 11 |
| Battle idle | 1 (down facing) |
| Battle attack | 0 → 2 → 1 |

---

## Adding New Sprites

1. Visit the LPC generator: https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
2. Customise the character for the role (e.g. hoodie for intern, suit for CTO)
3. Export as PNG — output is a walk-cycle sheet at 48×48px per frame
4. Save as `assets/sprites/characters/<spriteKey>.png`
5. The sprite will be loaded automatically — `BootScene` loads all registered sprite keys
   and falls back silently if a file is missing.
6. Add the `spriteKey` to the trainer entry in `src/data/trainers.js`
