import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { REGION_CONNECTIONS, getAll as getAllRegions } from '../src/data/regions.js'
import { getBy as getInteractionsBy } from '../src/data/interactions.js'

const MAPS_DIR = path.join(process.cwd(), 'assets', 'maps')

function loadMap(regionId) {
  return JSON.parse(fs.readFileSync(path.join(MAPS_DIR, `${regionId}.tmj`), 'utf8'))
}

const REQUIRED_LAYERS = ['Ground', 'Objects', 'NPCs', 'Overlay', 'Collision']
const connectedRegionIds = Object.keys(REGION_CONNECTIONS)
const allRegions = getAllRegions().filter(r => r.type !== 'hidden')

describe('localhost_town map tileset metadata', () => {
  it('declares stub_tiles as an image-based tileset', () => {
    const map = loadMap('localhost_town')
    const tileset = map.tilesets.find(set => set.name === 'stub_tiles')
    const tileEntries = tileset?.tiles ?? []

    expect(tileset).toBeDefined()
    expect(tileset.columns).toBe(5)
    expect(tileset.image).toBe('stub_tiles.png')
    expect(tileset.imagewidth).toBe(240)
    expect(tileset.imageheight).toBe(48)
    expect(Array.isArray(tileEntries)).toBe(true)
    expect(tileEntries.every(tile => tile.image === undefined)).toBe(true)
  })

  it('declares village as the second tileset for Ninja Adventure integration', () => {
    const map = loadMap('localhost_town')
    const village = map.tilesets.find(set => set.name === 'village')

    expect(village).toBeDefined()
    expect(village.columns).toBe(8)
    expect(village.image).toBe('tilesets/village.png')
    expect(village.imagewidth).toBe(384)
    expect(village.imageheight).toBe(192)
    expect(village.tilewidth).toBe(48)
    expect(village.tileheight).toBe(48)
    expect(village.tilecount).toBe(32)
    // stub_tiles must remain first; village must be exactly second
    expect(map.tilesets[0].name).toBe('stub_tiles')
    expect(map.tilesets[1].name).toBe('village')
    expect(map.tilesets[1].firstgid).toBe(6)
  })

  it('village tileset declares solid collision properties on wall tiles', () => {
    const map = loadMap('localhost_town')
    const village = map.tilesets.find(set => set.name === 'village')
    expect(village.tiles).toBeDefined()
    const solidIds = village.tiles
      .filter(t => t.properties?.some(p => p.name === 'solid' && p.value === true))
      .map(t => t.id)

    expect(solidIds.length).toBeGreaterThan(0)
    // Solid wall tiles asserted: wall_stone(8), wall_wood(9), wall_brick(10), fence(11)
    // (ids 12-15 in that row are intentionally walkable: door, water_shallow, door_frame, roof_edge)
    expect(solidIds).toContain(8)   // wall_stone
    expect(solidIds).toContain(9)   // wall_wood
    expect(solidIds).toContain(10)  // wall_brick
    expect(solidIds).toContain(11)  // fence
  })

  it('village tileset PNG is a valid PNG at 384×192px', () => {
    const pngPath = path.join(MAPS_DIR, 'tilesets', 'village.png')
    expect(fs.existsSync(pngPath)).toBe(true)
    const buf = fs.readFileSync(pngPath)
    // PNG signature
    expect(buf[0]).toBe(137)
    expect(buf[1]).toBe(80)   // P
    expect(buf[2]).toBe(78)   // N
    expect(buf[3]).toBe(71)   // G
    // IHDR width and height are big-endian uint32 at bytes 16-23
    const width  = buf.readUInt32BE(16)
    const height = buf.readUInt32BE(20)
    expect(width).toBe(384)
    expect(height).toBe(192)
  })

  it('localhost_town ground layer uses village tile IDs', () => {
    const map = loadMap('localhost_town')
    const ground = map.layers.find(l => l.name === 'Ground')
    const village = map.tilesets.find(ts => ts.name === 'village')
    const minGid = village.firstgid
    const maxGid = village.firstgid + village.tilecount - 1

    const usesVillageTiles = ground.data.some(id => id >= minGid && id <= maxGid)
    expect(usesVillageTiles).toBe(true)
  })
})

