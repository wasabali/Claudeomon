import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MAPS_DIR = path.join(ROOT, 'assets', 'maps')

const TILE = 48

// Base stub tileset (GIDs 1–5) — used by non-village regions as fallback
const TILESET_STUB = {
  columns: 5,
  firstgid: 1,
  image: 'stub_tiles.png',
  imageheight: 48,
  imagewidth: 240,
  margin: 0,
  name: 'stub_tiles',
  spacing: 0,
  tilecount: 5,
  tileheight: TILE,
  tilewidth: TILE,
}

// ---------------------------------------------------------------------------
// Kenney RPG Urban Pack tileset — 27 cols × 18 rows = 486 tiles at 48×48px.
// Source: assets/tiles/kenney-urban/tilemap_packed.png upscaled 3× via nearest-neighbor.
// ---------------------------------------------------------------------------
const KU_COLS = 27
const KU_ROWS = 18
const KU_TILE_COUNT = KU_COLS * KU_ROWS  // 486

const TILESET_KENNEY_URBAN = {
  columns: KU_COLS,
  firstgid: 1,
  image: 'tilesets/kenney_urban.png',
  imageheight: KU_ROWS * TILE,
  imagewidth: KU_COLS * TILE,
  margin: 0,
  name: 'kenney_urban',
  spacing: 0,
  tilecount: KU_TILE_COUNT,
  tileheight: TILE,
  tilewidth: TILE,
}

// GID helper: convert (col, row) in the Kenney urban tilemap to a 1-based GID.
const K = (col, row) => row * KU_COLS + col + 1

// ---------------------------------------------------------------------------
// Kenney Urban tile constants — named references to specific tiles.
// Derived from visual analysis of tilemap_packed.png (27×18 grid of 16px tiles).
// ---------------------------------------------------------------------------

const KU = {
  // ── Ground / walkable ───────────────────────────────────────────────────
  // Beige sidewalk tiles (rows 3-5, cols 0-7)
  SIDEWALK:      K(1, 4),   // 110 — plain beige center
  SIDEWALK_ALT:  K(5, 3),   // 87  — slightly warmer beige variant
  SIDEWALK_TL:   K(0, 3),   // 82  — top-left corner
  SIDEWALK_T:    K(1, 3),   // 83  — top edge
  SIDEWALK_TR:   K(2, 3),   // 84  — top-right corner
  SIDEWALK_L:    K(0, 4),   // 109 — left edge
  SIDEWALK_R:    K(2, 4),   // 111 — right edge
  SIDEWALK_BL:   K(0, 5),   // 136 — bottom-left corner
  SIDEWALK_B:    K(1, 5),   // 137 — bottom edge
  SIDEWALK_BR:   K(2, 5),   // 138 — bottom-right corner

  // Green grass (teal pool tiles repurposed)
  GRASS:         K(5, 0),   // 6   — solid teal green fill
  GRASS_ALT:     K(6, 0),   // 7   — teal green variant
  GRASS_EDGE_T:  K(1, 0),   // 2   — grass with top edge detail
  GRASS_EDGE_B:  K(1, 2),   // 56  — grass with bottom edge detail
  GRASS_EDGE_L:  K(0, 1),   // 28  — grass with left edge
  GRASS_EDGE_R:  K(7, 1),   // 35  — grass with right edge

  // Gray room floor tiles (rows 0-2, cols 8-15)
  GRAY_FLOOR:    K(9, 1),   // 37  — solid gray
  GRAY_FLOOR_V:  K(9, 0),   // 10  — gray floor variant

  // ── Building composites ─────────────────────────────────────────────────
  // Pool / Park building (rows 0-2, cols 0-7) — 8×3 block
  // These form a complete pool/fountain structure
  POOL_BLOCK: { w: 8, h: 3, startCol: 0, startRow: 0 },

  // Gray room (rows 0-2, cols 8-15) — 8×3 block
  GRAY_ROOM_BLOCK: { w: 8, h: 3, startCol: 8, startRow: 0 },

  // Red roof building (rows 0-2, cols 16-22) — 7×3 block
  RED_ROOF_BLOCK: { w: 7, h: 3, startCol: 16, startRow: 0 },

  // Beige room/building (rows 3-5, cols 0-7) — 8×3 block
  BEIGE_ROOM_BLOCK: { w: 8, h: 3, startCol: 0, startRow: 3 },

  // Gray interior (rows 3-5, cols 8-15) — 8×3 block
  GRAY_INT_BLOCK: { w: 8, h: 3, startCol: 8, startRow: 3 },

  // Orange/brown building front (rows 3-5, cols 16-22) — 7×3 block
  ORANGE_FRONT_BLOCK: { w: 7, h: 3, startCol: 16, startRow: 3 },

  // Water area (rows 6-8, cols 8-15) — 8×3 block
  WATER_BLOCK: { w: 8, h: 3, startCol: 8, startRow: 6 },

  // ── Road tiles (rows 15-17, cols 0-10) ──────────────────────────────────
  ROAD_SIDEWALK_V: K(0, 15), // 406 — road sidewalk (vertical edge)
  ROAD_EDGE_V:     K(1, 15), // 407 — road vertical edge
  ROAD_PLAIN:      K(2, 15), // 408 — road surface variant
  ROAD_H_DARK:     K(3, 15), // 409 — horizontal road dark
  ROAD_H_MARKS:    K(4, 15), // 410 — horizontal road with markings
  ROAD_V_A:        K(0, 16), // 433 — vertical road A
  ROAD_V_B:        K(1, 16), // 434 — vertical road B
  ROAD_CENTER:     K(2, 16), // 435 — road center/cross
  ROAD_CROSS_A:    K(3, 16), // 436 — road crossing A (with markings)
  ROAD_CROSS_B:    K(4, 16), // 437 — road crossing B (with markings)
  ROAD_H_A:        K(5, 16), // 438 — horizontal road A
  ROAD_H_B:        K(6, 16), // 439 — horizontal road B
  ROAD_V_C:        K(7, 16), // 440 — vertical road C
  ROAD_V_D:        K(8, 16), // 441 — vertical road D
  ROAD_V2:         K(0, 17), // 460 — vertical road 2
  ROAD_V2_B:       K(1, 17), // 461 — vertical road 2B

  // ── Trees (rows 8-10, cols 16-22) ───────────────────────────────────────
  // Trees are 1×2 (top+bottom) composite sprites
  TREE_A_TOP:    K(16, 8),   // 233 — bright green tree top
  TREE_A_BOT:    K(16, 9),   // 260 — bright green tree bottom
  TREE_B_TOP:    K(19, 8),   // 236 — green tree top variant
  TREE_B_BOT:    K(19, 9),   // 263 — green tree bottom variant
  TREE_C_TOP:    K(21, 8),   // 238 — dark green tree top
  TREE_C_BOT:    K(21, 9),   // 265 — dark green tree bottom
  TREE_D_TOP:    K(22, 8),   // 239 — small green tree top
  TREE_D_BOT:    K(22, 9),   // 266 — small green tree bottom

  // ── Orange trees / autumn (rows 11-12, cols 16-22) ──────────────────────
  TREE_ORANGE_TOP: K(16, 11),// 298 — orange tree top
  TREE_ORANGE_BOT: K(16, 12),// 325 — orange tree bottom
  TREE_RED_TOP:    K(19, 11),// 301 — red tree top
  TREE_RED_BOT:    K(19, 12),// 328 — red tree bottom

  // ── Vehicles (rows 15-17, cols 15-20) ───────────────────────────────────
  CAR_YELLOW_T:  K(15, 15),  // 421 — yellow car top
  CAR_YELLOW_B:  K(15, 16),  // 448 — yellow car bottom
  CAR_RED_T:     K(15, 17),  // 475 — red car top
  CAR_RED_B:     K(16, 17),  // 476 — red car bottom
  TRUCK_T:       K(17, 15),  // 423 — truck top
  TRUCK_B:       K(17, 16),  // 450 — truck bottom

  // ── Small items (row 6, cols 0-7) ───────────────────────────────────────
  ITEM_PURPLE:   K(0, 6),    // 163 — purple gem/item
  ITEM_SWORD:    K(1, 6),    // 164 — dark item
  ITEM_EMPTY:    K(2, 6),    // 165 — dark tile (impassable)
  ITEM_CHEST:    K(3, 6),    // 166 — chest/container
  ITEM_HEART:    K(4, 6),    // 167 — heart/potion
  ITEM_BLUE:     K(5, 6),    // 168 — blue item
  ITEM_GEM:      K(6, 6),    // 169 — blue gem

  // ── Walls / boundaries ──────────────────────────────────────────────────
  WALL_DARK:     K(2, 6),    // 165 — very dark tile (good for walls)
  WALL_STONE:    K(11, 14),  // 392 — dark stone
  WALL_V:        K(2, 14),   // 381 — vertical wall
}

