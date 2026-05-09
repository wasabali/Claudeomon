import Phaser from 'phaser'
import { BaseScene } from '#scenes/BaseScene.js'
import { DialogBox } from '#ui/DialogBox.js'
import { CONFIG, MOVEMENT } from '../config.js'
import { GameState, hasItem, addItem, markDirty, grantXpOnce } from '#state/GameState.js'
import { getById as getStoryById, getNpcAppearance, getViralWave } from '#data/story.js'
import { getById as getQuestById } from '#data/quests.js'
import { getById as getSkillById } from '#data/skills.js'
import {
  resolveChoice, isQuestCompleted, getCompletedDialog,
  isQuestAvailable, startQuest, getCurrentStage, advanceStage,
  getBranchLabels, resolveBranchChoice, resolveBranchBattleOutcome,
  resolveQuizAnswer,
} from '#engine/QuestEngine.js'
import {
  DIR_OFFSETS, lerp, canRun, resolveDirection, isTileWalkable,
  updateBump, updateStep, commitStep, onStepComplete,
  shouldTriggerEncounter, checkTransition, applyTransition,
  clampTileToInterior, findNearestWalkableTile, persistPlayerTile, syncPlayerTileFromPixels,
} from '#engine/MovementEngine.js'
import { getById as getTrainerById, PLAYER_SPRITE_KEY } from '#data/trainers.js'
import { getBy as getGymsBy } from '#data/gyms.js'
import { resolveNpcDialog, resolveNpcPages, checkActTransition, shouldTriggerViralWave, shouldTriggerThreeAmScene, getKristofferLocation, getKristofferShameDialog } from '#engine/StoryEngine.js'
import { getBy as getInteractionsBy, getById as getInteractionById } from '#data/interactions.js'
import { getById as getRegionById, getAll as getAllRegions } from '#data/regions.js'
import { roll as encounterRoll } from '#engine/EncounterEngine.js'
import { getById as getEncounterById } from '#data/encounters.js'
import { BATTLE_MODES } from '#engine/BattleEngine.js'
import {
  isGateResolved, getAvailableSolutions, evaluateSolution, getAll as getAllGates,
} from '#engine/GateEngine.js'
import { Menu } from '#ui/Menu.js'
import { HUD } from '#ui/HUD.js'
import { canTravel, getDiscoveredTerminals, canFastTravel, DENIAL_REASONS, shouldShowTravelDenial } from '#engine/RegionEngine.js'

// Texture keys that are statically generated as stub rectangles — not walk-cycle sheets.
const STUB_TEXTURE_KEYS = new Set(['npc_default', 'azure_terminal', 'player',
  'throttlemaster_hooded', 'stub_tiles'])

// Depth layer for world-space characters and NPCs.
const CHAR_DEPTH = 5

const TILESET_KEY           = 'stub_tiles'
const TECH_TILESET_KEY      = 'kenney_tech_office'
const VOID_TILESET_KEY      = 'void_tiles'
const WASTELAND_TILESET_KEY = 'wasteland_tiles'
const KENNEY_URBAN_KEY      = 'kenney_urban'
const NINJA_TILESETS        = ['village', 'dungeon', 'nature', 'interior']

// Derived from src/data/regions.js flags — single source of truth
const TECH_TILESET_REGIONS = new Set(
  getAllRegions().filter(r => r.hasTechTileset).map(r => r.id)
)
const VOID_TILESET_REGIONS = new Set(
  getAllRegions().filter(r => r.hasVoidTileset).map(r => r.id)
)
const WASTELAND_TILESET_REGIONS = new Set(
  getAllRegions().filter(r => r.hasWastelandTileset).map(r => r.id)
)
const TILE_SIZE   = CONFIG.TILE_SIZE

// 4-frame stepped fade for region transitions (overlay alpha per step)
const FADE_STEPS     = [0, 0.33, 0.67, 1.0]
const FADE_STEP_MS   = 50

// Map edge detection margin (in pixels)
const EDGE_MARGIN = TILE_SIZE / 2

export class WorldScene extends BaseScene {
  constructor() {
    super({ key: 'WorldScene' })
  }

  preload() {
    const regionId = GameState.player.location || 'localhost_town'
    this._regionId = regionId

    // Treat all WorldScene preload failures as soft errors: missing maps fall
    // back to the localhost_town stub in _setupMap(); missing tileset images are
    // handled in _setupMap() which only registers a tileset when the texture is
    // present.  This prevents a hard crash when assets are temporarily
    // unavailable (e.g. first deploy, offline play).
    this._preloadErrorHandler = (file) => {
      console.warn(`[WorldScene] Asset unavailable, continuing without it: ${file?.type}:${file?.key}`)
    }
    this.load.on('loaderror', this._preloadErrorHandler)

    if (!this.cache.tilemap.exists(regionId)) {
      this.load.tilemapTiledJSON(regionId, `assets/maps/${regionId}.tmj`)
    }

    // Preload Kenney Urban tileset (3× upscaled from tilemap_packed.png)
    if (!this.textures.exists(KENNEY_URBAN_KEY)) {
      this.load.image(KENNEY_URBAN_KEY, 'assets/maps/tilesets/kenney_urban.png')
    }

    // Preload Ninja Adventure tileset images so _setupMap can register them
    // when a map declares them.  Files are small (~3 KB each) so loading all
    // four unconditionally is fine.
    for (const name of NINJA_TILESETS) {
      if (!this.textures.exists(name)) {
        this.load.image(name, `assets/maps/tilesets/${name}.png`)
      }
    }

    // Preload biome-specific tileset PNGs for the current region so _setupMap
    // can bind the real textures instead of falling back to generated stubs.
    if (VOID_TILESET_REGIONS.has(regionId) && !this.textures.exists(VOID_TILESET_KEY)) {
      this.load.image(VOID_TILESET_KEY, 'assets/tiles/void_tiles.png')
    }
    if (WASTELAND_TILESET_REGIONS.has(regionId) && !this.textures.exists(WASTELAND_TILESET_KEY)) {
      this.load.image(WASTELAND_TILESET_KEY, 'assets/tiles/wasteland_tiles.png')
    }
    if (TECH_TILESET_REGIONS.has(regionId) && !this.textures.exists(TECH_TILESET_KEY)) {
      this.load.image(TECH_TILESET_KEY, 'assets/tiles/kenney_tech_office.png')
    }
  }