describe('all connected regions have map files', () => {
  it.each(connectedRegionIds)('%s has a .tmj file', (regionId) => {
    const mapPath = path.join(MAPS_DIR, `${regionId}.tmj`)
    expect(fs.existsSync(mapPath)).toBe(true)
  })
})

describe('map layer structure', () => {
  it.each(allRegions.map(r => r.id))('%s has all required layers', (regionId) => {
    const mapPath = path.join(MAPS_DIR, `${regionId}.tmj`)
    expect(fs.existsSync(mapPath)).toBe(true)
    const map = loadMap(regionId)
    const layerNames = map.layers.map(l => l.name)
    for (const name of REQUIRED_LAYERS) {
      expect(layerNames).toContain(name)
    }
  })

  it.each(allRegions.map(r => r.id))('%s uses stub_tiles tileset', (regionId) => {
    const mapPath = path.join(MAPS_DIR, `${regionId}.tmj`)
    expect(fs.existsSync(mapPath)).toBe(true)
    const map = loadMap(regionId)
    expect(map.tilesets[0].name).toBe('stub_tiles')
    expect(map.tilesets[0].image).toBe('stub_tiles.png')
  })
})

describe('Ninja Adventure tileset pipeline files', () => {
  const TILESET_NAMES = ['village', 'dungeon', 'nature', 'interior']

  it.each(TILESET_NAMES)('%s.png is a valid 384×192px PNG', (name) => {
    const buf = fs.readFileSync(path.join(MAPS_DIR, 'tilesets', `${name}.png`))
    expect(buf[0]).toBe(137) // PNG signature byte
    expect(buf.readUInt32BE(16)).toBe(384)  // IHDR width
    expect(buf.readUInt32BE(20)).toBe(192)  // IHDR height
  })

  it.each(TILESET_NAMES)('%s.tsx exists in assets/maps/tilesets/', (name) => {
    expect(fs.existsSync(path.join(MAPS_DIR, 'tilesets', `${name}.tsx`))).toBe(true)
  })

  it.each(TILESET_NAMES)('%s.tsx references the matching PNG', (name) => {
    const tsx = fs.readFileSync(path.join(MAPS_DIR, 'tilesets', `${name}.tsx`), 'utf8')
    expect(tsx).toContain(`source="${name}.png"`)
  })

  it.each(TILESET_NAMES)('%s.tsx declares tilewidth and tileheight of 48', (name) => {
    const tsx = fs.readFileSync(path.join(MAPS_DIR, 'tilesets', `${name}.tsx`), 'utf8')
    expect(tsx).toContain('tilewidth="48"')
    expect(tsx).toContain('tileheight="48"')
  })

  it.each(TILESET_NAMES)('%s.tsx marks at least one tile as solid', (name) => {
    const tsx = fs.readFileSync(path.join(MAPS_DIR, 'tilesets', `${name}.tsx`), 'utf8')
    expect(tsx).toContain('name="solid"')
    expect(tsx).toContain('value="true"')
  })

  it('village.tsx defines Wang autotile terrain sets', () => {
    const tsx = fs.readFileSync(path.join(MAPS_DIR, 'tilesets', 'village.tsx'), 'utf8')
    expect(tsx).toContain('<wangsets>')
    expect(tsx).toContain('<wangset ')
  })
})

describe('collision openings match REGION_CONNECTIONS', () => {
  for (const [regionId, connections] of Object.entries(REGION_CONNECTIONS)) {
    const directions = Object.keys(connections)
    it(`${regionId} has openings for ${directions.join(', ')}`, () => {
      const map = loadMap(regionId)
      const col = map.layers.find(l => l.name === 'Collision')
      expect(col).toBeDefined()
      const w = map.width
      const h = map.height
      const midX = Math.floor(w / 2)
      const midY = Math.floor(h / 2)

      for (const dir of directions) {
        if (dir === 'north') expect(col.data[0 * w + midX]).toBe(0)
        if (dir === 'south') expect(col.data[(h - 1) * w + midX]).toBe(0)
        if (dir === 'west')  expect(col.data[midY * w + 0]).toBe(0)
        if (dir === 'east')  expect(col.data[midY * w + (w - 1)]).toBe(0)
      }
    })
  }
})

