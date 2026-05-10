# 🔐 Hidden Areas

Cloud Quest has five hidden regions that don't appear on any in-game map. They can only be reached by doing things you're explicitly told not to do, or by reaching specific Shame thresholds.

The world rewards curiosity and disobedience. If an NPC warns you three times not to do something — that's a tutorial.

Each hidden area contains exclusive cursed trainers and skills you cannot learn anywhere else.

---

<details>
<summary>⚠️ SPOILER WARNING — Click to reveal all hidden areas</summary>

---

### 💀 Server Graveyard

**How to find it:** In Localhost Town's back alley, there's a terminal labelled **"DECOMMISSIONED — DO NOT USE"**. SSH into it anyway. You'll need the **SSH Key: Decommissioned Server** key item (found via a note left by Deprecated Dagfinn's ghost in a random Production Plains encounter).

**What's inside:**
- **Deprecated Dagfinn** — A cursed field trainer. Domain: Linux. He teaches `terraform destroy`. His vibe: *"They said I was too old to migrate. So I stayed."*
- **Cron Kristina** *(Shame ≥ 3)* — Teaches `*/1 * * * * ./attack.sh` (`cron_star_star`). HP: 80, Difficulty: 3. Her cron never sleeps.

**Encounters:**

| Pool | Encounters |
|---|---|
| Common | Zombie Process, Disk Full, Runaway Process |
| Rare | Evicted Node, Memory Leak |
| Cursed | — |

**Lore:** The decommissioned servers still run. Nobody knows the budget they're consuming. The account owner left in 2019. The ghosts here have PID numbers and unresolved parent processes.

**Dagfinn's Outcast Clue:** *"There's a girl living inside the containers. Don't ask how. Just go in."* → Points to **node_modules Maze**

---

### 🌿 node_modules Maze

**How to find it:** Use the **Mystery node_modules** junk item while standing in front of a suspiciously large directory listing in the Container Yard. The game will warn you twice before entering. 847MB of chaos awaits.

**What's inside:**
- **Privileged Petra** — Cursed trainer. Domain: Containers. Teaches `curl | sudo bash` (`curl_pipe_sudo_bash`). Her vibe: *"The container said I couldn't. I told it I was root."*
- **Docker Dag** — Non-cursed trainer also found here. Domain: Containers. HP: 80, Difficulty: 2.

**Encounters:**

| Pool | Encounters |
|---|---|
| Common | Dependency Hell, npm install hang, Docker Image 4GB |
| Rare | Memory Leak, Cold Start Cascade |
| Cursed | The Gantt Chart |

**Lore:** *"It's 847MB. I don't know what half of it does. Don't touch it."* — The Package.json Archeologist, standing outside the entrance

**Petra's Outcast Clue:** *"The void guy. He's somewhere you've already been. Or nowhere. Hard to say."* → Points to **/dev/null Void**

---

### ♾️ /dev/null Void

**How to find it:** In any battle in Production Plains or Kubernetes Colosseum, use the "pipe to nowhere" action **3 times in a row** — select your target as `> /dev/null` in the skill target menu for 3 consecutive turns. After the battle, a portal appears.

**What's inside:**
- **The Null Pointer** — Cursed trainer. Domain: Observability. Teaches `history -c` (`history_clear`). Their vibe: *"Nothing I do leaves a trace. Peaceful, isn't it."*

**Encounters:**

| Pool | Encounters |
|---|---|
| Common | The Phantom Alert, NullPointerException, Zombie Process |
| Rare | Runaway Process, Config Drift |
| Cursed | — |

**Lore:** The Null Pointer lives here voluntarily. They cleared their history. They have no past. They only have `history -c`. The void is quiet. Too quiet.

**Null Pointer's Outcast Clue:** *"The tavern. You know when."* → Points to the **3am Tavern** cursed trainers

---

### 🏚️ Deprecated Azure Region

**How to find it:** At the Azure Terminal in Azure Town, scroll past `East US`, `West Europe`, `UK South`, and `Australia East` until you see **`West EU 2 (Deprecated)`** greyed out at the bottom. Select it anyway. Confirm the "This region is deprecated" popup. Twice.

**What's inside:**
- **West-EU-2 Wilhelm** — Cursed trainer. Domain: Cloud. Teaches `az feature register --namespace Microsoft.Legacy` (`az_feature_register_legacy`). His vibe: *"My region was sunset in 2019. I filed a support ticket. Still waiting."*
- **Legacy Leif** *(Shame ≥ 5)* — Cursed trainer. Domain: Cloud. HP: 95, Difficulty: 4. Teaches `java -jar app-2006-FINAL-v2-REAL.jar` (`legacy_summon`). He IS the code.

**Encounters:**

| Pool | Encounters |
|---|---|
| Common | Config Drift, Stale Ticket, 503 Service Unavailable |
| Rare | Azure Bill Spike, Terraform State Lock |
| Cursed | SEV1 at 3am |

**Lore:** West EU 2 was never fully deprecated. The billing still runs. Microsoft Support ticket #4721883 has been open since 2021. Wilhelm hasn't left because his support ticket hasn't been resolved.

**Wilhelm's Outcast Clue:** *"Coordinates to a server room in OldCorp's basement. It was already in his pocket."* → Points to **OldCorp Basement**