// Biomes that use the Kenney Urban tileset instead of stub + biome tilesets.
const KENNEY_BIOMES = ['village', 'nature', 'interior']

// Resolve a block template to an array of GIDs.
// Returns a 2D array [row][col] of GIDs.
function resolveBlock(block) {
  const rows = []
  for (let dy = 0; dy < block.h; dy++) {
    const row = []
    for (let dx = 0; dx < block.w; dx++) {
      row.push(K(block.startCol + dx, block.startRow + dy))
    }
    rows.push(row)
  }
  return rows
}

// Available building templates for village maps (in order of size/interest)
const VILLAGE_BUILDINGS = [
  { name: 'pool',         block: KU.POOL_BLOCK,         w: 8, h: 3, solid: true },
  { name: 'gray_room',    block: KU.GRAY_ROOM_BLOCK,    w: 8, h: 3, solid: true },
  { name: 'red_roof',     block: KU.RED_ROOF_BLOCK,     w: 7, h: 3, solid: true },
  { name: 'beige_room',   block: KU.BEIGE_ROOM_BLOCK,   w: 8, h: 3, solid: true },
  { name: 'gray_int',     block: KU.GRAY_INT_BLOCK,     w: 8, h: 3, solid: true },
  { name: 'orange_front', block: KU.ORANGE_FRONT_BLOCK, w: 7, h: 3, solid: true },
  { name: 'water',        block: KU.WATER_BLOCK,        w: 8, h: 3, solid: true },
]

// Tech / office tileset (GIDs 6–55) — appended for tech-themed regions.
// Image lives at assets/tiles/kenney_tech_office.png (240×480, 50 tiles).
// The image path in .tmj is relative to the map file, which lives in assets/maps/,
// so we navigate one level up to reach assets/tiles/.
const TILESET_TECH = {
  columns: 5,
  firstgid: 6,
  image: '../tiles/kenney_tech_office.png',
  imageheight: 480,
  imagewidth: 240,
  margin: 0,
  name: 'kenney_tech_office',
  spacing: 0,
  tilecount: 50,
  tileheight: TILE,
  tilewidth: TILE,
}

// Void tileset (GIDs 6–19) — appended for void-themed regions.
// Image lives at assets/tiles/void_tiles.png (672×48, 14 tiles in a single row).
// Tiles 0–11 retained for compatibility; tiles 12–13 are new scatter objects.
const TILESET_VOID = {
  columns: 14,
  firstgid: 6,
  image: '../tiles/void_tiles.png',
  imageheight: TILE,
  imagewidth: TILE * 14,
  margin: 0,
  name: 'void_tiles',
  spacing: 0,
  tilecount: 14,
  tileheight: TILE,
  tilewidth: TILE,
}

// Wasteland tileset (GIDs 6–19) — appended for wasteland-themed regions.
// Image lives at assets/tiles/wasteland_tiles.png (672×48, 14 tiles in a single row).
// Tiles 0–11 retained for compatibility; tiles 12–13 are new scatter objects.
const TILESET_WASTELAND = {
  columns: 14,
  firstgid: 6,
  image: '../tiles/wasteland_tiles.png',
  imageheight: TILE,
  imagewidth: TILE * 14,
  margin: 0,
  name: 'wasteland_tiles',
  spacing: 0,
  tilecount: 14,
  tileheight: TILE,
  tilewidth: TILE,
}

// Tech GID offset (add to 1-based tile ID to get map GID)
const TECH_GID_OFFSET = TILESET_TECH.firstgid - 1  // 5

// Void/Wasteland GID offset — derived from firstgid (each biome uses its own second tileset slot)
const BIOME_GID_OFFSET = TILESET_VOID.firstgid - 1  // 5

// GIDs for the ground tile in each biome tileset (local tile id 0 / firstgid = GID 6)
const VOID_GROUND_GID      = TILESET_VOID.firstgid       // 6 — tile index 0 (void_ground)
const WASTELAND_GROUND_GID = TILESET_WASTELAND.firstgid  // 6 — tile index 0 (waste_ground)

// GIDs for object tiles in void tileset (0-indexed IDs + firstgid)
const VOID_PLATFORM_GID      = TILESET_VOID.firstgid + 2   // 8  — void_platform
const VOID_PLATFORM_L_GID    = TILESET_VOID.firstgid + 3   // 9  — void_platform_edge_l
const VOID_PLATFORM_R_GID    = TILESET_VOID.firstgid + 4   // 10 — void_platform_edge_r
const VOID_DEBRIS_GID        = TILESET_VOID.firstgid + 6   // 12 — void_debris
const VOID_WALL_GID          = TILESET_VOID.firstgid + 11  // 17 — void_wall (impassable)
const VOID_GLITCH_CORRUPT_GID = TILESET_VOID.firstgid + 12 // 18 — void_glitch_corrupt
const VOID_DATA_STREAM_GID   = TILESET_VOID.firstgid + 13  // 19 — void_data_stream

