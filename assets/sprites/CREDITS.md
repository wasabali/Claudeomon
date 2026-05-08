# Sprite Asset Credits

All sprite assets are CC0 or CC-BY-SA (see per-source details below). Attribution is included as good practice.

---

## LPC (Liberated Pixel Cup) Spritesheet Generator — CC-BY-SA 3.0

Character sprites used for Cloud Quest trainers, the player character, and NPCs are
generated from the **Universal LPC Spritesheet Character Generator**.

- **Source:** https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
- **License:** CC-BY-SA 3.0 (Creative Commons Attribution-ShareAlike 3.0)
- **Style:** Pokémon DS-era overworld — solid outline, ~16-colour palette, no anti-aliasing
- **Format:** 4-row × 3-column walk-cycle sheet, 48×48 px per frame (total 144×192 px)

### What's included

Each character sprite sheet is a **4-row × 3-column** walk-cycle sheet at 48×48 px per frame.

**Important:** BootScene loads all player/trainer sprites by `spriteKey` from `assets/sprites/characters/<spriteKey>.png`.
`PLAYER_SPRITE_KEY` is `'player_default'`; each trainer entry in `src/data/trainers.js` sets its own `spriteKey`.

Sprite sheets live in `assets/sprites/characters/` and are named by role:

| File | Role / archetype |
|------|-----------------|
| `player_default.png` | Young cloud engineer — player character |
| `senior_ops_npc.png` | Grizzled veteran ops engineer |
| `devops_npc.png` | DevOps / Linux wizard |
| `security_engineer_npc.png` | Security specialist |
| `principal_engineer_npc.png` | Elder all-knowing principal engineer |
| `cursed_trainer_npc.png` | Dark/mysterious cursed technique user |
| `data_engineer_npc.png` | Disciplined data engineer |
| `senior_engineer_npc.png` | Armoured, principled senior engineer |
| `infra_engineer_npc.png` | Large, bulky infrastructure engineer |
| `staff_engineer_npc.png` | Staff / fleet commander |
| `junior_engineer_npc.png` | Rank-and-file junior engineer |
| `sre_npc.png` | Sturdy battle-hardened SRE |
| `frontend_engineer_npc.png` | Precise frontend engineer |
| `platform_engineer_npc.png` | Meditative platform engineer |
| `devrel_npc.png` | Stealthy DevRel operative |
| `hacker_npc.png` | Fast, event-driven hacker |
| `sysadmin_npc.png` | Automated sysadmin |
| `intern_npc.png` | Young, inexperienced intern |
| `cloud_engineer_npc.png` | Cloud infrastructure engineer |
| `open_source_pirate_npc.png` | Swashbuckling open-source advocate |
| `chaos_engineer_npc.png` | Quick, opportunistic chaos engineer |
| `demon_trainer_npc.png` | Sinister cursed trainer |
| `zombie_process_npc.png` | Deprecated/ancient zombie process |
| `legacy_engineer_npc.png` | Massive legacy system engineer |
| `goblin_engineer_npc.png` | Small but chaotic goblin engineer |
| `jira_slime_npc.png` | Formless JIRA slime entity |
| `compliance_officer_npc.png` | Compliance officer |
| `scrum_master_npc.png` | Chaotic unpredictable scrum master |
| `backend_engineer_npc.png` | Backend engineer trickster |
| `cto_npc.png` | Final-boss CTO authority figure |
| `rival_engineer_npc.png` | Rival cloud engineer |

### How to obtain real assets

1. Visit **https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/**
2. Customise the character appearance for each role (hoodie, laptop bag for player, etc.)
3. Export as PNG — the generator outputs a walk-cycle sheet at **64×64 px per frame** by default
4. Scale down to **48×48 px per frame** (total sheet 144×192 px) using nearest-neighbor interpolation:
   ```bash
   convert lpc_export.png -filter point -resize 144x192 <spriteKey>.png
   ```
5. Save as `assets/sprites/characters/<spriteKey>.png`

---

## Kenney Tiny Town (CC0)

Portrait sprites used in DialogBox conversations are sourced from **Kenney Tiny Town**.

- **Source:** https://kenney.nl/assets/tiny-town
- **License:** CC0 1.0 Universal (Public Domain Dedication)
- **Format:** ~80×80 px talking-head portrait, restricted palette

### Folder Mapping

| Source | Cloud Quest folder |
|--------|--------------------|
| Kenney Tiny Town | `assets/sprites/portraits/` |

---

## Kenney Game Icons (CC0 1.0)

Item icons are sourced from [Kenney Game Icons](https://kenney.nl/assets/game-icons) by [Kenney](https://kenney.nl).

- **License:** CC0 1.0 Universal (Public Domain Dedication) — no restrictions
- **Source:** https://kenney.nl/assets/game-icons
- **Modifications:** Scaled to 48×48px using nearest-neighbor interpolation

### Folder Mapping

| Source | Cloud Quest folder |
|--------|--------------------|
| Kenney Game Icons | `assets/sprites/items/` |
