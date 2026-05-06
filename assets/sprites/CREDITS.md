# Sprite Asset Credits

## Ninja Adventure Asset Pack (CC0 1.0)

Character sprites, NPC sprites, monster sprites, VFX sprites, and item icons are
sourced from [Ninja Adventure](https://pixel-boy.itch.io/ninja-adventure-asset-pack)
by **pixel-boy (AAA)**.

- **License:** CC0 1.0 Universal (Public Domain Dedication) — no restrictions, no attribution required, but credited here for transparency.
- **Source:** https://pixel-boy.itch.io/ninja-adventure-asset-pack
- **Source folders:** `Actor/Characters/`, `Actor/Monsters/`, `FX/`, `Items/Icons/`, `Maps/Tilesets/`, `Audio/BGM/`, `Audio/SFX/`
- **Modifications:** 3× nearest-neighbor upscale from 16×16px to 48×48px

---

## Folder Mapping

| Ninja Adventure folder | Cloud Quest folder |
|------------------------|--------------------|
| `Actor/Characters/` | `assets/sprites/player/` |
| `Actor/Monsters/` | `assets/sprites/incidents/` |
| `FX/` | `assets/sprites/effects/` |
| `Items/Icons/` | `assets/sprites/items/` |
| `Maps/Tilesets/` | `assets/tilesets/` |
| `Audio/BGM/` | `assets/audio/bgm/` |
| `Audio/SFX/` | `assets/audio/sfx/` |

---

## Character Archetypes

Each character sprite sheet is a 4-direction walk-cycle sheet. Sprite sheets are
placed in `assets/sprites/player/` (player selectable) or `assets/sprites/trainers/`
(trainer NPCs) and named by archetype:

| File | Archetype |
|------|-----------|
| `ninja_hero.png` | Versatile young hero (player default) |
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

### Sprite Sheet Layout

Each `.png` is a **4-row × 3-column** grid at 3× scale (48×48px per frame):

| Row | Direction |
|-----|-----------|
| 0   | Down (south) |
| 1   | Left (west) |
| 2   | Right (east) |
| 3   | Up (north) |

Columns 0–2 are the three walk-cycle frames per direction.

---

## Obtaining the Files

1. Download **Ninja Adventure Asset Pack** from https://pixel-boy.itch.io/ninja-adventure-asset-pack
2. Upscale (3×): `node scripts/upscale-assets.js --input /path/to/NinjaAdventure --output /tmp/ninja-upscaled`
3. Install: `node scripts/install-ninja-assets.js --input /tmp/ninja-upscaled`

Or use the npm shortcut after upscaling:

```bash
npm run assets:install -- --input /tmp/ninja-upscaled
```

For development without the real pack, generate placeholder stubs:

```bash
npm run assets:stubs
```

