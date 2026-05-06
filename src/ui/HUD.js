import { GameState } from '#state/GameState.js'
import { CONFIG, ECONOMY } from '../config.js'

// ---------------------------------------------------------------------------
// Layout constants — all values are integer canvas pixels (1920 × 1080 space).
// ---------------------------------------------------------------------------
const BAR_W       = 300
const BAR_H       = 8
const PANEL_W     = 402   // label(20) + bar(300) + gap(6) + text(76)
const PANEL_H     = 20
const PANEL_GAP   = 4     // vertical gap between the two panels
const HP_PANEL_Y  = 0
const BUD_PANEL_Y = HP_PANEL_Y + PANEL_H + PANEL_GAP  // 24
const LABEL_X     = 4
const BAR_X       = 24   // bar starts after the 2-char label
const TEXT_X      = BAR_X + BAR_W + 6  // 330 — numeric readout starts here
const BAR_Y       = Math.floor((PANEL_H - BAR_H) / 2)  // vertically centred: 6
const TEXT_Y      = Math.floor((PANEL_H - 8) / 2)       // centred for 8 px font: 6

// Save-icon and tooltip positioned below the two panels.
const SAVE_ICON_X = 4
const SAVE_ICON_Y = BUD_PANEL_Y + PANEL_H + 4   // 48
const TOOLTIP_X   = 4
const TOOLTIP_Y   = SAVE_ICON_Y + 14             // 62

// ---------------------------------------------------------------------------
// Hex colour constants — matched exactly to the issue specification.
// ---------------------------------------------------------------------------
const HP_COL_GREEN  = 0x3CC864  // > 50 %
const HP_COL_YELLOW = 0xFFDC3C  // > 25 %
const HP_COL_RED    = 0xDC3232  // ≤ 25 %
const BUD_COL_POS   = 0x5082DC  // positive budget
const BUD_COL_NEG   = 0xE69632  // negative / debt
const TRACK_COL     = 0x111122  // dark bar-track background

// ---------------------------------------------------------------------------
// _createPanel — delegates to scene.createPanel() when available (BaseScene),
// otherwise creates a plain filled + stroked rectangle fallback.
// Returns a game object positioned at (x, y) with origin (0, 0).
// ---------------------------------------------------------------------------
function _createPanel(scene, x, y, w, h) {
  if (typeof scene.createPanel === 'function') {
    const p = scene.createPanel(x, y, w, h)
    p.setScrollFactor(0)
    return p
  }
  const r = scene.add.rectangle(x, y, w, h, 0x1a1a2a).setOrigin(0, 0)
  r.setStrokeStyle(2, 0x334155)
  r.setScrollFactor(0)
  return r
}

export class HUD {
  constructor(scene) {
    this.scene = scene

    const textStyle = {
      fontFamily: `${CONFIG.FONT}, monospace`,
      fontSize: '8px',
      color: '#ffffff',
    }

    // ----- HP row -----
    _createPanel(scene, 0, HP_PANEL_Y, PANEL_W, PANEL_H)

    scene.add.text(LABEL_X, HP_PANEL_Y + TEXT_Y, 'HP', textStyle).setScrollFactor(0)

    // dark track
    scene.add.rectangle(BAR_X, HP_PANEL_Y + BAR_Y, BAR_W, BAR_H, TRACK_COL)
      .setOrigin(0, 0).setScrollFactor(0)

    // coloured fill — width driven by refresh()
    this.hpBar = scene.add.rectangle(BAR_X, HP_PANEL_Y + BAR_Y, BAR_W, BAR_H, HP_COL_GREEN)
      .setOrigin(0, 0).setScrollFactor(0)

    this.hpText = scene.add.text(TEXT_X, HP_PANEL_Y + TEXT_Y, '', textStyle)
      .setScrollFactor(0)

    // ----- Budget row -----
    _createPanel(scene, 0, BUD_PANEL_Y, PANEL_W, PANEL_H)

    scene.add.text(LABEL_X, BUD_PANEL_Y + TEXT_Y, '$', textStyle).setScrollFactor(0)

    scene.add.rectangle(BAR_X, BUD_PANEL_Y + BAR_Y, BAR_W, BAR_H, TRACK_COL)
      .setOrigin(0, 0).setScrollFactor(0)

    this.budgetBar = scene.add.rectangle(BAR_X, BUD_PANEL_Y + BAR_Y, BAR_W, BAR_H, BUD_COL_POS)
      .setOrigin(0, 0).setScrollFactor(0)

    this.budgetText = scene.add.text(TEXT_X, BUD_PANEL_Y + TEXT_Y, '', textStyle)
      .setScrollFactor(0)

    // ----- Save icon + tooltip (below both panels) -----
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

    // HP bar — instant width update, no tweening (pixel art compliance)
    const hpRatio = maxHp > 0 ? Math.max(0, Math.min(1, hp / maxHp)) : 0
    const hpW     = Math.floor(BAR_W * hpRatio)
    const hpColor = hpRatio <= 0.25 ? HP_COL_RED : hpRatio <= 0.5 ? HP_COL_YELLOW : HP_COL_GREEN
    this.hpBar.setDisplaySize(hpW, BAR_H)
    this.hpBar.setFillStyle(hpColor)
    this.hpText.setText(`${hp} / ${maxHp}`)

    // Budget bar — clamped 0–1 against STARTING_BUDGET; negative budget → empty orange bar
    // (empty bar + orange colour signals a debt state; the track remains visible).
    const budRatio = Math.max(0, Math.min(1, budget / ECONOMY.STARTING_BUDGET))
    const budW     = Math.floor(BAR_W * budRatio)
    const budColor = budget >= 0 ? BUD_COL_POS : BUD_COL_NEG
    this.budgetBar.setDisplaySize(budW, BAR_H)
    this.budgetBar.setFillStyle(budColor)
    this.budgetText.setText(`$${budget}`)
  }
}