// GIDs for object tiles in wasteland tileset (0-indexed IDs + firstgid)
const WASTE_RUBBLE_GID       = TILESET_WASTELAND.firstgid + 3   // 9  — waste_rubble
const WASTE_SERVER_GID       = TILESET_WASTELAND.firstgid + 6   // 12 — waste_server_rack
const WASTE_CAUTION_GID      = TILESET_WASTELAND.firstgid + 7   // 13 — waste_caution_tape
const WASTE_FENCE_GID        = TILESET_WASTELAND.firstgid + 10  // 16 — waste_wire_fence
const WASTE_WALL_GID         = TILESET_WASTELAND.firstgid + 11  // 17 — waste_wall (impassable)
const WASTE_DEAD_TREE_GID    = TILESET_WASTELAND.firstgid + 12  // 18 — waste_dead_tree
const WASTE_BROKEN_SIGN_GID  = TILESET_WASTELAND.firstgid + 13  // 19 — waste_broken_sign

// Ninja Adventure tileset definitions (village, dungeon, nature, interior).
// Images live at assets/maps/tilesets/{name}.png (384×192, 8×4 tiles).
// The image path in .tmj is relative to assets/maps/, so no navigation needed.
const BIOME_COLS = 8
const BIOME_ROWS = 4
const BIOME_TILE_COUNT = BIOME_COLS * BIOME_ROWS  // 32

// GIDs for Ninja Adventure biome tilesets — derived from stub_tiles count so they
// stay correct if stub tile count ever changes.
const BIOME_FIRST_GID = TILESET_STUB.tilecount + 1  // 6 — biome tileset always starts here
const BIOME_PROP_LOCAL = 8                           // local tile index of first solid prop row
const BIOME_PROP_GID   = BIOME_FIRST_GID + BIOME_PROP_LOCAL  // 14 — wall/prop GID for Objects + Collision

// Solid tile IDs (0-indexed within each biome tileset) — kept in sync with
// generate-tilesets.js SOLID_TILES so collision properties match the PNG layout.
const BIOME_SOLID_TILES = {
  village:  [6, 8, 9, 10, 11, 13, 15, 16, 18, 23, 24, 27, 28],
  dungeon:  [8, 9, 10, 11, 12, 13, 14, 15, 24, 25],
  nature:   [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 24, 25, 26, 27],
  interior: [8, 9, 10, 11, 24, 25],
}

// Build the `tiles` array (solid property metadata) for a biome tileset entry.
function biomeTiles(name) {
  return (BIOME_SOLID_TILES[name] || []).map(id => ({
    id,
    properties: [{ name: 'solid', type: 'bool', value: true }],
  }))
}

function makeBiomeTileset(name) {
  return {
    columns:     BIOME_COLS,
    firstgid:    BIOME_FIRST_GID,
    image:       `tilesets/${name}.png`,
    imageheight: BIOME_ROWS * TILE,
    imagewidth:  BIOME_COLS * TILE,
    margin:      0,
    name,
    spacing:     0,
    tilecount:   BIOME_TILE_COUNT,
    tileheight:  TILE,
    tilewidth:   TILE,
    tiles:       biomeTiles(name),
  }
}

// Well-known tech tile local IDs (1-based within kenney_tech_office)
const T = {
  TECH_FLOOR:           1,
  SERVER_ROOM_FLOOR:    2,
  OFFICE_FLOOR:         3,
  RAISED_FLOOR:         4,
  CORRIDOR:             5,
  SERVER_ROOM_WALL:     6,
  OFFICE_WALL:          7,
  SERVER_RACK:          11,
  SERVER_RACK_LEDS:     12,
  CABLE_BUNDLE:         13,
  DESK:                 16,
  MONITOR:              17,
  KEYBOARD:             18,
  WHITEBOARD:           19,
  COOLING_UNIT:         21,
  WARNING_SIGN:         23,
  CRT_MONITOR:          26,
  COMMAND_PROMPT:       27,
  ERROR_SCREEN:         28,
  MONITORING_DASHBOARD: 29,
  DECOMMISSIONED_SERVER:38,
  DUSTY_RACK:           39,
  BLINKING_LED:         40,
  SERVER_RACK_INTERACT: 41,
  TERMINAL_INTERACT:    42,
  SERVER_TOMBSTONE:     44,
}

// Convert a 1-based tech tile ID to the GID used inside a .tmj file
function techGid(localId) {
  return localId + TECH_GID_OFFSET
}

const SIZE = {
  main:    { w: 40, h: 22 },
  gym:     { w: 20, h: 15 },
  dungeon: { w: 30, h: 18 },
  hidden:  { w: 30, h: 18 },
}

const OPENING_WIDTH = 3

function hashSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seededRng(seed) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function makeTileLayer(id, name, w, h, fillValue, opts = {}) {
  return {
    data: new Array(w * h).fill(fillValue),
    height: h,
    id,
    name,
    opacity: opts.opacity ?? 1,
    type: 'tilelayer',
    visible: opts.visible ?? true,
    width: w,
    x: 0,
    y: 0,
  }
}

function makeObjectGroup(id, name, objects) {
  return {
    draworder: 'topdown',
    id,
    name,
    objects,
    opacity: 1,
    type: 'objectgroup',
    visible: true,
    x: 0,
    y: 0,
  }
}

function makeNpcObject(objId, npcName, tileX, tileY) {
  return {
    height: TILE,
    id: objId,
    name: npcName,
    properties: [{ name: 'npc', type: 'string', value: npcName }],
    type: 'npc',
    visible: true,
    width: TILE,
    x: tileX * TILE,
    y: tileY * TILE,
  }
}

function makeInteractionObject(objId, interactionId, tileX, tileY) {
  return {
    height: TILE,
    id: objId,
    name: interactionId,
    properties: [{ name: 'interaction', type: 'string', value: interactionId }],
    type: 'interaction',
    visible: true,
    width: TILE,
    x: tileX * TILE,
    y: tileY * TILE,
  }
}

function makeTransitionObject(objId, name, targetRegion, spawnX, spawnY, tileX, tileY) {
  return {
    height: TILE,
    id: objId,
    name,
    properties: [
      { name: 'targetRegion', type: 'string', value: targetRegion },
      { name: 'targetSpawnX', type: 'int', value: spawnX },
      { name: 'targetSpawnY', type: 'int', value: spawnY },
    ],
    type: 'transition',
    visible: true,
    width: TILE,
    x: tileX * TILE,
    y: tileY * TILE,
  }
}