describe('gym regions have exit transitions', () => {
  const gymRegions = allRegions.filter(r => r.type === 'gym')
  it.each(gymRegions.map(r => [r.id, r.parentRegion]))('%s has exit door to %s', (gymId, parentId) => {
    const mapPath = path.join(MAPS_DIR, `${gymId}.tmj`)
    expect(fs.existsSync(mapPath)).toBe(true)
    const map = loadMap(gymId)
    const trans = map.layers.find(l => l.name === 'Transitions')
    expect(trans).toBeDefined()
    const exitDoor = trans.objects.find(o => o.name === 'exit_door')
    expect(exitDoor).toBeDefined()
    const target = exitDoor.properties.find(p => p.name === 'targetRegion')
    expect(target.value).toBe(parentId)
  })
})

describe('fast travel regions have azure_terminal', () => {
  const ftRegions = allRegions.filter(r => r.hasFastTravel)
  it.each(ftRegions.map(r => r.id))('%s has azure_terminal NPC', (regionId) => {
    const map = loadMap(regionId)
    const npcLayer = map.layers.find(l => l.name === 'NPCs')
    expect(npcLayer).toBeDefined()
    const terminal = npcLayer.objects.find(o => o.name === 'azure_terminal')
    expect(terminal).toBeDefined()
  })
})

describe('transition spawn coordinates are in-bounds for target maps', () => {
  const gymRegions = allRegions.filter(r => r.type === 'gym')
  it.each(gymRegions.map(r => [r.id, r.parentRegion]))('%s exit_door spawns within %s bounds', (gymId, parentId) => {
    const gymMap = loadMap(gymId)
    const trans = gymMap.layers.find(l => l.name === 'Transitions')
    const exitDoor = trans.objects.find(o => o.name === 'exit_door')
    const spawnX = exitDoor.properties.find(p => p.name === 'targetSpawnX').value
    const spawnY = exitDoor.properties.find(p => p.name === 'targetSpawnY').value
    const parentMap = loadMap(parentId)
    expect(spawnX).toBeGreaterThanOrEqual(0)
    expect(spawnX).toBeLessThan(parentMap.width)
    expect(spawnY).toBeGreaterThanOrEqual(0)
    expect(spawnY).toBeLessThan(parentMap.height)
  })

  it('sibling gyms under same parent have distinct exit spawn coords', () => {
    const gymsByParent = {}
    for (const r of gymRegions) {
      if (!gymsByParent[r.parentRegion]) gymsByParent[r.parentRegion] = []
      gymsByParent[r.parentRegion].push(r.id)
    }
    for (const [parentId, gymIds] of Object.entries(gymsByParent)) {
      if (gymIds.length < 2) continue
      const spawns = gymIds.map(id => {
        const map = loadMap(id)
        const trans = map.layers.find(l => l.name === 'Transitions')
        const exitDoor = trans.objects.find(o => o.name === 'exit_door')
        const x = exitDoor.properties.find(p => p.name === 'targetSpawnX').value
        const y = exitDoor.properties.find(p => p.name === 'targetSpawnY').value
        return `${x},${y}`
      })
      const unique = new Set(spawns)
      expect(unique.size).toBe(spawns.length)
    }
  })
})

// Derived from region data — single source of truth for which regions carry the tech tileset
const TECH_REGION_IDS = getAllRegions().filter(r => r.hasTechTileset).map(r => r.id)