  _generateStubTextures() {
    if (!this.textures.exists(TILESET_KEY)) {
      const g = this.make.graphics({ add: false })
      const TILE_COLORS = [
        0x4a7c3e, // id 1 — grass (styled green)
        0x64646e, // id 2 — building A (stone grey)
        0x503c28, // id 3 — building B (wood brown)
        0x323c50, // id 4 — building C (dark stone blue)
        0x191623, // id 5 — wall/impassable (dark)
      ]
      TILE_COLORS.forEach((color, i) => {
        g.fillStyle(color)
        g.fillRect(i * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)
        g.lineStyle(1, 0x000000, 0.3)
        g.strokeRect(i * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)
      })
      g.generateTexture(TILESET_KEY, TILE_SIZE * TILE_COLORS.length, TILE_SIZE)
      g.destroy()
    }

    // Tech / office tileset stub — 50 tiles (5 cols × 10 rows, 240×480)
    // Colours match the styled kenney_tech_office.png generated by generate-tilesets.js
    if (!this.textures.exists(TECH_TILESET_KEY)) {
      const TECH_COLS = 5
      const TECH_ROWS = 10
      const TECH_COLORS = [
        // Row 0: floors
        0x28282c, 0x34495e, 0xbec0c6, 0x1c2852, 0x5f626c,
        // Row 1: walls / structural
        0x161619, 0xdad4c0, 0x2d2d3a, 0xacd2eb, 0x3c4148,
        // Row 2: server equipment
        0x1e1e28, 0x1e1e28, 0x503c14, 0x3c3c50, 0x283246,
        // Row 3: office furniture
        0x785a32, 0x323c50, 0x464650, 0xc8c8d2, 0x50321e,
        // Row 4: data centre equipment
        0xb4b4be, 0x283c28, 0xffcc00, 0xc83232, 0x3c3c3c,
        // Row 5: terminal / console
        0x324632, 0x0a140a, 0xc82828, 0x1e5078, 0x28282e,
        // Row 6: building exteriors
        0x646e82, 0x5a5032, 0x505a6e, 0x788296, 0x968c78,
        // Row 7: decorative / items
        0xf0dc64, 0x8c6428, 0x282832, 0x463c32, 0x14c814,
        // Row 8: special / interaction
        0x1e1e28, 0x283c28, 0x323246, 0x3c3732, 0x28282c,
        // Row 9: custom / reserved (dark neutral — no magenta)
        0x28282c, 0x28282c, 0x28282c, 0x28282c, 0x28282c,
      ]
      const g = this.make.graphics({ add: false })
      TECH_COLORS.forEach((color, i) => {
        const col = i % TECH_COLS
        const row = Math.floor(i / TECH_COLS)
        g.fillStyle(color)
        g.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        g.lineStyle(1, 0x000000, 0.25)
        g.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      })
      g.generateTexture(TECH_TILESET_KEY, TILE_SIZE * TECH_COLS, TILE_SIZE * TECH_ROWS)
      g.destroy()
    }

    // Void tileset stub — 14 tiles (14 cols × 1 row, 672×48)
    // Colours match the styled void_tiles.png generated by generate-tilesets.js
    if (!this.textures.exists(VOID_TILESET_KEY)) {
      const VOID_COLORS = [
        0x0a0a1a, // void_ground
        0x1a1a2e, // void_ground_corrupted
        0x1e1e3f, // void_platform
        0x1e1e3f, // void_platform_edge_l
        0x1e1e3f, // void_platform_edge_r
        0x1a1a2e, // void_star_dense
        0x2a1a3e, // void_debris
        0x00ffcc, // void_glitch_h
        0x00ffcc, // void_glitch_v
        0x0a0a1a, // void_dissolution
        0x6600cc, // void_portal_glow
        0x050510, // void_wall
        0xcc00ff, // void_glitch_corrupt
        0x00cc66, // void_data_stream
      ]
      const g = this.make.graphics({ add: false })
      VOID_COLORS.forEach((color, i) => {
        g.fillStyle(color)
        g.fillRect(i * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)
        g.lineStyle(1, 0x000000, 0.25)
        g.strokeRect(i * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)
      })
      g.generateTexture(VOID_TILESET_KEY, TILE_SIZE * VOID_COLORS.length, TILE_SIZE)
      g.destroy()
    }

    // Wasteland tileset stub — 14 tiles (14 cols × 1 row, 672×48)
    // Colours match the styled wasteland_tiles.png generated by generate-tilesets.js
    if (!this.textures.exists(WASTELAND_TILESET_KEY)) {
      const WASTELAND_COLORS = [
        0xa07820, // waste_ground
        0x8b6914, // waste_ground_heavy
        0x9a9a8a, // waste_concrete
        0x7a6028, // waste_rubble
        0x4a5a20, // waste_dead_grass
        0x8b3a1a, // waste_rusted_pipe
        0x5a4030, // waste_server_rack
        0xffcc00, // waste_caution_tape
        0xffcc00, // waste_warning_sign
        0x2060a0, // waste_azure_logo
        0x6a6a5a, // waste_wire_fence
        0x1a1a1a, // waste_wall
        0x342616, // waste_dead_tree
        0xb47828, // waste_broken_sign
      ]
      const g = this.make.graphics({ add: false })
      WASTELAND_COLORS.forEach((color, i) => {
        g.fillStyle(color)
        g.fillRect(i * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)
        g.lineStyle(1, 0x000000, 0.25)
        g.strokeRect(i * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)
      })
      g.generateTexture(WASTELAND_TILESET_KEY, TILE_SIZE * WASTELAND_COLORS.length, TILE_SIZE)
      g.destroy()
    }

    if (!this.textures.exists('player')) {
      const g = this.make.graphics({ add: false })
      g.fillStyle(0x5599ff)
      g.fillRect(8, 8, 16, 22)
      g.fillStyle(0xffcc88)
      g.fillRect(8, 0, 16, 14)
      g.generateTexture('player', 32, 32)
      g.destroy()
    }

    if (!this.textures.exists('npc_default')) {
      const g = this.make.graphics({ add: false })
      g.fillStyle(0xff9944)
      g.fillRect(8, 8, 16, 22)
      g.fillStyle(0xffcc88)
      g.fillRect(8, 0, 16, 14)
      g.generateTexture('npc_default', 32, 32)
      g.destroy()
    }

    if (!this.textures.exists('azure_terminal')) {
      const g = this.make.graphics({ add: false })
      g.fillStyle(0x0078d4)
      g.fillRect(4, 4, 40, 40)
      g.fillStyle(0x50c8ff)
      g.fillRect(8, 8, 32, 8)
      g.fillRect(8, 20, 20, 4)
      g.generateTexture('azure_terminal', TILE_SIZE, TILE_SIZE)
      g.destroy()
    }

    if (!this.textures.exists('throttlemaster_hooded')) {
      const g = this.make.graphics({ add: false })
      g.fillStyle(0x1a1a2e)
      g.fillRect(8, 8, 16, 22)
      g.fillStyle(0x16213e)
      g.fillRect(8, 0, 16, 14)
      g.fillStyle(0x00ff88, 0.6)
      g.fillRect(10, 4, 12, 4)
      g.generateTexture('throttlemaster_hooded', 32, 32)
      g.destroy()
    }
  }

  create(data = {}) {
    this.cameras.main.setBackgroundColor('#2d4a1e')

    // Generate stub textures first — must happen in create(), not preload(),
    // so that the renderer is in its active state.
    this._generateStubTextures()

    this.dialog       = new DialogBox(this)
    this.choiceMenu   = new Menu(this)
    this._menu        = new Menu(this)
    this._interacting = false
    this._transitioning = false
    this._lastTravelDenialToken = null
    this._facing      = 'down'
    this._stepsSinceEncounter = 0
    this._totalSteps  = 0

    // Tile-step state machine
    this._moveState    = 'idle'  // 'idle' | 'stepping' | 'bumping'
    this._moveProgress = 0
    this._fromX        = 0
    this._fromY        = 0
    this._toX          = 0
    this._toY          = 0
    this._bufferedDir  = null

    // Bump state
    this._bumpProgress = 0
    this._bumpFromX    = 0
    this._bumpFromY    = 0
    this._bumpToX      = 0
    this._bumpToY      = 0

    // Transition state
    this._transitioning = false
    this._entryDir    = data.entryDirection || null

    const regionId = this._regionId || GameState.player.location || 'localhost_town'
    const resolvedRegionId = this._setupMap(regionId)

    this._setupNpcSprites()
    this._setupPlayer()
    this._setupInput()
    this._setupCamera()
    this.setupPauseKey()
    this._buildInteractionLookup()

    this._onRegionEnter(resolvedRegionId)

    this._setupThrottlemasterGhost()

    this._hud = new HUD(this)
  }

  // -------------------------------------------------------------------------
  // THROTTLEMASTER ghostly sprite — Act 2 crisis flicker appearance
  // Shows a 2-tile hooded figure that vanishes on player approach.
  // -------------------------------------------------------------------------
  _setupThrottlemasterGhost() {
    const act = GameState.story?.act ?? 1
    const alreadySeen = GameState.story?.flags?.throttlemaster_act2_seen
    if (act !== 2 || alreadySeen) {
      this._ghostSprite = null
      return
    }

    const ghostX = 8 * TILE_SIZE + TILE_SIZE / 2
    const ghostY = 3 * TILE_SIZE + TILE_SIZE / 2
    this._ghostSprite = this.add.image(ghostX, ghostY, 'throttlemaster_hooded').setDepth(5)
    this._ghostSprite.setVisible(false)
    this._ghostFlickerTimer = 0
    this._ghostVisible = false
  }

  _updateThrottlemasterGhost() {
    if (!this._ghostSprite) return

    this._ghostFlickerTimer++

    // Appear briefly every 180 frames (~3 seconds at 60fps)
    if (!this._ghostVisible && this._ghostFlickerTimer >= 180) {
      this._ghostSprite.setVisible(true)
      this._ghostVisible = true
      this._ghostFlickerTimer = 0
    }

    // Disappear after 30 frames (~0.5 seconds)
    if (this._ghostVisible && this._ghostFlickerTimer >= 30) {
      this._ghostSprite.setVisible(false)
      this._ghostVisible = false
      this._ghostFlickerTimer = 0
    }

    // Vanish permanently if player gets close
    if (this._ghostVisible && this._player) {
      const dist = Math.hypot(
        this._player.x - this._ghostSprite.x,
        this._player.y - this._ghostSprite.y,
      )
      if (dist < TILE_SIZE * 3) {
        this._ghostSprite.setVisible(false)
        this._ghostSprite.destroy()
        this._ghostSprite = null
        if (!GameState.story.flags) GameState.story.flags = {}
        GameState.story.flags.throttlemaster_act2_seen = true
        markDirty()
      }
    }
  }