function getOpeningTiles(w, h, connections) {
  const tiles = new Set()
  const midX = Math.floor(w / 2)
  const midY = Math.floor(h / 2)
  const half = Math.floor(OPENING_WIDTH / 2)

  if (connections.north) {
    for (let dx = -half; dx <= half; dx++) tiles.add(`${midX + dx},0`)
  }
  if (connections.south) {
    for (let dx = -half; dx <= half; dx++) tiles.add(`${midX + dx},${h - 1}`)
  }
  if (connections.west) {
    for (let dy = -half; dy <= half; dy++) tiles.add(`0,${midY + dy}`)
  }
  if (connections.east) {
    for (let dy = -half; dy <= half; dy++) tiles.add(`${w - 1},${midY + dy}`)
  }

  return tiles
}

function generateCollision(w, h, connections, occupiedTiles, wallGid = 5) {
  const layer = makeTileLayer(5, 'Collision', w, h, 0, { opacity: 0, visible: false })
  const openings = getOpeningTiles(w, h, connections)

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const isEdge = x === 0 || y === 0 || x === w - 1 || y === h - 1
      if (isEdge && !openings.has(`${x},${y}`)) {
        layer.data[y * w + x] = wallGid
      }
    }
  }

  for (const key of occupiedTiles) {
    const [bx, by] = key.split(',').map(Number)
    layer.data[by * w + bx] = wallGid
  }

  return layer
}

// ── BSP Dungeon Layout ────────────────────────────────────────────────────────
// Generates multiple rooms connected by L-shaped corridors using Binary Space
// Partitioning.  Every non-carved interior tile becomes a wall.
// Used for regions with layout.type === 'dungeon' and biome === 'dungeon'.
function bspDungeonObjects(w, h, openings, rng, wallGid) {
  const layer = makeTileLayer(2, 'Objects', w, h, 0)
  const occupied = new Set()
  const carved = new Set()
  const roomCenters = []

  function carveRect(rx, ry, rw, rh) {
    for (let x = rx; x < rx + rw; x++) {
      for (let y = ry; y < ry + rh; y++) {
        if (x >= 1 && x < w - 1 && y >= 1 && y < h - 1) carved.add(`${x},${y}`)
      }
    }
    const cx = rx + Math.floor(rw / 2)
    const cy = ry + Math.floor(rh / 2)
    roomCenters.push({ cx, cy })
    return { cx, cy }
  }

  function carveCorridor(x1, y1, x2, y2) {
    if (rng() < 0.5) {
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        if (x >= 1 && x < w - 1) carved.add(`${x},${y1}`)
      }
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        if (y >= 1 && y < h - 1) carved.add(`${x2},${y}`)
      }
    } else {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        if (y >= 1 && y < h - 1) carved.add(`${x1},${y}`)
      }
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        if (x >= 1 && x < w - 1) carved.add(`${x},${y2}`)
      }
    }
  }

  const MIN_SPLIT = 8
  const MIN_ROOM_W = 4
  const MIN_ROOM_H = 3

  // Carve a randomly-sized room within the partition [x, x+bw) × [y, y+bh).
  function leafRoom(x, y, bw, bh) {
    const maxRw = Math.max(MIN_ROOM_W, bw - 2)
    const maxRh = Math.max(MIN_ROOM_H, bh - 2)
    const rw = MIN_ROOM_W + Math.floor(rng() * (maxRw - MIN_ROOM_W + 1))
    const rh = MIN_ROOM_H + Math.floor(rng() * (maxRh - MIN_ROOM_H + 1))
    const rx = x + 1 + Math.floor(rng() * Math.max(1, bw - rw - 1))
    const ry = y + 1 + Math.floor(rng() * Math.max(1, bh - rh - 1))
    return carveRect(rx, ry, rw, rh)
  }

  function bsp(x, y, bw, bh, depth) {
    if (depth === 0 || bw < MIN_SPLIT || bh < MIN_SPLIT) return leafRoom(x, y, bw, bh)

    let c1, c2
    if (bw >= bh) {
      const maxSplit = bw - MIN_SPLIT
      if (maxSplit < MIN_SPLIT) return leafRoom(x, y, bw, bh)
      const splitOff = MIN_SPLIT + Math.floor(rng() * (maxSplit - MIN_SPLIT + 1))
      c1 = bsp(x, y, splitOff, bh, depth - 1)
      c2 = bsp(x + splitOff, y, bw - splitOff, bh, depth - 1)
    } else {
      const maxSplit = bh - MIN_SPLIT
      if (maxSplit < MIN_SPLIT) return leafRoom(x, y, bw, bh)
      const splitOff = MIN_SPLIT + Math.floor(rng() * (maxSplit - MIN_SPLIT + 1))
      c1 = bsp(x, y, bw, splitOff, depth - 1)
      c2 = bsp(x, y + splitOff, bw, bh - splitOff, depth - 1)
    }

    carveCorridor(c1.cx, c1.cy, c2.cx, c2.cy)
    return { cx: Math.floor((c1.cx + c2.cx) / 2), cy: Math.floor((c1.cy + c2.cy) / 2) }
  }

  bsp(1, 1, w - 2, h - 2, 3)

  // Connect each edge opening to the nearest room center via corridor
  for (const key of openings) {
    const [ox, oy] = key.split(',').map(Number)
    carved.add(key)
    if (roomCenters.length > 0) {
      let nearest = roomCenters[0]
      let bestDist = Infinity
      for (const r of roomCenters) {
        const d = Math.abs(r.cx - ox) + Math.abs(r.cy - oy)
        if (d < bestDist) { bestDist = d; nearest = r }
      }
      carveCorridor(ox, oy, nearest.cx, nearest.cy)
    }
  }

  // Fill every non-carved interior tile with the wall GID
  for (let x = 1; x < w - 1; x++) {
    for (let y = 1; y < h - 1; y++) {
      if (!carved.has(`${x},${y}`)) {
        layer.data[y * w + x] = wallGid
        occupied.add(`${x},${y}`)
      }
    }
  }

  return { layer, occupied }
}