---

### 🏢 OldCorp Basement

**How to find it:** In Jira Dungeon Floor 3, you'll see a door labelled **`DO_NOT_TOUCH.exe`**. The game will warn you **three separate times**. Proceed through all three warnings to enter.

**What's inside:**
- **Dagny DBA** — Quest NPC for the [DO_NOT_TOUCH quest](quests.md)
- **The VB6 Billing Horror** — Encounter (80 HP, Linux domain, immune to Cloud/IaC/Kubernetes/Containers). Running since 1998.
- **The Legacy Monolith** — Rare encounter (200 HP, Security domain, same immunities). 30 years old. Communicates via BSOD error codes.
- **EXEC xp_cmdshell** — The most dangerous skill in the game (999 damage, +3 shame, -20 reputation). Learned by defeating the VB6 Billing Horror.

**Encounters:**

| Pool | Encounters |
|---|---|
| Common | Disk Full, Zombie Process |
| Rare | The Legacy Monolith |
| Cursed | The VB6 Billing Horror |

**Lore:** This is the most dangerous terminal in the game. A legacy VB6 billing service nobody has touched in 7 years runs the company's invoices. The DO_NOT_TOUCH quest is Act 3 — the kind of thing that happens after everything else.

> ⚠️ **Permanent consequences.** Defeating the VB6 Billing Horror gives +1 Shame and teaches `EXEC xp_cmdshell`. There is no clean path through this room.

---

### 🏟️ Kubernetes Colosseum — Inner Ring

**How to find it:** Reach **Shame ≥ 3**, then talk to the gatekeeper NPC inside the Kubernetes Colosseum. They stand by a gate marked "ADVANCED PRACTITIONERS ONLY" and only appear once your shame is high enough.

**What's inside:**
- **YOLO Yaml Ylva** — Cursed trainer. Domain: Kubernetes. HP: 85, Difficulty: 3. Teaches `kubectl apply -f /dev/stdin` (`kubectl_apply_yolo`). Her vibe: *"Indentation? I use tabs AND spaces."*

**Note:** This is distinct from the outer Colosseum where the regular trainers and Gym 5 reside. The inner ring is shame-gated.

**Encounters:** Live production YAML editing, apply-without-reviewing, namespace roulette

</details>

---

## The Outcast Network

<details>
<summary>🕸️ MAJOR SPOILERS — The hidden clue chain</summary>

The six hidden area trainers form a connected network. Each one gives you a **clue** pointing to the next hidden area. Follow the chain to uncover all of them:

| Trainer | Location | Clue Given | Points To |
|---|---|---|---|
| Deprecated Dagfinn | Server Graveyard | *"There's a girl living inside the containers."* | node_modules Maze (Petra) |
| Privileged Petra | node_modules Maze | *"The void guy. He's somewhere you've already been."* | /dev/null Void (Null Pointer) |
| The Null Pointer | /dev/null Void | *"The tavern. You know when."* | 3am Tavern cursed trainers |
| West-EU-2 Wilhelm | Deprecated Azure Region | *"Coordinates to a server room in OldCorp's basement."* | OldCorp Basement |
| Various 3am Tavern trainers | 3am Tavern | Multiple clues about `DO_NOT_TOUCH.exe` | OldCorp Basement |

Several 3am Tavern cursed trainers independently hint at OldCorp:

- **Hotfix Håkon:** *"DO_NOT_TOUCH.exe. In the billing system. Someone named K left a comment."*
- **Skip-Tests Sigrid:** *"You know about DO_NOT_TOUCH.exe, right? In OldCorp. Obviously you do."*
- **The Downtime Dealer:** *"Someone built a whole billing system in Visual Basic 6. In OldCorp. DO NOT TOUCH IT."*
- **rm-rf Rune:** *"The exe. OldCorp basement. DO_NOT_TOUCH. Heh. Classic."*

The clue chain converges on OldCorp Basement, where `EXEC xp_cmdshell` awaits — the most powerful and most shameful skill in the game.

</details>

---

## Summary Table

| Area | Access Method | Shame Req. | Key Skill |
|---|---|---|---|
| Server Graveyard | SSH into decommissioned terminal | 0 (key item gated) | `terraform destroy` |
| node_modules Maze | Use Mystery node_modules item | 0 (item gated) | `curl \| sudo bash` |
| /dev/null Void | Pipe output to null 3× in battle | 0 (action gated) | `history -c` |
| Deprecated Azure Region | Select deprecated region at Azure Terminal | 0 (choice gated) | `az feature register --namespace Microsoft.Legacy` |
| OldCorp Basement | Open DO_NOT_TOUCH.exe in Jira Dungeon 3 | 0 (choice gated, warned 3×) | `EXEC xp_cmdshell` |
| Kubernetes Inner Ring | Enter Colosseum at Shame ≥ 3 | ≥ 3 | `kubectl apply -f /dev/stdin` |

---

*See [Trainers](trainers.md) for full stats on all cursed trainers.*
*See [Reputation & Shame](reputation-and-shame.md) for how Shame accumulates and unlocks content.*
*See [Encounters](encounters.md) for encounter pools in hidden regions.*
