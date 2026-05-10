# ⭐ Reputation & Shame

Two stats define who you are in the Cloud Quest world. One measures how much people trust you. The other measures how many bridges you've burned. They're independent, they move differently, and only one of them can be rebuilt.

Choose wisely. Or don't. That's kind of the point.

---

## Reputation

Reputation measures your professional standing in the cloud engineering world. It ranges from **-100 to 100**, starts at **50** (Competent Engineer), and can be rebuilt through good work.

### Reputation Thresholds

| Min Rep | Status Title | Shop Price Modifier |
|---|---|---|
| 90 | Distinguished Engineer | -20% |
| 80 | Senior Engineer | -10% |
| 60 | Competent Engineer | 0% |
| 40 | Adequate Engineer | 0% |
| 20 | Liability | +20% |
| 0 | Walking Incident | +50% |
| -25 | Known Incident | +50% |
| -50 | Do Not Pair With | +50% |
| -100 | The Reason We Have Runbooks | +50% |

### Shop Pricing

Your reputation directly affects shop prices. Distinguished Engineers get a 20% discount. Liabilities pay a 20% surcharge. Anyone below Walking Incident pays a flat 50% markup — because vendors know you're desperate.

### Signature Skill Teaching

At reputation ≥ 80 (Senior Engineer or above), trainers teach their signature skill on **any** win — not just Optimal tier. Being respected in the industry has tangible benefits.

### How Reputation Changes

- **Optimal wins:** Large reputation gain (+++)
- **Standard wins:** Small reputation gain (+)
- **Shortcut wins:** Small reputation loss (−)
- **Cursed techniques:** Significant reputation loss (−−)
- **Nuclear techniques:** Major reputation loss (−−−)
- **Quest completion:** Varies by solution path chosen
- **Gym leader victories:** Reputation boost

Reputation is always rebuildable. Even if you hit rock bottom at -100 ("The Reason We Have Runbooks"), you can climb back through consistent optimal play and quest completion. It's a long road, but it's there.

---

## Shame Points

Shame measures the accumulated weight of every shortcut, cursed technique, and catastrophic decision you've made. It starts at **0** and only goes up. Shame is **permanent** — it never decreases through normal play.

> *"Shame points are forever. The code remembers what you did."*

### Shame Thresholds

| Shame | Title | What Unlocks |
|---|---|---|
| 1 | It Was Like That When I Got Here | Professor Pedersen sighs at you; cursed location becomes visible |
| 3 | Cowboy Coder | NPC one-liners change — they're judging you now |
| 5 | The Shortcutter | Full 3am Tavern access; cursed network becomes active |
| 7 | Person of Interest | THROTTLEMASTER makes contact — the antagonist notices you |
| 10 | Shadow Engineer | Shadow Engineer title unlocked; auto-learns `EXEC xp_cmdshell` |
| 15 | The Other Principal | Secret ending becomes accessible |

Each threshold sets a story flag that permanently changes available content, NPC dialogue, and game progression.

### Gaining Shame

| Action | Shame Gain |
|---|---|
| Use any cursed technique | +1 |
| Use any nuclear technique | +2 |
| Certain quest choices | Varies |

---

## Gym Shame Reactions

Gym leaders react to your Shame level:

| Shame Level | Reaction |
|---|---|
| Shame ≥ 5 | Gym leaders add a **wary pre-battle line** — they've heard about you |
| Shame ≥ 10 | Gym leaders **refuse to teach their signature skill** — even if you win optimally |

At high Shame, gym leaders still fight you. They just don't want to be associated with you afterward. Fair enough.

---

## Shadow Engineer (Shame ≥ 10)

At Shame 10, you become a **Shadow Engineer**. This isn't just a title — it fundamentally changes your battle economy through the `shadow_fatigue` permanent status effect.

| Mechanic | Change |
|---|---|
| Optimal-tier skill budget cost | **+10** (it costs more to do the right thing) |
| Cursed-tier skill budget cost | **-5** (it costs less to do the wrong thing) |
| Healing from items/skills | **-20%** (nothing fixes you properly anymore) |
| ☕ Sip Coffee | Restores **15 HP** (Shadow-exclusive heal) |
| Emblem grime rate | Doubles from 0.05 to **0.10 per Shame Point** |
| Auto-learned skill | `EXEC xp_cmdshell` — added to your cursed skill list |

The Shadow Engineer economy is an inversion. The game actively incentivises cursed play and punishes optimal play. It's a trap that feels like a reward. Or a reward that feels like a trap. Depends on your perspective.

---

## The Evil Path

Cursed techniques are powerful. They bypass domain matchup disadvantages and deal devastating damage. But every use adds Shame and accumulates Technical Debt. The evil path isn't a punishment — it's an **alternate route** through the game with its own content, characters, and endings.

### What the Evil Path Offers

- **Cursed trainers** in hidden areas who teach the most powerful (and most dangerous) techniques
- **The Outcast Network** — 6 hidden areas found by doing things NPCs explicitly tell you *not* to do
- **THROTTLEMASTER** — the game's antagonist, who recruits high-Shame players
- **Alternate NPC dialogue** — the entire world reacts differently to a Shadow Engineer
- **Two exclusive endings** that are only accessible through high Shame

### The Price

- Technical Debt stacks reduce your Max HP by 2 per stack (permanent)
- Gym leaders refuse to teach you
- Shop prices are brutal if your reputation also tanks
- Your emblems get covered in grime

The evil path is viable. It's just... heavier.

---

## Endings

Cloud Quest has multiple endings, and Shame determines which ones you can access:

### Standard Ending: The Post-Mortem

Defeat the CTO with Shame 0–9. The standard "you did it, congratulations" ending. Professional. Clean. Your manager writes you a good performance review.

### Shadow Post-Mortem

**Requirements:** Shame 10–14 + CTO defeated (`cto_defeated` flag)

You beat the CTO, but the victory rings hollow. The post-mortem reveals the cost of every shortcut. NPCs reference your Shame history. It's... uncomfortable. But you still win.

### Fork the Company

**Requirements:** Shame 15+ + THROTTLEMASTER recruitment accepted (`throttlemaster_recruitment_accepted` flag)

You don't just beat the system — you **fork** it. THROTTLEMASTER offers you a position, and you accept. You take your cursed techniques, your shadow reputation, and your technical debt, and you build something new. Whether it's better or worse is left ambiguous. The credits roll differently.

---

## How to Reduce Shame

Shame can be reduced — but only barely. Two rare items exist:

| Item | Tab | Shame Reduction | Notes |
|---|---|---|---|
| Coffee and an Apology | Tools | -1 | A lukewarm coffee and a sticky note. The apology is genuine. Mostly. |
| Published Post-Mortem | Docs | -1 | Admitting what went wrong, publicly. Reduces 1 Shame Point per use. |

> ⚠️ These are the only methods to reduce Shame. Two items for -2 total versus the dozens of cursed technique uses it takes to reach Shadow Engineer. The math is not in your favour.

---

## Reputation vs. Shame: At a Glance

| | Reputation | Shame |
|---|---|---|
| Range | -100 to 100 | 0+ (no cap) |
| Starting Value | 50 | 0 |
| Direction | Bidirectional | One-way up only |
| Rebuildable? | ✅ Yes — quests, optimal play | ⚠️ Rare items only (Coffee and an Apology, Published Post-Mortem) |
| Affects | Shop prices, NPC trust, skill teaching | Content unlocks, endings, battle economy |
| Reflects | Professional standing | Accumulated bad decisions |

---

*See also: [Hidden Areas](hidden-areas.md) · [Combat Guide](combat-guide.md) · [Emblems](emblems.md)*