// ── Arena Layout ──────────────────────────────────────────────────────────────
// Generates a central combat ring surrounded by spectator stands.
// Used for regions with layout.type === 'arena' (kubernetes_colosseum).
function generateArenaObjects(w, h, openings, rng, isTech) {
  const layer = makeTileLayer(2, 'Objects', w, h, 0)
  const occupied = new Set()

  const wallGid  = isTech ? techGid(T.SERVER_ROOM_WALL)      : KU.WALL_DARK
  const specGid  = isTech ? techGid(T.SERVER_RACK)           : KU.WALL_STONE
  const propGids = isTech
    ? [techGid(T.MONITORING_DASHBOARD), techGid(T.WARNING_SIGN), techGid(T.CABLE_BUNDLE)]
    : [KU.ITEM_CHEST, KU.ITEM_GEM, KU.ITEM_BLUE]

  const arenaW = Math.floor(w * 0.40)
  const arenaH = Math.floor(h * 0.45)
  const arenaX = Math.floor((w - arenaW) / 2)
  const arenaY = Math.floor((h - arenaH) / 2)
  const midX   = Math.floor(w / 2)

  function place(x, y, gid) {
    if (x >= 1 && x < w - 1 && y >= 1 && y < h - 1 && !openings.has(`${x},${y}`) && !occupied.has(`${x},${y}`)) {
      layer.data[y * w + x] = gid
      occupied.add(`${x},${y}`)
    }
  }

  // Arena boundary — north, south, west, east edges
  for (let x = arenaX - 1; x <= arenaX + arenaW; x++) {
    place(x, arenaY - 1,       wallGid)
    place(x, arenaY + arenaH,  wallGid)
  }
  for (let y = arenaY; y < arenaY + arenaH; y++) {
    place(arenaX - 1,        y, wallGid)
    place(arenaX + arenaW,   y, wallGid)
  }

  // Spectator stands — two rows north of the arena
  for (let row = 0; row < 2; row++) {
    for (let x = arenaX - 2; x <= arenaX + arenaW + 1; x++) {
      place(x, arenaY - 3 - row, specGid)
    }
  }
  // Spectator stands — two rows south of the arena
  for (let row = 0; row < 2; row++) {
    for (let x = arenaX - 2; x <= arenaX + arenaW + 1; x++) {
      place(x, arenaY + arenaH + 2 + row, specGid)
    }
  }

  // Helper: unconditionally clear a tile from the objects layer and occupied set.
  function clearTile(x, y) {
    if (x >= 1 && x < w - 1 && y >= 1 && y < h - 1) {
      layer.data[y * w + x] = 0
      occupied.delete(`${x},${y}`)
    }
  }

  // For each edge direction that has an opening, carve a lane through any outer
  // decoration rows AND open a gate through the arena ring wall itself so the
  // interior is always reachable.
  const hasNorthOpening = [-1, 0, 1].some(dx => openings.has(`${midX + dx},0`))
  const hasSouthOpening = [-1, 0, 1].some(dx => openings.has(`${midX + dx},${h - 1}`))
  const midY = Math.floor(h / 2)
  const hasWestOpening  = [-1, 0, 1].some(dy => openings.has(`0,${midY + dy}`))
  const hasEastOpening  = [-1, 0, 1].some(dy => openings.has(`${w - 1},${midY + dy}`))

  // North: clear spectator rows + ring north wall (y = arenaY - 1)
  if (hasNorthOpening) {
    for (let y = 1; y < arenaY; y++) {
      for (let dx = -1; dx <= 1; dx++) clearTile(midX + dx, y)
    }
  }
  // South: clear ring south wall (y = arenaY + arenaH) + rows to edge
  if (hasSouthOpening) {
    for (let y = arenaY + arenaH; y < h - 1; y++) {
      for (let dx = -1; dx <= 1; dx++) clearTile(midX + dx, y)
    }
  }
  // West: clear ring west wall (x = arenaX - 1) + columns to edge
  if (hasWestOpening) {
    for (let x = 1; x < arenaX; x++) {
      for (let dy = -1; dy <= 1; dy++) clearTile(x, midY + dy)
    }
  }
  // East: clear ring east wall (x = arenaX + arenaW) + columns to edge
  if (hasEastOpening) {
    for (let x = arenaX + arenaW; x < w - 1; x++) {
      for (let dy = -1; dy <= 1; dy++) clearTile(x, midY + dy)
    }
  }

  // Scatter decorative props in the outer corners (not inside the arena ring)
  const safeZone = 2
  for (let i = 0; i < 10; i++) {
    for (let attempt = 0; attempt < 25; attempt++) {
      const tx = Math.floor(rng() * (w - safeZone * 2)) + safeZone
      const ty = Math.floor(rng() * (h - safeZone * 2)) + safeZone
      const inArenaBounds = tx > arenaX - 3 && tx < arenaX + arenaW + 2 && ty > arenaY - 5 && ty < arenaY + arenaH + 5
      if (!inArenaBounds && !occupied.has(`${tx},${ty}`) && !openings.has(`${tx},${ty}`)) {
        place(tx, ty, propGids[Math.floor(rng() * propGids.length)])
        break
      }
    }
  }

  return { layer, occupied }
}

