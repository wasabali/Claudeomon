# Map Tile Asset Credits

## Placeholder tiles

All maps use `stub_tiles.png` as their base tileset — a 5-tile placeholder strip generated for
development. This remains the first tileset for all maps; biome-specific tilesets are appended
as a second entry.

---

## `/dev/null Void` (`dev_null_void`) — `void_tiles.png`

Tiles for the space/void biome are adapted from the following CC0-licensed Kenney asset pack.

| Source | Author | License | URL |
|--------|--------|---------|-----|
| **Kenney Space Kit** | Kenney | CC0 1.0 | https://kenney.nl/assets/space-kit |

Tiles adapted to 48×48px (3× nearest-neighbor upscale from 16×16px source); recoloured to
match the void palette specified in `TILE_SPECS.md §1`.

All 12 tiles are defined in `assets/tiles/void_tiles.tsj` and delivered as a single-row PNG
strip (`void_tiles.png`, 576×48px).

---

## `Deprecated Azure Region` (`deprecated_azure_region`) — `wasteland_tiles.png`

Tiles for the wasteland biome are adapted from the following CC0-licensed Kenney asset pack.

| Source | Author | License | URL |
|--------|--------|---------|-----|
| **Kenney RPG Urban Pack** | Kenney | CC0 1.0 | https://kenney.nl/assets/rpg-urban-pack |

Tiles adapted to 48×48px (3× nearest-neighbor upscale from 16×16px source); recoloured to
match the wasteland/rust palette specified in `TILE_SPECS.md §2`.

All 12 tiles are defined in `assets/tiles/wasteland_tiles.tsj` and delivered as a single-row
PNG strip (`wasteland_tiles.png`, 576×48px).

---

## All other regions

All other map files (Localhost Town, Pipeline Pass, Azure Town, etc.) use `stub_tiles.png`
and are pending their own sourcing pass. See the parent tracking issue for priority order.

---

## License note

All Kenney assets are released under **CC0 1.0 Universal (Public Domain Dedication)**.
Modification and redistribution — including in commercial projects — require no attribution,
though attribution is always appreciated.

See: https://creativecommons.org/publicdomain/zero/1.0/
