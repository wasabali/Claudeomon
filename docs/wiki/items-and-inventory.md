# Items & Inventory

Your inventory has five tabs: **Tools**, **Key Items**, **Credentials**, **Docs**, and **Junk**. Items are found in the world, given as quest rewards, dropped by encounters, or bought in shops.

---

## 🔧 Tools

Consumable items you can use in battle or the overworld.

| Item | Usable in Battle? | Effect | Description |
|---|---|---|---|
| **Red Bull** | ✅ | Heal 30 HP | 3am fuel. Restores 30 HP. |
| **Rollback Potion** | ✅ | Heal 20 HP | Reverts the latest bad deploy. |
| **Azure Credit Voucher** | ✅ | Restore 50 Budget | Restore 50 Budget. No questions asked. |
| **Skip Tests Scroll** | ✅ | Bypass one skill check | Bypass one skill check. Your karma takes the hit. |
| **On-Call Phone** | ❌ (overworld only) | Applies "on_call" status | Picks up the pager rotation immediately. |
| **Coffee and an Apology** | ❌ (overworld only) | Reduces 1 Shame Point | A lukewarm coffee and a sticky note that says 'sorry about the deploy.' Reduces 1 Shame Point. The coffee is bad. The apology is genuine. Mostly. |
| **Coffee (Black)** | ✅ | Heal 15 HP | Tastes like 6am. Restores 15 HP. |
| **Energy Drink (Monster)** | ✅ | Heal 50 HP | Your hands are shaking. Restores 50 HP. |
| **Hot Chocolate** | ✅ | Heal 40 HP | Warm. Comforting. Briefly. Restores 40 HP. Only available at the 3am Tavern. |
| **Full English Breakfast** | ✅ | Heal 999 HP | Beans, toast, and a clean build. Restores HP to full. |
| **Protein Bar** | ✅ | Heal 25 HP | Expired 2 months ago. Probably fine. Restores 25 HP. |
| **Stack Overflow Printout** | ✅ | Reveal Domain And Weakness | The answer was from 2014. It still works. Reveals enemy domain and weakness. |
| **Feature Flag Toggle** | ✅ | Disable Enemy Skill (turns: 2) | Flip it. Ship it. Pray. Disables one enemy skill for 2 turns. |
| **Canary Token** | ✅ | Damage Reduction (value: 50, turns: 1) | The canary died so you don't have to. Reduces next hit's damage by 50%. |
| **Load Balancer Cookie** | ✅ | Dodge Next Attack | Session affinity: OFF. Causes next enemy attack to miss. |
| **CI Green Badge** | ✅ | Damage Buff (value: 25, turns: 3) | ✅ All checks passed. Deals +25% damage for the next 3 turns. |
| **Rubber Duck** | ✅ | Reveal Hint | You explain the problem. It quacks. Reveals a hint about the current enemy. |
| **Azure Coupon Code** | ✅ | Restore 100 Budget | AZFREE100. Expired. Still works somehow. Restores 100 Budget. |
| **Reserved Instance Contract** | ✅ | Budget Cost Reduction (value: 50, uses: 5) | Commitment issues? Not anymore. Next 5 skills cost 50% less budget. |
| **Spot Instance Ticket** | ✅ | Free Skill With Interrupt Risk (interruptchance: 20) | Cheap. Unreliable. Perfect. One skill costs 0 budget but has 20% chance to be interrupted. |
| **Cost Alert Suppressor** | ✅ | Ignore Budget Drain (turns: 3) | You'll deal with the bill later. Ignore budget drain for 3 turns. |

---

## 🔑 Key Items

Important items that unlock areas or advance the story. These can't be dropped.