function generateObjects(w, h, regionType, openings, rng, isTech, isVoid, isWasteland, biome = null, useKenney = false, layout = null) {
  const layoutType = layout?.type

  // ── BSP dungeon: dungeon-type regions with dungeon biome ──────────────────
  if (layoutType === 'dungeon' && regionType === 'dungeon' && biome === 'dungeon') {
    return bspDungeonObjects(w, h, openings, rng, BIOME_PROP_GID)
  }

  // ── Arena layout: main region with arena type ─────────────────────────────
  if (layoutType === 'arena') {
    return generateArenaObjects(w, h, openings, rng, isTech)
  }

  // ── All other region types: existing generation logic ─────────────────────
  const layer = makeTileLayer(2, 'Objects', w, h, 0)
  const occupied = new Set()

  const safeZone = 2
  function canPlace(bx, by, bw, bh) {
    for (let dx = 0; dx < bw; dx++) {
      for (let dy = 0; dy < bh; dy++) {
        const tx = bx + dx
        const ty = by + dy
        if (tx < safeZone || ty < safeZone || tx >= w - safeZone || ty >= h - safeZone) return false
        if (occupied.has(`${tx},${ty}`)) return false
        if (openings.has(`${tx},${ty}`)) return false
      }
    }
    return true
  }

  function placeBuilding(bx, by, bw, bh, tileId) {
    for (let dx = 0; dx < bw; dx++) {
      for (let dy = 0; dy < bh; dy++) {
        const tx = bx + dx
        const ty = by + dy
        layer.data[ty * w + tx] = tileId
        occupied.add(`${tx},${ty}`)
      }
    }
  }

  // Place a composite block from the Kenney tilemap — each tile gets its own GID.
  function placeBlock(bx, by, block) {
    const gids = resolveBlock(block)
    for (let dy = 0; dy < block.h; dy++) {
      for (let dx = 0; dx < block.w; dx++) {
        const tx = bx + dx
        const ty = by + dy
        layer.data[ty * w + tx] = gids[dy][dx]
        occupied.add(`${tx},${ty}`)
      }
    }
  }

  // Place a 1×2 tree (top + bottom)
  function placeTree(tx, ty, topGid, botGid) {
    if (ty < 1) return
    layer.data[(ty - 1) * w + tx] = topGid
    layer.data[ty * w + tx] = botGid
    occupied.add(`${tx},${ty - 1}`)
    occupied.add(`${tx},${ty}`)
  }

  if (useKenney && (regionType === 'main' || regionType === 'gym')) {
    // ── Kenney Urban village layout ──
    // Place composite building blocks from the Kenney tilemap.
    // Shuffle the building list and try to place 3-4 buildings.
    const availableBuildings = [...VILLAGE_BUILDINGS]
    // Shuffle
    for (let i = availableBuildings.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [availableBuildings[i], availableBuildings[j]] = [availableBuildings[j], availableBuildings[i]]
    }

    const numBuildings = regionType === 'gym' ? 2 : Math.min(4, availableBuildings.length)
    for (let bi = 0; bi < numBuildings; bi++) {
      const bdef = availableBuildings[bi]
      for (let attempt = 0; attempt < 80; attempt++) {
        const bx = Math.floor(rng() * (w - bdef.w - safeZone * 2)) + safeZone
        const by = Math.floor(rng() * (h - bdef.h - safeZone * 2)) + safeZone
        if (canPlace(bx, by, bdef.w, bdef.h)) {
          placeBlock(bx, by, bdef.block)
          break
        }
      }
    }

    // Scatter trees in open spaces
    const treeTypes = [
      [KU.TREE_A_TOP, KU.TREE_A_BOT],
      [KU.TREE_B_TOP, KU.TREE_B_BOT],
      [KU.TREE_C_TOP, KU.TREE_C_BOT],
      [KU.TREE_D_TOP, KU.TREE_D_BOT],
      [KU.TREE_ORANGE_TOP, KU.TREE_ORANGE_BOT],
      [KU.TREE_RED_TOP, KU.TREE_RED_BOT],
    ]
    const numTrees = regionType === 'gym' ? 2 : Math.floor(rng() * 6) + 4
    for (let ti = 0; ti < numTrees; ti++) {
      for (let attempt = 0; attempt < 30; attempt++) {
        const tx = Math.floor(rng() * (w - safeZone * 2)) + safeZone
        const ty = Math.floor(rng() * (h - safeZone * 2 - 1)) + safeZone + 1
        if (canPlace(tx, ty - 1, 1, 2)) {
          const [top, bot] = treeTypes[Math.floor(rng() * treeTypes.length)]
          placeTree(tx, ty, top, bot)
          break
        }
      }
    }

    // Place a road through the middle (horizontal or vertical based on aspect ratio)
    if (regionType === 'main') {
      const midY = Math.floor(h / 2)
      const roadTiles = [KU.ROAD_V_A, KU.ROAD_V_B, KU.ROAD_H_A, KU.ROAD_H_B]
      // Horizontal road across the map
      for (let x = 1; x < w - 1; x++) {
        const key = `${x},${midY}`
        if (!occupied.has(key) && !openings.has(key)) {
          layer.data[midY * w + x] = roadTiles[x % 2]
          // Don't mark road as occupied — NPCs can walk on roads
        }
        const key2 = `${x},${midY + 1}`
        if (!occupied.has(key2) && !openings.has(key2)) {
          layer.data[(midY + 1) * w + x] = roadTiles[(x % 2) + 2]
        }
      }

      // Vertical road crossing
      const midX = Math.floor(w / 2)
      for (let y = 1; y < h - 1; y++) {
        const key = `${midX},${y}`
        if (!occupied.has(key) && !openings.has(key)) {
          layer.data[y * w + midX] = KU.ROAD_V_C
        }
        const key2 = `${midX + 1},${y}`
        if (!occupied.has(key2) && !openings.has(key2)) {
          layer.data[y * w + (midX + 1)] = KU.ROAD_V_D
        }
      }
    }

  } else {
    // ── Legacy object generation (non-Kenney regions) ──
    let buildings
    if (isTech && regionType === 'main') {
      buildings = [
        { w: 2, h: 3, tile: techGid(T.SERVER_RACK) },
        { w: 2, h: 3, tile: techGid(T.SERVER_RACK_LEDS) },
        { w: 3, h: 2, tile: techGid(T.DESK) },
        { w: 2, h: 2, tile: techGid(T.COOLING_UNIT) },
        { w: 2, h: 2, tile: techGid(T.MONITORING_DASHBOARD) },
      ]
    } else if (isTech && (regionType === 'dungeon' || regionType === 'hidden')) {
      buildings = [
        { w: 1, h: 2, tile: techGid(T.DECOMMISSIONED_SERVER) },
        { w: 1, h: 2, tile: techGid(T.DUSTY_RACK) },
        { w: 1, h: 2, tile: techGid(T.SERVER_TOMBSTONE) },
        { w: 2, h: 2, tile: techGid(T.DECOMMISSIONED_SERVER) },
      ]
    } else if (isTech && regionType === 'gym') {
      buildings = [
        { w: 2, h: 2, tile: techGid(T.SERVER_RACK_INTERACT) },
      ]
    } else if (isVoid) {
      buildings = [
        { w: 3, h: 1, tile: VOID_PLATFORM_GID },
        { w: 1, h: 1, tile: VOID_PLATFORM_L_GID },
        { w: 1, h: 1, tile: VOID_PLATFORM_R_GID },
        { w: 2, h: 1, tile: VOID_DEBRIS_GID },
        { w: 1, h: 1, tile: VOID_GLITCH_CORRUPT_GID },
        { w: 1, h: 1, tile: VOID_DATA_STREAM_GID },
      ]
    } else if (isWasteland) {
      buildings = [
        { w: 1, h: 2, tile: WASTE_SERVER_GID },
        { w: 2, h: 1, tile: WASTE_RUBBLE_GID },
        { w: 3, h: 1, tile: WASTE_FENCE_GID },
        { w: 1, h: 1, tile: WASTE_CAUTION_GID },
        { w: 1, h: 1, tile: WASTE_DEAD_TREE_GID },
        { w: 1, h: 1, tile: WASTE_BROKEN_SIGN_GID },
      ]
    } else if (regionType === 'main') {
      buildings = [
        { w: 4, h: 4, tile: 2 },
        { w: 4, h: 4, tile: 3 },
        { w: 4, h: 4, tile: 4 },
      ]
    } else if (regionType === 'gym') {
      buildings = [
        { w: 3, h: 3, tile: 3 },
      ]
    } else {
      const propTile = biome ? BIOME_PROP_GID : 4
      buildings = [
        { w: 2, h: 2, tile: propTile },
        { w: 2, h: 2, tile: propTile + 1 },
        { w: 3, h: 2, tile: propTile },
      ]
    }

    for (const b of buildings) {
      for (let attempt = 0; attempt < 50; attempt++) {
        const bx = Math.floor(rng() * (w - b.w - safeZone * 2)) + safeZone
        const by = Math.floor(rng() * (h - b.h - safeZone * 2)) + safeZone
        if (canPlace(bx, by, b.w, b.h)) {
          placeBuilding(bx, by, b.w, b.h, b.tile)
          break
        }
      }
    }
  }

  return { layer, occupied }
}

