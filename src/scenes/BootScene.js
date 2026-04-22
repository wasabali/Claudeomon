import Phaser from 'phaser'
import { getAllBgm, getAllSfx } from '#data/audio.js'

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

    // Ignore missing optional audio files and the loop-points JSON — the game
    // runs silently if audio assets are unavailable.  Surface all other failures.
    this.load.on('loaderror', (file) => {
      const isOptionalAudio = file?.type === 'audio' && optionalAudioKeys.has(file.key)
      const isOptionalLoopJson = file?.type === 'json' && file.key === 'bgmLoopPoints'
      if (isOptionalAudio || isOptionalLoopJson) {
        console.warn(`[BootScene] Optional asset unavailable, continuing without it: ${file?.type}:${file?.key}`)
        return
      }
      throw new Error(`BootScene failed to load required asset: ${file?.type ?? 'unknown'}:${file?.key ?? 'unknown'}`)
    })

    // Load BGM tracks — OGG primary, MP3 fallback for browser coverage.
    for (const bgm of bgmTracks) {
      this.load.audio(bgm.id, [bgm.file, bgm.file.replace('.ogg', '.mp3')])
    }

    // Load SFX files — OGG primary, MP3 fallback for browser coverage.
    for (const sfx of sfxPresets) {
      this.load.audio(sfx.id, [sfx.file, sfx.file.replace('.ogg', '.mp3')])
    }

    this.load.json('bgmLoopPoints', 'assets/audio/bgm-loop-points.json')
  }

  create() {
    this.registry.set('bgmLoopPoints', this.cache.json.get('bgmLoopPoints') ?? {})
    this.scene.start('TitleScene')
  }
}
