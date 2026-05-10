import { BaseScene } from '#scenes/BaseScene.js'
import { CONFIG } from '../config.js'
import { GameState, grantXpOnce } from '#state/GameState.js'
import { getById as getThreadById, getByCommandId } from '#data/stackoverflow.js'
import { getAll as getAllSkills } from '#data/skills.js'

// StackOverflowScene — in-game command wiki themed as Stack Overflow.
//
// Modes:
//   'list'   — scrollable list of all command threads (locked/unlocked)
//   'detail' — scrollable Q&A view for a selected thread
//
// Navigation:
//   UP/DOWN  — scroll list or detail
//   Z        — open selected thread (list mode)
//   X        — back (detail → list, list → return scene)

// Stack Overflow authentic colour palette
const SO_ORANGE      = '#F48024'   // brand orange — header, selected row, comments heading
const SO_BLUE        = '#6CBBF7'   // question title blue (SO dark-mode link colour)
const SO_WHITE       = '#E7E8EB'   // body text, unselected rows
const SO_MUTED       = '#9DAAB0'   // authors, tags, separators, footer, locked rows
const SO_GREEN       = '#57AE78'   // accepted-answer badge
const SO_RED         = '#E06C5E'   // negative score, cursed hints
const SO_HEADER_TEXT = '#FFFFFF'   // white text on the orange header bar
const SO_HEADER_FILL = 0xF48024   // header bar fill (hex integer for Phaser graphics)
const FONT_SIZE             = '8px'
const PANEL_INSET           = 4    // gap from screen edge to all panels
const HEADER_H              = 56   // actual panel height of the header bar
const FOOTER_H              = 52   // actual panel height of the footer bar
const CONTENT_X             = 24   // left padding for content
const CONTENT_Y_PAD         = 16   // gap between header panel bottom and first content row
const CONTENT_Y_START       = PANEL_INSET + HEADER_H + CONTENT_Y_PAD  // first content row y
const ROW_H                 = 40   // vertical spacing between rows
const VISIBLE_ROWS          = 23   // max rows shown in list view
const DETAIL_LINES_PER_PAGE = 23

export class StackOverflowScene extends BaseScene {
  constructor() {
    super({ key: 'StackOverflowScene' })
    this.mode = 'list'
    this.listIndex = 0
    this.listScroll = 0
    this.detailScroll = 0
    this.returnSceneKey = 'SkillManagementScene'
    this.returnSceneData = {}
    this.contentObjects = []
    this._rows = []
    this._detailLines = []
    this._currentThreadId = null
  }

  init(data = {}) {
    this.returnSceneKey = data.returnSceneKey ?? 'SkillManagementScene'
    this.returnSceneData = data.returnSceneData ?? {}
  }

  create() {
    this._ensurePanelTexture()

    // Background panel covering the full canvas
    this._bgPanel = this._addPanel(PANEL_INSET, PANEL_INSET, CONFIG.WIDTH - PANEL_INSET * 2, CONFIG.HEIGHT - PANEL_INSET * 2)
    // Header bar at the top
    this._headerPanel = this._addPanel(PANEL_INSET, PANEL_INSET, CONFIG.WIDTH - PANEL_INSET * 2, HEADER_H)
    // Footer bar at the bottom
    this._footerPanel = this._addPanel(PANEL_INSET, CONFIG.HEIGHT - PANEL_INSET - FOOTER_H, CONFIG.WIDTH - PANEL_INSET * 2, FOOTER_H)

    // Orange header bar — matches Stack Overflow's brand header colour
    this._headerOverlay = this.add.rectangle(
      PANEL_INSET, PANEL_INSET,
      CONFIG.WIDTH - PANEL_INSET * 2, HEADER_H,
      SO_HEADER_FILL,
    )
    this._headerOverlay.setOrigin(0, 0)

    this._headerText = this.add.text(CONTENT_X, PANEL_INSET + CONTENT_Y_PAD, 'STACKOVERFLOW', {
      fontFamily: CONFIG.FONT,
      fontSize: FONT_SIZE,
      color: SO_HEADER_TEXT,
    })

    this._footerText = this.add.text(CONTENT_X, CONFIG.HEIGHT - PANEL_INSET - FOOTER_H + CONTENT_Y_PAD, '', {
      fontFamily: CONFIG.FONT,
      fontSize: FONT_SIZE,
      color: SO_MUTED,
    })

    this._bindInput()
    this._buildRows()
    this._render()
    this.setupPauseKey()
  }