  _onRegionEnter(regionId) {
    if (GameState.player.location !== regionId) {
      GameState.player.location = regionId
      markDirty()
    }

    // Unlock fast travel terminal on first visit
    const region = getRegionById(regionId)
    if (region?.hasFastTravel) {
      const terminalFlag = `terminal_unlocked_${regionId}`
      if (!GameState.story.flags[terminalFlag]) {
        GameState.story.flags[terminalFlag] = true
        markDirty()
      }
    }

    // Viral Wave — scripted 3-encounter sequence on first Production Plains entry in Act 2
    if (shouldTriggerViralWave(GameState.story.act, regionId, GameState.story.flags)) {
      if (this._triggerViralWave()) return  // BattleScene takes over; skip further region-enter logic
    }

    // 3am scene — fires once after viral wave completes
    if (shouldTriggerThreeAmScene(GameState.story.flags)) {
      this._interacting = true
      this.dialog.show([
        'Your phone buzzes. Then again.',
        "The on-call rotation doesn't care\nthat you just went to bed.",
        'You stare at the ceiling.',
        'The alerts keep coming.',
        '...you get up.',
      ], () => {
        GameState.story.flags.three_am_scene_complete = true
        markDirty()
        this._interacting = false
      })
    }

    this.playBgm(regionId)
  }

  // Launches the next encounter in the viral-wave scripted sequence.
  // Returns true when a battle is started; false when the final encounter
  // already resolved and we only needed to set viral_wave_complete.
  // Stage is stored in GameState.story.flags.viral_wave_stage (0-based index
  // into VIRAL_WAVE.encounters), so it survives scene restarts.
  _triggerViralWave() {
    const wave  = getViralWave()
    const stage = GameState.story.flags.viral_wave_stage ?? 0

    if (stage >= wave.encounters.length) {
      // All encounters resolved — mark the sequence complete so the 3am scene can fire.
      GameState.story.flags.viral_wave_complete = true
      markDirty()
      return false
    }

    GameState.story.flags.viral_wave_stage = stage + 1
    markDirty()

    const encounterId = wave.encounters[stage].id
    const encounter   = getEncounterById(encounterId)
    this.scene.start('BattleScene', {
      mode:         BATTLE_MODES.SCRIPTED,
      opponent:     encounter ?? { id: encounterId, name: encounterId, domain: 'observability', hp: 50, maxHp: 50, difficulty: 3 },
      slaTimer:     encounter?.sla ?? 8,
      originRegion: this._regionId,
      returnScene:  'WorldScene',
    })
    return true
  }

  _setupMap(regionId) {
    const mapKey = this.cache.tilemap.exists(regionId) ? regionId : 'localhost_town'
    this._regionId = mapKey

    this._map = this.make.tilemap({ key: mapKey })
    const tilesets = []

    // Register the Kenney Urban tileset if this map uses it
    if (this._map.tilesets.some(ts => ts.name === 'kenney_urban') && this.textures.exists(KENNEY_URBAN_KEY)) {
      const kenneyTs = this._map.addTilesetImage('kenney_urban', KENNEY_URBAN_KEY, TILE_SIZE, TILE_SIZE, 0, 0)
      if (kenneyTs) tilesets.push(kenneyTs)
    }

    // Fallback: register stub_tiles if this map uses it (non-Kenney maps)
    if (this._map.tilesets.some(ts => ts.name === 'stub_tiles')) {
      const stubTileset = this._map.addTilesetImage('stub_tiles', TILESET_KEY, TILE_SIZE, TILE_SIZE, 0, 0)
      if (stubTileset) tilesets.push(stubTileset)
    }

    // Safety fallback: if no tilesets registered (e.g. kenney_urban failed to load),
    // fall back to stub_tiles so createLayer() doesn't break
    if (tilesets.length === 0) {
      const fallbackTs = this._map.addTilesetImage('stub_tiles', TILESET_KEY, TILE_SIZE, TILE_SIZE, 0, 0)
      if (fallbackTs) tilesets.push(fallbackTs)
    }
    // Tech regions carry a second tileset for server rooms, offices, and data centres
    const isTech = TECH_TILESET_REGIONS.has(mapKey)
    if (isTech) {
      const techTileset = this._map.addTilesetImage('kenney_tech_office', TECH_TILESET_KEY, TILE_SIZE, TILE_SIZE, 0, 0)
      if (techTileset) tilesets.push(techTileset)
    }
    // Void regions carry the void_tiles tileset (space/void biome)
    if (VOID_TILESET_REGIONS.has(mapKey)) {
      const voidTileset = this._map.addTilesetImage('void_tiles', VOID_TILESET_KEY, TILE_SIZE, TILE_SIZE, 0, 0)
      if (voidTileset) tilesets.push(voidTileset)
    }
    // Wasteland regions carry the wasteland_tiles tileset (derelict infrastructure biome)
    if (WASTELAND_TILESET_REGIONS.has(mapKey)) {
      const wastelandTileset = this._map.addTilesetImage('wasteland_tiles', WASTELAND_TILESET_KEY, TILE_SIZE, TILE_SIZE, 0, 0)
      if (wastelandTileset) tilesets.push(wastelandTileset)
    }
    // Register any Ninja Adventure tilesets declared by this map.
    // The four PNG files are preloaded unconditionally in preload() because
    // they are small (~3 KB each) and knowing which tilesets a map uses
    // requires the tilemap to already be constructed.
    for (const name of NINJA_TILESETS) {
      if (this._map.tilesets.some(ts => ts.name === name) && this.textures.exists(name)) {
        const ts = this._map.addTilesetImage(name, name, TILE_SIZE, TILE_SIZE, 0, 0)
        if (ts) tilesets.push(ts)
      }
    }

    this._groundLayer  = this._map.createLayer('Ground',  tilesets, 0, 0)
    this._objectsLayer = this._map.createLayer('Objects', tilesets, 0, 0)

    this._collisionLayer = this._map.createLayer('Collision', tilesets, 0, 0)
    if (this._collisionLayer) {
      this._collisionLayer.setVisible(false)
      this._collisionLayer.setCollisionByExclusion([0])
    } else {
      console.warn(`[WorldScene] 'Collision' layer missing from map '${mapKey}' — collision detection disabled.`)
    }

    this._overlayLayer = this._map.createLayer('Overlay', tilesets, 0, 0)
    if (this._overlayLayer) {
      this._overlayLayer.setDepth(10)
    } else {
      console.warn(`[WorldScene] 'Overlay' layer missing from map '${mapKey}' — overlay rendering disabled.`)
    }

    const npcLayer = this._map.getObjectLayer('NPCs')
    this._npcDefs  = npcLayer ? npcLayer.objects : []
    return mapKey
  }

  _setupNpcSprites() {
    this._npcSprites = []
    // Tiles occupied by NPC sprites — player cannot walk into them.
    this._blockedNpcTiles = new Set()

    // Pre-compute per-act state used across the loop.
    const act                = GameState.story?.act ?? 1
    const kristofferRegionId = getKristofferLocation(act)

    for (const def of this._npcDefs) {
      // Only suppress NPCs that have an explicit appearance entry whose
      // appearsInAct has not been reached yet.  NPCs without an entry are
      // default/Act-1 NPCs and are always visible.
      const appearance = getNpcAppearance(def.name)
      if (appearance && appearance.appearsInAct > act) continue

      // Kristoffer NPC: only show in the region he's assigned to for this act
      if (def.name === 'kristoffer' && kristofferRegionId !== this._regionId) continue

      const cx     = def.x + def.width / 2
      const cy     = def.y + def.height / 2

      // Resolve texture key: prefer the trainer's spriteKey when the sheet was
      // loaded successfully; fall back to the stub NPC texture otherwise.
      let key = 'npc_default'
      if (def.name === 'azure_terminal') {
        key = 'azure_terminal'
      } else {
        const trainer = getTrainerById(def.name)
        if (trainer?.spriteKey && this.textures.exists(trainer.spriteKey)) {
          key = trainer.spriteKey
        }
      }

      // Use a sprite for walk-cycle sheets, plain image for static stubs.
      const isSheet = !STUB_TEXTURE_KEYS.has(key)
      const sprite  = isSheet
        ? this.add.sprite(cx, cy, key, 1).setDepth(CHAR_DEPTH)  // frame 1 = idle-down
        : this.add.image(cx, cy, key).setDepth(CHAR_DEPTH)

      // Block the tile this NPC occupies so the player can't walk through it.
      const npcTileX = Math.floor(cx / TILE_SIZE)
      const npcTileY = Math.floor(cy / TILE_SIZE)
      this._blockedNpcTiles.add(`${npcTileX},${npcTileY}`)

      this._npcSprites.push({ def, sprite })
    }
  }

