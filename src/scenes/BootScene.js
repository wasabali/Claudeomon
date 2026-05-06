import Phaser from 'phaser'
import { getAllBgm, getAllSfx } from '#data/audio.js'
import { getAllSpriteKeys } from '#data/trainers.js'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    const bgmTracks = getAllBgm()
    const sfxPresets = getAllSfx()
    const optionalAudioKeys = new Set([
      ...bgmTracks.map((bgm) => bgm.id),
      ...sfxPresets.map((sfx) => sfx.id),
    ])

    // All character sprite keys are optional — the game falls back to procedurally
    // generated stub textures when the Ninja Adventure sprite files are not present.
    const optionalSpriteKeys = new Set(getAllSpriteKeys())

    // Ignore missing optional audio files, the loop-points JSON, and character sprites
    // — the game runs silently if audio or sprite assets are unavailable.
    // Surface all other failures.
    this.load.on('loaderror', (file) => {
      const isOptionalAudio  = file?.type === 'audio' && optionalAudioKeys.has(file.key)
      const isOptionalLoopJson = file?.type === 'json' && file.key === 'bgmLoopPoints'
      const isOptionalSprite = optionalSpriteKeys.has(file.key)
      if (isOptionalAudio || isOptionalLoopJson || isOptionalSprite) {
        console.warn(`[BootScene] Optional asset unavailable, continuing without it: ${file?.type}:${file?.key}`)
        return
      }
      throw new Error(`BootScene failed to load required asset: ${file?.type ?? 'unknown'}:${file?.key ?? 'unknown'}`)
    })

    // Load BGM tracks — OGG primary, MP3 fallback for browser coverage.
    for (const bgm of bgmTracks) {
      this.load.audio(bgm.id, [bgm.file, bgm.file.replace(/\.ogg$/, '.mp3')])
    }

    // Load SFX files — OGG primary, MP3 fallback for browser coverage.
    for (const sfx of sfxPresets) {
      this.load.audio(sfx.id, [sfx.file, sfx.file.replace(/\.ogg$/, '.mp3')])
    }

    this.load.json('bgmLoopPoints', 'assets/audio/bgm-loop-points.json')

    // Load character sprite sheets (4-row × 3-col walk-cycle, 48×48 px per frame).
    // Files live in assets/sprites/characters/<key>.png and are optional — if absent
    // the game uses procedurally generated stub textures (coloured rectangles).
    for (const key of optionalSpriteKeys) {
      this.load.spritesheet(key, `assets/sprites/characters/${key}.png`, {
        frameWidth:  48,
        frameHeight: 48,
      })
    }
  }

  create() {
    this.registry.set('bgmLoopPoints', this.cache.json.get('bgmLoopPoints') ?? {})
    this.scene.start('TitleScene')
  }
}
