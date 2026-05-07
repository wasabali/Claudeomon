# Sprite Asset Credits

All sprite assets are CC0 (public domain). Attribution is not legally required; we credit sources here as good practice.

---

## Ninja Adventure Asset Pack (CC0)

Character sprites used for Cloud Quest trainers, the player character, and NPCs are
sourced from the **Ninja Adventure Asset Pack** by Robert and Pixel-Boy.

- **Source:** https://pixel-boy.itch.io/ninja-adventure-asset-pack  
- **License:** CC0 (Public Domain)
- **Modifications:** 3× nearest-neighbor upscale from 16×16px to 48×48px

### What's included

Each character sprite sheet is a **4-row × 3-column** walk-cycle sheet at 48×48 px per frame.

**Important:** BootScene loads all player/trainer sprites by `spriteKey` from `assets/sprites/characters/<spriteKey>.png`.
`PLAYER_SPRITE_KEY` is `'ninja_hero'`; each trainer entry in `src/data/trainers.js` sets its own `spriteKey`.

Sprite sheets live in `assets/sprites/characters/` and are named by archetype:

| File | Archetype |
|------|-----------|
| `ninja_hero.png` | Versatile young hero (**player default**) |
| `ninja_old_samurai.png` | Grizzled veteran warrior |
| `ninja_mage.png` | Robed wizard/spell-caster |
| `ninja_sorceress.png` | Female magic user |
| `ninja_archwizard.png` | Elder all-knowing spell-caster |
| `ninja_warlock.png` | Dark/mysterious magic user |
| `ninja_samurai.png` | Disciplined sword-wielder |
| `ninja_knight.png` | Armoured, principled fighter |
| `ninja_heavy_bandit.png` | Large, bulky brawler |
| `ninja_captain.png` | Naval/fleet commander |
| `ninja_soldier.png` | Rank-and-file armoured fighter |
| `ninja_warrior.png` | Sturdy battle-hardened fighter |
| `ninja_archer.png` | Precise ranged fighter |
| `ninja_monk.png` | Meditative martial artist |
| `ninja_ninja.png` | Stealthy operative |
| `ninja_assassin.png` | Fast, event-driven rogue |
| `ninja_robot.png` | Automated mechanical fighter |
| `ninja_adventurer.png` | Young, inexperienced traveller |
| `ninja_woman_fighter.png` | Female armoured fighter |
| `ninja_pirate.png` | Swashbuckling sales type |
| `ninja_burglar.png` | Quick, opportunistic thief |
| `ninja_demon.png` | Sinister corrupted figure |
| `ninja_skeleton.png` | Deprecated/ancient undead |
| `ninja_ogre.png` | Massive destructive brute |
| `ninja_goblin.png` | Small but chaotic primitive |
| `ninja_slime.png` | Formless null entity |
| `ninja_sheriff.png` | Law-enforcement type |
| `ninja_clown.png` | Chaotic unpredictable joker |
| `ninja_magician.png` | Stage-magician trickster |
| `ninja_king.png` | Final-boss authority figure |

### Folder Mapping

| Ninja Adventure folder | Cloud Quest folder |
|------------------------|--------------------|
| `Actor/Characters/` | `assets/sprites/characters/` |
| `Actor/Monsters/` | `assets/sprites/monsters/` |
| `FX/` | `assets/sprites/vfx/` |

### Obtaining the files

1. Download **Ninja Adventure Asset Pack** from https://pixel-boy.itch.io/ninja-adventure-asset-pack
2. Run the upscale script (3×): `node scripts/upscale-assets.js --input /tmp/NinjaAdventure --output /tmp/ninja-upscaled`
3. Copy character sheets matching the table above into `assets/sprites/characters/`

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
