# 🔐 Hidden Areas

Cloud Quest has six hidden zones that don't appear on any in-game map. They can only be reached by doing things you're explicitly told not to do, or by reaching specific Shame thresholds.

Each contains exclusive cursed trainers and skills you cannot learn anywhere else.

---

<details>
<summary>⚠️ Spoiler Warning — click to reveal hidden areas</summary>

---

### 💀 Server Graveyard

**How to access:** SSH into the terminal labelled "DECOMMISSIONED — DO NOT USE" in the Localhost Town back alley. You need the **SSH Key: Decommissioned Server** key item (found via a note left by Deprecated Dagfinn's ghost in a random Production Plains encounter).

**Who's there:**
- **Deprecated Dagfinn** — Field trainer. Teaches `terraform apply` and `az group delete --yes --force-deletion-types`
- **Cron Kristina** *(Shame ≥ 3)* — Teaches `*/1 * * * * ./attack.sh`

**Encounters:** Ghost processes, haunted crontabs, cursed legacy workloads

**Lore:** The decommissioned servers still run. Nobody knows the budget they're consuming. The account owner left in 2019.

---

### 🌿 node_modules Maze

**How to access:** Use the **Mystery node_modules** key item while standing in front of a `node_modules/` folder in the Container Yard (look for the suspiciously large directory listing). You'll be warned twice before entering.

**Who's there:**
- **Privileged Petra** — Teaches `docker run --privileged` and `curl example.com | sudo bash`

**Encounters:** Dependency loops, ghost packages, transitive vulnerabilities, the occasional useful module (very rare)

**Lore:** "It's 847MB. I don't know what half of it does. Don't touch it." — Package.json archeologist NPC outside the entrance

---

### ♾️ /dev/null Void

**How to access:** In a battle anywhere in Production Plains or Kubernetes Colosseum, use the "pipe to nowhere" action 3 times in a row (pipe skill output to nothing — select your target as `> /dev/null` in the skill target menu 3 consecutive turns).

**Who's there:**
- **The Null Pointer** — Teaches `history -c`

**Encounters:** None. The void is silent. Battles don't happen here — it's purely a trainer zone.

**Lore:** The Null Pointer lives here voluntarily. They cleared their history. They have no past. They only have `history -c`.

---

### 🏚️ Deprecated Azure Region

**How to access:** At the Azure Terminal in Azure Town, scroll past `East US`, `West Europe`, `UK South`, and `Australia East` until you see `West EU 2 (Deprecated)` greyed out. Select it anyway. Confirm the "This region is deprecated" popup twice.

**Who's there:**
- **West-EU-2 Wilhelm** — Teaches `az feature register --namespace Microsoft.Legacy`
- **Legacy Leif** *(Shame ≥ 5)* — Teaches `java -jar app-2006-FINAL-v2-REAL.jar`

**Encounters:** Unsupported API versions, deprecated SKUs, services that still technically work

**Lore:** West EU 2 was never fully deprecated. The billing still runs. Microsoft Support ticket #4721883 has been open since 2021.

---

### 🏢 OldCorp Basement

**How to access:** In Jira Dungeon floor 3, you'll see a door labelled `DO_NOT_TOUCH.exe`. The game will warn you three separate times. Proceed through all three warnings to find the **DO_NOT_TOUCH.exe** key item. Use it. A server room door opens.

**Who's there:**
- **The CTO's Legacy System** (special encounter — non-standard battle format)
- `EXEC xp_cmdshell` is learned by completing the encounter, not from a trainer

**Encounters:** Access DB queries, legacy COBOL-adjacent processes, Excel macros achieving sentience

**Lore:** "The do_not_touch quest is Act 3 — the kind of thing that happens after everything else. This is the relic from the Oracle's past." — Game design doc, Act 3 notes

> ⚠️ This area has permanent consequences. The DO_NOT_TOUCH.exe key item cannot be discarded after acquisition.

---

### 🏟️ Kubernetes Colosseum — Inner Ring

**How to access:** Reach Shame ≥ 3, then talk to the gatekeeper NPC in the Kubernetes Colosseum (they appear after you enter the Colosseum with Shame ≥ 3, standing by a gate marked "ADVANCED PRACTITIONERS ONLY").

**Who's there:**
- **YOLO Yaml Ylva** — Teaches `kubectl apply -f /dev/stdin`

**Note:** This is distinct from the outer Colosseum. The regular trainers and Gym 5 are in the outer ring. The inner ring is shame-gated.

**Encounters:** Live production YAML editing, apply-without-reviewing, namespace roulette

---

</details>

---

## Summary Table

| Area | Access Method | Shame Req. | Key Skill |
|---|---|---|---|
| Server Graveyard | SSH into decommissioned terminal | 0 (gated by key item) | `terraform apply` |
| node_modules Maze | Use Mystery node_modules item | 0 (gated by item) | `curl \| sudo bash` |
| /dev/null Void | Pipe output to null 3× in battle | 0 (action-gated) | `history -c` |
| Deprecated Azure Region | Select deprecated region at Azure Terminal | 0 (choice-gated) | `az feature register` |
| OldCorp Basement | Open DO_NOT_TOUCH.exe in Jira Dungeon 3 | 0 (choice-gated, warned 3×) | `EXEC xp_cmdshell` |
| Kubernetes Inner Ring | Enter Colosseum at Shame ≥ 3 | ≥ 3 | `kubectl apply -f /dev/stdin` |

---

*See [Trainers](trainers.md) for full stats on the outcast trainers.*  
*See [Reputation & Shame](reputation-and-shame.md) for how Shame accumulates.*