describe('tech regions carry kenney_tech_office tileset', () => {
  it.each(TECH_REGION_IDS)('%s includes kenney_tech_office as second tileset', (regionId) => {
    const mapPath = path.join(MAPS_DIR, `${regionId}.tmj`)
    expect(fs.existsSync(mapPath)).toBe(true)
    const map = loadMap(regionId)
    const techTs = map.tilesets.find(ts => ts.name === 'kenney_tech_office')
    expect(techTs).toBeDefined()
    expect(techTs.image).toBe('../tiles/kenney_tech_office.png')
    expect(techTs.tilewidth).toBe(48)
    expect(techTs.tileheight).toBe(48)
    expect(techTs.columns).toBe(5)
    expect(techTs.tilecount).toBe(50)
    expect(techTs.firstgid).toBe(6)
  })

  it('server_graveyard ground layer uses tech_floor (GID 6)', () => {
    const map = loadMap('server_graveyard')
    const ground = map.layers.find(l => l.name === 'Ground')
    expect(ground).toBeDefined()
    // All ground tiles should be the tech_floor GID (local ID 1 + firstgid - 1 = 1 + 5 = 6)
    expect(ground.data.every(gid => gid === 6)).toBe(true)
  })

  it('server_graveyard objects layer contains graveyard tech tiles', () => {
    const map = loadMap('server_graveyard')
    const objects = map.layers.find(l => l.name === 'Objects')
    expect(objects).toBeDefined()
    const nonZero = objects.data.filter(gid => gid !== 0)
    expect(nonZero.length).toBeGreaterThan(0)
    // All non-zero GIDs should be in range 6–55 (kenney_tech_office tiles)
    expect(nonZero.every(gid => gid >= 6 && gid <= 55)).toBe(true)
  })
})

describe('Interactions object layer', () => {
  const knownRegionIds = new Set(allRegions.map(r => r.id))

  it('interaction objects are in Interactions layer, not NPCs layer', () => {
    const regionsWithInteractions = [...new Set(
      ['sign', 'flavor', 'chest', 'door'].flatMap(type => getInteractionsBy('type', type))
        .map(i => i.region)
        .filter(id => knownRegionIds.has(id))
    )]

    for (const regionId of regionsWithInteractions) {
      const map = loadMap(regionId)
      const npcLayer = map.layers.find(l => l.name === 'NPCs')
      const interLayer = map.layers.find(l => l.name === 'Interactions')

      expect(interLayer).toBeDefined()

      const interactionIds = getInteractionsBy('region', regionId).map(i => i.id)
      for (const id of interactionIds) {
        if (npcLayer) {
          expect(npcLayer.objects.find(o => o.name === id)).toBeUndefined()
        }
        expect(interLayer.objects.find(o => o.name === id)).toBeDefined()
      }
    }
  })

  it('each Interactions layer object has type "interaction" and an interaction property matching its name', () => {
    for (const region of allRegions) {
      const mapPath = path.join(MAPS_DIR, `${region.id}.tmj`)
      if (!fs.existsSync(mapPath)) continue
      const map = loadMap(region.id)
      const interLayer = map.layers.find(l => l.name === 'Interactions')
      if (!interLayer) continue
      for (const obj of interLayer.objects) {
        expect(obj.type).toBe('interaction')
        const interactionProp = obj.properties?.find(p => p.name === 'interaction')
        expect(interactionProp).toBeDefined()
        expect(interactionProp.value).toBe(obj.name)
      }
    }
  })
})

