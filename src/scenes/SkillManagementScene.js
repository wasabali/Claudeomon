import Phaser from 'phaser'
import { BaseScene } from '#scenes/BaseScene.js'
import { CONFIG } from '../config.js'
import { getById as getSkillById } from '#data/skills.js'
import {
  assignSkillToSlot,
  buildSkillStateAfterDeckCommit,
  getActiveSlotCount,
  isCursedSkillId,
  normalizeActiveDeck,
  removeSkillFromSlot,
  swapActiveSlots,
} from '#engine/SkillDeckEngine.js'
import { GameState, markDirty } from '#state/GameState.js'

const VISIBLE_KNOWN_COUNT = 6

const DIM_OVERLAY_ALPHA = 0.70

// Layout constants — all derived from CONFIG.WIDTH / CONFIG.HEIGHT (1920×1080)
const COL_W         = 700   // width of each column panel
const COL_H         = 740   // height of each column panel
const COL_LEFT_X    = 160   // left column x
const COL_RIGHT_X   = 1060  // right column x
const COL_Y         = 140   // top of both columns
const DETAIL_X      = 160   // bottom detail panel x
const DETAIL_Y      = 900   // bottom detail panel y (COL_Y + COL_H + 20)
const DETAIL_W      = 1600  // bottom detail panel width
const DETAIL_H      = 120   // bottom detail panel height
const FONT_TITLE    = '22px'
const FONT_ITEM     = '18px'
const FONT_DETAIL   = '16px'
const FONT_HEADER   = '14px'
const ITEM_LINE_H   = 46    // vertical spacing between skill rows
const ITEMS_START_Y = 72    // offset inside column panel before first item

export class SkillManagementScene extends BaseScene {
  constructor() {
    super({ key: 'SkillManagementScene' })
  }

