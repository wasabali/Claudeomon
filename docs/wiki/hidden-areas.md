# 🔍 Hidden Areas

> ⚠️ **Spoiler warning.** This page describes secret content. It is intended for players who have already encountered these areas or deliberately want to know about them.

Cloud Quest has six hidden areas collectively known as the **Outcast Network**. They are not on any in-game map. Each one is found by doing something an NPC tells you not to do.

Finding all six unlocks something special.

---

## The Outcast Network

The Outcast Network is a set of areas accessible only to engineers willing to take shortcuts, break the rules, or generally make choices that would concern a reasonable team lead.

**How to access it:**  
Each area has a specific unlock condition. Shame ≥ 3–4 makes most areas discoverable. Some areas require higher Shame thresholds or specific story flags.

---

## Hidden Area 1: Three AM Tavern

**Unlock:** Enter Pipeline Pass after 2:57am real-world time, or fail three consecutive encounters.  
**Encounter Rate:** 40% (highest in the game)  
**What's here:** The toughest random encounter pool in the game. Rare pool includes Azure Bill Spike, SEV1 at 3am, and Cold Start Cascade.  
**Trainer:** BigIron (Cursed, Shame ≥ 7 required to battle)  
**Teaches:** `exec_xp_cmdshell`, `chmod 777`, `rm -rf /`

---

## Hidden Area 2: Server Graveyard

**Unlock:** Refuse to comply with two consecutive NPC requests.  
**Encounter Rate:** Low (no fixed rate — encounter chance from walking near old server racks)  
**What's here:** Zombie Process and legacy hardware encounters. `Disk Full` and `Memory Leak` appear as Rare.  
**Trainer:** OldAdmin (Cursed)  
**Teaches:** `dd if=/dev/zero`, `fsck` (nuclear), `badblocks`

---

## Hidden Area 3: Node_modules Maze

**Unlock:** Open your inventory and manually delete an item (a junk item works).  
**Encounter Rate:** 25%  
**What's here:** Dependency Hell, npm install hang, Docker Image 4GB in the Common pool. Home of the Gantt Chart cursed encounter.  
**Trainer:** Dock (sub-leader) and two apprentices  
**Teaches:** `npm install --force`, `docker system prune -a --volumes` (nuclear)

---

## Hidden Area 4: /dev/null Void

**Unlock:** Use a Nuclear technique and win.  
**Encounter Rate:** Variable — increases with Shame  
**What's here:** Ambient encounters only — no fixed pool. The Phantom Alert appears here as a Common. Strange dialog.  
**Trainer:** None (no trainers)  
**Mechanic:** Each step here has a 10% chance to silently delete a random inventory item  
**Note:** This is where dropped items go.

---

## Hidden Area 5: OldCorp Basement

**Unlock:** Complete the `do_not_touch` quest (Act 3) and enter the basement door.  
**Encounter Rate:** 15%  
**What's here:** The VB6 Billing Horror and The Legacy Monolith — both immune to modern cloud skills. Only Linux and Security work here.  
**Trainer:** None (no trainers — NPCs are "decommissioned" servers that speak in error codes)  
**Drops:** `oldcorp_keycard` (required for the Fork the Company ending)  
**Lore:** A 1994 billing server that survived five migrations. It is not happy about any of them.

---

## Hidden Area 6: Deprecated Azure Region

**Unlock:** Accept THROTTLEMASTER's first offer (Shame ≥ 7 required).  
**Encounter Rate:** 20%  
**What's here:** Config Drift and Stale Ticket in the Common pool. Azure Bill Spike and Terraform State Lock in Rare. SEV1 at 3am in Cursed.  
**Trainer:** THROTTLEMASTER (final cursed trainer, Shame ≥ 10 required)  
**Teaches:** `az group delete --yes --no-wait` (nuclear), `terraform destroy` (nuclear)  
**Lore:** An Azure region that was officially deprecated in 2021. Some workloads never got the memo.

---

## Outcast Trainer Summary

| Trainer | Area | Shame Required | Teaches |
|---|---|---|---|
| BigIron | Three AM Tavern | 7 | `exec_xp_cmdshell`, `chmod 777`, nuclear signal |
| OldAdmin | Server Graveyard | 5 | `dd if=/dev/zero`, nuclear `fsck` |
| THROTTLEMASTER | Deprecated Azure Region | 10 | `az group delete`, `terraform destroy` |

---

## Finding All Six

Accessing all six hidden areas sets the `outcast_network_complete` story flag. This:

- Unlocks a secret conversation with the final boss
- Reveals an optional sixth emblem (unimplemented — **Planned**)
- Changes the ending dialog if you reach the Fork the Company path

---

See [Reputation & Shame](reputation-and-shame.md) for Shame threshold mechanics and the evil path overview.
