# 🏅 Emblems

Emblems are permanent badges earned by defeating Gym Leaders. Each emblem grants a passive bonus for the rest of the run. They are displayed in your Emblem Case (press `E` from the overworld).

---

## All Emblems

| Emblem | Domain | How to Earn | Passive Bonus |
|---|---|---|---|
| 🐧 Tux Emblem | Linux | Defeat Rex (Linux Gym, Localhost Town) | Linux skills +5% effectiveness |
| 🔒 Vault Emblem | Security | Defeat Cipher (Security Vault) | Shame Point gain –1 per battle (minimum 0) |
| ⚡ Serverless Emblem | Serverless | Defeat Evie (Serverless Spire) | Serverless skills +5% effectiveness |
| ☁️ Cloud Emblem | Cloud | Defeat CloudChad (Production Plains) | Budget drain –10% in all battles |
| 🏗️ Pipeline Emblem | IaC | Defeat TerraMax (Staging Valley) | IaC skill fail chance –5% |
| 🐳 Container Emblem | Containers | Defeat Dock (Node_modules Maze) | Container skills +5% effectiveness |
| ⛵ Helm Emblem | Kubernetes | Defeat Kube (Kubernetes Colosseum) | Kubernetes skills +5% effectiveness |
| 📊 SRE Emblem | Observability | Defeat Dashia (Architecture District) | Max HP +10 |
| 💰 FinOps Emblem | Cloud | Defeat CloudChad **and** resolve Azure Bill Spike | Budget restored +10% after each battle |

---

## Notes

- Emblems are stored in `GameState.emblems` and are never lost.
- You earn exactly one emblem per Gym Leader. Defeating the same leader twice does nothing.
- The **FinOps Emblem** requires both defeating CloudChad *and* resolving the Azure Bill Spike boss encounter — the only emblem with a two-step unlock.
- The **Vault Emblem** interacts directly with the Shame system and is the only way to reduce Shame accumulation passively. See [Reputation & Shame](reputation-and-shame.md).
- **SRE Emblem** (+10 Max HP) stacks with level-up HP gains.
- Domain-specific bonuses (+5%) stack with domain matchup multipliers (2.0× strong).

---

## Emblem Grime & Polishing

Each emblem slowly accumulates **grime** — visual wear from your adventures. The grime rate is 0.05 per Shame Point (`GRIME_PER_SHAME`), doubling to 0.10 at Shadow Engineer tier.

| Emblem | Grime Flavour |
|---|---|
| Tux | Terminal scrollback residue |
| Pipeline | Failed build red ink splatter |
| Container | node_modules dust |
| Cloud | Azure portal spinner smudges |
| Vault | Leaked secret stains |
| Helm | CrashLoopBackOff soot |
| FinOps | Billing alert residue |
| SRE | 3am coffee ring stains |
| Serverless | Cold start frost residue |

Open the **Emblem Case** (press `E`) to polish emblems via the drag/swipe minigame. Polished emblems glow in battle with the `ShineEffect`. Cosmetic only.

---

See [Trainers](trainers.md) for Gym Leader locations and teams.