  create(data = {}) {
    this.replaceSkillId = data.replaceSkillId ?? null
    this.returnSceneKey = data.returnScene ?? 'WorldScene'
    this.focus = 'left'
    this.leftIndex = 0
    this.rightIndex = 0
    this.rightScroll = 0
    this.selectedSlot = null
    this.confirmRemove = false
    this.removeConfirmIndex = 0

    this.ensureWindowTexture()
    this.renderChrome()
    this.bindKeys()
    this.setupPauseKey()
    this.refresh()
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.up)) this.onUp()
    if (Phaser.Input.Keyboard.JustDown(this.keys.down)) this.onDown()
    if (Phaser.Input.Keyboard.JustDown(this.keys.left)) this.onLeft()
    if (Phaser.Input.Keyboard.JustDown(this.keys.right)) this.onRight()
    if (Phaser.Input.Keyboard.JustDown(this.keys.confirm)) this.onConfirm()
    if (Phaser.Input.Keyboard.JustDown(this.keys.cancel)) this.onCancel()
    if (Phaser.Input.Keyboard.JustDown(this.keys.stackoverflow)) this.onStackOverflow()
  }

  bindKeys() {
    this.keys = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      confirm: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      cancel: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      stackoverflow: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    }
  }

  ensureWindowTexture() {
    // No-op: BaseScene.createPanel() handles 'ui_window' loading via BootScene.
    // This method is kept so renderChrome() callers don't break.
  }

  renderChrome() {
    // Dim background so underlying world isn't a distraction
    this.add.rectangle(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT, 0x000000)
      .setOrigin(0, 0)
      .setAlpha(DIM_OVERLAY_ALPHA)

    // Title bar
    this.add.text(CONFIG.WIDTH / 2, 60, this.replaceSkillId ? 'REPLACE A SKILL?' : 'AZURE TERMINAL', {
      fontFamily: CONFIG.FONT,
      fontSize:   FONT_TITLE,
      color:      '#9bc5ff',
    }).setOrigin(0.5, 0.5)

    // Left column — active deck
    this.createPanel(COL_LEFT_X, COL_Y, COL_W, COL_H)
    this.add.text(COL_LEFT_X + 20, COL_Y + 20, 'ACTIVE DECK', {
      fontFamily: CONFIG.FONT,
      fontSize:   FONT_HEADER,
      color:      '#9bc5ff',
    })

    // Right column — known / replacement skill
    this.createPanel(COL_RIGHT_X, COL_Y, COL_W, COL_H)
    this.add.text(COL_RIGHT_X + 20, COL_Y + 20, this.replaceSkillId ? 'NEW SKILL' : 'KNOWN SKILLS', {
      fontFamily: CONFIG.FONT,
      fontSize:   FONT_HEADER,
      color:      '#9bc5ff',
    })

    // Bottom detail panel — skill info + confirm prompt
    this.createPanel(DETAIL_X, DETAIL_Y, DETAIL_W, DETAIL_H)

    // Hint line
    this.add.text(CONFIG.WIDTH / 2, DETAIL_Y + DETAIL_H + 20,
      'Z: SELECT   X: CANCEL   ESC: PAUSE', {
        fontFamily: CONFIG.FONT,
        fontSize:   FONT_DETAIL,
        color:      '#556677',
      }).setOrigin(0.5, 0)

    this.leftTexts = []
    this.rightTexts = []
    for (let i = 0; i < VISIBLE_KNOWN_COUNT; i++) {
      this.leftTexts.push(
        this.add.text(COL_LEFT_X + 24, COL_Y + ITEMS_START_Y + i * ITEM_LINE_H, '', {
          fontFamily: CONFIG.FONT,
          fontSize:   FONT_ITEM,
          color:      '#f8f8f8',
        }),
      )
      this.rightTexts.push(
        this.add.text(COL_RIGHT_X + 24, COL_Y + ITEMS_START_Y + i * ITEM_LINE_H, '', {
          fontFamily: CONFIG.FONT,
          fontSize:   FONT_ITEM,
          color:      '#f8f8f8',
        }),
      )
    }

    this.bottomText = this.add.text(DETAIL_X + 24, DETAIL_Y + 20, '', {
      fontFamily: CONFIG.FONT,
      fontSize:   FONT_DETAIL,
      color:      '#cccccc',
    })
    this.confirmText = this.add.text(DETAIL_X + 24, DETAIL_Y + 56, '', {
      fontFamily: CONFIG.FONT,
      fontSize:   FONT_ITEM,
      color:      '#ffe066',
    }).setVisible(false)
  }

  getSlotCount() {
    return getActiveSlotCount(GameState.player.activeSlots)
  }

  getActiveDeck() {
    return normalizeActiveDeck(GameState.skills.active, this.getSlotCount())
  }

  getKnownSkills() {
    if (this.replaceSkillId) return [this.replaceSkillId]
    return [...GameState.skills.learned]
  }

  getHighlightedSkillId() {
    const deck = this.getActiveDeck()
    if (this.focus === 'left') return deck[this.leftIndex] ?? null
    const known = this.getKnownSkills()
    return known[this.rightIndex] ?? null
  }

  formatSkillName(skillId) {
    if (!skillId) return '[empty]'
    const skill = getSkillById(skillId)
    const base = skill?.displayName ?? skillId.replaceAll('_', ' ')
    return isCursedSkillId(skillId, GameState.skills.cursed) ? `[!] ${base}` : base
  }

  refresh() {
    const slotCount = this.getSlotCount()
    const deck = this.getActiveDeck()
    const known = this.getKnownSkills()
    this.leftTexts.forEach((textObj, i) => {
      if (i >= slotCount) {
        textObj.setText('')
        return
      }
      const marker = this.focus === 'left' && i === this.leftIndex ? '► ' : '  '
      const selected = this.selectedSlot === i ? '*' : ' '
      textObj.setText(`${marker}${selected}${this.formatSkillName(deck[i])}`)
    })

    if (this.rightIndex < this.rightScroll) this.rightScroll = this.rightIndex
    if (this.rightIndex >= this.rightScroll + VISIBLE_KNOWN_COUNT) this.rightScroll = this.rightIndex - VISIBLE_KNOWN_COUNT + 1

    this.rightTexts.forEach((textObj, i) => {
      const idx = this.rightScroll + i
      const skillId = known[idx]
      if (!skillId) {
        textObj.setText('')
        return
      }
      const marker = this.focus === 'right' && idx === this.rightIndex ? '► ' : '  '
      textObj.setText(`${marker}${this.formatSkillName(skillId)}`)
    })

    const highlightedSkillId = this.getHighlightedSkillId()
    const highlightedSkill = highlightedSkillId ? getSkillById(highlightedSkillId) : null
    if (highlightedSkill) {
      const cost = highlightedSkill.budgetCost > 0 ? `$${highlightedSkill.budgetCost}` : 'free'
      this.bottomText.setText(`${highlightedSkill.domain} · ${highlightedSkill.tier} · ${cost}`)
    } else if (highlightedSkillId) {
      this.bottomText.setText(`unknown · unknown · free`)
    } else {
      this.bottomText.setText(this.replaceSkillId ? '' : 'S: StackOverflow')
    }
  }

  onUp() {
    if (this.confirmRemove) {
      this.removeConfirmIndex = this.removeConfirmIndex === 0 ? 1 : 0
      this.updateConfirmText()
      return
    }

    if (this.focus === 'left') {
      const count = this.getSlotCount()
      this.leftIndex = (this.leftIndex - 1 + count) % count
    } else {
      const known = this.getKnownSkills()
      if (known.length > 0) this.rightIndex = (this.rightIndex - 1 + known.length) % known.length
    }
    this.refresh()
  }

  onDown() {
    if (this.confirmRemove) {
      this.removeConfirmIndex = this.removeConfirmIndex === 0 ? 1 : 0
      this.updateConfirmText()
      return
    }

    if (this.focus === 'left') {
      const count = this.getSlotCount()
      this.leftIndex = (this.leftIndex + 1) % count
    } else {
      const known = this.getKnownSkills()
      if (known.length > 0) this.rightIndex = (this.rightIndex + 1) % known.length
    }
    this.refresh()
  }

  onLeft() {
    if (this.confirmRemove) return
    this.focus = 'left'
    this.refresh()
  }

  onRight() {
    if (this.confirmRemove || this.replaceSkillId) return
    if (this.getKnownSkills().length === 0) return
    this.focus = 'right'
    this.refresh()
  }

  commitDeck(nextDeck) {
    const nextState = buildSkillStateAfterDeckCommit(GameState.skills, nextDeck)
    GameState.skills.active = nextState.active
    GameState.skills.learned = nextState.learned
    GameState.skills.cursed = nextState.cursed
    markDirty()
  }

  onConfirm() {
    if (this.confirmRemove) {
      if (this.removeConfirmIndex === 0) {
        const nextDeck = removeSkillFromSlot(GameState.skills.active, this.selectedSlot, this.getSlotCount())
        this.commitDeck(nextDeck)
      }
      this.confirmRemove = false
      this.confirmText.setVisible(false)
      this.selectedSlot = null
      this.refresh()
      return
    }

    if (this.replaceSkillId) {
      const nextDeck = assignSkillToSlot(GameState.skills.active, this.leftIndex, this.replaceSkillId, this.getSlotCount())
      this.commitDeck(nextDeck)
      this.closeWithResult({ learned: true, skillId: this.replaceSkillId, replacedSlot: this.leftIndex })
      return
    }

    if (this.focus === 'left') {
      if (this.selectedSlot === null) {
        this.selectedSlot = this.leftIndex
      } else if (this.selectedSlot === this.leftIndex) {
        this.selectedSlot = null
      } else {
        const nextDeck = swapActiveSlots(GameState.skills.active, this.selectedSlot, this.leftIndex, this.getSlotCount())
        this.commitDeck(nextDeck)
        this.selectedSlot = null
      }
      this.refresh()
      return
    }

    if (this.focus === 'right' && this.selectedSlot !== null) {
      const known = this.getKnownSkills()
      const skillId = known[this.rightIndex]
      if (!skillId) return
      const nextDeck = assignSkillToSlot(GameState.skills.active, this.selectedSlot, skillId, this.getSlotCount())
      this.commitDeck(nextDeck)
      this.selectedSlot = null
      this.focus = 'left'
      this.refresh()
    }
  }

  onCancel() {
    if (this.confirmRemove) {
      this.confirmRemove = false
      this.confirmText.setVisible(false)
      this.refresh()
      return
    }

    if (this.replaceSkillId) {
      this.closeWithResult({ learned: false, skillId: this.replaceSkillId })
      return
    }

    if (this.selectedSlot !== null) {
      const selectedSkill = this.getActiveDeck()[this.selectedSlot]
      if (selectedSkill && this.focus === 'left') {
        this.confirmRemove = true
        this.removeConfirmIndex = 1
        this.updateConfirmText()
        this.confirmText.setVisible(true)
        return
      }
      this.selectedSlot = null
      this.focus = 'left'
      this.refresh()
      return
    }

    this.closeWithResult({ learned: false })
  }

  updateConfirmText() {
    const selectedSkill = this.getActiveDeck()[this.selectedSlot]
    const yes = this.removeConfirmIndex === 0 ? '[YES]' : ' YES '
    const no = this.removeConfirmIndex === 1 ? '[NO]' : ' NO '
    this.confirmText.setText(`Remove ${this.formatSkillName(selectedSkill)}?\n${yes} ${no}`)
  }

  closeWithResult(result) {
    if (this.returnSceneKey) {
      if (this.scene.isSleeping(this.returnSceneKey)) {
        this.scene.stop('SkillManagementScene')
        this.scene.wake(this.returnSceneKey, result)
        return
      }
      if (this.scene.isPaused(this.returnSceneKey)) {
        this.scene.stop('SkillManagementScene')
        this.scene.resume(this.returnSceneKey, result)
        return
      }
      this.fadeToScene(this.returnSceneKey, result)
      return
    }
    this.scene.stop('SkillManagementScene')
  }

  onStackOverflow() {
    if (this.replaceSkillId) return
    this.scene.pause()
    this.scene.launch('StackOverflowScene', {
      returnSceneKey: 'SkillManagementScene',
      returnSceneData: {},
    })
  }
}