function findNpcSpot(w, h, occupied, usedSpots, openings, rng) {
  const safeZone = 3
  for (let attempt = 0; attempt < 100; attempt++) {
    const tx = Math.floor(rng() * (w - safeZone * 2)) + safeZone
    const ty = Math.floor(rng() * (h - safeZone * 2)) + safeZone
    const key = `${tx},${ty}`
    if (!occupied.has(key) && !usedSpots.has(key) && !openings.has(key)) {
      usedSpots.add(key)
      return { tileX: tx, tileY: ty }
    }
  }
  // Fallback: scan outward from center
  const cx = Math.floor(w / 2)
  const cy = Math.floor(h / 2)
  for (let r = 0; r < Math.max(w, h); r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        const tx = cx + dx
        const ty = cy + dy
        if (tx < safeZone || ty < safeZone || tx >= w - safeZone || ty >= h - safeZone) continue
        const key = `${tx},${ty}`
        if (!occupied.has(key) && !usedSpots.has(key) && !openings.has(key)) {
          usedSpots.add(key)
          return { tileX: tx, tileY: ty }
        }
      }
    }
  }
  return { tileX: Math.floor(w / 2), tileY: Math.floor(h / 2) }
}

function generateMap(regionId, region, connections, allRegions, trainers, interactions, childGyms, gymDoorPositions, childDungeons = []) {
  const type = region.type
  const { w, h } = SIZE[type] || SIZE.main
  // Two independent RNG streams derived from the regionId seed:
  //   rngObjects — drives tile scatter and object placement (generateObjects + ground)
  //   rngNpcs    — drives NPC/transition spot selection (unaffected by scatter changes)
  const baseSeed = hashSeed(regionId)
  const rng      = seededRng(baseSeed)
  const rngNpcs  = seededRng(baseSeed ^ 0x5a5a5a5a)

  const isTech = !!region.hasTechTileset
  const isVoid = !!region.hasVoidTileset
  const isWasteland = !!region.hasWastelandTileset
  const biome = (!isTech && !isVoid && !isWasteland) ? (region.biome || null) : null
  // Use Kenney Urban tileset for village/nature/interior biomes, but only for
  // main/gym region types — dungeons still use legacy biome/stub GIDs
  const useKenney = KENNEY_BIOMES.includes(biome) && (type === 'main' || type === 'gym')
  const openings = getOpeningTiles(w, h, connections)
  const { layer: objectsLayer, occupied } = generateObjects(w, h, type, openings, rng, isTech, isVoid, isWasteland, biome, useKenney, region.layout)

  // Biome regions use their biome floor as the ground tile; tech regions use tech_floor;
  // void/wasteland use their own ground tile; Kenney village uses green grass;
  // all others fall back to stub tile 1.
  const biomeFirstGid = BIOME_FIRST_GID
  const groundGid = useKenney     ? KU.GRASS
                  : isTech        ? techGid(T.TECH_FLOOR)
                  : isVoid        ? VOID_GROUND_GID
                  : isWasteland   ? WASTELAND_GROUND_GID
                  : biome         ? biomeFirstGid
                  : 1

  // Scatter alt-ground tile using seeded RNG for visual variety.
  const groundData = new Array(w * h)
  if (useKenney) {
    // Kenney village: alternate between two teal-green grass tiles
    for (let i = 0; i < w * h; i++) {
      groundData[i] = rng() < 0.3 ? KU.GRASS_ALT : groundGid
    }
  } else if (biome) {
    const altGid = biomeFirstGid + 1
    for (let i = 0; i < w * h; i++) {
      groundData[i] = rng() < 0.25 ? altGid : groundGid
    }
  } else {
    groundData.fill(groundGid)
  }
  const groundLayer = { ...makeTileLayer(1, 'Ground', w, h, groundGid), data: groundData }
  const overlayLayer = makeTileLayer(4, 'Overlay', w, h, 0)

  const npcObjects = []
  const interactionObjects = []
  const usedSpots = new Set([...occupied])
  let objId = 1

  // Reserve fixed interaction coordinates first so that randomly-placed NPCs
  // (trainers, azure_terminal) never land on a fixed sign/flavor/chest tile.
  const regionInteractions = interactions.filter(i => i.region === regionId)
  for (const i of regionInteractions) {
    const tx = i.tileX >= 0 && i.tileX < w ? i.tileX : Math.floor(w / 2)
    const ty = i.tileY >= 0 && i.tileY < h ? i.tileY : Math.floor(h / 2)
    usedSpots.add(`${tx},${ty}`)
  }

  // Trainers in this region
  const regionTrainers = trainers.filter(t => t.location === regionId)
  for (const t of regionTrainers) {
    const spot = findNpcSpot(w, h, occupied, usedSpots, openings, rngNpcs)
    npcObjects.push(makeNpcObject(objId++, t.id, spot.tileX, spot.tileY))
  }


  // Azure terminal for fast-travel regions
  if (region.hasFastTravel) {
    const spot = findNpcSpot(w, h, occupied, usedSpots, openings, rngNpcs)
    npcObjects.push(makeNpcObject(objId++, 'azure_terminal', spot.tileX, spot.tileY))
  }

  // Interactions in this region — placed in a separate Interactions layer
  for (const i of regionInteractions) {
    const tx = i.tileX >= 0 && i.tileX < w ? i.tileX : Math.floor(w / 2)
    const ty = i.tileY >= 0 && i.tileY < h ? i.tileY : Math.floor(h / 2)
    interactionObjects.push(makeInteractionObject(objId++, i.id, tx, ty))
    usedSpots.add(`${tx},${ty}`)
  }

  const npcLayer = makeObjectGroup(3, 'NPCs', npcObjects)
  const interactionsLayer = makeObjectGroup(6, 'Interactions', interactionObjects)
  const wallGid = isVoid ? VOID_WALL_GID : isWasteland ? WASTE_WALL_GID : useKenney ? KU.WALL_DARK : biome ? BIOME_PROP_GID : 5
  const collisionLayer = generateCollision(w, h, connections, occupied, wallGid)

  const layers = [groundLayer, objectsLayer, npcLayer, overlayLayer, collisionLayer, interactionsLayer]
  let nextLayerId = 7

  // Transitions layer
  const transitionObjects = []
  let transObjId = 100

  // Track gym_door placements so gym exit_doors can reference them
  const placedGymDoors = {}

  if (type === 'gym') {
    const exitX = Math.floor(w / 2)
    const exitY = h - 2
    // Look up the actual gym_door position in the parent map
    const parentDoorPos = gymDoorPositions[regionId]
    const spawnX = parentDoorPos ? parentDoorPos.tileX : Math.floor((SIZE[allRegions.find(r => r.id === region.parentRegion)?.type || 'main']?.w || SIZE.main.w) / 2)
    const spawnY = parentDoorPos ? parentDoorPos.tileY : Math.floor((SIZE[allRegions.find(r => r.id === region.parentRegion)?.type || 'main']?.h || SIZE.main.h) / 2)
    transitionObjects.push(
      makeTransitionObject(transObjId++, 'exit_door', region.parentRegion, spawnX, spawnY, exitX, exitY)
    )
  }

  if (type === 'main' && childGyms.length > 0) {
    for (const gym of childGyms) {
      const spot = findNpcSpot(w, h, occupied, usedSpots, openings, rngNpcs)
      const gymSize = SIZE.gym
      // Spawn player one tile above the exit_door inside the gym
      const gymSpawnX = Math.floor(gymSize.w / 2)
      const gymSpawnY = gymSize.h - 3
      transitionObjects.push(
        makeTransitionObject(transObjId++, 'gym_door', gym.id, gymSpawnX, gymSpawnY, spot.tileX, spot.tileY)
      )
      placedGymDoors[gym.id] = { tileX: spot.tileX, tileY: spot.tileY }
    }
  }

  // Dungeon child transitions (bakery_door, lab_door, etc.)
  if (type === 'main' && childDungeons.length > 0) {
    for (const dg of childDungeons) {
      const spot = findNpcSpot(w, h, occupied, usedSpots, openings, rngNpcs)
      const dgSize = SIZE.dungeon || SIZE.main
      const dgSpawnX = Math.floor(dgSize.w / 2)
      const dgSpawnY = dgSize.h - 3
      const doorName = dg.id.replace(/_interior$/, '_door').replace(/_(\d+)$/, '_door_$1')
      transitionObjects.push(
        makeTransitionObject(transObjId++, doorName, dg.id, dgSpawnX, dgSpawnY, spot.tileX, spot.tileY)
      )
    }
  }

  if (transitionObjects.length > 0) {
    layers.push(makeObjectGroup(nextLayerId++, 'Transitions', transitionObjects))
  }

  const nextObjectId = Math.max(objId, transObjId)

  return {
    map: {
      compressionlevel: -1,
      height: h,
      infinite: false,
      layers,
      nextlayerid: nextLayerId,
      nextobjectid: nextObjectId,
      orientation: 'orthogonal',
      renderorder: 'right-down',
      tiledversion: '1.10.0',
      tileheight: TILE,
      tilesets: useKenney    ? [TILESET_KENNEY_URBAN]
               : isTech       ? [TILESET_STUB, TILESET_TECH]
               : isVoid      ? [TILESET_STUB, TILESET_VOID]
               : isWasteland ? [TILESET_STUB, TILESET_WASTELAND]
               : biome       ? [TILESET_STUB, makeBiomeTileset(biome)]
               : [TILESET_STUB],
      tilewidth: TILE,
      type: 'map',
      version: '1.10',
      width: w,
    },
    placedGymDoors,
  }
}

