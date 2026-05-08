# Trainer Sprite — Reference

## Runtime loading convention

**BootScene loads each trainer's sprite by `spriteKey` (from `src/data/trainers.js`) from `assets/sprites/characters/<spriteKey>.png`.**

For example, the trainer with `spriteKey: 'senior_ops_npc'` is loaded from:
```
assets/sprites/characters/senior_ops_npc.png
```

This directory (`assets/sprites/trainers/`) is a **staging area** for real LPC-generated character sprites
before copying to `assets/sprites/characters/`. `trainer_default.png` is a colour-coded
placeholder stub (144×192px, 3-col × 4-row walk-cycle sheet, 48×48px per frame).

## Source

**LPC (Liberated Pixel Cup) Spritesheet Generator** — https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/  
License: CC-BY-SA 3.0 (Creative Commons Attribution-ShareAlike 3.0).  
Style target: Pokémon DS-era overworld — solid outline, ~16-colour palette, no anti-aliasing.  
Palette consistent across all characters (shared shadow/skin tones).

## Integration steps

1. Visit https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
2. For each trainer defined in `src/data/trainers.js`, customise a matching character appearance.
3. Export as PNG — the generator outputs a walk-cycle sheet at 48×48px per frame.
4. Copy it to `assets/sprites/characters/<spriteKey>.png` where `<spriteKey>` matches the trainer's `spriteKey` field
   (e.g., `senior_ops_npc.png`, `devops_npc.png`, `intern_npc.png`, etc.).

## Sprite sheet layout

Each sprite sheet is a **4-row × 3-column** grid at 48×48 px per frame:

| Row | Direction |
|-----|-----------|
| 0   | Down (south) |
| 1   | Left (west) |
| 2   | Right (east) |
| 3   | Up (north) |

Columns 0–2 are the three walk-cycle frames per direction.
Total sheet size: 144×192 px.
