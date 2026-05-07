import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MAPS_DIR = path.join(ROOT, 'assets', 'maps')

const TILE = 48

// Base stub tileset (GIDs 1–5) — used by all regions
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

// Void tileset (GIDs 6–17) — appended for void-themed regions.
// Image lives at assets/tiles/void_tiles.png (576×48, 12 tiles in a single row).
const TILESET_VOID = {
  columns: 12,
  firstgid: 6,
  image: '../tiles/void_tiles.png',
  imageheight: TILE,
  imagewidth: TILE * 12,
  margin: 0,
  name: 'void_tiles',
  spacing: 0,
  tilecount: 12,
  tileheight: TILE,
  tilewidth: TILE,
}

// Wasteland tileset (GIDs 6–17) — appended for wasteland-themed regions.
// Image lives at assets/tiles/wasteland_tiles.png (576×48, 12 tiles in a single row).
const TILESET_WASTELAND = {
  columns: 12,
  firstgid: 6,
  image: '../tiles/wasteland_tiles.png',
  imageheight: TILE,
  imagewidth: TILE * 12,
  margin: 0,
  name: 'wasteland_tiles',
  spacing: 0,
  tilecount: 12,
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

// Ninja Adventure tileset definitions (village, dungeon, nature, interior).
// Images live at assets/maps/tilesets/{name}.png (384×192, 8×4 tiles).
// The image path in .tmj is relative to assets/maps/, so no navigation needed.
const BIOME_COLS = 8
const BIOME_ROWS = 4
const BIOME_TILE_COUNT = BIOME_COLS * BIOME_ROWS  // 32

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
    firstgid:    6,
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

function generateCollision(w, h, connections, occupiedTiles) {
  const layer = makeTileLayer(5, 'Collision', w, h, 0, { opacity: 0, visible: false })
  const openings = getOpeningTiles(w, h, connections)

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const isEdge = x === 0 || y === 0 || x === w - 1 || y === h - 1
      if (isEdge && !openings.has(`${x},${y}`)) {
        layer.data[y * w + x] = 5
      }
    }
  }

  for (const key of occupiedTiles) {
    const [bx, by] = key.split(',').map(Number)
    layer.data[by * w + bx] = 5
  }

  return layer
}

function generateObjects(w, h, regionType, openings, rng, isTech) {
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

  let buildings
  if (isTech && regionType === 'main') {
    // Tech regions: server racks, desks, cooling units instead of generic blocks
    buildings = [
      { w: 2, h: 3, tile: techGid(T.SERVER_RACK) },
      { w: 2, h: 3, tile: techGid(T.SERVER_RACK_LEDS) },
      { w: 3, h: 2, tile: techGid(T.DESK) },
      { w: 2, h: 2, tile: techGid(T.COOLING_UNIT) },
      { w: 2, h: 2, tile: techGid(T.MONITORING_DASHBOARD) },
    ]
  } else if (isTech && (regionType === 'dungeon' || regionType === 'hidden')) {
    // Server Graveyard-style: decommissioned hardware, tombstones
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
    buildings = [
      { w: 2, h: 2, tile: 4 },
      { w: 2, h: 2, tile: 4 },
      { w: 3, h: 2, tile: 4 },
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

function generateMap(regionId, region, connections, allRegions, trainers, interactions, childGyms, gymDoorPositions) {
  const type = region.type
  const { w, h } = SIZE[type] || SIZE.main
  const rng = seededRng(hashSeed(regionId))

  const isTech = !!region.hasTechTileset
  const isVoid = !!region.hasVoidTileset
  const isWasteland = !!region.hasWastelandTileset
  const biome = (!isTech && !isVoid && !isWasteland) ? (region.biome || null) : null
  const openings = getOpeningTiles(w, h, connections)
  const { layer: objectsLayer, occupied } = generateObjects(w, h, type, openings, rng, isTech)

  // Biome regions use their biome floor as the ground tile; tech regions use tech_floor;
  // void/wasteland use their own ground tile; all others fall back to stub tile 1.
  const biomeFirstGid = 6  // biome tileset always starts at GID 6 (after stub_tiles GIDs 1–5)
  const groundGid = isTech     ? techGid(T.TECH_FLOOR)
                  : isVoid     ? VOID_GROUND_GID
                  : isWasteland ? WASTELAND_GROUND_GID
                  : biome      ? biomeFirstGid
                  : 1

  // Scatter alt-ground tile (GID+1) using seeded RNG for visual variety in biome regions.
  // ~25% of tiles use the alt variant so the ground looks textured rather than uniform.
  const groundData = new Array(w * h)
  if (biome) {
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
    const spot = findNpcSpot(w, h, occupied, usedSpots, openings, rng)
    npcObjects.push(makeNpcObject(objId++, t.id, spot.tileX, spot.tileY))
  }


  // Azure terminal for fast-travel regions
  if (region.hasFastTravel) {
    const spot = findNpcSpot(w, h, occupied, usedSpots, openings, rng)
    npcObjects.push(makeNpcObject(objId++, 'azure_terminal', spot.tileX, spot.tileY))
  }

  // Interactions in this region — placed in a separate Interactions layer
  for (const i of regionInteractions) {
    const tx = i.tileX >= 0 && i.tileX < w ? i.tileX : Math.floor(w / 2)
    const ty = i.tileY >= 0 && i.tileY < h ? i.tileY : Math.floor(h / 2)
    interactionObjects.push(makeInteractionObject(objId++, i.id, tx, ty))
  }

  const npcLayer = makeObjectGroup(3, 'NPCs', npcObjects)
  const interactionsLayer = makeObjectGroup(6, 'Interactions', interactionObjects)
  const collisionLayer = generateCollision(w, h, connections, occupied)

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
      const spot = findNpcSpot(w, h, occupied, usedSpots, openings, rng)
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
      tilesets: isTech       ? [TILESET_STUB, TILESET_TECH]
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
    const { map, placedGymDoors } = generateMap(region.id, region, conn, allRegions, allTrainers, allInteractions, childGyms, gymDoorPositions)

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
