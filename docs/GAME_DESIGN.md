# Cloud Quest — Pokémon GameBoy-Style Cloud Engineer Game

## Context
The user wants to build a browser-based Pokémon-style RPG that humorously and educationally captures the experience of being a cloud engineer. The game should feel like a GameBoy Color game, be funny and satirical, educationally reference real cloud concepts, and be buildable with free/open-source tools requiring zero paid services.

---

## Game Design Document

### Elevator Pitch
> "You're a junior cloud engineer. Your company's production environment is your world. Tame cloud services, survive incidents, defeat Jira tickets, and ascend from intern to Principal Engineer."

### Tone
- **Funny**: On-call alerts at 3am, "it works on my machine", AWS bills
- **Educational**: Players learn what Lambda, containers, IaC, etc. actually do
- **Nostalgic**: Strict GameBoy Color palette (4 colors per sprite), chiptune audio, pixelated UI

---

## Tech Stack (All Free & Open Source)

| Tool | Purpose |
|------|---------|
| **Phaser 3** | Game engine (HTML5 Canvas, free, battle-tested for RPGs) |
| **Tiled Map Editor** | Create pixel-art world maps (free) |
| **Asset pack — sprites** | [BitBop 16x16 Top-Down GBC sprites](https://bitbop.itch.io/top-down-characters-gameboy-style) (CC0) + [sonDanielson GBC RPG tileset](https://sondanielson.itch.io/gameboy-simple-rpg-tileset) (free) |
| **Asset pack — audio** | [OpenGameArt CC0 8-bit chiptune](https://opengameart.org/content/audio-cc0-8bit-chiptune) + [ChipTone SFX generator](https://sfbgames.itch.io/chiptone) (CC0) |
| **GitHub Pages** | Free hosting, zero setup |
| **Vite** | Dev server + bundler (fast, free) |
| **No backend** | Fully stateless — no server, no database, no account required |
| **Save format** | JSON file — exported/imported by the player |

> **Scope: Core engineering disciplines** — Linux, DevOps, CI/CD pipelines, Kubernetes, and Azure cloud. Not all Azure, not all cloud. The fundamentals matter most.

---

## Core Skill Domains

| Domain | What You Learn | Example Skills |
|--------|---------------|----------------|
| **Linux** | Shell, permissions, processes, networking | `chmod`, `grep`, `systemctl`, `curl`, `htop` |
| **DevOps** | Culture, workflows, automation principles | `git rebase`, `feature flags`, `blue-green deploy` |
| **CI/CD Pipelines** | Build, test, deploy automation | `az pipelines run`, `docker build`, `helm upgrade` |
| **Kubernetes** | Container orchestration, AKS | `kubectl apply`, `helm install`, `k9s`, `stern` |
| **Azure Cloud** | Managed services, IaC, cost | `az webapp deploy`, `bicep deploy`, `az monitor alert` |

Skills in each domain have **tiers** (Novice → Practitioner → Expert → Master).

## Visual Style — GameBoy Color Aesthetic

Strictly follow the GameBoy Color visual language:
- **Color palette**: Max 56 colors total on screen; each sprite uses a 4-color palette
- **Resolution**: 160×144px native resolution, scaled up 4x (640×576px display)
- **Font**: Pixel font (e.g. "Press Start 2P" from Google Fonts — free)
- **UI**: Black border frame styled as a GameBoy Color shell with speaker grilles and buttons
- **Battle screen**: Classic split layout — enemy top-right, player bottom-left, HP bars, move menu in white box
- **Overworld**: Top-down tile-based world (16×16px tiles), character is 16×24px sprite
- **Animations**: Limited to 2-4 frame sprite flips (no smooth tweening — chunky and deliberate)
- **Audio**: Chiptune only — square waves, triangle bass, noise channel for drums (use `BeepBox` or `jsfxr` for sounds, free tools)
- **Dialog boxes**: White box, black border, text appears character-by-character with typewriter effect

---

## World Design

### Regions (Progression)
```
[Dev Region] → [Staging Valley] → [Production Plains] → [Multi-Region Endgame]
```

### Key Locations
| Location | Vibe |
|----------|------|
| **Localhost Town** | Starting town. Nothing ever breaks here |
| **Pipeline Pass** | CI/CD corridor. Random build failures block the path |
| **Jira Dungeon** | Dark cave full of tickets with no acceptance criteria |
| **The Runbook Library** | Safe zone. Heal and read outdated docs |
| **Kubernetes Colosseum** | Mid-game gym. Pods crash randomly |
| **Production Plains** | High-stakes open world. Every step is an incident risk |
| **The Cloud Console** | Final dungeon. Pure chaos. Billing surprises |

### NPC Side Quests — "Help a Neighbour" System

Walking into NPCs' houses triggers optional side quests where **residents have cloud problems** they need help with. Completing them rewards XP and items.

| NPC | House Location | Problem | Reward |
|-----|---------------|---------|--------|
| **Old Margaret** | Localhost Town | "My website keeps going down!" (needs Azure App Service) | +50 XP, Azure Credits item |
| **Dev Dave** | Pipeline Pass | "My CI pipeline keeps failing on tests" (flaky tests) | +75 XP, `Skip Tests` scroll (one-use item, dangerous) |
| **Startup Steve** | Staging Valley | "We ran out of storage!" (needs Blob Storage config) | +60 XP, Storage Key item |
| **Nervous Nancy** | Production Plains | "Someone's accessing our data!" (Entra ID breach) | +120 XP, Security Scan badge |
| **Budget Barry** | Azure Town | "Our Azure bill tripled!" (cost optimization) | +100 XP, Cost Alert Suppressor |
| **Intern Ivan** | Anywhere | "What even is a container?" (explains Docker) | +30 XP, Dockertle treat item |
| **Architect Alice** | Architecture District | "Review my system design" (multi-step quest) | +200 XP, Rare Cloudémon unlock |

**How it works:**
- Enter any house with a ❓ symbol above it
- NPC describes their problem in plain language + technical terms
- Player picks the correct Azure service/solution from 3 options
- Wrong answers cost HP ("downtime damage")
- Correct answer = XP + item reward
- Some quests have **follow-up visits** (multi-stage problems that escalate)

---

## Core Design — You Are the Engineer

There are **no creatures to catch**. You play as a cloud engineer. You learn **Azure skills** from people in the world, use those skills in battles, and grow as an engineer.

### How You Get Skills
Skills come from three sources:

| Source | How | Example |
|--------|-----|---------|
| **NPC conversations** | Talk to engineers, professors, clients in houses/towns | Old Margaret teaches you App Service basics |
| **Quest completion** | Finish a help request or story mission | Fixing Dave's pipeline unlocks `CI/CD Repair` |
| **Trainer battles** | Defeat a trainer → they teach you what you used against them | Beat the DevOps trainer → learn `Blue-Green Deploy` |

### Your Skill Deck
You carry a **skill deck** of up to 6 active skills at a time (like a move set). Skills are slotted and swapped freely at any Azure Terminal (save point / skill menu).

| Skill | Domain | Effect in Battle |
|-------|--------|-----------------|
| `az webapp deploy` | App Service | Deal damage to server-side incidents |
| `terraform apply` | IaC | Reshape the battlefield; remove environmental hazards |
| `kubectl rollout restart` | Kubernetes | Reset opponent's buffs; fix CrashLoopBackOff |
| `az monitor alert create` | Observability | Reveal opponent's hidden weaknesses |
| `az ad user create` | Entra ID | Deny opponent's next move (permission block) |
| `git revert` | DevOps | Undo last turn's damage |
| `cost optimization scan` | FinOps | Drain opponent's resources each turn |
| `disaster recovery failover` | SRE | Full heal; costs 2 turns to execute |
| `bicep deploy` | IaC | Build infrastructure; slower but more powerful than terraform |
| `scale out` | Compute | Boost your max HP for 3 turns |

Skills have **tiers** (Basic → Intermediate → Advanced → Expert). You unlock higher tiers by:
1. Using the skill repeatedly (practice)
2. Passing the corresponding certification exam

### Random Encounters — Who You Meet

Walking through the world triggers random encounters — **not with creatures, but with people**:

| Encounter Type | Who | What Happens |
|---------------|-----|-------------|
| **Lost Intern** | A confused junior dev | Teaches you a basic skill if you explain the concept correctly (quiz) |
| **Rival Trainer** | Another cloud engineer | Turn-based skill battle; loser learns from the winner |
| **Incident Report** | A floating error log | Scenario puzzle — apply the right skill to resolve it |
| **Sales Rep** | Azure sales person | Tries to sell you unnecessary services; drain your budget if you're not careful |
| **On-Call Alert** | Flashing red ❗ | Emergency battle — time-limited, must resolve before SLA breach |
| **Senior Engineer** | Appears rarely | Teaches you an advanced skill if you answer their question correctly |

### Trainer Battles — The Good Guys

Trainers are named characters scattered across the world. Beating them rewards skills and lore.

| Trainer | Domain | Signature Skill | Location |
|---------|--------|----------------|---------|
| **Ola the Ops Guy** | Linux / Infrastructure | `systemctl restart` | Localhost Town outskirts |
| **Tux the Terminal Wizard** | Linux | `grep -r`, `awk`, `sed` | The Shell Cavern |
| **Fatima the Function Witch** | Azure Serverless | `az functionapp deploy` | Pipeline Pass |
| **Bjørn the Build Breaker** | CI/CD Pipelines | `az pipelines run` | Jira Dungeon |
| **Ingrid the IAM Inspector** | Azure Security/Entra | `az role assignment create` | Security Vault |
| **The Kube-rnetes Master** | Kubernetes / AKS | `kubectl apply -f` | Kubernetes Colosseum |
| **The Solutions Oracle** | Azure Architecture | `az network vnet create` | Architecture District |
| **Helm Hansen** | Kubernetes packaging | `helm upgrade --install` | The Helm Repository |

---

## The Dark Faction — Cursed Technique Trainers

Scattered across the world are **shadowy engineers** who've survived long enough to know every shortcut. They wear hoodies, avoid eye contact, and have a haunted look. They teach you skills that **work** — but that you **should never use**.

Defeating a Cursed Trainer gives you their technique. Using a cursed technique in battle is powerful but comes with a **side effect** and permanently adds a **Shame Point** to your profile. Collect too many and NPCs start judging you.

### The Cursed Trainers

| Trainer | Vibe | Cursed Technique | Effect | Side Effect |
|---------|------|-----------------|--------|-------------|
| **The Force Pusher** | Lone wolf in a dark alley. "Rules are for people who didn't write the code." | `git push --force` | Instantly wipes the opponent's last 3 turns | Deletes a random teammate's work too |
| **Hotfix Håkon** | Sweating profusely. Has 14 open tabs. | `deploy directly to prod` | Skips the pipeline; instant win — but no rollback | 40% chance to trigger an outage next battle |
| **Merge Magda** | Always rushing. Never reviews PRs. | `merge without review` | Win the current turn immediately | Introduces a random bug that surfaces 3 battles later |
| **The Root Whisperer** | Runs everything as root. Wears a cape. | `sudo chmod 777 /` | Removes all permission errors permanently | All your defenses drop to zero too |
| **kubectl Karen** | "I don't have time for manifests." | `kubectl delete pod --all` | Clears all opponent buffs/debuffs instantly | Restarts your own services; lose 1 turn |
| **Skip-Tests Sigrid** | "Tests slow me down." Eyes twitch. | `--no-verify` on commit | Bypasses all pre-check opponent blocks | 50% chance your next skill fails silently |
| **Hardcode Henrik** | Has API keys in commit history. | `hardcode the secret` | Solve an authentication puzzle instantly | Secret leaks; Reputation -20 permanently |
| **The Rebase Reverend** | Preaches rebase but uses it wrong. | `git rebase -i HEAD~999` | Rewrite battle history in your favour | 30% chance to corrupt your own skill deck |
| **rm-rf Rune** | Smells of burnt servers. | `rm -rf /` | Nuclear option — wipes all opponent status effects | Also wipes yours. And maybe the filesystem. |
| **The Downtime Dealer** | "Maintenance windows are a myth." | `restart in prod without notice` | Full heal yourself | Triggers On-Call alert for the next 5 battles |

### Cursed Technique Mechanics

- Cursed techniques appear greyed out in your skill deck with a ☠️ icon
- Before use: a warning dialog — *"This will work. But at what cost?"* (Yes / No)
- Shame Points are visible on your character profile; NPCs react differently at thresholds:
  - 3 Shame Points: *"I heard about what you did to the repo..."*
  - 5 Shame Points: Trainer battles get harder (they know you'll cheat)
  - 10 Shame Points: You get a secret "Shadow Engineer" title — NPCs fear AND respect you
- Some story quests **require** a cursed technique to unlock a hidden path (the "chaotic good" route)
- Professor Pedersen will give you a disappointed look if you use too many

---

## Inventory System

The player carries a **Bag** — a classic tabbed inventory accessible from the pause menu. Opens with the B button, navigated with D-pad, items used with A.

### Bag Tabs

| Tab | Icon | Contents |
|-----|------|----------|
| **Tools** | 🔧 | Consumable use-in-battle items |
| **Key Items** | 🔑 | Quest items, access cards, SSH keys (cannot be dropped) |
| **Credentials** | 🪪 | Certs, access tokens, API keys (not the hardcoded kind) |
| **Docs** | 📄 | Collected runbooks, architecture diagrams, README files |
| **Junk** | 🗑️ | Old tickets, stale PRs, mystery node_modules folders |

### Item Examples

| Item | Tab | Effect |
|------|-----|--------|
| **Red Bull** | Tools | Restore 30 HP ("3am fuel") |
| **Rollback Potion** | Tools | Undo your last failed skill; full revert |
| **SSH Key** | Key Items | Unlocks server access doors in dungeons |
| **Staging Env Token** | Key Items | Required to enter Staging Valley |
| **Root Password (sticky note)** | Junk | Found in Old Margaret's house. Useless. Horrifying. |
| **Skip Tests Scroll** | Tools | One-use; bypass a skill check. Feels wrong. |
| **Azure Credit Voucher** | Tools | Restore 50 Budget mid-battle |
| **Outdated Runbook** | Docs | Read for +5 XP. Half the steps are wrong. |
| **Mystery node_modules** | Junk | 47,000 files. Does nothing. Can't delete. |
| **On-Call Phone** | Key Items | Activates On-Call mode. Why would you equip this willingly. |
| **Terraform State File** | Docs | Don't touch it. Don't move it. Don't even look at it. |
| **Incident Postmortem** | Docs | Study after a lost battle for +20 XP bonus |

### Item Acquisition

- **Loot drops** after battles (random chance per enemy type)
- **NPC rewards** for completing house quests
- **Shops** in towns — buy with Azure Credits currency
- **Treasure chests** in dungeons (old server closets, Jira Dungeon corners)
- **Recycling bin** — rummage through deprecated services for rare finds

---

## Certification Emblems & The Emblem Case

Completing a **Gym** earns you a **Certification Emblem** — a physical badge representing mastery of that domain. Think HG/SS badge case but for cloud certs.

### The Emblem Case

Accessible from the pause menu → **Emblem Case**. Opens to a full-screen pixel-art display of all 8 emblem slots arranged in a 4×2 grid, each in a velvet-lined compartment.

**Emblems you can earn:**

| # | Emblem | Domain | Gym Boss |
|---|--------|--------|----------|
| 1 | 🐧 **Tux Emblem** | Linux Fundamentals | The Legacy Monolith |
| 2 | ⚙️ **Pipeline Emblem** | CI/CD | The Broken Pipeline |
| 3 | 📦 **Container Emblem** | Docker / Containers | The Runaway App Service |
| 4 | ☁️ **Cloud Emblem** | Azure Core Services | The 3am Incident |
| 5 | 🔒 **Vault Emblem** | Security / IAM | The Entra Misconfiguration |
| 6 | ⎈ **Helm Emblem** | Kubernetes | The Pod Crasher |
| 7 | 💰 **FinOps Emblem** | Cost / Architecture | The Azure Bill |
| 8 | 🛡️ **SRE Emblem** | Reliability / SRE | The CTO |

### Cleaning Your Emblems — DS Touchscreen Minigame

Inspired by the **HeartGold/SoulSilver badge polishing mechanic** — tap and rub your emblems to make them shine.

**How it works:**
- Open the Emblem Case and click/tap on any earned emblem
- The emblem zooms in — full-screen pixel art close-up
- The emblem starts **dusty and dull** after you earn it (covered in incident smoke, deploy errors, etc.)
- **Mouse drag** / touchscreen rub to polish it
- A **shine meter** fills as you clean — fully polished emblems glow with a pulse animation
- Each emblem has its own **grime flavour** matching what you went through to earn it:

| Emblem | What You're Wiping Off |
|--------|----------------------|
| 🐧 Tux Emblem | Terminal scrollback residue |
| ⚙️ Pipeline Emblem | Failed build red ink splatter |
| 📦 Container Emblem | node_modules dust |
| ☁️ Cloud Emblem | Azure portal loading spinner smudges |
| 🔒 Vault Emblem | Leaked secret stains |
| ⎈ Helm Emblem | CrashLoopBackOff soot |
| 💰 FinOps Emblem | Billing alert pop-up residue |
| 🛡️ SRE Emblem | 3am coffee ring stains |

**Fully polished emblems:**
- Animate with a sparkle/shine effect on the overworld HUD
- Grant a small passive bonus (e.g., polished Pipeline Emblem → 5% lower fail rate on CI/CD skills)
- NPCs notice: *"Wow, your emblems are spotless. What kind of nerd are you?"*

**Emblem degradation:**
- Emblems slowly get dirty again over time (battles, incidents, shame points all add grime)
- Cursed techniques add a **permanent dark stain** that requires more rubbing to clean
- If you use `rm -rf /`, the SRE Emblem gets black scorch marks

---

## Save System — Stateless File-Based Saves

The game has **zero backend**. No accounts, no cloud sync, no localStorage as primary storage. Your progress lives entirely in a single `.cloudquest` file that you own, export, and import yourself.

> Fitting lore: *"Even your save file is infrastructure-as-code."*

### Philosophy

| Principle | Implementation |
|-----------|---------------|
| **Stateless app** | The browser holds nothing between sessions |
| **Player owns data** | Save file is a plain JSON blob you download |
| **Portable** | Import on any browser, any device, any OS |
| **No account needed** | No email, no OAuth, no cookies |
| **Transparent** | File is human-readable — curious players can inspect it |

---

### The Save File — `.cloudquest` Format

A `.cloudquest` file is a **base64-encoded JSON** blob wrapped in a thin envelope. The extension is cosmetic — it's just a renamed `.json` under the hood. Players can open it in a text editor.

```json
{
  "version": "1.0",
  "savedAt": "2025-03-23T02:47:00Z",
  "checksum": "sha256:a3f9...",
  "player": {
    "name": "devuser",
    "title": "Junior Cloud Engineer",
    "level": 7,
    "xp": 3420,
    "hp": 85,
    "maxHp": 100,
    "budget": 240,
    "reputation": 71,
    "shamePoints": 2,
    "location": "pipeline_pass",
    "playtime": 7240
  },
  "skills": {
    "active": ["az_webapp_deploy", "kubectl_rollout_restart", "git_revert"],
    "learned": ["terraform_apply", "az_monitor_alert", "blame_dns"],
    "tiers": {
      "az_webapp_deploy": 2,
      "kubectl_rollout_restart": 1
    },
    "cursed": ["git_push_force"]
  },
  "inventory": {
    "tools": [
      { "id": "red_bull", "qty": 3 },
      { "id": "rollback_potion", "qty": 1 }
    ],
    "keyItems": ["ssh_key_staging", "staging_env_token"],
    "credentials": ["az_sp_cert_dev"],
    "docs": ["outdated_runbook_v3", "incident_postmortem_2024"],
    "junk": ["root_password_sticky_note", "mystery_node_modules"]
  },
  "emblems": {
    "tux": { "earned": true, "shine": 0.62 },
    "pipeline": { "earned": true, "shine": 1.0 },
    "container": { "earned": false },
    "cloud": { "earned": false },
    "vault": { "earned": false },
    "helm": { "earned": false },
    "finops": { "earned": false },
    "sre": { "earned": false }
  },
  "story": {
    "act": 1,
    "completedQuests": ["margaret_website", "dave_flaky_tests"],
    "flags": {
      "chose_dockertle": true,
      "met_professor_pedersen": true,
      "visited_jira_dungeon": false
    }
  },
  "stats": {
    "battlesWon": 14,
    "battlesLost": 2,
    "incidentsResolved": 9,
    "cursedTechniquesUsed": 1,
    "totalDeployments": 31,
    "longestUptime": 580
  }
}
```

The `checksum` field is a SHA-256 hash of the JSON payload (excluding the checksum field itself). The game validates it on import to catch corrupted or manually tampered saves — with a suitably dramatic warning if it fails.

---

### Save & Load UI

#### Saving — "Commit Your Progress"

Triggered three ways:
1. **Manual** — pause menu → *"Commit Progress"*
2. **Auto-prompt** — after gym wins, act transitions, major quests
3. **Azure Terminal** — the in-world save point (glowing terminal in each town)

When saving:
1. Game serialises current state to JSON
2. Computes checksum
3. Browser triggers a file download: `cloudquest-save-[name]-[date].cloudquest`
4. A commit message dialog appears — *"Describe this save (optional):"* — stored in the file as `"commitMessage": "Beat the Pipeline Gym, finally"`
5. Dialog confirmation: *"Progress committed. Don't forget to back it up."*

The save dialog is styled like a `git commit` terminal prompt — monospace font, blinking cursor.

#### Loading — "Checkout a Save"

From the main menu → *"Load Save"* or from the pause menu → *"Restore from File"*:

1. Browser file picker opens (standard `<input type="file" accept=".cloudquest,.json">`)
2. Game reads and parses the file client-side
3. Checksum is validated — on mismatch: ⚠️ *"Save file checksum mismatch. Someone's been poking around the config. Load anyway?"*
4. Version check — if save version > game version: *"This save is from a newer version. Some features may be missing."*
5. State is loaded into memory — game resumes at the saved location
6. Confirmation: *"Session restored. Welcome back, [name]."*

#### Multiple Saves — "Branch Management"

Players can keep multiple `.cloudquest` files on their own machine — named however they want. The game treats each import as a fresh checkout. No slot management, no overwrite risk — the file system is the save manager.

Suggested in-game tooltip: *"Pro tip: keep multiple save files. It's basically git branches for your life."*

---

### Autosave Warning

There is **no autosave**. If you close the tab without exporting, progress since your last export is lost.

The game shows a persistent **unsaved changes indicator** in the HUD — a small blinking 💾 icon — whenever the in-memory state has diverged from the last exported file. Hovering it shows: *"You have uncommitted changes."*

Before tab close / navigation away, the browser fires an `beforeunload` warning:
> *"You have unsaved progress. Export your save file before leaving."*

---

### Save File Portability

| Scenario | Works? |
|----------|--------|
| Load save from Chrome into Firefox | ✅ |
| Load save from desktop into mobile browser | ✅ |
| Share save file with a friend | ✅ (they can import and play your character) |
| Inspect / read save file in a text editor | ✅ |
| Edit save file manually | ✅ — but checksum will fail; game warns you |
| Recover from corrupted save | Partial — if JSON is valid, game attempts graceful degradation |

---

## Battle System

### Core Loop
Turn-based battles triggered by:
- **Random encounters**: Walking through the world (trainers, incidents, lost interns)
- **Story battles**: Boss fights, gym challenges, incident reports

### Your Stats
| Stat | What It Represents |
|------|--------------------|
| **HP** | Your resilience — drops when incidents go unresolved |
| **Budget** | Azure Credits — some skills cost budget to use |
| **Reputation** | Long-term score — bad decisions damage it permanently |
| **Uptime** | SLA meter — if it hits 0 during a battle, you lose |

### Skill Effects in Battle
| Skill | Effect |
|-------|--------|
| `az webapp deploy` | Deal damage to server-side incidents |
| `git revert` | Undo last turn's damage (self-heal) |
| `scale out` | Boost max HP for 3 turns (costs Budget) |
| `blame DNS` | 50% confuse everyone, including yourself |
| `open a ticket` | Freeze battle for 1 turn; queues the problem |
| `read the docs` | Reveal opponent's weaknesses |
| `kubectl rollout restart` | Reset opponent's active buffs |
| `cost optimization scan` | Drain opponent's Budget each turn |

### Status Conditions
| Status | Effect |
|--------|--------|
| **Throttled** | Can only use 1 skill every 2 turns |
| **Cold Start** | Skip first turn of battle |
| **Deprecated** | Skills lose 50% effectiveness |
| **On-Call** | Random forced encounters even during rest |
| **Cost Alert** | Budget drains 2x faster |
| **Technical Debt** | Accumulates across battles; reduces max HP over time |
| **In Review** | Cannot act until you pass a peer review (1-3 turns) |

### Boss Battles (Gym Leaders)
| Gym | Boss Name | Mechanic |
|-----|-----------|----------|
| Fundamentals | **The Legacy Monolith** | Immune to modern Azure skills; must use basic tools |
| Admin | **The 3am Incident** | Time-limited battle; resolve before SLA breach |
| Developer | **The Runaway App Service** | Opponent scales infinitely, draining your Budget |
| DevOps | **The Broken Pipeline** | Every skill has 30% chance to fail ("flaky test") |
| Kubernetes | **The Pod Crasher** | Opponent respawns 3 times (CrashLoopBackOff) |
| Security | **The Entra Misconfiguration** | Your own skills get randomly denied (RBAC hell) |
| Architecture | **The Azure Bill** | Opponent grows stronger each turn (cost spiral) |
| SRE (Final) | **The CTO** | Three phases: incident → cost → existential crisis |

---

## Progression & Story

### Story Arc — Full Draft

---

#### PROLOGUE — "The Offer"
*Localhost Town. Your bedroom.*

You're a fresh computer science graduate staring at a rejection email from Big Tech. Then a new notification pings — it's from **NorCloud AS**, a mid-size Norwegian tech consultancy. They need a junior cloud engineer. It's not Google, but it's a start.

Your mum knocks on your door: *"There's a strange man outside with a briefcase."*

You go downstairs. Standing at the door is **Professor Pedersen** — a weathered cloud architect with a trenchcoat covered in Azure sticker logos. He hands you a starter kit: a laptop, an Azure free-tier account, and a Cloudémon capsule containing your first companion.

> "Choose wisely. The cloud is vast. And it will bill you for everything."

**Choose your starter:**
- 🐢 **Dockertle** — Containers. Reliable, portable. "Works on my machine."
- ⚡ **Functionchu** — Serverless. Fast and cheap. Suffers cold starts.
- 🖥️ **VMsaur** — Virtual machines. Old reliable. Expensive if you forget to shut it down.

---

#### ACT 1 — "Junior in the Wild" (Lv 1–10)
*Localhost Town → Pipeline Pass*

You arrive at NorCloud AS. Your manager, **Kristoffer**, gives you your first task: *"Deploy a simple web app to Azure App Service. Should take 30 minutes."*

It takes three days.

Along the way you:
- Help **Old Margaret** (NPC side quest) whose bakery website keeps going down — you migrate her to Azure App Service
- Encounter your first **wild incident** — a 404 error in the dev environment
- Learn what a Resource Group is (the hard way — you delete the wrong one)
- Earn your **AZ-900 (Azure Fundamentals) certification** after studying with Professor Pedersen
- Defeat the **Fundamentals Gym Leader**: *The Legacy Monolith* — an ancient on-prem server running Windows Server 2003

**Act 1 ends** when you successfully push your first app to production. Kristoffer says: *"Nice. Now you're on the on-call rotation."*

The CloudWatchowl you just tamed begins crying.

---

#### ACT 2 — "The First Outage" (Lv 11–18)
*Staging Valley → Production Plains*

Your app goes viral overnight (NorCloud's client is a Norwegian government portal). Traffic spikes. The app crashes.

**3:17am.** Your phone screams. Azure Monitor alerts. You scramble to the laptop in your boxers.

The villain is revealed: **THROTTLEMASTER** — a shadowy figure representing misconfigured rate limits and undersized App Service plans. He appears in every outage, cackling.

You learn:
- Auto-scaling with Azure VMSS (evolve VMsaur → ScaleSeteon)
- Monitoring with Azure Monitor and Application Insights (Monitorowl joins your team)
- Help **Budget Barry** (NPC side quest) whose Azure bill tripled overnight — you implement cost alerts
- Earn **AZ-104 (Azure Administrator)** certification
- Earn **AZ-204 (Azure Developer)** certification
- Defeat the **Admin Gym** and **Developer Gym** leaders

**Act 2 ends** with the app stable. Kristoffer promotes you to "Cloud Engineer." You get a 5% raise. You ask for 15%. He gives you a NorCloud hoodie instead.

---

#### ACT 3 — "The Migration" (Lv 19–25)
*Production Plains → Kubernetes Colosseum*

NorCloud wins a major contract: migrate **OldCorp AS**, a fishing company running 47 microservices on bare metal servers in a basement in Ålesund, to Azure.

The codebase has no tests. The documentation is a Post-it note. One service is called `DO_NOT_TOUCH.exe`.

You discover **KubeDragon** hiding in the Kubernetes Colosseum — a powerful but temperamental creature. You must tame it to orchestrate all 47 services.

You battle:
- **Nervous Nancy** (NPC side quest) whose company had a data breach — you set up Entra ID and Conditional Access
- **The Broken Pipeline** (DevOps Gym boss) — your CI/CD keeps breaking on flaky tests
- **The Pod Crasher** (Kubernetes Gym boss) — pods stuck in CrashLoopBackOff forever
- Earn **AZ-400 (DevOps Engineer)** and **CKAD (Kubernetes)** certifications
- Discover `DO_NOT_TOUCH.exe` is actually the entire billing system, written in Visual Basic 6

**Act 3 ends** when the migration completes. OldCorp's CTO shakes your hand and says: *"We thought we'd lose the company. You saved us."* Then he asks if you can also fix his home Wi-Fi.

---

#### ACT 4 — "The Architect" (Lv 26–30)
*The Azure Capital → The Security Vault → Architecture District*

A crisis: NorCloud's biggest client — a Norwegian bank — is being audited. A **security misconfiguration** in Entra ID has exposed sensitive data. The press is involved. The CEO is sweating.

**THROTTLEMASTER** returns — now revealed as a full villain. He's been deliberately introducing misconfigurations across NorCloud's client environments, exploiting the chaos. He works for **OmniCloud Corp**, a shady competitor trying to poach NorCloud's clients.

You must:
- Lock down the bank's Azure environment (AZ-500 Security challenges)
- Design a new multi-region, fault-tolerant architecture (AZ-305 Architecture challenges)
- Help **Architect Alice** (NPC side quest) review a system design — multi-stage quest spanning the whole act
- Earn **AZ-500 (Security Engineer)** and **AZ-305 (Solutions Architect)** certifications
- Defeat **The IAM Inquisitor** (Security Gym) and **The Solutions Oracle** (Architecture Gym)

**Act 4 ends** when you expose THROTTLEMASTER's identity: he is Kristoffer's old colleague, bitter about being passed over for promotion. He is arrested by the Azure Compliance Team (they have badges and everything).

---

#### FINALE — "The SRE" (Lv 30+)
*The On-Call Throne Room*

Professor Pedersen reappears: *"There is one final challenge. The SRE Gym. No one has cleared it in 3 years."*

The **SRE Gym** is chaos incarnate. It simulates a full production meltdown:
- Simultaneous outages across 3 regions
- The database is throwing errors AND is over-provisioned
- Someone merged directly to main
- The Azure bill is 400% over budget
- And it's Christmas Day

Final boss: **The CTO** — a three-phase battle:
1. Phase 1: *"Why is the site down?"* (incident management)
2. Phase 2: *"Why does this cost so much?"* (cost optimization)
3. Phase 3: *"Why didn't we just use Excel?"* (existential crisis battle)

**Victory.** The CTO shakes your hand. *"I'm promoting you to Principal Engineer."*

A Confluence page is auto-generated with your name on it. Nobody will ever read it.

**Credits roll** over a chiptune version of the Azure theme. Post-credits scene: your phone buzzes. A new Azure Monitor alert. It never ends.

---

#### THEMES THROUGHOUT
- **Imposter syndrome** — NPCs constantly doubt themselves; the game validates that confusion is normal
- **Cloud is never "done"** — every solution creates new problems
- **Cost vs performance** — a constant trade-off woven into every battle
- **Community** — other engineers help you; the NPC quests show cloud knowledge is shared, not hoarded

### Player Progression

**XP → Level → Skills**
- XP earned from: closing tickets, resolving incidents, completing quests
- Leveling up unlocks: new move slots, higher-tier Cloudémon, access to certification exams
- Each level has a "skill tree" node (e.g. unlock `blue-green deploy`, learn `cost optimization`)

**Certification System (replaces badges)**

Certifications are earned by passing a multi-stage exam challenge:
1. **Study Phase** — NPCs/Runbooks in the world teach you domain concepts
2. **Practice Arena** — Sparring battles against weaker domain-specific opponents
3. **Certification Exam** — A gauntlet of 5 scenario battles (no healing between)
4. **Cert Awarded** — Stored in your "Resume" (the equivalent of a Pokédex)

Certifications are **prerequisites** to enter the corresponding Gym:

| Certification | Real-World Equivalent | Prerequisite Level | Unlocks Gym |
|---------------|-----------------------|--------------------|------------|
| **Azure Fundamentals** | AZ-900 | Lv 5 | Fundamentals Gym |
| **Azure Administrator** | AZ-104 | Lv 10 + AZ-900 | Admin Gym |
| **Azure Developer** | AZ-204 | Lv 12 + AZ-900 | Developer Gym |
| **Azure DevOps Engineer** | AZ-400 | Lv 15 + AZ-104 or AZ-204 | DevOps Gym |
| **AKS / Kubernetes** | CKAD / CKA | Lv 18 + AZ-204 | Kubernetes Gym |
| **Azure Security Engineer** | AZ-500 | Lv 20 + AZ-104 | Security Gym |
| **Azure Solutions Architect** | AZ-305 | Lv 25 + AZ-104 + AZ-204 | Architecture Gym |
| **Azure SRE / Expert** | Custom | Lv 30 + all prior | Final SRE Gym |

### Gym System — Domain Mastery

Each Gym is the **pinnacle challenge** of its domain. Beating it means you are an expert:

| Gym | Domain | Leader | Cert Required | Mastery Title |
|-----|--------|--------|---------------|---------------|
| **Fundamentals Gym** | Azure Basics | The Azure Rookie | AZ-900 | Azure Fundamentals Expert |
| **Admin Gym** | Azure Infrastructure | The Resource Group Warden | AZ-104 | Azure Administrator |
| **Developer Gym** | App Services & APIs | The Function Witch | AZ-204 | Azure Developer |
| **DevOps Gym** | CI/CD & Pipelines | The Pipeline Prophet | AZ-400 | DevOps Engineer |
| **Kubernetes Gym** | AKS & Containers | The Kube-rnetes Master | CKAD | K8s Expert |
| **Security Gym** | Entra & Defender | The IAM Inquisitor | AZ-500 | Security Engineer |
| **Architecture Gym** | System Design | The Solutions Oracle | AZ-305 | Solutions Architect |
| **SRE Gym** ⭐ | Full Reliability | The On-Call Champion | All certs | Principal Engineer |

Gym battles are multi-phase:
- Phase 1: Apprentices (easier battles to learn domain mechanics)
- Phase 2: The Gym Sub-Leader (mid boss)
- Phase 3: The Gym Leader (full domain mastery test)

Beating the SRE Gym (final) ends the main story.

**Pokedex equivalent** = "Service Catalog" — document every cloud service you've encountered

---

---

## Execution Plan — What Happens Next

### Step 1 — Save plan to repo
Copy this file to `docs/GAME_DESIGN.md` in the repository for historical reference.

### Step 2 — Create GitHub issues (8 total)
Attempt via Gitea API. If unavailable, write `docs/ISSUES.md` as a fallback.

| Issue # | Title | Labels |
|---------|-------|--------|
| 1 | `[Game] Scaffold + GameBoy Color shell` | `game`, `setup` |
| 2 | `[Game] GameState + stateless save/load system` | `game`, `core` |
| 3 | `[Game] Overworld — Localhost Town + NPC dialog` | `game`, `world` |
| 4 | `[Game] Data layer — skills, items, trainers, emblems` | `game`, `data` |
| 5 | `[Game] Battle engine + battle scene` | `game`, `battle` |
| 6 | `[Game] Inventory bag (5 tabs)` | `game`, `ui` |
| 7 | `[Game] Emblem case + drag-to-polish minigame` | `game`, `ui` |
| 8 | `[Game] Random encounters + status effects` | `game`, `battle` |

### Step 3 — Commit to branch
Commit `docs/GAME_DESIGN.md` (and `docs/ISSUES.md` if needed) to `claude/install-claude-code-tool-O0XPI` and push.

### Principles
- **DRY**: All game data (skills, items, trainers, quests) lives in `src/data/` as pure definitions — referenced everywhere, duplicated nowhere
- **Separation of concerns**: Logic (engines) never touches rendering (scenes); data never contains logic
- **Abstraction**: `BaseScene` provides shared utilities; `Registry` pattern gives uniform data access
- **Readable**: Small files (<200 lines), descriptive names, no clever one-liners

---

### Project File Structure

```
cloud-quest/
├── index.html                  # GameBoy Color shell frame (CSS border, buttons)
├── package.json                # vite + phaser
├── src/
│   ├── main.js                 # Phaser config + scene registry, nothing else
│   ├── config.js               # Constants: resolution, palette, tile size, XP table
│   │
│   ├── state/
│   │   ├── GameState.js        # Single mutable object — the only mutable state in the app
│   │   └── SaveManager.js      # export / import / checksum — no Phaser dependency
│   │
│   ├── data/                   # Pure definitions — no logic, no imports from engine/scenes
│   │   ├── skills.js           # All skill definitions { id, name, domain, tier, effect }
│   │   ├── items.js            # All item definitions { id, name, tab, stackable, effect }
│   │   ├── trainers.js         # Good trainers + cursed trainers { id, name, dialog, rewards }
│   │   ├── quests.js           # Quest definitions { id, stages[], rewards }
│   │   ├── emblems.js          # Emblem metadata { id, name, grime, passiveBonus }
│   │   ├── encounters.js       # Random encounter tables per region
│   │   └── story.js            # Act definitions, flags, dialog trees
│   │
│   ├── engine/                 # Pure logic — no Phaser, fully unit-testable
│   │   ├── BattleEngine.js     # Turn resolution, win condition, event log
│   │   ├── SkillEngine.js      # Skill effects, tier progression, XP tracking
│   │   ├── StatusEngine.js     # Status effect application + decay per turn
│   │   └── EncounterEngine.js  # Encounter probability + selection per region
│   │
│   ├── scenes/                 # Phaser scenes — rendering only, delegate logic to engines
│   │   ├── BaseScene.js        # Abstract base: showDialog(), fadeIn/Out(), playSound()
│   │   ├── BootScene.js        # Preload all assets
│   │   ├── TitleScene.js       # Main menu: New Game / Load Save
│   │   ├── WorldScene.js       # Overworld: Tiled map, player movement, NPC interaction
│   │   ├── BattleScene.js      # Battle rendering: HUD, skill menu, animations
│   │   ├── InventoryScene.js   # Bag UI: tabbed navigation, item use
│   │   ├── EmblemScene.js      # Emblem case + mouse-drag polish minigame
│   │   └── SaveScene.js        # Commit/checkout UI styled as git terminal
│   │
│   ├── ui/                     # Reusable Phaser UI components
│   │   ├── HUD.js              # HP bar, budget meter, 💾 unsaved indicator
│   │   ├── DialogBox.js        # Typewriter text box — used across all scenes
│   │   ├── Menu.js             # D-pad navigable list menu — used in battle + bag
│   │   └── ShineEffect.js      # Reusable sparkle/glow shader for polished emblems
│   │
│   └── utils/
│       ├── crypto.js           # SHA-256 via Web Crypto API (async, no library needed)
│       ├── fileIO.js           # download() and openFilePicker() browser helpers
│       └── random.js           # Seeded RNG for reproducible encounter rolls
│
└── assets/
    ├── sprites/                # Pixel art PNGs (Piskel exports)
    ├── maps/                   # Tiled .tmj exports
    └── audio/                  # Chiptune .ogg files
```

---

### Core Abstractions

#### 1. `GameState` — Single Source of Truth
All mutable game data lives here. Engines and scenes read/write only this object. Nothing else is mutable.

```js
// src/state/GameState.js
export const GameState = {
  player:    { name, level, xp, hp, maxHp, budget, reputation, shamePoints, location, playtime },
  skills:    { active: [], learned: [], tiers: {}, cursed: [] },
  inventory: { tools: [], keyItems: [], credentials: [], docs: [], junk: [] },
  emblems:   { tux: { earned, shine, grime }, ... },   // shine: 0.0–1.0, grime: 0.0–1.0
  story:     { act, completedQuests: [], flags: {} },
  stats:     { battlesWon, battlesLost, cursedTechniquesUsed, ... },
  _session:  { isDirty: false, lastSavedAt: null }     // not persisted to file
}
```

#### 2. Registry Pattern — Data Access
Every data module exports a `getById()` helper so consumers never iterate arrays.

```js
// src/data/skills.js
const SKILLS = { kubectl_rollout_restart: { id, name, domain, tier, effect }, ... }
export const getSkill = (id) => SKILLS[id]
export const getAllSkills = () => Object.values(SKILLS)
export const getSkillsByDomain = (domain) => getAllSkills().filter(s => s.domain === domain)
```

Same pattern for `getItem()`, `getTrainer()`, `getQuest()`, `getEmblem()`.

#### 3. `BattleEngine` — Pure Logic
No Phaser. Returns an event log the `BattleScene` replays as animations.

```js
// src/engine/BattleEngine.js
export class BattleEngine {
  constructor(playerSnapshot, opponentDef) { }
  useSkill(skillId)        // → { events: BattleEvent[], stateAfter: {} }
  applyTurnEffects()       // → { events: BattleEvent[] }
  checkWinCondition()      // → 'player' | 'opponent' | null
}
// BattleEvent = { type: 'damage'|'heal'|'status'|'shame'|'dialog', payload: {} }
```

`BattleScene` drives the engine, reads events, and renders them one at a time.

#### 4. `SaveManager` — Stateless File I/O
No Phaser. Works in any JS context.

```js
// src/state/SaveManager.js
export const SaveManager = {
  async export(gameState, commitMessage) { /* builds JSON, computes checksum, triggers download */ },
  async import(file)                     { /* reads file, validates checksum, returns state or throws */ },
  async computeChecksum(payload)         { /* Web Crypto SHA-256 */ },
  stripSession(gameState)                { /* removes _session before serialising */ }
}
```

#### 5. `BaseScene` — Shared Scene Utilities
All scenes extend this instead of `Phaser.Scene` directly.

```js
// src/scenes/BaseScene.js
export class BaseScene extends Phaser.Scene {
  showDialog(lines, onDone)     // renders DialogBox with typewriter effect
  fadeIn(duration)              // standard scene transition
  fadeOut(duration, callback)
  playSound(key)                // wraps Phaser audio with GBC chiptune defaults
  markDirty()                   // sets GameState._session.isDirty = true, updates HUD
}
```

---

### MVP Scope (Phase 1 — Playable Prototype)

| # | Feature | Key Files |
|---|---------|-----------|
| 1 | Project scaffold + GameBoy frame | `index.html`, `main.js`, `config.js` |
| 2 | GameState + SaveManager (export/import) | `state/GameState.js`, `state/SaveManager.js`, `utils/crypto.js`, `utils/fileIO.js` |
| 3 | Title screen (New Game / Load Save) | `scenes/TitleScene.js`, `scenes/SaveScene.js` |
| 4 | Overworld — Localhost Town | `scenes/WorldScene.js`, `assets/maps/localhost_town.tmj` |
| 5 | Skill + item data (subset) | `data/skills.js`, `data/items.js` |
| 6 | Battle system — 1 trainer fight | `engine/BattleEngine.js`, `scenes/BattleScene.js`, `ui/Menu.js` |
| 7 | Inventory bag (all 5 tabs) | `scenes/InventoryScene.js` |
| 8 | Emblem case + polish minigame | `scenes/EmblemScene.js`, `ui/ShineEffect.js` |
| 9 | HUD with 💾 unsaved indicator | `ui/HUD.js` |
| 10 | DialogBox + NPC interaction | `ui/DialogBox.js`, `scenes/WorldScene.js` |

---

### Verification

```bash
npm create vite@latest cloud-quest -- --template vanilla
cd cloud-quest && npm install phaser
npm run dev       # → localhost:5173

# Manual checks:
# 1. New Game → name entry → spawns in Localhost Town
# 2. Walk around, talk to NPC → dialog typewriter appears
# 3. Trigger trainer battle → skill menu works, turn resolves
# 4. Pause → Bag → switch tabs, use Red Bull
# 5. Pause → Emblem Case → click earned emblem → drag to polish
# 6. Pause → Commit Progress → .cloudquest file downloads
# 7. Refresh page → Load Save → pick file → resumes at saved location
# 8. Close tab without saving → beforeunload warning fires
```

Deploy: push to GitHub → Settings → Pages → deploy from `main` → live at `https://[user].github.io/cloud-quest`