  _bindInput() {
    this.input.keyboard.on('keydown-UP', () => {
      if (this.mode === 'list') {
        if (this._rows.length === 0) return
        this.listIndex = Math.max(0, this.listIndex - 1)
        this._adjustListScroll()
        this._render()
      } else {
        this.detailScroll = Math.max(0, this.detailScroll - 1)
        this._render()
      }
    })

    this.input.keyboard.on('keydown-DOWN', () => {
      if (this.mode === 'list') {
        if (this._rows.length === 0) return
        this.listIndex = Math.min(this._rows.length - 1, this.listIndex + 1)
        this._adjustListScroll()
        this._render()
      } else {
        const maxScroll = Math.max(0, this._detailLines.length - DETAIL_LINES_PER_PAGE)
        this.detailScroll = Math.min(maxScroll, this.detailScroll + 1)
        this._render()
      }
    })

    this.input.keyboard.on('keydown-Z', () => {
      if (this.mode !== 'list') return
      const row = this._rows[this.listIndex]
      if (!row) return
      if (!row.unlocked) return
      this._openThread(row.threadId)
    })

    this.input.keyboard.on('keydown-X', () => {
      if (this.mode === 'detail') {
        this.mode = 'list'
        this.detailScroll = 0
        this._currentThreadId = null
        this._detailLines = []
        this._render()
        return
      }
      this._close()
    })
  }

  _close() {
    if (this.scene.isPaused(this.returnSceneKey)) {
      this.scene.stop('StackOverflowScene')
      this.scene.resume(this.returnSceneKey, this.returnSceneData)
    } else if (this.returnSceneKey) {
      this.fadeToScene(this.returnSceneKey, this.returnSceneData)
    } else {
      this.scene.stop('StackOverflowScene')
    }
  }

  _buildRows() {
    const learnedSet = new Set(GameState.skills.learned)
    const allSkills = getAllSkills()

    // Build ordered list: one row per skill that has a thread
    this._rows = allSkills
      .map(skill => {
        const thread = getByCommandId(skill.id)
        if (!thread) return null
        const unlocked = learnedSet.has(skill.id)
        // rm -rf gate: only visible at shame 5+
        if (skill.id === 'rm_rf' && GameState.player.shamePoints < 5) return null
        return {
          threadId: thread.id,
          commandId: skill.id,
          displayName: skill.displayName,
          unlocked,
          isCursed: skill.isCursed,
        }
      })
      .filter(Boolean)
  }

  _adjustListScroll() {
    if (this.listIndex < this.listScroll) this.listScroll = this.listIndex
    if (this.listIndex >= this.listScroll + VISIBLE_ROWS) {
      this.listScroll = this.listIndex - VISIBLE_ROWS + 1
    }
  }

  _openThread(threadId) {
    this._currentThreadId = threadId
    this.mode = 'detail'
    this.detailScroll = 0
    this._buildDetailLines(threadId)
    grantXpOnce(`so_read_${threadId}`, 5)
    this._render()
  }

