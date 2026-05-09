import { BaseScene } from '#scenes/BaseScene.js'
import { SaveManager } from '#state/SaveManager.js'
import { GameState } from '#state/GameState.js'
import { CONFIG, COLORS } from '../config.js'

const SLOT_COUNT = 3

const PANEL_X       = 360
const PANEL_W       = CONFIG.WIDTH - PANEL_X * 2
const PANEL_H       = 200
const PANEL_GAP     = 40
const PANEL_START_Y = 260
const FONT_SM       = '22px'
const FONT_MD       = '28px'
const FONT_LG       = '36px'
const COLOR_EMPTY   = '#666688'
const COLOR_SLOT    = '#f8f8f8'
const COLOR_LABEL   = '#9bc5ff'
const COLOR_SELECT  = '#ffe066'
const COLOR_HINT    = '#aaaaaa'
const COLOR_CONFIRM = '#ff6666'
const COLOR_OK      = '#78ff9d'
const COLOR_BG      = '#0b1020'

const formatPlaytime = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export class SaveSlotScene extends BaseScene {
  constructor() {
    super({ key: 'SaveSlotScene' })
    this._mode = 'load'
    this._selectedIndex = 0
    this._confirmDeleteIndex = -1
    this._slots = []
    this._panels = []
    this._slotTexts = []
    this._arrowText = null
    this._statusText = null
  }

  create(data = {}) {
    this._mode = data.mode === 'save' ? 'save' : 'load'
    this._selectedIndex = 0
    this._confirmDeleteIndex = -1
    this._slots = SaveManager.getAllSlotMeta()

    this.cameras.main.setBackgroundColor(COLOR_BG)

    const cx = CONFIG.WIDTH / 2
    const title = this._mode === 'save' ? 'SAVE GAME' : 'LOAD GAME'

    this.add.text(cx, 120, title, {
      fontFamily: CONFIG.FONT,
      fontSize: '54px',
      color: COLORS.TITLE,
    }).setOrigin(0.5)

    this._buildSlotPanels()

    this._arrowText = this.add.text(
      PANEL_X - 52,
      this._slotPanelY(this._selectedIndex) + Math.floor(PANEL_H / 2),
      '▶',
      { fontFamily: CONFIG.FONT, fontSize: FONT_LG, color: COLOR_SELECT },
    ).setOrigin(0.5)

    this._statusText = this.add.text(cx, CONFIG.HEIGHT - 80, '', {
      fontFamily: CONFIG.FONT,
      fontSize: FONT_SM,
      color: COLOR_OK,
    }).setOrigin(0.5)

    const hintY = CONFIG.HEIGHT - 140
    const deleteHint = this._mode === 'load' ? '  X — Delete slot' : ''
    this.add.text(cx, hintY, `Z/ENTER — Confirm  ESC — Back${deleteHint}`, {
      fontFamily: CONFIG.FONT,
      fontSize: FONT_SM,
      color: COLOR_HINT,
    }).setOrigin(0.5)

    this.input.keyboard.on('keydown-UP',    () => this._move(-1))
    this.input.keyboard.on('keydown-DOWN',  () => this._move(1))
    this.input.keyboard.on('keydown-Z',     () => this._confirm())
    this.input.keyboard.on('keydown-ENTER', () => this._confirm())
    this.input.keyboard.on('keydown-X',     () => this._requestDelete())
    this.input.keyboard.on('keydown-ESC',   () => this._back())
  }

  _slotPanelY(index) {
    return PANEL_START_Y + index * (PANEL_H + PANEL_GAP)
  }

  _buildSlotPanels() {
    this._panels = []
    this._slotTexts = []

    for (let i = 0; i < SLOT_COUNT; i++) {
      const y    = this._slotPanelY(i)
      const meta = this._slots[i]

      const panel = this.createPanel(PANEL_X, y, PANEL_W, PANEL_H)
      this._panels.push(panel)

      const texts = []

      if (!meta) {
        texts.push(
          this.add.text(PANEL_X + 40, y + Math.floor(PANEL_H / 2), `SLOT ${i + 1}   — empty —`, {
            fontFamily: CONFIG.FONT,
            fontSize:   FONT_MD,
            color:      COLOR_EMPTY,
          }).setOrigin(0, 0.5),
        )
      } else {
        texts.push(
          this.add.text(PANEL_X + 40, y + 36, `SLOT ${i + 1}`, {
            fontFamily: CONFIG.FONT,
            fontSize:   FONT_SM,
            color:      COLOR_LABEL,
          }),
          this.add.text(PANEL_X + 220, y + 36, meta.playerName, {
            fontFamily: CONFIG.FONT,
            fontSize:   FONT_MD,
            color:      COLOR_SLOT,
          }),
          this.add.text(PANEL_X + 40, y + 100, `Lv.${meta.level}`, {
            fontFamily: CONFIG.FONT,
            fontSize:   FONT_SM,
            color:      COLOR_SLOT,
          }),
          this.add.text(PANEL_X + 200, y + 100, meta.location.replace(/_/g, ' '), {
            fontFamily: CONFIG.FONT,
            fontSize:   FONT_SM,
            color:      COLOR_SLOT,
          }),
          this.add.text(PANEL_X + PANEL_W - 40, y + 36, formatDate(meta.savedAt), {
            fontFamily: CONFIG.FONT,
            fontSize:   FONT_SM,
            color:      COLOR_LABEL,
          }).setOrigin(1, 0),
          this.add.text(PANEL_X + PANEL_W - 40, y + 100, formatPlaytime(meta.playtime), {
            fontFamily: CONFIG.FONT,
            fontSize:   FONT_SM,
            color:      COLOR_SLOT,
          }).setOrigin(1, 0),
        )

        if (meta.commitMessage) {
          texts.push(
            this.add.text(PANEL_X + 40, y + 150, `"${meta.commitMessage}"`, {
              fontFamily: CONFIG.FONT,
              fontSize:   '18px',
              color:      COLOR_LABEL,
            }),
          )
        }
      }

      this._slotTexts.push(texts)
    }
  }

  _rebuildPanels() {
    for (const p of this._panels) p.destroy()
    for (const group of this._slotTexts) for (const t of group) t.destroy()
    this._slots = SaveManager.getAllSlotMeta()
    this._buildSlotPanels()
  }

  _move(delta) {
    if (this._confirmDeleteIndex >= 0) {
      this._confirmDeleteIndex = -1
      this._statusText.setText('').setColor(COLOR_OK)
    }
    this._selectedIndex = (this._selectedIndex + delta + SLOT_COUNT) % SLOT_COUNT
    this._arrowText.setY(this._slotPanelY(this._selectedIndex) + Math.floor(PANEL_H / 2))
    this._statusText.setText('').setColor(COLOR_OK)
  }

  _confirm() {
    if (this._confirmDeleteIndex >= 0) {
      this._executeDelete(this._confirmDeleteIndex)
      return
    }

    if (this._mode === 'save') {
      this._saveToSelected()
    } else {
      this._loadFromSelected()
    }
  }

  async _saveToSelected() {
    const i = this._selectedIndex
    const msg = GameState.story.flags?.lastCommitMessage ?? ''
    await SaveManager.saveToSlot(i, GameState, msg)
    this._slots = SaveManager.getAllSlotMeta()
    this._rebuildPanels()
    this._arrowText.setY(this._slotPanelY(i) + Math.floor(PANEL_H / 2))
    this._statusText.setText(`Slot ${i + 1} saved.`).setColor(COLOR_OK)
  }

  _loadFromSelected() {
    const meta = this._slots[this._selectedIndex]
    if (!meta) {
      this._statusText.setText('Empty slot — nothing to load.').setColor(COLOR_CONFIRM)
      return
    }
    SaveManager.loadFromSlot(this._selectedIndex)
    this.fadeToScene('WorldScene')
  }

  _requestDelete() {
    if (this._mode !== 'load') return
    const meta = this._slots[this._selectedIndex]
    if (!meta) return

    this._confirmDeleteIndex = this._selectedIndex
    this._statusText
      .setText(`Delete Slot ${this._selectedIndex + 1}? Press Z to confirm.`)
      .setColor(COLOR_CONFIRM)
  }

  _executeDelete(index) {
    SaveManager.deleteSlot(index)
    this._confirmDeleteIndex = -1
    this._rebuildPanels()
    this._arrowText.setY(this._slotPanelY(this._selectedIndex) + Math.floor(PANEL_H / 2))
    this._statusText.setText(`Slot ${index + 1} deleted.`).setColor(COLOR_OK)
  }

  _back() {
    if (this._confirmDeleteIndex >= 0) {
      this._confirmDeleteIndex = -1
      this._statusText.setText('').setColor(COLOR_OK)
      return
    }
    if (this._mode === 'save') {
      this.fadeToScene('SaveScene')
    } else {
      this.fadeToScene('TitleScene')
    }
  }
}
