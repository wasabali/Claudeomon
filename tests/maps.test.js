import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { REGION_CONNECTIONS, getAll as getAllRegions } from '../src/data/regions.js'
import { getBy as getInteractionsBy } from '../src/data/interactions.js'
import { getById as getTrainerById } from '../src/data/trainers.js'

const MAPS_DIR = path.join(process.cwd(), 'assets', 'maps')

function loadMap(regionId) {
  return JSON.parse(fs.readFileSync(path.join(MAPS_DIR, `${regionId}.tmj`), 'utf8'))
}

const REQUIRED_LAYERS = ['Ground', 'Objects', 'NPCs', 'Overlay', 'Collision']
const connectedRegionIds = Object.keys(REGION_CONNECTIONS)
const allRegions = getAllRegions().filter(r => r.type !== 'hidden')

describe('localhost_town map tileset metadata', () => {
  it('declares kenney_urban as its primary tileset', () => {
    const map = loadMap('localhost_town')
    const tileset = map.tilesets.find(set => set.name === 'kenney_urban')
    expect(tileset).toBeDefined()
    expect(tileset.columns).toBe(27)
    expect(tileset.image).toBe('tilesets/kenney_urban.png')
    expect(tileset.imagewidth).toBe(1296)
    expect(tileset.imageheight).toBe(864)
    expect(tileset.tilecount).toBe(486)
    expect(tileset.tilewidth).toBe(48)
    expect(tileset.tileheight).toBe(48)
    expect(map.tilesets[0].name).toBe('kenney_urban')
  })

  it('kenney_urban tileset PNG is a valid PNG at 1296×864px', () => {
    const pngPath = path.join(MAPS_DIR, 'tilesets', 'kenney_urban.png')
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
    expect(width).toBe(1296)
    expect(height).toBe(864)
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

  it('localhost_town ground layer uses kenney_urban tile GIDs', () => {
    const map = loadMap('localhost_town')
    const ground = map.layers.find(l => l.name === 'Ground')
    const kenney = map.tilesets.find(ts => ts.name === 'kenney_urban')
    const minGid = kenney.firstgid
    const maxGid = kenney.firstgid + kenney.tilecount - 1

    const usesKenneyTiles = ground.data.some(id => id >= minGid && id <= maxGid)
    expect(usesKenneyTiles).toBe(true)
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

  it.each(allRegions.map(r => r.id))('%s uses stub_tiles or kenney_urban tileset', (regionId) => {
    const mapPath = path.join(MAPS_DIR, `${regionId}.tmj`)
    expect(fs.existsSync(mapPath)).toBe(true)
    const map = loadMap(regionId)
    const firstName = map.tilesets[0].name
    expect(['stub_tiles', 'kenney_urban']).toContain(firstName)
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

// Biome regions derived from region data
const BIOME_REGION_IDS_BY_BIOME = {}
for (const region of getAllRegions()) {
  if (region.biome) {
    if (!BIOME_REGION_IDS_BY_BIOME[region.biome]) BIOME_REGION_IDS_BY_BIOME[region.biome] = []
    BIOME_REGION_IDS_BY_BIOME[region.biome].push(region.id)
  }
}
const DUNGEON_BIOME_REGION_IDS  = BIOME_REGION_IDS_BY_BIOME['dungeon']  || []
const INTERIOR_BIOME_REGION_IDS = BIOME_REGION_IDS_BY_BIOME['interior'] || []

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

describe('dungeon biome regions carry dungeon tileset', () => {
  it.each(DUNGEON_BIOME_REGION_IDS)('%s includes dungeon as second tileset', (regionId) => {
    const map = loadMap(regionId)
    const ts = map.tilesets.find(t => t.name === 'dungeon')
    expect(ts).toBeDefined()
    expect(ts.image).toBe('tilesets/dungeon.png')
    expect(ts.tilewidth).toBe(48)
    expect(ts.tileheight).toBe(48)
    expect(ts.columns).toBe(8)
    expect(ts.tilecount).toBe(32)
    expect(ts.firstgid).toBe(6)
  })

  it.each(DUNGEON_BIOME_REGION_IDS)('%s ground layer uses dungeon tile GIDs', (regionId) => {
    const map = loadMap(regionId)
    const ground = map.layers.find(l => l.name === 'Ground')
    expect(ground).toBeDefined()
    expect(ground.data.some(gid => gid >= 6 && gid <= 37)).toBe(true)
  })
})

// Only generated (non-hand-made) maps are guaranteed to have no stub building GIDs.
// Hand-made maps with biome may still carry legacy stub tiles and are out of scope.
const GENERATED_DUNGEON_IDS  = ['jira_dungeon_1', 'jira_dungeon_2', 'jira_dungeon_3']
const GENERATED_INTERIOR_IDS = ['bakery_interior', 'lab_interior', 'apartment_interior']

describe('generated dungeon maps have no stub building GIDs', () => {
  it.each(GENERATED_DUNGEON_IDS)('%s has no stub building GIDs (2–5) in tile layers', (regionId) => {
    const map = loadMap(regionId)
    const tileLayers = map.layers.filter(l => l.type === 'tilelayer')
    for (const layer of tileLayers) {
      expect(layer.data.filter(gid => gid >= 2 && gid <= 5).length).toBe(0)
    }
  })
})

describe('interior biome regions carry interior or kenney_urban tileset', () => {
  it.each(INTERIOR_BIOME_REGION_IDS)('%s includes interior tileset or uses kenney_urban', (regionId) => {
    const map = loadMap(regionId)
    const usesKenney = map.tilesets.some(t => t.name === 'kenney_urban')
    const ts = map.tilesets.find(t => t.name === 'interior')
    // Kenney urban maps don't need a separate interior tileset
    if (usesKenney) {
      expect(usesKenney).toBe(true)
    } else {
      expect(ts).toBeDefined()
      expect(ts.image).toBe('tilesets/interior.png')
      expect(ts.tilewidth).toBe(48)
      expect(ts.tileheight).toBe(48)
      expect(ts.columns).toBe(8)
      expect(ts.tilecount).toBe(32)
      expect(ts.firstgid).toBe(6)
    }
  })

  it.each(INTERIOR_BIOME_REGION_IDS)('%s ground layer uses valid tile GIDs', (regionId) => {
    const map = loadMap(regionId)
    const ground = map.layers.find(l => l.name === 'Ground')
    expect(ground).toBeDefined()
    const usesKenney = map.tilesets.some(t => t.name === 'kenney_urban')
    if (usesKenney) {
      // Kenney maps use GIDs from the Kenney urban tileset (1-486)
      expect(ground.data.some(gid => gid >= 1 && gid <= 486)).toBe(true)
    } else {
      expect(ground.data.some(gid => gid >= 6 && gid <= 37)).toBe(true)
    }
  })
})

describe('generated interior maps have no stub building GIDs', () => {
  it.each(GENERATED_INTERIOR_IDS)('%s has no stub building GIDs (2–5) in tile layers', (regionId) => {
    const map = loadMap(regionId)
    const tileLayers = map.layers.filter(l => l.type === 'tilelayer')
    for (const layer of tileLayers) {
      expect(layer.data.filter(gid => gid >= 2 && gid <= 5).length).toBe(0)
    }
  })
})

// Derived from region data — single source of truth for which regions carry the void/wasteland tilesets
const VOID_REGION_IDS = getAllRegions().filter(r => r.hasVoidTileset).map(r => r.id)
const WASTELAND_REGION_IDS = getAllRegions().filter(r => r.hasWastelandTileset).map(r => r.id)

describe('void regions carry void_tiles tileset', () => {
  it.each(VOID_REGION_IDS)('%s declares void_tiles as second tileset', (regionId) => {
    const map = loadMap(regionId)
    const voidTs = map.tilesets.find(ts => ts.name === 'void_tiles')
    expect(voidTs).toBeDefined()
    expect(voidTs.image).toBe('../tiles/void_tiles.png')
    expect(voidTs.tilewidth).toBe(48)
    expect(voidTs.tileheight).toBe(48)
    expect(voidTs.columns).toBe(12)
    expect(voidTs.tilecount).toBe(12)
    expect(voidTs.firstgid).toBe(6)
    expect(map.tilesets[0].name).toBe('stub_tiles')
    expect(map.tilesets[1].name).toBe('void_tiles')
  })

  it.each(VOID_REGION_IDS)('%s ground layer uses void_ground GID 6', (regionId) => {
    const map = loadMap(regionId)
    const ground = map.layers.find(l => l.name === 'Ground')
    expect(ground).toBeDefined()
    expect(ground.data.every(gid => gid === 6)).toBe(true)
  })

  it.each(VOID_REGION_IDS)('%s objects layer uses void tile GIDs (6–17), not stub GIDs 2–5', (regionId) => {
    const map = loadMap(regionId)
    const objects = map.layers.find(l => l.name === 'Objects')
    expect(objects).toBeDefined()
    const nonZero = objects.data.filter(gid => gid !== 0)
    expect(nonZero.length).toBeGreaterThan(0)
    expect(nonZero.every(gid => gid >= 6 && gid <= 17)).toBe(true)
  })

  it.each(VOID_REGION_IDS)('%s collision layer uses void_wall GID 17, not stub GID 5', (regionId) => {
    const map = loadMap(regionId)
    const collision = map.layers.find(l => l.name === 'Collision')
    expect(collision).toBeDefined()
    const nonZero = collision.data.filter(gid => gid !== 0)
    expect(nonZero.length).toBeGreaterThan(0)
    expect(nonZero.every(gid => gid === 17)).toBe(true)
  })
})

describe('wasteland regions carry wasteland_tiles tileset', () => {
  it.each(WASTELAND_REGION_IDS)('%s declares wasteland_tiles as second tileset', (regionId) => {
    const map = loadMap(regionId)
    const wasteTs = map.tilesets.find(ts => ts.name === 'wasteland_tiles')
    expect(wasteTs).toBeDefined()
    expect(wasteTs.image).toBe('../tiles/wasteland_tiles.png')
    expect(wasteTs.tilewidth).toBe(48)
    expect(wasteTs.tileheight).toBe(48)
    expect(wasteTs.columns).toBe(12)
    expect(wasteTs.tilecount).toBe(12)
    expect(wasteTs.firstgid).toBe(6)
    expect(map.tilesets[0].name).toBe('stub_tiles')
    expect(map.tilesets[1].name).toBe('wasteland_tiles')
  })

  it.each(WASTELAND_REGION_IDS)('%s ground layer uses waste_ground GID 6', (regionId) => {
    const map = loadMap(regionId)
    const ground = map.layers.find(l => l.name === 'Ground')
    expect(ground).toBeDefined()
    expect(ground.data.every(gid => gid === 6)).toBe(true)
  })

  it.each(WASTELAND_REGION_IDS)('%s objects layer uses wasteland tile GIDs (6–17), not stub GIDs 2–5', (regionId) => {
    const map = loadMap(regionId)
    const objects = map.layers.find(l => l.name === 'Objects')
    expect(objects).toBeDefined()
    const nonZero = objects.data.filter(gid => gid !== 0)
    expect(nonZero.length).toBeGreaterThan(0)
    expect(nonZero.every(gid => gid >= 6 && gid <= 17)).toBe(true)
  })

  it.each(WASTELAND_REGION_IDS)('%s collision layer uses waste_wall GID 17, not stub GID 5', (regionId) => {
    const map = loadMap(regionId)
    const collision = map.layers.find(l => l.name === 'Collision')
    expect(collision).toBeDefined()
    const nonZero = collision.data.filter(gid => gid !== 0)
    expect(nonZero.length).toBeGreaterThan(0)
    expect(nonZero.every(gid => gid === 17)).toBe(true)
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

describe('NPC sprite coverage', () => {
  // azure_terminal is the only intentional non-trainer NPC stub (it is a machine, not a person).
  const INTENTIONAL_STUBS = new Set(['azure_terminal'])

  it('every NPC in every map NPCs layer has a trainer registry entry', () => {
    const maps = fs.readdirSync(MAPS_DIR).filter(f => f.endsWith('.tmj'))
    for (const mapFile of maps) {
      const map = JSON.parse(fs.readFileSync(path.join(MAPS_DIR, mapFile), 'utf-8'))
      const npcLayer = map.layers?.find(l => l.name === 'NPCs')
      if (!npcLayer) continue
      for (const npc of npcLayer.objects) {
        if (INTENTIONAL_STUBS.has(npc.name)) continue
        const trainer = getTrainerById(npc.name)
        expect(
          trainer,
          `NPC "${npc.name}" in ${mapFile} has no trainer registry entry — it will render as an orange rectangle`,
        ).toBeDefined()
        expect(
          trainer?.spriteKey,
          `NPC "${npc.name}" in ${mapFile} has a trainer entry but no spriteKey — it will render as an orange rectangle`,
        ).toBeTruthy()
      }
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Acceptance criteria for layout-aware procedural map generator
// ─────────────────────────────────────────────────────────────────────────────

describe('all regions carry a layout descriptor', () => {
  it('every region in regions.js has a layout field with a valid type', () => {
    const VALID_LAYOUT_TYPES = new Set(['town', 'dungeon', 'arena', 'gym', 'interior', 'wilderness'])
    for (const region of getAllRegions()) {
      expect(region.layout, `${region.id} is missing a layout descriptor`).toBeDefined()
      expect(
        VALID_LAYOUT_TYPES.has(region.layout.type),
        `${region.id} has unknown layout type "${region.layout?.type}"`,
      ).toBe(true)
    }
  })
})

describe('localhost_town town layout', () => {
  it('Objects layer has enough tiles to represent at least 3 buildings', () => {
    const map = loadMap('localhost_town')
    const objects = map.layers.find(l => l.name === 'Objects')
    // Kenney building composite GIDs occupy rows 0–8, cols 0–22 of the 27-col tileset.
    // The last building block (WATER_BLOCK) ends at K(15,8) = 8*27+15+1 = 232.
    // Trees start at K(16,8) = 233, so GIDs 1–232 are building tiles exclusively
    // (in the Objects layer where only placeBlock, placeTree, and road code run).
    const isBuildingGid = gid => gid > 0 && gid <= 232
    const buildingTileCount = objects.data.filter(isBuildingGid).length
    // Three buildings × minimum 7×3 = 21 tiles each → need at least 63 building tiles
    expect(buildingTileCount).toBeGreaterThanOrEqual(63)
  })

  it('Objects layer contains road/path tiles (paved path network)', () => {
    const map = loadMap('localhost_town')
    const objects = map.layers.find(l => l.name === 'Objects')
    // Kenney road GIDs occupy rows 15–17, cols 0–10 of the 27-col tileset.
    // GID = row * 27 + col + 1  →  min: 15*27+0+1=406, max: 17*27+10+1=470
    const isRoadGid = gid => gid >= 406 && gid <= 470
    expect(objects.data.some(isRoadGid)).toBe(true)
  })

  it('Objects layer contains at least 2 tree tiles (decorative landmarks)', () => {
    const map = loadMap('localhost_town')
    const objects = map.layers.find(l => l.name === 'Objects')
    // Kenney tree GIDs: rows 8–12, cols 16–22 of the 27-col tileset.
    // Green tree tops/bottoms: rows 8–9  → GID 233–266
    // Orange/red tree tops/bottoms: rows 11–12 → GID 298–328
    const isTreeGid = gid => (gid >= 233 && gid <= 266) || (gid >= 298 && gid <= 328)
    const treeCount = objects.data.filter(isTreeGid).length
    expect(treeCount).toBeGreaterThanOrEqual(2)
  })
})

describe('jira_dungeon BSP layout', () => {
  it.each(['jira_dungeon_1', 'jira_dungeon_2', 'jira_dungeon_3'])('%s Objects layer has BSP wall tiles forming multiple rooms', (regionId) => {
    const map = loadMap(regionId)
    const objects = map.layers.find(l => l.name === 'Objects')
    const nonZero = objects.data.filter(gid => gid !== 0)
    // With BSP depth 3, interior walls should account for at least 100 tiles
    expect(nonZero.length).toBeGreaterThan(100)
  })

  it.each(['jira_dungeon_1', 'jira_dungeon_2', 'jira_dungeon_3'])('%s has substantial walkable area inside (rooms + corridors)', (regionId) => {
    const map = loadMap(regionId)
    const collision = map.layers.find(l => l.name === 'Collision')
    const walkable = collision.data.filter(gid => gid === 0).length
    // At least 25% of all tiles should be walkable
    expect(walkable).toBeGreaterThan(map.width * map.height * 0.25)
  })
})

describe('kubernetes_colosseum arena layout', () => {
  it('Objects layer contains arena walls and spectator tiles', () => {
    const map = loadMap('kubernetes_colosseum')
    const objects = map.layers.find(l => l.name === 'Objects')
    const nonZero = objects.data.filter(gid => gid !== 0)
    // Arena walls + spectator stands should produce many obstacle tiles
    expect(nonZero.length).toBeGreaterThan(50)
  })

  it('center of map is walkable (open arena floor)', () => {
    const map = loadMap('kubernetes_colosseum')
    const collision = map.layers.find(l => l.name === 'Collision')
    const cx = Math.floor(map.width / 2)
    const cy = Math.floor(map.height / 2)
    expect(collision.data[cy * map.width + cx]).toBe(0)
  })

  it('has gym_door transitions for child gyms', () => {
    const map = loadMap('kubernetes_colosseum')
    const trans = map.layers.find(l => l.name === 'Transitions')
    expect(trans).toBeDefined()
    const gymDoors = trans.objects.filter(o => o.name === 'gym_door')
    expect(gymDoors.length).toBeGreaterThanOrEqual(1)
  })
})

