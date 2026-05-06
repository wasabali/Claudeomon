# Audio Asset Credits

## Ninja Adventure (CC0 / Public Domain)

Sound effects and background music tracks are sourced from the
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

### BGM mapping

BGM tracks are placed in `assets/audio/bgm/`. Each track is loaded as OGG with an
MP3 fallback for full browser coverage (Phaser picks the first supported format).

The file stored at `assets/audio/bgm/<id>.ogg` is a copy/rename of the listed
Ninja Adventure source track. Re-measure loop points in `bgm-loop-points.json`
with an audio editor (e.g. Audacity) if any source file is replaced.

| Cloud Quest track ID | Ninja Adventure source track | Scene / Region |
|---|---|---|
| `title` | `07 - MainMenu.ogg` | Title screen |
| `localhost_town` | `18 - Town.ogg` | Localhost Town (starting area) |
| `pipeline_pass` | `33 - Peaceful.ogg` | Pipeline Pass |
| `container_port` | `35 - Energy.ogg` | Container Port |
| `cloud_citadel` | `15 - Castle.ogg` | Cloud Citadel |
| `kernel_caves` | `09 - WaterCave.ogg` | Kernel Caves |
| `serverless_steppes` | `13 - Forest.ogg` | Serverless Steppes |
| `three_am_tavern` | `21 - Inn.ogg` | 3am Tavern |
| `legacy_codebase` | `34 - Ancient.ogg` | Legacy Codebase area |
| `outcast_network` | `37 - Secret.ogg` | Outcast Network (hidden) |
| `shadow_registry` | `26 - Mystery.ogg` | Shadow Registry (hidden) |
| `battle_incident` | `22 - Battle.ogg` | Battle — incident encounter |
| `battle_engineer` | `29 - Escape.ogg` | Battle — engineer encounter |
| `battle_cursed` | `28 - Tension.ogg` | Battle — cursed encounter |
| `battle_throttlemaster` | `08 - BossTheme.ogg` | Battle — ThrottleMaster boss |
| `victory` | `23 - Victory.ogg` | Victory fanfare (no loop) |
| `game_over` | `24 - GameOver.ogg` | Game over (no loop) |

### License

These assets are in the **public domain** under CC0 1.0.
See <https://creativecommons.org/publicdomain/zero/1.0/> for details.
