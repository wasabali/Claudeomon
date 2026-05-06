import Phaser from 'phaser'
import { getAllBgm } from '#data/audio.js'
import { getAll as getAllEncounters } from '#data/encounters.js'

// Incident spritesheets — 48×48 px per frame, horizontal strip.
// Load is always attempted for encounters with a spriteKey; missing files are treated as optional
// via loaderror handling, and BattleScene falls back gracefully when a sprite is unavailable.
const INCIDENT_SPRITE_FRAME_SIZE = { frameWidth: 48, frameHeight: 48 }

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    const bgmTracks = getAllBgm()
    const optionalBgmKeys = new Set(bgmTracks.map((bgm) => bgm.id))

    // Collect all known incident spriteKeys so we can suppress load errors for them.
    const incidentSpriteKeys = new Set(
      getAllEncounters()
        .filter(e => e.spriteKey)
        .map(e => e.spriteKey),
    )

    // Ignore missing optional assets — BGM, loop-points JSON, and incident sprites.
    // Logs a warning for each; surface all other failures as errors.
    this.load.on('loaderror', (file) => {
      const isOptionalBgm = file?.type === 'audio' && optionalBgmKeys.has(file.key)
      const isOptionalLoopJson = file?.type === 'json' && file.key === 'bgmLoopPoints'
      const isOptionalSprite = file?.type === 'spritesheet' && incidentSpriteKeys.has(file.key)
      if (isOptionalBgm || isOptionalLoopJson || isOptionalSprite) {
        console.warn(`[BootScene] Optional asset unavailable, continuing without it: ${file?.type}:${file?.key}`)
        return
      }
      throw new Error(`BootScene failed to load required asset: ${file?.type ?? 'unknown'}:${file?.key ?? 'unknown'}`)
    })

    // Load BGM tracks listed in the audio registry.
    // SFX are procedurally generated via jsfxr at runtime — no files to preload.
    for (const bgm of bgmTracks) {
      this.load.audio(bgm.id, bgm.file)
    }

    this.load.json('bgmLoopPoints', 'assets/audio/bgm-loop-points.json')

    // Load incident spritesheets for encounters that have a spriteKey defined.
    for (const encounter of getAllEncounters()) {
      if (!encounter.spriteKey) continue
      this.load.spritesheet(
        encounter.spriteKey,
        `assets/sprites/incidents/${encounter.id}.png`,
        INCIDENT_SPRITE_FRAME_SIZE,
      )
    }
  }

  create() {
    this.registry.set('bgmLoopPoints', this.cache.json.get('bgmLoopPoints') ?? {})

    // Register idle animations for all loaded incident sprites.
    for (const encounter of getAllEncounters()) {
      if (!encounter.spriteKey) continue
      if (!this.textures.exists(encounter.spriteKey)) continue
      const lastFrameIndex = this.textures.get(encounter.spriteKey).frameTotal - 1
      if (lastFrameIndex < 1) continue
      this.anims.create({
        key: `${encounter.spriteKey}_idle`,
        frames: this.anims.generateFrameNumbers(encounter.spriteKey, { start: 0, end: lastFrameIndex - 1 }),
        frameRate: encounter.animFrameRate ?? 2,
        repeat: -1,
      })
    }

    this.scene.start('TitleScene')
  }
}