  _buildDetailLines(threadId) {
    const thread = this._getThread(threadId)
    if (!thread) { this._detailLines = []; return }

    const lines = []
    const wrap = (text, maxLen) => {
      const words = text.split(' ')
      const result = []
      let line = ''
      for (const word of words) {
        if ((line + (line ? ' ' : '') + word).length > maxLen) {
          if (line) result.push(line)
          line = word
        } else {
          line = line ? `${line} ${word}` : word
        }
      }
      if (line) result.push(line)
      return result
    }

    const MAX_CHARS = 80

    // Question header
    lines.push({ text: `Q: ${thread.questionTitle}`, color: SO_BLUE })
    lines.push({ text: `Asked by: ${thread.askedBy}`, color: SO_MUTED })
    lines.push({ text: `Tags: ${thread.tags.join(' ')}`, color: SO_MUTED })
    lines.push({ text: '────────────────────────', color: SO_MUTED })

    // Answers
    for (const answer of thread.answers) {
      const badge = answer.isAccepted ? '✓ ACCEPTED' : 'ANSWER'
      const scoreColor = answer.score < 0 ? SO_RED : (answer.isAccepted ? SO_GREEN : SO_WHITE)
      lines.push({ text: `${badge} (Score: ${answer.score})`, color: scoreColor })
      for (const l of wrap(answer.text, MAX_CHARS)) {
        lines.push({ text: l, color: SO_WHITE })
      }
      lines.push({ text: `— ${answer.author}`, color: SO_MUTED })
      if (answer.isCursedHint) {
        lines.push({ text: '💀 [CURSED TECHNIQUE HINT]', color: SO_RED })
      }
      lines.push({ text: '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄', color: SO_MUTED })
    }

    // Comments
    if (thread.comments.length > 0) {
      lines.push({ text: `COMMENTS (${thread.comments.length})`, color: SO_ORANGE })
      for (const comment of thread.comments) {
        for (const l of wrap(`${comment.text} — ${comment.author}`, MAX_CHARS)) {
          lines.push({ text: `  ${l}`, color: SO_MUTED })
        }
      }
    }

    this._detailLines = lines
  }

  _getThread(threadId) {
    return getThreadById(threadId)
  }

  _render() {
    this.contentObjects.forEach(o => o.destroy())
    this.contentObjects = []

    if (this.mode === 'list') {
      this._renderList()
    } else {
      this._renderDetail()
    }
  }

  _renderList() {
    if (this._rows.length === 0) {
      this.contentObjects.push(this.add.text(CONTENT_X, CONTENT_Y_START, 'No commands discovered yet.\nBeat trainers to learn skills.', {
        fontFamily: CONFIG.FONT,
        fontSize: FONT_SIZE,
        color: SO_MUTED,
        lineSpacing: 6,
      }))
      this._footerText.setText('X: back')
      return
    }

    const visible = this._rows.slice(this.listScroll, this.listScroll + VISIBLE_ROWS)
    visible.forEach((row, i) => {
      const isSelected = this.listScroll + i === this.listIndex
      const prefix = isSelected ? '►' : ' '
      const lockIcon = row.unlocked ? ' ' : '🔒'
      const cursedMark = row.isCursed ? '[!]' : ''
      const label = row.unlocked
        ? `${prefix}${lockIcon}${row.displayName}${cursedMark}`
        : `${prefix}${lockIcon}[LOCKED]`
      const color = !row.unlocked ? SO_MUTED
        : (row.isCursed ? SO_RED : (isSelected ? SO_ORANGE : SO_WHITE))

      this.contentObjects.push(this.add.text(CONTENT_X, CONTENT_Y_START + i * ROW_H, label, {
        fontFamily: CONFIG.FONT,
        fontSize: FONT_SIZE,
        color,
      }))
    })

    const selected = this._rows[this.listIndex]
    const hint = selected && !selected.unlocked
      ? 'Defeat a trainer to unlock'
      : (selected ? 'Z: open  X: back' : 'X: back')
    this._footerText.setText(hint)
    this._headerText.setText('STACKOVERFLOW')
  }

  _renderDetail() {
    if (!this._detailLines.length) {
      this._footerText.setText('X: back')
      return
    }

    const visible = this._detailLines.slice(this.detailScroll, this.detailScroll + DETAIL_LINES_PER_PAGE)
    visible.forEach((line, i) => {
      const obj = this.add.text(CONTENT_X, CONTENT_Y_START + i * ROW_H, line.text, {
        fontFamily: CONFIG.FONT,
        fontSize: FONT_SIZE,
        color: line.color,
        wordWrap: { width: CONFIG.WIDTH - CONTENT_X * 2 },
      })
      this.contentObjects.push(obj)
    })

    const total = this._detailLines.length
    const hasMore = this.detailScroll + DETAIL_LINES_PER_PAGE < total
    this._footerText.setText(hasMore ? '▼ more  X: back' : 'X: back')
    this._headerText.setText('STACKOVERFLOW')
  }

  _ensurePanelTexture() {
    // No-op: BaseScene.createPanel() handles 'ui_window' loading via BootScene.
  }

  _addPanel(x, y, width, height) {
    // Delegate to BaseScene which uses the loaded 'ui_window' asset with 8px corners
    return this.createPanel(x, y, width, height)
  }
}