async function main() {
  const regions = await import(path.join(ROOT, 'src/data/regions.js'))
  const trainersModule = await import(path.join(ROOT, 'src/data/trainers.js'))
  const interactionsModule = await import(path.join(ROOT, 'src/data/interactions.js'))

  const allRegions = regions.getAll()
  const allTrainers = trainersModule.getAll()
  const allInteractions = interactionsModule.getAll()
  const connections = regions.REGION_CONNECTIONS

  // Index gyms by parent region
  const gymsByParent = {}
  for (const r of allRegions) {
    if (r.type === 'gym' && r.parentRegion) {
      if (!gymsByParent[r.parentRegion]) gymsByParent[r.parentRegion] = []
      gymsByParent[r.parentRegion].push(r)
    }
  }

  // Index dungeon children by parent region
  const dungeonsByParent = {}
  for (const r of allRegions) {
    if (r.type === 'dungeon' && r.parentRegion) {
      if (!dungeonsByParent[r.parentRegion]) dungeonsByParent[r.parentRegion] = []
      dungeonsByParent[r.parentRegion].push(r)
    }
  }

  let generated = 0
  let skipped = 0

  // Accumulated gym_door positions from parent maps (gymId → {tileX, tileY})
  const gymDoorPositions = {}

  // Pre-seed gymDoorPositions from hand-made parent maps that already exist on disk.
  // This ensures gym exit_doors get correct spawn coords even when their parent
  // map was not generated in this run.
  for (const region of allRegions) {
    if (region.type === 'gym') continue
    const mapPath = path.join(MAPS_DIR, `${region.id}.tmj`)
    if (!fs.existsSync(mapPath)) continue
    const existingMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'))
    const transLayer = existingMap.layers?.find(l => l.name === 'Transitions')
    if (!transLayer) continue
    for (const obj of transLayer.objects ?? []) {
      if (obj.name !== 'gym_door') continue
      const targetRegion = obj.properties?.find(p => p.name === 'targetRegion')?.value
      if (targetRegion) {
        gymDoorPositions[targetRegion] = {
          tileX: Math.floor(obj.x / TILE),
          tileY: Math.floor(obj.y / TILE),
        }
      }
    }
  }

  // Pass 1: Generate non-gym maps first (main, dungeon, hidden)
  // so we know where gym_doors land in parent maps
  for (const region of allRegions) {
    if (region.type === 'gym') continue

    const mapPath = path.join(MAPS_DIR, `${region.id}.tmj`)
    if (fs.existsSync(mapPath)) {
      console.log(`  skip  ${region.id} (hand-made map exists)`)
      skipped++
      continue
    }

    const conn = connections[region.id] || {}
    const childGyms = gymsByParent[region.id] || []
    const childDungeons = dungeonsByParent[region.id] || []
    const { map, placedGymDoors } = generateMap(region.id, region, conn, allRegions, allTrainers, allInteractions, childGyms, gymDoorPositions, childDungeons)

    Object.assign(gymDoorPositions, placedGymDoors)

    fs.writeFileSync(mapPath, JSON.stringify(map, null, 2) + '\n')
    console.log(`  gen   ${region.id} (${map.width}×${map.height})`)
    generated++
  }

  // Pass 2: Generate gym maps using accumulated gym_door positions
  for (const region of allRegions) {
    if (region.type !== 'gym') continue

    const mapPath = path.join(MAPS_DIR, `${region.id}.tmj`)
    if (fs.existsSync(mapPath)) {
      console.log(`  skip  ${region.id} (hand-made map exists)`)
      skipped++
      continue
    }

    const conn = connections[region.id] || {}
    const { map } = generateMap(region.id, region, conn, allRegions, allTrainers, allInteractions, [], gymDoorPositions)

    fs.writeFileSync(mapPath, JSON.stringify(map, null, 2) + '\n')
    console.log(`  gen   ${region.id} (${map.width}×${map.height})`)
    generated++
  }

  console.log(`\nDone — ${generated} generated, ${skipped} skipped`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
