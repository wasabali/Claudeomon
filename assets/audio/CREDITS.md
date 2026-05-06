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

| Track ID | Scene / Region |
|---|---|
| `title` | Title screen |
| `localhost_town` | Localhost Town (starting area) |
| `pipeline_pass` | Pipeline Pass |
| `container_port` | Container Port |
| `cloud_citadel` | Cloud Citadel |
| `kernel_caves` | Kernel Caves |
| `serverless_steppes` | Serverless Steppes |
| `three_am_tavern` | 3am Tavern |
| `legacy_codebase` | Legacy Codebase area |
| `outcast_network` | Outcast Network (hidden) |
| `shadow_registry` | Shadow Registry (hidden) |
| `battle_incident` | Battle — incident encounter |
| `battle_engineer` | Battle — engineer encounter |
| `battle_cursed` | Battle — cursed encounter |
| `battle_throttlemaster` | Battle — ThrottleMaster boss |
| `victory` | Victory fanfare (no loop) |
| `game_over` | Game over (no loop) |

### License

These assets are in the **public domain** under CC0 1.0.
See <https://creativecommons.org/publicdomain/zero/1.0/> for details.
