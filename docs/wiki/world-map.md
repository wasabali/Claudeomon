# 🗺️ World Map

Cloud Quest spans multiple regions, each with its own trainers, incidents, encounter pools, and encounter rate. Start in Localhost Town and work your way to the CTO's Office.

---

## Main Story Regions

### 🏘️ Localhost Town
**Encounter Rate:** 0% (safe exploration zone)  
**Battle Background:** Plains

The starting town. Old Margaret is here with your first quest. Ola the Ops Guy stands on the path — your first trainer battle. No random encounters, so explore freely.

**Key NPCs:** Old Margaret (first quest), Ola the Ops Guy (first trainer), Logging Lena (sub-leader), Apprentice Engineers A & B

---

### 🔧 Pipeline Pass
**Encounter Rate:** 15% (every 4 steps)  
**Battle Background:** Construction

The first real adventure zone. Pipeline Per and CI Carl lurk here. You'll fight your first gym battle with **Bjørn the Build Breaker** (Gym 1, IaC). Fatima the Function Witch offers serverless training.

**Key NPCs:** Bjørn the Build Breaker (Gym 1), Fatima the Function Witch, CI Carl, DevOps Dave, Trigger Trude, Pipeline Per, Developer Apprentices A & B

---

### 📋 Jira Dungeon
**Encounter Rate:** 25% (every 3 steps)  
**Battle Background:** Cave

Scrum Siri's sprint realm and the DevOps gym. Encounters here are bureaucratic nightmares (stale tickets, scope creep, infinite sprints). Story Point Søren blocks the path to Siri.

**Key NPCs:** Scrum Siri (Gym 3, Observability), Story Point Søren (sub-leader), Pipeline Per (sub-leader), DevOps Apprentices A & B

---

### 🌾 Production Plains
**Encounter Rate:** 20% (every 3 steps)  
**Battle Background:** Factory

The main mid-game hub. Captain Nines runs Gym 2 here. High-stakes incidents — production fires, CPU spikes, on-call emergencies. The CTO's Office is in this district.

**Key NPCs:** Captain Nines (Gym 2, Cloud), SLA Signe (sub-leader), Alert Anders (sub-leader), Scale Set Sven, Deploy Diana (CTO sub-leader), Incident Ivan (CTO sub-leader), Admin Apprentices A & B, CTO Apprentices A, B & C

---

### ⚓ Kubernetes Colosseum
**Encounter Rate:** 30% (every 2 steps)  
**Battle Background:** Stadium

The Kubernetes gym. The Kube-rnetes Master respawns up to 3 times in the boss fight. CrashLoopBackOff and YAML nightmares around every corner. Replica Set Ragnhild and Manifest Magnus guard the path.

**Key NPCs:** The Kube-rnetes Master (Gym 5, Kubernetes), Replica Set Ragnhild (sub-leader), Manifest Magnus (sub-leader), Kubernetes Apprentices A & B

---

### 🔐 Security Vault
**Encounter Rate:** Variable  
**Battle Background:** (Dungeon)

Ingrid the IAM Inspector's domain. Leaking secrets, RBAC denials, expired certificates. Policy Pål guards the entrance.

**Key NPCs:** Ingrid the IAM Inspector (Gym 6, Security), Policy Pål (sub-leader), Firewall Frida (field trainer), Security Apprentices A & B

---

### 📐 Architecture District
**Encounter Rate:** Variable  
**Battle Background:** (Professional)

The Solutions Oracle holds court here. High-level incidents, design discussions, and the final gym before the CTO. Architect Aleksander and Metrics Maja precede the Oracle.

**Key NPCs:** The Solutions Oracle (Gym 7, Observability), Architect Aleksander (sub-leader), Metrics Maja (sub-leader), Grafana Gerd, Architecture Apprentices A & B

---

### 🧾 Azure Town
**Encounter Rate:** Variable  
**Battle Background:** (Azure Portal)

A commercial hub with shops and Cloud Costas. Cloud-heavy incidents — 503 errors, bill spikes, infinite redirects.

**Key NPCs:** Cloud Costas, shop vendors

---

### 🌀 Shell Cavern
**Encounter Rate:** Variable  
**Battle Background:** (Terminal)

Linux expert country. Tux the Terminal Wizard's gym is here. NFS Nora teaches mount. DNS propagation delays haunt this place.

**Key NPCs:** Tux the Terminal Wizard (Gym Leader, Linux), NFS Nora

---

### ⛵ Helm Repository
**Encounter Rate:** Variable  
**Battle Background:** (Container Yard)

Docker Dag's gym (Gym 4). Helm Hansen roams here teaching chart magic. Layer Lars blocks the gym entrance.

**Key NPCs:** Docker Dag (Gym 4, Containers), Helm Hansen, Layer Lars (sub-leader)

---

### 🏗️ Staging Valley
**Encounter Rate:** Variable  
**Battle Background:** (Staging)

Pre-production zone. Lambda Lars and Terraform Tore offer field training here.

**Key NPCs:** Lambda Lars, Terraform Tore

---

### 🏚️ OldCorp Basement
**Encounter Rate:** Variable  
**Battle Background:** (Server Room)

Dagny the DBA guards a very important piece of advice: *don't touch the legacy billing service*. The VB6 billing horror and Legacy Monolith lurk here.

**Key NPCs:** Dagny the DBA (quest giver), rare encounter: The Legacy Monolith (HP 200)

---

## Hidden Areas

These areas don't appear on the map. They're found by exploration, items, or doing what NPCs tell you not to do.

| Area | How to Find |
|---|---|
| Three AM Tavern | Available at high encounter rate (40%); accessible after high shame |
| Server Graveyard | Explore off the beaten path after Act 2 |
| Node_modules Maze | Use `Mystery node_modules` item |
| /dev/null Void | Exploration; linked to the outcast network |
| Deprecated Azure Region | End of the main path |

See [Hidden Areas](hidden-areas.md) for details (⚠️ spoilers).

---

## Encounter Rates at a Glance

| Region | Encounter Rate | Steps per Roll |
|---|---|---|
| Localhost Town | 0% | — |
| Pipeline Pass | 15% | 4 |
| Jira Dungeon | 25% | 3 |
| Production Plains | 20% | 3 |
| Kubernetes Colosseum | 30% | 2 |
| Three AM Tavern | 40% | 2 |

Other regions use the global base rate from `config.js` (8% base, 4-step cooldown after each encounter).

---

> Use the `sudo Running Shoes` key item for ×2 movement speed — but encounter rate goes up 50% too. Your call.