  _setupPlayer() {
    const mapW = this._map.width
    const mapH = this._map.height
    const maxInteriorTile = clampTileToInterior(mapW - 1, mapH - 1, mapW, mapH)
    let spawnTileX = GameState.player.tileX ?? 5
    let spawnTileY = GameState.player.tileY ?? 10

    if (this._entryDir === 'west')       { spawnTileX = 1;              spawnTileY = Math.floor(mapH / 2) }
    else if (this._entryDir === 'east')  { spawnTileX = maxInteriorTile.tileX; spawnTileY = Math.floor(mapH / 2) }
    else if (this._entryDir === 'north') { spawnTileX = Math.floor(mapW / 2); spawnTileY = 1 }
    else if (this._entryDir === 'south') { spawnTileX = Math.floor(mapW / 2); spawnTileY = maxInteriorTile.tileY }

    const clamped = clampTileToInterior(spawnTileX, spawnTileY, mapW, mapH)
    spawnTileX = clamped.tileX
    spawnTileY = clamped.tileY

    if (!this._isTileWalkable(spawnTileX, spawnTileY)) {
      const fallback = findNearestWalkableTile(
        spawnTileX, spawnTileY, mapW, mapH,
        (x, y) => this._isTileWalkable(x, y),
      )
      if (fallback) {
        spawnTileX = fallback.tileX
        spawnTileY = fallback.tileY
      }
    }

    const startX = spawnTileX * TILE_SIZE + TILE_SIZE / 2
    const startY = spawnTileY * TILE_SIZE + TILE_SIZE / 2

    // Use the Ninja Adventure hero sheet when it has been loaded; fall back to
    // the procedurally generated stub 'player' texture otherwise.
    const playerTextureKey = this.textures.exists(PLAYER_SPRITE_KEY)
      ? PLAYER_SPRITE_KEY
      : 'player'
    this._playerUseSheet = playerTextureKey !== 'player'
    this._player = this._playerUseSheet
      ? this.physics.add.sprite(startX, startY, playerTextureKey, 1)
      : this.physics.add.sprite(startX, startY, playerTextureKey)
    this._player.setDepth(CHAR_DEPTH)

    const persistedSpawn = persistPlayerTile(spawnTileX, spawnTileY)
    this._tileX = persistedSpawn.tileX
    this._tileY = persistedSpawn.tileY
    if (this._collisionLayer) {
      this.physics.add.collider(this._player, this._collisionLayer)
    }
    this.physics.world.setBounds(0, 0, this._map.widthInPixels, this._map.heightInPixels)

    this._setupPlayerAnimations(playerTextureKey)
  }