| Item | Description |
|---|---|
| **SSH Key (Staging)** | Unlocks staging server doors. |
| **Staging Env Token** | Required to enter Staging Valley. |
| **Terraform State** | Don't touch it. Don't move it. |
| **Cross-Origin-Opener-Policy** | Value: same-origin. You found this in a config file. It looked important. |
| **Cross-Origin-Embedder-Policy** | Value: require-corp. Nobody knows why this is needed. It just is. |
| **sudo Running Shoes** | sudo chmod +x legs.sh. 2x movement speed while holding Z. Encounter rate +50%. |
| **Legacy Migration Badge** | Awarded for choosing the strangler fig pattern. Proof you respect legacy systems. |
| **Pipeline Pass Badge** | Grants access beyond Localhost Town. Awarded for beating Gym 1. |
| **Production Clearance** | Required to enter Production Plains. Complete your first staging deployment first. |
| **OldCorp Keycard** | Kristoffer gave you this in Act 3. Opens the OldCorp Basement. |
| **THROTTLEMASTER's Notes** | Found in the hidden workstation. Show these to Professor Pedersen before the finale. |
| **The Pager** | SLA Signe gave you this. It vibrates constantly. Random incident encounters anywhere. |
| **Admin Kubeconfig** | Grants access to the Kubernetes Colosseum inner ring. Complete the Helm Repository first. |
| **Architecture Review Stamp** | Your design was approved. Access to The Cloud Console granted. |

---

## 🎫 Credentials

Authentication tokens and certificates. You need these for certain battles and areas.

| Item | Description |
|---|---|
| **Azure Service Principal Cert** | Auth token for Azure battles. |
| **Cloud Cert** | Validates your access level. |

---

## 📄 Docs

Readable items that grant XP or provide information.

| Item | Effect | Description |
|---|---|---|
| **Outdated Runbook** | +5 XP on first read | Half the steps are wrong. Still +5 XP. |
| **Incident Postmortem** | +20 XP if your last battle was lost | Painful reading, but educational. |
| **Published Post-Mortem** | Reduces 1 Shame Point | You wrote a blameless post-mortem. You named your mistakes. People read it. Reduces 1 Shame Point. The damage is done, but at least you owned it. |
| **Well-Architected Framework** | +15 XP on first read | The sacred text. +15 XP on read. |
| **THROTTLEMASTER's Blog Post** | +10 XP on first read | "10 Reasons Your Cloud Is Wrong." Lore about the villain's motivation. +10 XP. |
| **The Original Commit Message** | +5 XP on first read | "initial commit" — that's it. +5 XP. |
| **Kristoffer's Performance Review** | +10 XP on first read | "Shows improvement. Questionable judgement." Hints at THROTTLEMASTER connection. +10 XP. |
| **Deprecated API Changelog** | +5 XP on first read | Breaking changes: yes. Migration guide: no. +5 XP. |

---

## 🗑️ Junk

Worthless items. Or are they?

| Item | Description |
|---|---|
| **Root Password (sticky note)** | Found in Margaret's house. Useless. Horrifying. |
| **Mystery node_modules** | An inexplicable dependency forest. |
| **Stale PR** | Open since 2019. Nobody will merge it. |
| **Cold Coffee** | Margaret's thanks. It was warm when she made it. You took too long. |
| **Scorched Server** | Still smoking. A monument to your choices. A cursed salvage that restores 20 HP. |
| **Broken Jenkins Plugin** | Version 0.0.1-alpha-SNAPSHOT-RC2. No documentation. |
| **USB Stick Labelled 'BACKUP'** | Contains a single README.md that says 'TODO'. |
| **Conference Lanyard** | KubeCon 2024. Still wearing it. |
| **Printed Email Thread** | 17 pages. Subject: 'Re: Re: Re: Re: Quick question'. |
| **Expired SSL Certificate** | Valid until: yesterday. |
| **A Single YAML Tab** | It's a tab character in a YAML file. It broke everything. |
| **Floppy Disk** | 1.44MB. Contains the original cloud. |

---

*Auto-generated from `src/data/items.js` by `scripts/generate-wiki.js`*
