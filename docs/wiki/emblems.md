# 🏅 Emblems

Emblems are the shiny proof that you beat a gym leader and lived to tell the tale. Each emblem grants a **permanent passive bonus** that's always active in battle — no equipping required. They're basically certifications, except these ones actually do something useful.

You can view and polish your emblems in the **Emblem Case** scene. Polish them with the mouse-drag minigame to remove grime and unlock a shine effect. Because even in a satirical RPG, we believe in emblem hygiene.

---

## All Emblems

There are 9 emblems in Cloud Quest — one for each gym.

---

### 🐧 Tux Emblem — Linux

- **Gym:** The Legacy Terminal (Gym 1)
- **Leader:** Tux the Terminal Wizard
- **Required Badges:** 0
- **Passive Bonus:** Linux skills +5% effectiveness
- **Grime:** *Terminal scrollback residue*

Your first emblem. Earned by surviving a fight where Cloud and Serverless skills are completely blocked. Hope you like `grep`.

---

### ☁️ Cloud Emblem — Cloud

- **Gym:** 3am Incident Response (Gym 2)
- **Leader:** Captain Nines
- **Required Badges:** 1
- **Passive Bonus:** Budget drain -10%
- **Grime:** *Azure portal spinner smudges*

Earned under a brutal 6-turn SLA timer. If you breached the SLA, you still get the emblem — but you'll remember the reputation hit.

---

### 🔧 Pipeline Emblem — IaC

- **Gym:** The Broken Pipeline (Gym 3)
- **Leader:** Bjørn the Build Breaker
- **Required Badges:** 2
- **Passive Bonus:** IaC skill fail chance -5%
- **Grime:** *Failed build red ink splatter*

Earned in the gym where 30% of your skills just... don't work. The Pipeline Emblem's -5% fail chance bonus is sweet revenge.

---

### ⚡ Serverless Emblem — Serverless

- **Gym:** Cold Start Gauntlet (Gym 4)
- **Leader:** Fatima the Function Witch
- **Required Badges:** 3
- **Passive Bonus:** Serverless skills +5% effectiveness
- **Grime:** *Cold start frost residue*

You skip your entire first turn in this gym. The frost on this emblem is a permanent reminder of that helpless feeling.

---

### ⛵ Helm Emblem — Kubernetes

- **Gym:** Pod Crasher (Gym 5)
- **Leader:** The Kube-rnetes Master
- **Required Badges:** 4
- **Passive Bonus:** Kubernetes skills +5% effectiveness
- **Grime:** *CrashLoopBackOff soot*

The Kube-rnetes Master respawns 3 times at 50% HP. You basically have to beat the same fight four times. The soot on this emblem is well-earned.

---

### 🔒 Vault Emblem — Security

- **Gym:** Entra Misconfiguration (Gym 6)
- **Leader:** Ingrid the IAM Inspector
- **Required Badges:** 5
- **Passive Bonus:** Shame Point gain -1 (minimum 0)
- **Grime:** *Leaked secret stains*

The most defensively valuable emblem in the game. With the Vault Emblem equipped, cursed techniques only add +0 Shame instead of +1 (minimum 0). If you're flirting with the evil path, this is your safety net.

---

### 📊 SRE Emblem — Observability

- **Gym:** Azure Bill Spiral (Gym 7)
- **Leader:** Oracle Alice
- **Required Badges:** 6
- **Passive Bonus:** Max HP +10
- **Grime:** *3am coffee ring stains*

Earned in the gym where Oracle Alice's HP and attack grow every single turn. The cost spiral hits hard after turn 8. The coffee ring stains are from the all-nighter you pulled to beat her.

---

### 💰 FinOps Emblem — Cloud

- **Gym:** The CTO Office (Gym 8)
- **Leader:** The CTO
- **Required Badges:** 7
- **Passive Bonus:** Budget restored +10% after each battle
- **Grime:** *Billing alert residue*

The final gym emblem. The CTO switches domains every 2 turns and enters Executive Mode (×1.5 damage) at 25% HP. Beating the CTO is the hardest standard fight in the game. The budget bonus is your reward for surviving corporate.

---

## Emblem Summary Table

| Emblem | Domain | Gym | Leader | Passive Bonus |
|---|---|---|---|---|
| Tux | Linux | The Legacy Terminal | Tux the Terminal Wizard | Linux skills +5% effectiveness |
| Cloud | Cloud | 3am Incident Response | Captain Nines | Budget drain -10% |
| Pipeline | IaC | The Broken Pipeline | Bjørn the Build Breaker | IaC skill fail chance -5% |
| Serverless | Serverless | Cold Start Gauntlet | Fatima the Function Witch | Serverless skills +5% effectiveness |
| Helm | Kubernetes | Pod Crasher | The Kube-rnetes Master | Kubernetes skills +5% effectiveness |
| Vault | Security | Entra Misconfiguration | Ingrid the IAM Inspector | Shame Point gain -1 (minimum 0) |
| SRE | Observability | Azure Bill Spiral | Oracle Alice | Max HP +10 |
| FinOps | Cloud | The CTO Office | The CTO | Budget restored +10% after each battle |
| Container | Containers | *(see below)* | *(see below)* | Container skills +5% effectiveness |

### 📦 Container Emblem — Containers

The Container Emblem is the only emblem **not directly tied to a numbered gym** in the current data. Its passive bonus is Container skills +5% effectiveness, and its grime description is *node_modules dust* — because of course it is. *Planned: The Container Emblem's acquisition method will be confirmed in a future update.*

---

## Emblem Grime & Polishing

### How Grime Works

Shame dirties your emblems. Every Shame Point you accumulate adds **0.05 grime** to all earned emblems. At Shame ≥ 10 (Shadow Engineer), the rate doubles to **0.10 grime per Shame Point**.

Grimy emblems still provide their passive bonus — they just look terrible. Like a LinkedIn certification badge with coffee stains on it.

| Shame Level | Grime Per Shame Point |
|---|---|
| 0–9 | 0.05 |
| 10+ (Shadow Engineer) | 0.10 |

### Polishing

In the Emblem Case scene:

1. Hover over any earned emblem
2. Click and drag the polishing cloth across the surface
3. After several passes, the emblem regains its shine

Fully polished emblems glow during gym leader pre-battle dialogue and display a sparkle effect on the battle HUD. It's purely cosmetic — but it *feels* good.

---

*See also: [Combat Guide](combat-guide.md) · [Reputation & Shame](reputation-and-shame.md)*
