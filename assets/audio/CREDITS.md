# Audio Asset Credits

## Ninja Adventure (CC0 / Public Domain)

Sound effects are sourced from the
**Ninja Adventure Asset Pack** by [pixel-boy](https://pixel-boy.itch.io/) and
[AAA](https://www.aamatnovi.art/), published at
<https://pixel-boy.itch.io/ninja-adventure-asset-pack>.

These assets are released under **CC0 1.0 Universal (Public Domain Dedication)**.
No attribution is legally required, but we credit the authors here in appreciation.

### SFX mapping

SFX files are placed in `assets/audio/sfx/` organised by category:

| Category | Directory | Game events |
|---|---|---|
| Battle | `sfx/battle/` | hit, critical, heal, status effects, SLA timers, shame, budget drain, reputation, encounter start |
| UI | `sfx/ui/` | cursor move, confirm, cancel, text blip, save |
| Overworld | `sfx/overworld/` | emblem earn/sparkle, door locked, level up |

---

## Kenney RPG Audio (CC0 / Public Domain)

Background music tracks are sourced from the
**Kenney RPG Audio** pack by [Kenney](https://kenney.nl/), published at
<https://kenney.nl/assets/rpg-audio>.

These assets are released under **CC0 1.0 Universal (Public Domain Dedication)**.
No attribution is legally required, but we credit the author here in appreciation.

### BGM mapping

BGM tracks are placed in `assets/audio/bgm/`. Each track is loaded as OGG with an
MP3 fallback for full browser coverage (Phaser picks the first supported format).
The `kenneyTrack` field in `src/data/audio.js` records the Kenney source filename
for each Cloud Quest BGM ID.

| Cloud Quest ID | Scene / Region | Kenney Source Track |
|---|---|---|
| `title` | Title screen | `rpgTitle.ogg` |
| `localhost_town` | Localhost Town (starting area) | `rpgExploration.ogg` |
| `pipeline_pass` | Pipeline Pass | `rpgExploration.ogg` |
| `container_port` | Container Port | `rpgExploration.ogg` |
| `cloud_citadel` | Cloud Citadel | `rpgBattleTheme.ogg` |
| `kernel_caves` | Kernel Caves | `rpgExploration.ogg` |
| `serverless_steppes` | Serverless Steppes | `rpgExploration.ogg` |
| `three_am_tavern` | 3am Tavern | `rpgTitle.ogg` |
| `legacy_codebase` | Legacy Codebase area | `rpgExploration.ogg` |
| `outcast_network` | Outcast Network (hidden) | `rpgBattleTheme.ogg` |
| `shadow_registry` | Shadow Registry (hidden) | `rpgBattleTheme.ogg` |
| `battle_incident` | Battle — incident encounter | `rpgBattleTheme.ogg` |
| `battle_engineer` | Battle — engineer encounter | `rpgBattleTheme.ogg` |
| `battle_cursed` | Battle — cursed encounter | `rpgBattleTheme.ogg` |
| `battle_throttlemaster` | Battle — ThrottleMaster boss | `rpgBattleTheme.ogg` |
| `victory` | Victory fanfare (no loop) | `rpgVictoryJingle.ogg` |
| `game_over` | Game over (no loop) | `rpgDefeatJingle.ogg` |

> **Note:** Multiple Cloud Quest BGM IDs may share the same Kenney source track.
> Each file is renamed to match the Cloud Quest ID when copied to `assets/audio/bgm/`.
> Verify exact Kenney filenames against the downloaded pack and update loop points in
> `assets/audio/bgm-loop-points.json` using Audacity or the track's natural end time.

### License

These assets are in the **public domain** under CC0 1.0.
See <https://creativecommons.org/publicdomain/zero/1.0/> for details.
