import { BaseScene } from '#scenes/BaseScene.js'
import { SaveManager } from '#state/SaveManager.js'
import { GameState } from '#state/GameState.js'
import { CONFIG, COLORS } from '../config.js'

const FONT_SM  = '22px'
const FONT_MD  = '28px'
const COLOR_HINT = '#aaaaaa'
const COLOR_LABEL = '#9bc5ff'

export class SaveScene extends BaseScene {
  constructor() {
    super({ key: 'SaveScene' })
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND)
    this.fadeToScene('SaveSlotScene', { mode: 'save' })
  }
}

