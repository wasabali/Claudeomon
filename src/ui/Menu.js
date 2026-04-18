// D-pad navigable list menu for Cloud Quest.
// Renders a vertical list of items with an arrow cursor. Up/Down to move,
// Z/Enter to confirm, X to cancel. Positioned relative to the dialog box
// area so it layers naturally with DialogBox.
//
// Usage:
//   const menu = new Menu(this)
//   menu.show(['Option A', 'Option B'], {
//     title: '> FAST TRAVEL',
//     onSelect: (index, label) => { /* chosen */ },
//     onCancel: () => { /* dismissed */ },
//   })

import { CONFIG, COLORS } from '../config.js'

// Layout constants — sized for the game's display resolution (CONFIG.WIDTH × CONFIG.HEIGHT).
const BOX_HEIGHT    = 216
const BOX_Y         = CONFIG.HEIGHT - BOX_HEIGHT
const PADDING_X     = 24
const PADDING_Y     = 20
const FONT_SIZE     = '22px'
const LINE_HEIGHT   = 40
const ARROW_OFFSET  = 24
const PANEL_KEY     = 'menu_panel_9slice'

// Maximum visible items before the list would clip the panel.
// Derived from: (BOX_HEIGHT - PADDING_Y*2 - LINE_HEIGHT for title) / LINE_HEIGHT
const MAX_VISIBLE_ITEMS = 4

export class Menu {
  /**
   * @param {Phaser.Scene} scene - The scene that owns this menu.
   */
  constructor(scene) {
    this.scene      = scene
    this._active    = false
    this._items     = []
    this._selected  = 0
    this._onSelect  = null
    this._onCancel  = null

    this._ensureTexture()
    this._buildChrome()
    this.hide()
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Display a list menu for the player to choose from.
   * @param {string[]} items    - Menu item labels.
   * @param {Object}   opts     - Options.
   * @param {string}   [opts.title]    - Optional header line above the list.
   * @param {Function} [opts.onSelect] - Called with (index, label) on confirm.
   * @param {Function} [opts.onCancel] - Called when X is pressed to cancel.
   */
  show(items, opts = {}) {
    if (!items || items.length === 0) return

    this._items    = items
    this._selected = 0
    this._onSelect = opts.onSelect ?? null
    this._onCancel = opts.onCancel ?? null
    this._active   = true

    // Title line (optional header above items)
    this._titleText.setText(opts.title ?? '')

    this._renderItems()
    this._updateArrow()
    this._container.setVisible(true)
  }

  /** Hide and deactivate the menu. */
  hide() {
    this._active = false
    this._container.setVisible(false)
  }

  /** True while the menu is visible and accepting input. */
  get isActive() {
    return this._active
  }

  /** Move selection up by one (wraps). */
  moveUp() {
    if (!this._active || this._items.length === 0) return
    this._selected = (this._selected - 1 + this._items.length) % this._items.length
    this._updateArrow()
  }

  /** Move selection down by one (wraps). */
  moveDown() {
    if (!this._active || this._items.length === 0) return
    this._selected = (this._selected + 1) % this._items.length
    this._updateArrow()
  }

  /** Confirm the current selection. */
  confirm() {
    if (!this._active || this._items.length === 0) return
    const idx   = this._selected
    const label = this._items[idx]
    this.hide()
    if (this._onSelect) this._onSelect(idx, label)
  }

  /** Cancel / dismiss the menu. */
  cancel() {
    if (!this._active) return
    this.hide()
    if (this._onCancel) this._onCancel()
  }

  /** Clean up Phaser objects — call when scene shuts down. */
  destroy() {
    this._active = false
    this._container.destroy()
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  _ensureTexture() {
    if (this.scene.textures.exists(PANEL_KEY)) return

    const g = this.scene.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x0d1117, 1)
    g.fillRect(0, 0, 16, 16)
    g.fillStyle(0x334155, 1)
    g.fillRect(0, 0, 16, 2)
    g.fillRect(0, 14, 16, 2)
    g.fillRect(0, 0, 2, 16)
    g.fillRect(14, 0, 2, 16)
    g.generateTexture(PANEL_KEY, 16, 16)
    g.destroy()
  }

  _buildChrome() {
    this._container = this.scene.add.container(0, 0)
    this._container.setDepth(101) // above DialogBox (100)

    // Background panel
    if (typeof this.scene.add.nineslice === 'function' && this.scene.textures.exists(PANEL_KEY)) {
      this._bg = this.scene.add.nineslice(0, BOX_Y, PANEL_KEY, 0, CONFIG.WIDTH, BOX_HEIGHT, 4, 4, 4, 4)
        .setOrigin(0, 0)
    } else {
      this._bg = this.scene.add.rectangle(0, BOX_Y, CONFIG.WIDTH, BOX_HEIGHT, 0x0d1117)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x334155)
    }
    this._container.add(this._bg)

    // Title text (optional header)
    this._titleText = this.scene.add.text(
      PADDING_X,
      BOX_Y + PADDING_Y,
      '',
      { fontFamily: CONFIG.FONT, fontSize: FONT_SIZE, color: '#9bc5ff' },
    )
    this._container.add(this._titleText)

    // Item texts — pre-allocate up to MAX_VISIBLE_ITEMS slots.
    // Items beyond this limit are not rendered (scroll not implemented yet).
    this._itemTexts = []
    for (let i = 0; i < MAX_VISIBLE_ITEMS; i++) {
      const t = this.scene.add.text(
        PADDING_X + ARROW_OFFSET,
        BOX_Y + PADDING_Y + LINE_HEIGHT + (i * LINE_HEIGHT),
        '',
        { fontFamily: CONFIG.FONT, fontSize: FONT_SIZE, color: COLORS.MENU_TEXT },
      )
      this._container.add(t)
      this._itemTexts.push(t)
    }

    // Selection arrow
    this._arrow = this.scene.add.text(
      PADDING_X,
      BOX_Y + PADDING_Y + LINE_HEIGHT,
      '▶',
      { fontFamily: CONFIG.FONT, fontSize: FONT_SIZE, color: COLORS.MENU_ARROW },
    )
    this._container.add(this._arrow)
  }

  _renderItems() {
    for (let i = 0; i < this._itemTexts.length; i++) {
      if (i < this._items.length) {
        this._itemTexts[i].setText(this._items[i]).setVisible(true)
      } else {
        this._itemTexts[i].setText('').setVisible(false)
      }
    }
  }

  _updateArrow() {
    this._arrow.setY(BOX_Y + PADDING_Y + LINE_HEIGHT + (this._selected * LINE_HEIGHT))
  }
}
