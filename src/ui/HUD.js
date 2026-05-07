import { GameState } from '#state/GameState.js'
import { CONFIG, ECONOMY } from '../config.js'

// Bar and panel geometry constants (canvas-space pixels at 1920×1080)
const PANEL_W   = 378
const PANEL_H   = 20
const BAR_W     = 300
const BAR_H     = 8
const PANEL_X   = 4
const LABEL_X   = 8

const HP_PANEL_Y    = 4
const HP_BAR_X      = 28
const HP_BAR_Y      = HP_PANEL_Y + 6    // vertically centred in panel
const HP_TEXT_X     = 334
const HP_TEXT_Y     = HP_PANEL_Y + 6

const BUDGET_PANEL_Y  = 28             // HP_PANEL_Y + PANEL_H + 4 gap
const BUDGET_BAR_X    = 28
const BUDGET_BAR_Y    = BUDGET_PANEL_Y + 6
const BUDGET_TEXT_X   = 334
const BUDGET_TEXT_Y   = BUDGET_PANEL_Y + 6

const SAVE_ICON_X  = PANEL_X + PANEL_W + 8
const SAVE_ICON_Y  = HP_PANEL_Y + 2
const TOOLTIP_X    = PANEL_X + PANEL_W + 8
const TOOLTIP_Y    = BUDGET_PANEL_Y + 2

// HP colour thresholds (spec: green > 50%, yellow > 25%, red ≤ 25%)
const HP_COLOR_GREEN  = 0x3cc864
const HP_COLOR_YELLOW = 0xffdc3c
const HP_COLOR_RED    = 0xdc3232

// Budget colour (spec: positive = blue, negative/debt = orange)
const BUDGET_COLOR_POS  = 0x5082dc
const BUDGET_COLOR_DEBT = 0xe69632

// Dark track colour for unfilled bar background
const BAR_TRACK_COLOR = 0x222222

// Fallback panel colours used when BaseScene.createPanel is unavailable
const PANEL_FILL_COLOR   = 0x1a1a2a
const PANEL_BORDER_COLOR = 0x334155

export class HUD {
  constructor(scene) {
    this.scene = scene

    const textStyle = { fontFamily: `${CONFIG.FONT}, monospace`, fontSize: '8px', color: '#ffffff' }

    // --- HP row ---
    _makePanel(scene, PANEL_X, HP_PANEL_Y, PANEL_W, PANEL_H)

    scene.add.text(LABEL_X, HP_TEXT_Y, 'HP', textStyle).setScrollFactor(0)

    scene.add.rectangle(HP_BAR_X, HP_BAR_Y, BAR_W, BAR_H, BAR_TRACK_COLOR)
      .setOrigin(0, 0).setScrollFactor(0)

    this._hpBar = scene.add.rectangle(HP_BAR_X, HP_BAR_Y, BAR_W, BAR_H, HP_COLOR_GREEN)
      .setOrigin(0, 0).setScrollFactor(0)

    this._hpText = scene.add.text(HP_TEXT_X, HP_TEXT_Y, '', textStyle).setScrollFactor(0)

    // --- Budget row ---
    _makePanel(scene, PANEL_X, BUDGET_PANEL_Y, PANEL_W, PANEL_H)

    scene.add.text(LABEL_X, BUDGET_TEXT_Y, '$', textStyle).setScrollFactor(0)

    scene.add.rectangle(BUDGET_BAR_X, BUDGET_BAR_Y, BAR_W, BAR_H, BAR_TRACK_COLOR)
      .setOrigin(0, 0).setScrollFactor(0)

    this._budgetBar = scene.add.rectangle(BUDGET_BAR_X, BUDGET_BAR_Y, BAR_W, BAR_H, BUDGET_COLOR_POS)
      .setOrigin(0, 0).setScrollFactor(0)

    this._budgetText = scene.add.text(BUDGET_TEXT_X, BUDGET_TEXT_Y, '', textStyle).setScrollFactor(0)

    // --- Save icon and tooltip ---
    this.saveIcon = scene.add.text(SAVE_ICON_X, SAVE_ICON_Y, '💾', {
      fontFamily: `${CONFIG.FONT}, monospace`,
      fontSize: '10px',
      color: '#7CFC00',
    }).setScrollFactor(0).setVisible(false)

    this.tooltip = scene.add.text(TOOLTIP_X, TOOLTIP_Y, 'You have uncommitted changes.', {
      fontFamily: `${CONFIG.FONT}, monospace`,
      fontSize: '7px',
      color: '#7CFC00',
      backgroundColor: '#000000',
      padding: { left: 2, right: 2, top: 1, bottom: 1 },
    }).setScrollFactor(0).setVisible(false)

    this.saveIcon.setInteractive({ useHandCursor: true })
    this.saveIcon.on('pointerover', () => this.tooltip.setVisible(GameState._session.isDirty))
    this.saveIcon.on('pointerout', () => this.tooltip.setVisible(false))

    scene.time.addEvent({
      delay: 350,
      loop: true,
      callback: () => {
        if (!GameState._session.isDirty) {
          this.saveIcon.setVisible(false)
          this.tooltip.setVisible(false)
          return
        }
        this.saveIcon.setVisible(!this.saveIcon.visible)
      },
    })

    this.refresh()
  }

  refresh() {
    const { hp, maxHp, budget } = GameState.player

    // HP bar — width proportional to hp/maxHp, integer pixels, instant update
    const hpRatio  = maxHp > 0 ? Math.max(0, Math.min(1, hp / maxHp)) : 0
    const hpFillW  = Math.round(BAR_W * hpRatio)
    this._hpBar.setDisplaySize(hpFillW, BAR_H)
    const hpColor  = hpRatio <= 0.25 ? HP_COLOR_RED : hpRatio <= 0.5 ? HP_COLOR_YELLOW : HP_COLOR_GREEN
    this._hpBar.setFillStyle(hpColor)
    this._hpText.setText(`${hp} / ${maxHp}`)

    // Budget bar — width proportional to budget/STARTING_BUDGET, clamped 0–1
    const startingBudget = ECONOMY.STARTING_BUDGET > 0 ? ECONOMY.STARTING_BUDGET : 1
    const budgetRatio  = Math.max(0, Math.min(1, budget / startingBudget))
    const budgetFillW  = Math.round(BAR_W * budgetRatio)
    this._budgetBar.setDisplaySize(budgetFillW, BAR_H)
    this._budgetBar.setFillStyle(budget >= 0 ? BUDGET_COLOR_POS : BUDGET_COLOR_DEBT)
    this._budgetText.setText(`$${budget}`)
  }
}

// Creates a Kenney 9-slice panel (via scene.createPanel if available) or a plain
// dark-navy rectangle as a fallback bar background frame.
function _makePanel(scene, x, y, w, h) {
  const panel = typeof scene.createPanel === 'function'
    ? scene.createPanel(x, y, w, h)
    : scene.add.rectangle(x, y, w, h, PANEL_FILL_COLOR).setOrigin(0, 0).setStrokeStyle(2, PANEL_BORDER_COLOR)
  panel.setScrollFactor(0)
  return panel
}
