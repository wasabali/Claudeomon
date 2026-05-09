import { BaseScene } from '#scenes/BaseScene.js'
import { COLORS } from '../config.js'

export class SaveScene extends BaseScene {
  constructor() {
    super({ key: 'SaveScene' })
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND)
    this.fadeToScene('SaveSlotScene', { mode: 'save' })
  }
}