describe('localhost_town NPC and interaction objects', () => {
  it('has all localhost_town trainers in NPCs layer', async () => {
    const { getAll: getAllTrainers } = await import('../src/data/trainers.js')
    const map = loadMap('localhost_town')
    const npcLayer = map.layers.find(l => l.name === 'NPCs')
    expect(npcLayer).toBeDefined()
    const placedNames = npcLayer.objects.map(o => o.name)
    const regionTrainers = getAllTrainers().filter(t => t.location === 'localhost_town')
    for (const trainer of regionTrainers) {
      expect(placedNames).toContain(trainer.id)
    }
  })

  it('every NPC object name in NPCs layer has a trainer registry entry with a spriteKey', async () => {
    const { getById: getTrainerById } = await import('../src/data/trainers.js')
    const map = loadMap('localhost_town')
    const npcLayer = map.layers.find(l => l.name === 'NPCs')
    expect(npcLayer).toBeDefined()
    const SPRITES_DIR = path.join(process.cwd(), 'assets', 'sprites', 'characters')
    for (const obj of npcLayer.objects) {
      // azure_terminal is a special hardcoded stub (not a trainer), always intentional
      if (obj.name === 'azure_terminal') continue
      const trainer = getTrainerById(obj.name)
      expect(trainer, `NPC "${obj.name}" has no trainer registry entry`).toBeDefined()
      expect(trainer.spriteKey, `NPC "${obj.name}" trainer has no spriteKey`).toBeTruthy()
      const spritePath = path.join(SPRITES_DIR, `${trainer.spriteKey}.png`)
      expect(fs.existsSync(spritePath), `NPC "${obj.name}" spriteKey "${trainer.spriteKey}" has no sprite file at assets/sprites/characters/${trainer.spriteKey}.png`).toBe(true)
    }
  })

  it('has Interactions layer with all localhost_town interaction objects', async () => {
    const { getBy: getInteractionsBy } = await import('../src/data/interactions.js')
    const map = loadMap('localhost_town')
    const interactionsLayer = map.layers.find(l => l.name === 'Interactions')
    expect(interactionsLayer).toBeDefined()
    expect(interactionsLayer.type).toBe('objectgroup')
    const placedNames = interactionsLayer.objects.map(o => o.name)
    const regionInteractions = getInteractionsBy('region', 'localhost_town')
    for (const interaction of regionInteractions) {
      expect(placedNames).toContain(interaction.id)
    }
  })

  it('Interactions layer objects have interaction type property', async () => {
    const map = loadMap('localhost_town')
    const interactionsLayer = map.layers.find(l => l.name === 'Interactions')
    expect(interactionsLayer).toBeDefined()
    for (const obj of interactionsLayer.objects) {
      const prop = obj.properties?.find(p => p.name === 'interaction')
      expect(prop).toBeDefined()
      expect(prop.value).toBe(obj.name)
    }
  })

  it('Transitions layer has bakery_door, lab_door, and apartment_door entries', () => {
    const map = loadMap('localhost_town')
    const transLayer = map.layers.find(l => l.name === 'Transitions')
    expect(transLayer).toBeDefined()
    const doorNames = transLayer.objects.map(o => o.name)
    expect(doorNames).toContain('bakery_door')
    expect(doorNames).toContain('lab_door')
    expect(doorNames).toContain('apartment_door')
  })

  it('all Transitions objects target an existing region map with in-bounds spawn coordinates', () => {
    const map = loadMap('localhost_town')
    const transLayer = map.layers.find(l => l.name === 'Transitions')
    expect(transLayer).toBeDefined()
    for (const obj of transLayer.objects) {
      const regionProp = obj.properties?.find(p => p.name === 'targetRegion')
      const spawnXProp = obj.properties?.find(p => p.name === 'targetSpawnX')
      const spawnYProp = obj.properties?.find(p => p.name === 'targetSpawnY')
      expect(regionProp, `${obj.name} missing targetRegion`).toBeDefined()
      expect(spawnXProp, `${obj.name} missing targetSpawnX`).toBeDefined()
      expect(spawnYProp, `${obj.name} missing targetSpawnY`).toBeDefined()

      const targetId = regionProp.value
      const targetMapPath = path.join(MAPS_DIR, `${targetId}.tmj`)
      expect(fs.existsSync(targetMapPath), `${obj.name} targets missing map: ${targetId}`).toBe(true)

      const targetMap = loadMap(targetId)
      const spawnX = spawnXProp.value
      const spawnY = spawnYProp.value
      expect(spawnX, `${obj.name} targetSpawnX out of bounds`).toBeGreaterThanOrEqual(0)
      expect(spawnX, `${obj.name} targetSpawnX out of bounds`).toBeLessThan(targetMap.width)
      expect(spawnY, `${obj.name} targetSpawnY out of bounds`).toBeGreaterThanOrEqual(0)
      expect(spawnY, `${obj.name} targetSpawnY out of bounds`).toBeLessThan(targetMap.height)
    }
  })
})