  // Register a walk-cycle animation for each direction using the 4-row × 3-col
  // ninja spritesheet layout:  Row 0 = down, 1 = right, 2 = left, 3 = up.
  // Animations are shared across scene restarts (Phaser deduplicates by key).
  _setupPlayerAnimations(textureKey) {
    if (!this._playerUseSheet) return
    const DIRS = [
      { dir: 'down',  startFrame: 0 },
      { dir: 'right', startFrame: 3 },
      { dir: 'left',  startFrame: 6 },
      { dir: 'up',    startFrame: 9 },
    ]
    for (const { dir, startFrame } of DIRS) {
      const key = `player_walk_${dir}`
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers(textureKey, {
            start: startFrame,
            end:   startFrame + 2,
          }),
          frameRate: 8,
          repeat: -1,
        })
      }
    }
  }

  // Idle frame index for each facing direction (middle column of each row).
  static IDLE_FRAME = { down: 1, right: 4, left: 7, up: 10 }

  // Update the player sprite animation to match the current movement state.
  _updatePlayerAnim() {
    if (!this._playerUseSheet || !this._player) return
    if (this._moveState === 'stepping') {
      const animKey = `player_walk_${this._facing}`
      if (this._player.anims.currentAnim?.key !== animKey) {
        this._player.play(animKey, true)
      }
    } else {
      // idle or bumping — freeze on the standing frame for the current direction
      this._player.anims.stop()
      this._player.setFrame(WorldScene.IDLE_FRAME[this._facing] ?? 1)
    }
  }

  _syncTileFromPlayerPosition() {
    const persisted = syncPlayerTileFromPixels(
      this._player.x,
      this._player.y,
      TILE_SIZE,
      this._map.width,
      this._map.height,
    )
    this._tileX = persisted.tileX
    this._tileY = persisted.tileY
  }

  _setupInput() {
    this._cursors  = this.input.keyboard.createCursorKeys()
    this._keyZ     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this._keyX     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
    this._keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this._keyE     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this._keyI     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)
  }

  _setupCamera() {
    this.cameras.main.setBounds(0, 0, this._map.widthInPixels, this._map.heightInPixels)
    this.cameras.main.startFollow(this._player, true)
  }

  update(time, delta) {
    if (this._transitioning) return
    if (this._menu.isActive) {
      this._handleMenuInput()
      return
    }
    const dialogOrMenu = this._interacting || this.dialog.isActive
    GameState._session.dialogActive = dialogOrMenu
    if (dialogOrMenu) {
      this._handleDialogInput()
      return
    }
    this._updateMovement(delta)
    this._updatePlayerAnim()
    this._updateThrottlemasterGhost()
    this._checkEdgeTransition()
  }

  get _isRunning() {
    return this._keyZ.isDown && canRun()
  }

  _getInputDirection() {
    return resolveDirection(
      this._cursors.up.isDown,
      this._cursors.down.isDown,
      this._cursors.left.isDown,
      this._cursors.right.isDown,
    )
  }

  _isTileWalkable(tileX, tileY) {
    if (this._blockedNpcTiles?.has(`${tileX},${tileY}`)) return false
    return isTileWalkable(tileX, tileY, this._map.width, this._map.height,
      (tx, ty) => this._collisionLayer ? this._collisionLayer.getTileAt(tx, ty) : null)
  }

  _startStep(targetTileX, targetTileY) {
    this._moveState    = 'stepping'
    this._moveProgress = 0
    this._fromX        = this._player.x
    this._fromY        = this._player.y
    this._toX          = targetTileX * TILE_SIZE + TILE_SIZE / 2
    this._toY          = targetTileY * TILE_SIZE + TILE_SIZE / 2
    this._tileX        = targetTileX
    this._tileY        = targetTileY
    commitStep(targetTileX, targetTileY)
  }

  _updateMovement(delta) {
    if (this._moveState === 'bumping') {
      const result = updateBump(this._bumpProgress, delta,
        this._bumpFromX, this._bumpFromY, this._bumpToX, this._bumpToY)
      this._bumpProgress = result.progress
      this._player.x = result.complete ? result.snapX : result.x
      this._player.y = result.complete ? result.snapY : result.y
      if (result.complete) this._moveState = 'idle'
      return
    }

    if (this._moveState === 'stepping') {
      const result = updateStep(this._moveProgress, delta,
        this._fromX, this._fromY, this._toX, this._toY, this._isRunning)
      this._moveProgress = result.progress
      this._player.x = result.x
      this._player.y = result.y

      if (result.remaining <= MOVEMENT.INPUT_BUFFER_WINDOW_MS) {
        // Always overwrite — clears the buffer when no key is held, preventing
        // an extra step from a quick tap that was buffered but released before
        // the step finished (the two-tiles-at-once bug).
        this._bufferedDir = this._getInputDirection()
      }

      if (result.complete) {
        this._moveState = 'idle'
        this._onStepComplete()
        if (this._transitioning) return
        if (this._bufferedDir) {
          const dir = this._bufferedDir
          this._bufferedDir = null
          this._facing = dir
          const { dx, dy } = DIR_OFFSETS[dir]
          const targetX = this._tileX + dx
          const targetY = this._tileY + dy
          if (this._isTileWalkable(targetX, targetY)) {
            this._startStep(targetX, targetY)
          } else {
            this._playBumpAnimation(dir)
          }
        }
      }
      return
    }

    // 'idle' — check for new input
    const dir = this._getInputDirection()
    if (dir) {
      this._facing = dir
      const { dx, dy } = DIR_OFFSETS[dir]
      const targetX = this._tileX + dx
      const targetY = this._tileY + dy
      if (this._isTileWalkable(targetX, targetY)) {
        this._startStep(targetX, targetY)
      } else {
        this._playBumpAnimation(dir)
      }
      return
    }

    if (Phaser.Input.Keyboard.JustDown(this._keyZ) || Phaser.Input.Keyboard.JustDown(this._keyEnter)) {
      this._tryInteract()
    }

    if (Phaser.Input.Keyboard.JustDown(this._keyE)) {
      this.scene.pause()
      this.scene.launch('EmblemScene', { returnSceneKey: 'WorldScene' })
    }

    if (Phaser.Input.Keyboard.JustDown(this._keyI)) {
      this.scene.pause()
      this.scene.launch('InventoryScene', { returnSceneKey: 'WorldScene' })
    }
  }

  _playBumpAnimation(dir) {
    const { dx, dy } = DIR_OFFSETS[dir]
    this._moveState    = 'bumping'
    this._bumpProgress = 0
    this._bumpFromX    = this._player.x
    this._bumpFromY    = this._player.y
    this._bumpToX      = this._player.x + dx * MOVEMENT.BUMP_DISTANCE_PX
    this._bumpToY      = this._player.y + dy * MOVEMENT.BUMP_DISTANCE_PX
  }

  _onStepComplete() {
    onStepComplete()
    this._checkDoorInteraction()
    this._stepsSinceEncounter++
    this._totalSteps++
    this._checkEncounterStep()
    this._checkTransitionTile()
    this._hud?.refresh()
  }

  _handleDialogInput() {
    if (this.dialog.isChoiceMode) {
      if (Phaser.Input.Keyboard.JustDown(this._cursors.up))   this.dialog.moveChoice(-1)
      if (Phaser.Input.Keyboard.JustDown(this._cursors.down)) this.dialog.moveChoice(1)
      const confirm = Phaser.Input.Keyboard.JustDown(this._keyZ)
        || Phaser.Input.Keyboard.JustDown(this._keyEnter)
      if (confirm) this.dialog.confirmChoice()
      return
    }
    const confirm = Phaser.Input.Keyboard.JustDown(this._keyZ)
      || Phaser.Input.Keyboard.JustDown(this._keyEnter)

    // Choice menu is open — D-pad navigates, A confirms, no B-cancel.
    if (this.choiceMenu.isActive) {
      if (Phaser.Input.Keyboard.JustDown(this._cursors.up))   this.choiceMenu.moveUp()
      if (Phaser.Input.Keyboard.JustDown(this._cursors.down)) this.choiceMenu.moveDown()
      if (confirm) this.choiceMenu.confirm()
      return
    }

    if (confirm)                                         this.dialog.advance()
    else if (Phaser.Input.Keyboard.JustDown(this._keyX)) this.dialog.skip()
  }

  _handleMenuInput() {
    this._player.setVelocity(0, 0)
    if (Phaser.Input.Keyboard.JustDown(this._cursors.up))        this._menu.moveUp()
    else if (Phaser.Input.Keyboard.JustDown(this._cursors.down)) this._menu.moveDown()
    else if (Phaser.Input.Keyboard.JustDown(this._keyZ)
          || Phaser.Input.Keyboard.JustDown(this._keyEnter))     this._menu.confirm()
    else if (Phaser.Input.Keyboard.JustDown(this._keyX))         this._menu.cancel()
  }

  _tryInteract() {
    const { dx, dy } = DIR_OFFSETS[this._facing]
    const facingTileX  = this._tileX + dx
    const facingTileY  = this._tileY + dy
    const facingWorldX = facingTileX * TILE_SIZE + TILE_SIZE / 2
    const facingWorldY = facingTileY * TILE_SIZE + TILE_SIZE / 2

    for (const { def } of this._npcSprites) {
      const cx = def.x + def.width  / 2
      const cy = def.y + def.height / 2
      if (Math.abs(facingWorldX - cx) < TILE_SIZE && Math.abs(facingWorldY - cy) < TILE_SIZE) {
        this._interactWithNpc(def.name)
        return
      }
    }

    const facingInteraction = this._interactionLookup?.get(`${facingTileX},${facingTileY}`)
    if (facingInteraction && facingInteraction.type !== 'door') {
      this._resolveInteraction(facingInteraction)
      return
    }

    this._checkInteractionTile()
  }

  _buildInteractionLookup() {
    this._interactionLookup = new Map()
    const region = this._regionId
    const regionInteractions = getInteractionsBy('region', region)
    for (const interaction of regionInteractions) {
      this._interactionLookup.set(`${interaction.tileX},${interaction.tileY}`, interaction)
    }
  }

  _checkInteractionTile() {
    const tileX = Math.floor(this._player.x / TILE_SIZE)
    const tileY = Math.floor(this._player.y / TILE_SIZE)
    const interaction = this._interactionLookup?.get(`${tileX},${tileY}`)
    if (interaction && interaction.type !== 'door' && interaction.type !== 'npc') {
      this._resolveInteraction(interaction)
    }
  }

  _resolveInteraction(interaction) {
    const { type } = interaction

    if (type === 'sign' || type === 'flavor') {
      this._interacting = true
      this.dialog.show(interaction.dialog, () => { this._interacting = false })
      return
    }

    if (type === 'chest') {
      if (GameState.story.flags[interaction.flagKey]) return
      this._interacting = true
      GameState.story.flags[interaction.flagKey] = true
      addItem(interaction.item.tab, interaction.item.id, interaction.item.qty)
      this.dialog.show(interaction.dialog, () => { this._interacting = false })
      return
    }

    if (type === 'door') {
      const { requiresItem, flagKey, lockedDialog, unlockedDialog } = interaction
      if (GameState.story.flags[flagKey]) return
      this._interacting = true
      if (hasItem(requiresItem.tab, requiresItem.id)) {
        GameState.story.flags[flagKey] = true
        markDirty()
        this.dialog.show(unlockedDialog, () => { this._interacting = false })
      } else {
        this.dialog.show(lockedDialog, () => { this._interacting = false })
      }
    }
  }

  _checkDoorInteraction() {
    const tileX = Math.floor(this._player.x / TILE_SIZE)
    const tileY = Math.floor(this._player.y / TILE_SIZE)
    const interaction = this._interactionLookup?.get(`${tileX},${tileY}`)
    if (interaction && interaction.type === 'door') {
      this._resolveInteraction(interaction)
    }
  }

  _interactWithNpc(npcName) {
    this._interacting = true

    // Set the dialog box speaker — name + portrait drawn from trainer data when
    // available. Terminals show no speaker (clearSpeaker resets to plain text layout).
    const speakerTrainer = getTrainerById(npcName)
    const isTerminal = npcName === 'azure_terminal' || npcName === 'hosting_terminal'
    if (isTerminal) {
      this.dialog.clearSpeaker()
    } else {
      const speakerName = speakerTrainer?.name ?? this._formatNpcName(npcName)
      this.dialog.setSpeaker(speakerName, `portrait_${npcName}`)
    }

    if (npcName === 'margaret') {
      this._interactMargaret()
      return
    }

    if (npcName === 'dagny_dba') {
      this._interactDagny()
      return
    }

    if (npcName === 'intern_ivan') {
      this._resolveQuestNpc('intern_ivan_roaming')
      return
    }

    if (npcName === 'architect_alice') {
      this._resolveQuestNpc('architect_alice_design')
      return
    }

    if (npcName === 'tech_debt_auditor') {
      this._interactTechDebtAuditor()
      return
    }

    if (npcName === 'azure_terminal') {
      // Unlock terminal flag on interaction
      const terminalFlag = `terminal_unlocked_${this._regionId}`
      if (!GameState.story.flags[terminalFlag]) {
        GameState.story.flags[terminalFlag] = true
        markDirty()
      }

      const terminals = getDiscoveredTerminals(GameState.story.flags)
      const hasOtherTerminals = terminals.filter(id => id !== this._regionId).length > 0

      if (hasOtherTerminals) {
        const pages = getStoryById('npc_azure_terminal')?.pages ?? ['> AZURE TERMINAL v2.0']
        this.dialog.show(pages, () => {
          this._openFastTravelMenu()
        })
      } else {
        const pages = getStoryById('npc_azure_terminal')?.pages ?? ['> AZURE TERMINAL v2.0']
        this.dialog.show(pages, () => {
          this._interacting = false
          this.scene.pause()
          this.scene.launch('SkillManagementScene', { returnScene: 'WorldScene' })
        })
      }
      return
    }

    if (npcName === 'hosting_terminal') {
      const hasCoop = hasItem('keyItems', 'cross_origin_opener_policy')
      const hasCoep = hasItem('keyItems', 'cross_origin_embedder_policy')
      if (!hasCoop || !hasCoep) {
        this.dialog.show(['The terminal is behind a locked door.\nYou need the right credentials.'], () => {
          this._interacting = false
        })
        return
      }
      if (!GameState.story.flags.found_hosting_terminal) {
        const pages = getStoryById('terminal_hosting')?.pages ?? ['> ...']
        this.dialog.show(pages, () => {
          GameState.story.flags.found_hosting_terminal = true
          markDirty()
          this._interacting = false
        })
      } else {
        const pages = getStoryById('terminal_hosting_pipeline')?.pages ?? ['> ...']
        this.dialog.show(pages, () => {
          GameState.story.flags.saw_deployment_pipeline = true
          markDirty()
          this._interacting = false
        })
      }
      return
    }

    if (npcName === 'west_eu_2_wilhelm') {
      const storyId = GameState.story.flags.found_hosting_terminal
        ? 'npc_west_eu_2_wilhelm_post_terminal'
        : 'npc_west_eu_2_wilhelm'
      const entry   = getStoryById(storyId)
      const trainer = getTrainerById(npcName)
      const lines   = this._resolveNpcDialog(entry, trainer)
      this.dialog.show(lines, () => { this._interacting = false })
      return
    }

    if (npcName === 'kristoffer') {
      // Kristoffer's dialog reacts to player shame — use the shame-aware resolver
      const shameLines = getKristofferShameDialog(GameState.player.shamePoints ?? 0)
      const fallback = getStoryById('npc_kristoffer')?.pages ?? ['...']
      const lines = shameLines.length > 0 ? shameLines : fallback
      this.dialog.show(lines, () => { this._interacting = false })
      return
    }

    const entry   = getStoryById(`npc_${npcName}`)
    const trainer = getTrainerById(npcName)
    const lines   = this._resolveNpcDialog(entry, trainer)

    // Gate-blocking NPCs: check if this NPC guards an unresolved hard gate.
    // If so, present available skill choices first; fall through to battle/dialog otherwise.
    const gateForNpc = getAllGates().find(g => g.npcId === npcName)
    if (gateForNpc && !isGateResolved(gateForNpc.id, GameState.story.flags)) {
      this._resolveGateNpc(gateForNpc, lines)
      return
    }

    // Battle-capable trainers: show intro dialog then offer the fight.
    if (trainer?.hp && trainer?.deck?.length > 0) {
      const alreadyDefeated = GameState.story.flags[`trainer_${npcName}_defeated`]
      if (alreadyDefeated) {
        // Post-battle dialog (lose/win reaction)
        const postLines = trainer.winDialog ?? lines
        this.dialog.show(postLines, () => { this._interacting = false })
        return
      }

      // Look up gym data if this trainer is a gym leader
      const gym = getGymsBy('leader', npcName)[0] ?? null

      const introLines = Array.isArray(trainer.introDialog)
        ? trainer.introDialog
        : (typeof trainer.introDialog === 'string' ? [trainer.introDialog] : lines)
      this.dialog.show(introLines, () => {
        this.choiceMenu.open(
          ['Fight!', 'Not now.'],
          (idx) => {
            if (idx === 0) {
              this.scene.start('BattleScene', {
                mode:             BATTLE_MODES.ENGINEER,
                opponent:         trainer,
                telegraphedMove:  trainer.telegraphs?.[0] ?? null,
                gymId:            gym?.id ?? null,
                gymMechanic:      gym?.mechanic ?? null,
                gymMechanicConfig: gym?.mechanicConfig ?? null,
                returnScene:      'WorldScene',
              })
            } else {
              this._interacting = false
            }
          },
          () => { this._interacting = false },
        )
      })
      return
    }

    this.dialog.show(lines, () => { this._interacting = false })
  }

  // Generic gate-NPC interaction. Shows the gate hint then presents the player's
  // available solutions as a skill-choice menu. Applies repDelta, shameDelta, and
  // the gate flag when a solution is selected.
  _resolveGateNpc(gate, introLines) {
    const learnedSkills  = GameState.skills.learned ?? []
    const available = getAvailableSolutions(gate.id, learnedSkills)

    if (available.length === 0) {
      // Player doesn't have any solution commands yet — show hint and exit
      const hintLines = introLines.length > 0 ? introLines : [gate.hintText ?? 'I need your help.']
      this.dialog.show(hintLines, () => { this._interacting = false })
      return
    }

    const choices = available.map(sol => sol.commandId)
    this.dialog.show(introLines.length > 0 ? introLines : [gate.hintText ?? 'I need your help.'], () => {
      this.choiceMenu.open(
        choices,
        (idx) => {
          const sol    = available[idx]
          const result = evaluateSolution(gate.id, sol.commandId)

          // Apply rep and shame deltas
          if (result.repDelta) {
            GameState.player.reputation = Math.max(0, Math.min(100,
              (GameState.player.reputation ?? 50) + result.repDelta))
          }
          if (result.shameDelta) {
            GameState.player.shamePoints = (GameState.player.shamePoints ?? 0) + result.shameDelta
          }

          // Set quest flag effect
          if (result.questFlagEffect) {
            GameState.story.flags[result.questFlagEffect] = true
          }

          // Resolve the gate if pathEffect is 'open'
          if (result.resolved && result.flag) {
            GameState.story.flags[result.flag] = true
          }

          markDirty()

          // Show confirmation line from story registry if available
          const confirmLines = getStoryById(`gate_resolved_${gate.id}`)?.pages
            ?? [`${sol.commandId} — done. You may pass.`]
          this.dialog.show(confirmLines, () => { this._interacting = false })
        },
        () => { this._interacting = false },
      )
    })
  }

  // Delegates to the pure StoryEngine resolver, then applies any state mutation
  // the engine flagged (technique acknowledgment flag). All decision logic lives
  // in StoryEngine — this method is rendering-layer glue only.
  _resolveNpcDialog(entry, trainer) {
    const { pages, setFlag } = resolveNpcDialog(entry, trainer, GameState)
    if (setFlag) {
      GameState.story.flags[setFlag] = true
      markDirty()
    }
    this._checkActTransition()
    return pages
  }

  // Check whether the current flags satisfy an act transition and, if so,
  // advance the act and show the title-card narration.
  _checkActTransition() {
    const transition = checkActTransition(GameState.story.act, GameState.story.flags)
    if (!transition) return
    GameState.story.act = transition.newAct
    markDirty()
    // Show act narration as a dialog then continue
    const titleLine = `${transition.titleCard}: ${transition.titleSub}`
    const pages = [titleLine, ...(transition.narration ?? [])]
    this._interacting = true
    this.dialog.show(pages, () => { this._interacting = false })
  }

  // Delegates variant/page selection to the pure StoryEngine helper.
  _resolveNpcPages(entry) {
    return resolveNpcPages(entry, GameState.player)
  }

  _checkEdgeTransition() {
    const px = this._player.x
    const py = this._player.y
    const mapW = this._map.widthInPixels
    const mapH = this._map.heightInPixels

    let direction = null
    if (px <= EDGE_MARGIN)               direction = 'west'
    else if (px >= mapW - EDGE_MARGIN)   direction = 'east'
    else if (py <= EDGE_MARGIN)          direction = 'north'
    else if (py >= mapH - EDGE_MARGIN)   direction = 'south'

    if (!direction) {
      this._lastTravelDenialToken = null
      return
    }

    const result = canTravel(this._regionId, direction, GameState)
    if (!result.target) {
      this._lastTravelDenialToken = null
      return
    }

    if (!result.allowed) {
      const denial = shouldShowTravelDenial(this._lastTravelDenialToken, this._regionId, direction, result)
      this._lastTravelDenialToken = denial.token
      if (!denial.shouldShow) return

      this._player.setVelocity(0, 0)
      this._interacting = true
      const denialText = this._resolveDenialText(result.reasonId, result.reasonParams)
      this.dialog.show([denialText], () => { this._interacting = false })
      // Push player back from edge so they don't re-trigger
      const pushback = TILE_SIZE
      if (direction === 'west')       this._player.x += pushback
      else if (direction === 'east')  this._player.x -= pushback
      else if (direction === 'north') this._player.y += pushback
      else if (direction === 'south') this._player.y -= pushback
      this._syncTileFromPlayerPosition()
      return
    }

    this._lastTravelDenialToken = null
    this._transitionToRegion(result.target, result.entry)
  }

  // Resolve a denial reasonId from the engine into display text via the story
  // registry. Falls back to a generic message if the story entry is missing.
  _resolveDenialText(reasonId, reasonParams) {
    const REASON_TO_STORY = {
      [DENIAL_REASONS.ACT_GATE]:       'region_under_construction',
      [DENIAL_REASONS.DUNGEON_POINTS]: 'dungeon_points_required',
      [DENIAL_REASONS.RESOURCE_LOCKS]: 'resource_locks_required',
      [DENIAL_REASONS.HARD_GATE]:      'region_gate_blocked',
    }
    const storyId = REASON_TO_STORY[reasonId]
    const entry   = storyId ? getStoryById(storyId) : null
    return entry?.pages?.[0] ?? 'You cannot go this way.'
  }

  // Converts an NPC ID to a title-cased display name for the dialog speaker label.
  // Example: 'intern_ivan' → 'Intern Ivan', 'dagny_dba' → 'Dagny Dba'
  _formatNpcName(npcId) {
    return npcId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // 4-frame stepped fade (0% → 34% → 67% → 100% black), not smooth
  _transitionToRegion(targetRegionId, entryDirection) {
    this._transitioning = true
    this._player.setVelocity(0, 0)

    const overlay = this.add.rectangle(
      CONFIG.WIDTH / 2,
      CONFIG.HEIGHT / 2,
      CONFIG.WIDTH, CONFIG.HEIGHT, 0x000000, 0,
    ).setDepth(100).setScrollFactor(0)

    let step = 0
    this.time.addEvent({
      delay: FADE_STEP_MS,
      repeat: FADE_STEPS.length - 1,
      callback: () => {
        overlay.setAlpha(FADE_STEPS[step])
        step++
        if (step >= FADE_STEPS.length) {
          GameState.player.location = targetRegionId
          markDirty()
          this.scene.restart({ entryDirection })
        }
      },
    })
  }

  _openFastTravelMenu() {
    const terminals = getDiscoveredTerminals(GameState.story.flags)
    const currentRegion = this._regionId

    // Filter out current region
    const destinations = terminals.filter(id => id !== currentRegion)
    if (destinations.length === 0) {
      this.dialog.show(['No other terminals discovered yet.'], () => {
        this._interacting = false
      })
      return
    }

    const menuItems = destinations.map(id => {
      const region = getRegionById(id)
      return region ? region.name : id
    })

    // D-pad selectable fast travel menu via Menu component.
    this._menu.show(menuItems, {
      title: '> AZURE TERMINAL — FAST TRAVEL',
      onSelect: (index) => {
        this._interacting = false
        if (canFastTravel(destinations[index], GameState.story.flags)) {
          this._transitionToRegion(destinations[index], null)
        }
      },
      onCancel: () => {
        this._interacting = false
      },
    })
  }

  _checkEncounterStep() {
    if (shouldTriggerEncounter(this._stepsSinceEncounter, this._isRunning)) {
      this._stepsSinceEncounter = 0
      // Use session step count as seed (resets each time WorldScene is created)
      const seed = this._totalSteps
      const encounter = encounterRoll(this._regionId, this._totalSteps, seed)
      if (encounter) {
        const enemyDef = getEncounterById(encounter.enemyId)
        if (enemyDef) {
          this.scene.start('BattleScene', {
            mode:         BATTLE_MODES.INCIDENT,
            opponent:     enemyDef,
            slaTimer:     enemyDef.sla ?? 10,
            originRegion: this._regionId,
            returnScene:  'WorldScene',
          })
        }
      }
    }
  }

  _checkTransitionTile() {
    const objectLayer = this._map.getObjectLayer('Transitions')
    if (!objectLayer) return

    const result = checkTransition(this._tileX, this._tileY, TILE_SIZE, objectLayer.objects)
    if (!result) return

    if (result.type === 'blocked') {
      this._interacting = true
      this.dialog.show([result.message], () => { this._interacting = false })
      return
    }

    this._startTransition(result.targetRegion, result.spawnX, result.spawnY)
  }

  _startTransition(targetRegion, spawnX, spawnY) {
    this._transitioning = true
    const overlay = this.add.rectangle(
      this.cameras.main.scrollX + CONFIG.WIDTH / 2,
      this.cameras.main.scrollY + CONFIG.HEIGHT / 2,
      CONFIG.WIDTH, CONFIG.HEIGHT, 0x000000
    ).setDepth(100).setScrollFactor(0).setAlpha(0)

    const steps = MOVEMENT.TRANSITION_FADE_STEPS
    let step = 0
    this.time.addEvent({
      delay:    MOVEMENT.TRANSITION_STEP_DELAY_MS,
      repeat:   steps.length - 1,
      callback: () => {
        overlay.setAlpha(steps[step])
        step++
        if (step >= steps.length) {
          applyTransition(targetRegion, spawnX, spawnY)
          this.scene.restart({ fromTransition: true })
        }
      },
    })
  }

  _interactMargaret() {
    if (isQuestCompleted('margaret_website', GameState.story.completedQuests)) {
      const lines = getCompletedDialog('margaret_website')
      this.dialog.show(lines, () => { this._interacting = false })
      return
    }

    const { started } = startQuest('margaret_website', GameState.story)
    if (started) markDirty()

    const stage = getCurrentStage('margaret_website', GameState.story)
    const choices = stage.choices.map(c => c.text)

    this.dialog.show(stage.dialog, () => {
      this.dialog.showChoices('What do you suggest?', choices, (idx) => {
        const result = resolveChoice('margaret_website', idx, GameState.story, GameState.player)
        if (!result) { this._interacting = false; return }
        this._applyQuestChoiceResult('margaret_website', result, stage)
      })
    })
  }

  _interactTechDebtAuditor() {
    const chain = [
      'tech_debt_cleanup_01', 'tech_debt_cleanup_02', 'tech_debt_cleanup_03',
      'tech_debt_cleanup_04', 'tech_debt_cleanup_05', 'tech_debt_cleanup_06',
      'tech_debt_cleanup_07', 'tech_debt_cleanup_08', 'tech_debt_cleanup_09',
      'tech_debt_cleanup_10',
    ]
    const currentQuestId = chain.find(id => !isQuestCompleted(id, GameState.story.completedQuests))
    if (!currentQuestId) {
      const lines = getCompletedDialog('tech_debt_cleanup_10')
      this.dialog.show(lines, () => { this._interacting = false })
      return
    }
    this._resolveQuestNpc(currentQuestId)
  }

  _resolveQuestNpc(questId) {
    const quest = getQuestById(questId)
    const isComplete = (quest?.completionFlag && GameState.story.flags[quest.completionFlag])
      || isQuestCompleted(questId, GameState.story.completedQuests)

    if (isComplete) {
      const lines = getCompletedDialog(questId)
      this.dialog.show(lines, () => { this._interacting = false })
      return
    }

    const { available, reason } = isQuestAvailable(questId, GameState.story)
    if (!available) {
      const msg = quest?.reminderDialog ?? [reason ?? "Come back later."]
      this.dialog.show(Array.isArray(msg) ? msg : [msg], () => { this._interacting = false })
      return
    }

    const { started } = startQuest(questId, GameState.story)
    if (started) markDirty()

    const stage = getCurrentStage(questId, GameState.story)
    if (!stage) { this._interacting = false; return }

    if (stage.requiresFlags && !stage.requiresFlags.every(f => GameState.story.flags[f])) {
      const msg = quest?.reminderDialog ?? ["Come back when you're ready."]
      this.dialog.show(Array.isArray(msg) ? msg : [msg], () => { this._interacting = false })
      return
    }

    const choices = stage.choices?.map(c => c.text) ?? []
    this.dialog.show(stage.dialog, () => {
      this.dialog.showChoices('What do you do?', choices, (idx) => {
        const result = resolveChoice(questId, idx, GameState.story, GameState.player)
        if (!result) { this._interacting = false; return }
        this._applyQuestChoiceResult(questId, result, stage)
      })
    })
  }

  _applyQuestChoiceResult(questId, result, stage) {
    const quest = getQuestById(questId)

    if (result.penalty && !result.stageReset) {
      if (result.penalty.type === 'hp' && result.penalty.value < 0) {
        GameState.player.hp = Math.max(1, GameState.player.hp + result.penalty.value)
      } else if (result.penalty.type === 'budget') {
        GameState.player.budget = Math.max(0, (GameState.player.budget || 0) + result.penalty.value)
      } else if (result.penalty.type === 'reputation') {
        GameState.player.reputation = Math.max(0, (GameState.player.reputation || 0) + result.penalty.value)
      }
    }
    if (result.repDelta) {
      GameState.player.reputation = Math.max(0, Math.min(100, (GameState.player.reputation || 0) + result.repDelta))
    }
    if (result.shameDelta) {
      GameState.player.shamePoints = (GameState.player.shamePoints || 0) + result.shameDelta
    }
    if (result.flag) {
      GameState.story.flags[result.flag] = true
    }
    if (result.itemReward) {
      addItem('tools', result.itemReward.id, result.itemReward.qty)
    }

    if (result.stageReset) {
      GameState.story.activeQuests[questId].stage = result.stageIndex
      markDirty()
      const respDialog = result.responseDialog.length > 0 ? result.responseDialog : (stage.wrongDialog ?? ["Try again."])
      this.dialog.show(respDialog, () => { this._interacting = false })
      return
    }

    let respDialog = result.responseDialog.length > 0
      ? result.responseDialog
      : (result.correct ? (stage.correctDialog ?? []) : (stage.wrongDialog ?? []))
    if (!respDialog.length) respDialog = ['OK.']

    if (result.correct) {
      if (result.xp > 0) grantXpOnce(`${questId}_stage_${result.stageIndex}_xp`, result.xp)
      const { questComplete } = advanceStage(questId, GameState.story)
      if (questComplete) {
        if (quest?.rewards?.xp > 0) grantXpOnce(`${questId}_completion_xp`, quest.rewards.xp)
        if (quest?.rewards?.technicalDebtClear) {
          GameState.player.technicalDebt = Math.max(0, (GameState.player.technicalDebt || 0) - quest.rewards.technicalDebtClear)
        }
        if (quest?.rewards?.reputation) {
          GameState.player.reputation = Math.min(100, (GameState.player.reputation || 0) + quest.rewards.reputation)
        }
        if (quest?.rewards?.items) {
          for (const item of quest.rewards.items) {
            addItem(item.tab ?? 'tools', item.id, item.qty)
          }
        }
        GameState.story.completedQuests.push(questId)
        markDirty()
        const transition = checkActTransition(GameState.story.act, GameState.story.flags)
        if (transition) {
          GameState.story.act = transition.toAct
          markDirty()
        }
      } else {
        markDirty()
      }
    } else {
      markDirty()
    }

    this.dialog.show(respDialog, () => { this._interacting = false })
  }

  _interactDagny() {
    const questId = 'do_not_touch'
    const quest = getQuestById(questId)

    if (quest?.completionFlag && GameState.story.flags[quest.completionFlag]) {
      const lines = getCompletedDialog(questId)
      this.dialog.show(lines, () => { this._interacting = false })
      return
    }

    const { available, reason } = isQuestAvailable(questId, GameState.story)
    if (!available) {
      const msg = quest?.reminderDialog ?? [reason ?? "Come back later."]
      this.dialog.show(Array.isArray(msg) ? msg : [msg], () => { this._interacting = false })
      return
    }

    const { started: dagnyStarted } = startQuest(questId, GameState.story)
    if (dagnyStarted) markDirty()

    const stage = getCurrentStage(questId, GameState.story)
    const stageDialog = stage?.dialog ?? quest.stages[0].dialog
    const labels = getBranchLabels(questId)
    const branchTexts = labels?.map(l => l.label) ?? []

    this.dialog.show(stageDialog, () => {
      this.dialog.showChoices('What do you do?', branchTexts, (idx) => {
        const { key: branchKey } = labels[idx]
        const events = resolveBranchChoice(questId, branchKey)

        const triggerEvent = events.find(e => e.type === 'trigger_encounter')
        const quizEvent    = events.find(e => e.type === 'quiz_start')

        if (triggerEvent) {
          // Branch 'open': store encounter + branch context in _session (not persisted)
          // so the encounter system can launch the right battle and apply the outcome.
          GameState._session.pendingBranchQuest      = questId
          GameState._session.pendingBranchKey        = branchKey
          GameState._session.pendingBranchEncounter  = triggerEvent.value
          this._interacting = false
          return
        }

        if (quizEvent) {
          const quizChoices = quizEvent.value.map(q => q.text)
          this.dialog.showChoices('Choose your approach:', quizChoices, (qIdx) => {
            const quizEvents = resolveQuizAnswer(questId, branchKey, qIdx)
            this._applyBranchEvents(questId, branchKey, quizEvents)
          })
        }
      })
    })
  }

  _applyBranchEvents(questId, branchKey, events) {
    for (const ev of events) {
      if (ev.type === 'xp_gain' && ev.value > 0) {
        grantXpOnce(`${questId}_${branchKey}_xp_${ev.value}`, ev.value)
      } else if (ev.type === 'budget_drain') {
        GameState.player.budget = Math.max(0, (GameState.player.budget || 0) - ev.value)
      } else if (ev.type === 'item_drop') {
        addItem('tools', ev.value, 1)
      } else if (ev.type === 'set_flag') {
        GameState.story.flags[ev.value] = true
      } else if (ev.type === 'shame') {
        GameState.player.shamePoints = (GameState.player.shamePoints || 0) + ev.value
      } else if (ev.type === 'reputation') {
        GameState.player.reputation = Math.max(0, Math.min(100, (GameState.player.reputation || 0) + ev.value))
      } else if (ev.type === 'damage') {
        GameState.player.hp = Math.max(1, GameState.player.hp - ev.value)
      } else if (ev.type === 'heal') {
        GameState.player.hp = Math.min(GameState.player.maxHp, GameState.player.hp + ev.value)
      } else if (ev.type === 'teach_skill') {
        if (!GameState.skills.learned.includes(ev.value)) {
          GameState.skills.learned.push(ev.value)
        }
        const skill = getSkillById(ev.value)
        if (skill?.isCursed && !GameState.skills.cursed.includes(ev.value)) {
          GameState.skills.cursed.push(ev.value)
        }
      }
    }
    markDirty()

    const dialogLines = events.filter(e => e.type === 'dialog').map(e => e.text)
    const questComplete = events.some(e => e.type === 'set_flag' && e.value === getQuestById(questId)?.completionFlag)

    if (questComplete) {
      GameState.story.completedQuests.push(questId)
      markDirty()
      const transition = checkActTransition(GameState.story.act, GameState.story.flags)
      if (transition) {
        GameState.story.act = transition.toAct
        markDirty()
      }
    }

    if (dialogLines.length > 0) {
      this.dialog.show(dialogLines, () => { this._interacting = false })
    } else {
      this._interacting = false
    }
  }

  shutdown() {
    GameState._session.dialogActive = false
    if (this._preloadErrorHandler) {
      this.load.off('loaderror', this._preloadErrorHandler)
      this._preloadErrorHandler = null
    }
    super.shutdown()
    if (this.choiceMenu) this.choiceMenu.destroy()
    if (this._menu)   this._menu.destroy()
    if (this.dialog) this.dialog.destroy()
  }
}
