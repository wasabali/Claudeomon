import { BaseScene } from '#scenes/BaseScene.js'
import { CONFIG } from '../config.js'
import { GameState, grantXpOnce } from '#state/GameState.js'
import { getById as getThreadById, getByCommandId } from '#data/stackoverflow.js'
import { getAll as getAllSkills } from '#data/skills.js'

// StackOverflowScene — in-game command wiki themed as Stack Overflow (dark mode).
//
// Modes:
//   'list'   — scrollable list of all command threads with vote/answer boxes and tags
//   'detail' — scrollable Q&A view for a selected thread
//
// Navigation:
//   UP/DOWN  — scroll list or detail
//   Z        — open selected thread (list mode)
//   X        — back (detail → list, list → return scene)

// ── Stack Overflow dark-mode colour palette ──────────────────────────────────
const SO_ORANGE      = '#F48024'   // brand orange — logo, accents, selected rows
const SO_ORANGE_INT  = 0xF48024
const SO_BLUE        = '#6CBBF7'   // question title link colour (SO dark-mode)
const SO_WHITE       = '#E7E8EB'   // primary body text
const SO_MUTED       = '#9DAAB0'   // secondary text: authors, tags meta, separators
const SO_GREEN       = '#57AE78'   // accepted-answer badge text
const SO_GREEN_INT   = 0x2D6A4F   // accepted-answer box border
const SO_RED         = '#E06C5E'   // negative score, cursed hints
const SO_PAGE_BG     = 0x1c1d1e   // page background
const SO_CHROME_BG   = 0x27282B   // header / sidebar chrome
const SO_CARD_BG     = 0x232629   // question card / widget background
const SO_BORDER      = 0x3c3f41   // subtle UI borders
const SO_SEL_ROW     = 0x2A2D31   // selected row highlight
const SO_TAG_BG      = 0x1a3550   // tag badge background
const SO_TAG_TEXT    = '#9CC3E6'  // tag badge text
const SO_INPUT_BG    = 0x3B4148   // search-bar background
const SO_HEADER_TEXT = '#FFFFFF'

// ── Layout constants (1920 × 1080) ───────────────────────────────────────────
const HEADER_H   = 60   // top header bar height
const LEFT_W     = 200  // left navigation sidebar width
const RIGHT_W    = 240  // right blog-widget sidebar width
const MAIN_X     = LEFT_W
const MAIN_W     = CONFIG.WIDTH - LEFT_W - RIGHT_W   // 1480
const HEADING_H  = 62   // "All Questions" heading row height
const FILTER_H   = 42   // filter-tab row height
const LIST_Y     = HEADER_H + HEADING_H + FILTER_H   // first question row y (164)
const ROW_H      = 88   // question row height
const VISIBLE_ROWS = Math.floor((CONFIG.HEIGHT - LIST_Y) / ROW_H)  // 10
const VOTE_W     = 78   // vote-count box width
const VOTE_H     = 64   // vote-count box height
const ANS_W      = 78   // answer-count box width

// Font sizes (Press Start 2P, canvas 1920×1080)
const F_LOGO     = '20px'
const F_NAV      = '12px'
const F_HEADING  = '18px'
const F_FILTER   = '11px'
const F_TITLE    = '14px'
const F_META     = '10px'
const F_TAG      = '9px'
const F_VOTE_NUM = '20px'
const F_VOTE_LBL = '8px'
const F_BODY     = '13px'
const F_DETAIL   = '16px'

const DETAIL_LINE_H    = 36
const DETAIL_PER_PAGE  = Math.floor((CONFIG.HEIGHT - LIST_Y - 10) / DETAIL_LINE_H)  // ~25

export class StackOverflowScene extends BaseScene {
  constructor() {
    super({ key: 'StackOverflowScene' })
    this.mode = 'list'
    this.listIndex = 0
    this.listScroll = 0
    this.detailScroll = 0
    this.returnSceneKey = 'SkillManagementScene'
    this.returnSceneData = {}
    this._contentObjects = []
    this._rows = []
    this._detailLines = []
    this._currentThreadId = null
  }

  init(data = {}) {
    this.returnSceneKey = data.returnSceneKey ?? 'SkillManagementScene'
    this.returnSceneData = data.returnSceneData ?? {}
  }

  create() {
    this._drawStaticChrome()
    this._bindInput()
    this._buildRows()
    this._render()
    this.setupPauseKey()
  }

  // ── Static chrome — drawn once, never rebuilt ──────────────────────────────

  _drawStaticChrome() {
    const g = this.add.graphics()

    // Page background
    g.fillStyle(SO_PAGE_BG, 1)
    g.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT)

    // ── Header bar ───────────────────────────────────────────────────────────
    g.fillStyle(SO_CHROME_BG, 1)
    g.fillRect(0, 0, CONFIG.WIDTH, HEADER_H)
    // Orange bottom accent stripe
    g.fillStyle(SO_ORANGE_INT, 1)
    g.fillRect(0, HEADER_H - 3, CONFIG.WIDTH, 3)

    // ── Left navigation sidebar ───────────────────────────────────────────────
    g.fillStyle(SO_CHROME_BG, 1)
    g.fillRect(0, HEADER_H, LEFT_W, CONFIG.HEIGHT - HEADER_H)
    g.fillStyle(SO_BORDER, 1)
    g.fillRect(LEFT_W, HEADER_H, 1, CONFIG.HEIGHT - HEADER_H)

    // ── Right sidebar ─────────────────────────────────────────────────────────
    g.fillStyle(SO_CHROME_BG, 1)
    g.fillRect(CONFIG.WIDTH - RIGHT_W, HEADER_H, RIGHT_W, CONFIG.HEIGHT - HEADER_H)
    g.fillStyle(SO_BORDER, 1)
    g.fillRect(CONFIG.WIDTH - RIGHT_W - 1, HEADER_H, 1, CONFIG.HEIGHT - HEADER_H)

    // ── Heading-row bottom border ─────────────────────────────────────────────
    g.fillStyle(SO_BORDER, 1)
    g.fillRect(MAIN_X, HEADER_H + HEADING_H - 1, MAIN_W, 1)

    // ── Filter-tab row bottom border ──────────────────────────────────────────
    g.fillStyle(SO_BORDER, 1)
    g.fillRect(MAIN_X, HEADER_H + HEADING_H + FILTER_H - 1, MAIN_W, 1)

    // ── Search bar ────────────────────────────────────────────────────────────
    const searchX = LEFT_W + 20
    const searchY = 14
    const searchW = MAIN_W - 200
    const searchH = 32
    g.fillStyle(SO_INPUT_BG, 1)
    g.fillRect(searchX, searchY, searchW, searchH)
    g.lineStyle(1, SO_BORDER, 1)
    g.strokeRect(searchX, searchY, searchW, searchH)

    // ── Right sidebar: "The Overflow Blog" widget ─────────────────────────────
    const RX = CONFIG.WIDTH - RIGHT_W + 12
    const RY = HEADER_H + 16
    const RW = RIGHT_W - 24
    g.fillStyle(SO_CARD_BG, 1)
    g.fillRect(RX - 4, RY, RW + 8, 230)
    g.lineStyle(1, SO_BORDER, 1)
    g.strokeRect(RX - 4, RY, RW + 8, 230)
    // Widget header band
    g.fillStyle(SO_ORANGE_INT, 1)
    g.fillRect(RX - 4, RY, RW + 8, 30)

    this.add.text(RX + 4, RY + 15, 'The Overflow Blog', {
      fontFamily: CONFIG.FONT, fontSize: '9px', color: '#FFFFFF',
    }).setOrigin(0, 0.5)

    const blogLines = [
      '> Bash is a terrible',
      '  language. We use it',
      '  anyway.',
      '',
      '> Post-mortems written',
      '  at 3AM are legally',
      '  binding.',
      '',
      '> How I rm -rf\'d prod',
      '  and got a promotion.',
    ]
    blogLines.forEach((line, i) => {
      this.add.text(RX, RY + 42 + i * 17, line, {
        fontFamily: CONFIG.FONT, fontSize: '8px', color: SO_MUTED,
      })
    })

    // ── Header: logo ─────────────────────────────────────────────────────────
    // Small orange icon square before the logo text
    g.fillStyle(SO_ORANGE_INT, 1)
    g.fillRect(10, 18, 6, HEADER_H - 36)

    this.add.text(24, HEADER_H / 2, 'stack', {
      fontFamily: CONFIG.FONT, fontSize: F_LOGO, color: SO_WHITE,
    }).setOrigin(0, 0.5)
    this.add.text(24 + 76, HEADER_H / 2, 'overflow', {
      fontFamily: CONFIG.FONT, fontSize: F_LOGO, color: SO_ORANGE,
    }).setOrigin(0, 0.5)

    // Search placeholder
    this.add.text(searchX + 10, searchY + searchH / 2, 'Search commands...', {
      fontFamily: CONFIG.FONT, fontSize: F_FILTER, color: SO_MUTED,
    }).setOrigin(0, 0.5)

    // Header nav (right side)
    const headerNavItems = ['Log In', 'Sign Up']
    let navX = CONFIG.WIDTH - 16
    for (const item of [...headerNavItems].reverse()) {
      const t = this.add.text(navX, HEADER_H / 2, item, {
        fontFamily: CONFIG.FONT, fontSize: F_FILTER, color: SO_WHITE,
      }).setOrigin(1, 0.5)
      navX -= t.width + 28
    }

    // ── Left sidebar: navigation items ───────────────────────────────────────
    const navItems = [
      { label: 'Home',        active: false },
      { label: 'QUESTIONS',   active: true  },
      { label: 'Tags',        active: false },
      { label: 'Users',       active: false },
      { label: 'Unanswered',  active: false },
    ]
    let itemY = HEADER_H + 18
    for (const item of navItems) {
      if (item.active) {
        g.fillStyle(SO_SEL_ROW, 1)
        g.fillRect(0, itemY - 6, LEFT_W, 32)
        g.fillStyle(SO_ORANGE_INT, 1)
        g.fillRect(0, itemY - 6, 3, 32)
      }
      this.add.text(item.active ? 14 : 18, itemY + 10, item.label, {
        fontFamily: CONFIG.FONT, fontSize: F_NAV,
        color: item.active ? SO_WHITE : SO_MUTED,
      }).setOrigin(0, 0.5)
      itemY += 40
    }

    // Sidebar divider + stat
    g.fillStyle(SO_BORDER, 1)
    g.fillRect(8, itemY + 4, LEFT_W - 16, 1)
    this.add.text(12, itemY + 18, '2.7M questions', {
      fontFamily: CONFIG.FONT, fontSize: '9px', color: SO_MUTED,
    })

    // ── Persistent heading and count text ────────────────────────────────────
    this._headingText = this.add.text(
      MAIN_X + 16, HEADER_H + HEADING_H / 2, 'All Questions',
      { fontFamily: CONFIG.FONT, fontSize: F_HEADING, color: SO_WHITE },
    ).setOrigin(0, 0.5)

    this._headingCount = this.add.text(
      MAIN_X + 290, HEADER_H + HEADING_H / 2, '',
      { fontFamily: CONFIG.FONT, fontSize: F_FILTER, color: SO_MUTED },
    ).setOrigin(0, 0.5)

    // ── Keyboard hint (bottom-right) ──────────────────────────────────────────
    this.add.text(CONFIG.WIDTH - 12, CONFIG.HEIGHT - 12, 'UP/DOWN: scroll   Z: open   X: back', {
      fontFamily: CONFIG.FONT, fontSize: '10px', color: SO_MUTED,
    }).setOrigin(1, 1)
  }

  // ── Input ─────────────────────────────────────────────────────────────────

  _bindInput() {
    this.input.keyboard.on('keydown-UP', () => {
      if (this.mode === 'list') {
        if (!this._rows.length) return
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
        if (!this._rows.length) return
        this.listIndex = Math.min(this._rows.length - 1, this.listIndex + 1)
        this._adjustListScroll()
        this._render()
      } else {
        const maxScroll = Math.max(0, this._detailLines.length - DETAIL_PER_PAGE)
        this.detailScroll = Math.min(maxScroll, this.detailScroll + 1)
        this._render()
      }
    })

    this.input.keyboard.on('keydown-Z', () => {
      if (this.mode !== 'list') return
      const row = this._rows[this.listIndex]
      if (!row || !row.unlocked) return
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

  // ── Data ──────────────────────────────────────────────────────────────────

  _buildRows() {
    const learnedSet = new Set(GameState.skills.learned)
    this._rows = getAllSkills()
      .map(skill => {
        const thread = getByCommandId(skill.id)
        if (!thread) return null
        const unlocked = learnedSet.has(skill.id)
        // rm -rf gate: only visible at shame 5+
        if (skill.id === 'rm_rf' && GameState.player.shamePoints < 5) return null
        const topScore   = thread.answers.length > 0
          ? thread.answers.reduce((m, a) => Math.max(m, a.score), 0)
          : null
        const hasAccepted = thread.answers.some(a => a.isAccepted)
        return {
          threadId:      thread.id,
          commandId:     skill.id,
          displayName:   skill.displayName,
          questionTitle: thread.questionTitle,
          unlocked,
          isCursed:    skill.isCursed,
          topScore,
          answerCount: thread.answers.length,
          hasAccepted,
          tags:        thread.tags ?? [],
          askedBy:     thread.askedBy ?? 'anonymous',
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
    const thread = getThreadById(threadId)
    if (!thread) { this._detailLines = []; return }

    const MAX_CHARS = 92
    const wrap = (text) => {
      const words = text.split(' ')
      const result = []
      let line = ''
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word
        if (candidate.length > MAX_CHARS) {
          if (line) result.push(line)
          line = word
        } else {
          line = candidate
        }
      }
      if (line) result.push(line)
      return result
    }

    const lines = []

    // Question block
    lines.push({ text: `Q: ${thread.questionTitle}`, color: SO_BLUE, size: F_DETAIL })
    lines.push({ text: `  asked by ${thread.askedBy}`, color: SO_MUTED, size: F_META })
    lines.push({ text: `  tags: ${thread.tags.join('  ')}`, color: SO_TAG_TEXT, size: F_META })
    lines.push({ text: '──────────────────────────────────────────────────────────────────────────', color: SO_MUTED, size: F_META })

    for (const answer of thread.answers) {
      const badge       = answer.isAccepted ? '✓ ACCEPTED ANSWER' : '── ANSWER'
      const scoreLabel  = `▲ ${answer.score}`
      const headerColor = answer.score < 0 ? SO_RED : (answer.isAccepted ? SO_GREEN : SO_WHITE)
      lines.push({ text: `${badge}   ${scoreLabel}`, color: headerColor, size: F_FILTER })
      for (const l of wrap(answer.text)) {
        lines.push({ text: `  ${l}`, color: SO_WHITE, size: F_BODY })
      }
      lines.push({ text: `  — ${answer.author}`, color: SO_MUTED, size: F_META })
      if (answer.isCursedHint) {
        lines.push({ text: '  💀 [CURSED TECHNIQUE HINT]', color: SO_RED, size: F_META })
      }
      lines.push({ text: '', color: SO_MUTED, size: F_META })
    }

    if (thread.comments.length > 0) {
      lines.push({ text: `COMMENTS (${thread.comments.length})`, color: SO_ORANGE, size: F_FILTER })
      for (const comment of thread.comments) {
        for (const l of wrap(`${comment.text} — ${comment.author}`)) {
          lines.push({ text: `  ${l}`, color: SO_MUTED, size: F_META })
        }
      }
    }

    this._detailLines = lines
  }

  // ── Render ────────────────────────────────────────────────────────────────

  _render() {
    this._contentObjects.forEach(o => o.destroy())
    this._contentObjects = []

    if (this.mode === 'list') {
      this._headingText.setText('All Questions')
      this._headingCount.setText(`${this._rows.length} questions`)
      this._renderFilterTabs()
      this._renderList()
    } else {
      this._headingText.setText('Question')
      this._headingCount.setText('')
      this._renderDetailTags()
      this._renderDetail()
    }
  }

  _renderFilterTabs() {
    const tabY  = HEADER_H + HEADING_H + FILTER_H / 2
    const tabs  = ['Newest', 'Active', 'Unanswered']
    const tabG  = this.add.graphics()
    this._contentObjects.push(tabG)
    let tx = MAIN_X + 16
    for (const [i, tab] of tabs.entries()) {
      const isFirst = i === 0
      const color   = isFirst ? SO_HEADER_TEXT : SO_MUTED
      const textObj = this.add.text(tx + (isFirst ? 8 : 0), tabY, tab, {
        fontFamily: CONFIG.FONT, fontSize: F_FILTER, color,
      }).setOrigin(0, 0.5)
      if (isFirst) {
        tabG.fillStyle(SO_ORANGE_INT, 1)
        tabG.fillRect(tx, tabY - 14, textObj.width + 16, 28)
        textObj.setDepth(1)
      }
      this._contentObjects.push(textObj)
      tx += 130
    }
  }

  _renderList() {
    if (!this._rows.length) {
      this._contentObjects.push(
        this.add.text(MAIN_X + 30, LIST_Y + 40,
          'No commands discovered yet.\nDefeat trainers to learn skills.',
          { fontFamily: CONFIG.FONT, fontSize: F_TITLE, color: SO_MUTED, lineSpacing: 10 }),
      )
      return
    }

    const g = this.add.graphics()
    this._contentObjects.push(g)

    const visible = this._rows.slice(this.listScroll, this.listScroll + VISIBLE_ROWS)
    visible.forEach((row, i) => {
      const rowY      = LIST_Y + i * ROW_H
      const isSelected = (this.listScroll + i) === this.listIndex
      const alpha     = row.unlocked ? 1.0 : 0.45

      // Row background
      if (isSelected) {
        g.fillStyle(SO_SEL_ROW, 1)
        g.fillRect(MAIN_X, rowY, MAIN_W, ROW_H - 2)
        g.fillStyle(SO_ORANGE_INT, 1)
        g.fillRect(MAIN_X, rowY, 4, ROW_H - 2)
      }
      // Row bottom border
      g.fillStyle(SO_BORDER, 1)
      g.fillRect(MAIN_X, rowY + ROW_H - 1, MAIN_W, 1)

      const boxY       = rowY + (ROW_H - VOTE_H) / 2
      const voteBoxX   = MAIN_X + 16
      const ansBoxX    = voteBoxX + VOTE_W + 10
      const titleX     = ansBoxX + ANS_W + 18
      const titleMaxW  = MAIN_W - (titleX - MAIN_X) - 20

      // ── Vote-count box ────────────────────────────────────────────────────
      g.lineStyle(1, isSelected ? SO_ORANGE_INT : SO_BORDER, 1)
      g.strokeRect(voteBoxX, boxY, VOTE_W, VOTE_H)
      const voteLabel = row.unlocked ? (row.topScore ?? 0) : '?'
      this._contentObjects.push(
        this.add.text(voteBoxX + VOTE_W / 2, boxY + VOTE_H / 2 - 10, voteLabel, {
          fontFamily: CONFIG.FONT, fontSize: F_VOTE_NUM,
          color: isSelected ? SO_ORANGE : SO_WHITE,
        }).setOrigin(0.5, 0.5).setAlpha(alpha),
        this.add.text(voteBoxX + VOTE_W / 2, boxY + VOTE_H - 11, 'votes', {
          fontFamily: CONFIG.FONT, fontSize: F_VOTE_LBL, color: SO_MUTED,
        }).setOrigin(0.5, 0.5).setAlpha(alpha),
      )

      // ── Answer-count box ──────────────────────────────────────────────────
      const ansBorderColor = row.hasAccepted ? SO_GREEN_INT : SO_BORDER
      g.lineStyle(2, ansBorderColor, row.unlocked ? 1 : 0.4)
      g.strokeRect(ansBoxX, boxY, ANS_W, VOTE_H)
      const ansLabel    = row.unlocked ? row.answerCount : '?'
      const ansLblColor = row.hasAccepted ? SO_GREEN : SO_WHITE
      this._contentObjects.push(
        this.add.text(ansBoxX + ANS_W / 2, boxY + VOTE_H / 2 - 10, ansLabel, {
          fontFamily: CONFIG.FONT, fontSize: F_VOTE_NUM, color: ansLblColor,
        }).setOrigin(0.5, 0.5).setAlpha(alpha),
        this.add.text(ansBoxX + ANS_W / 2, boxY + VOTE_H - 11,
          row.hasAccepted ? 'accepted' : 'answers', {
            fontFamily: CONFIG.FONT, fontSize: F_VOTE_LBL,
            color: row.hasAccepted ? SO_GREEN : SO_MUTED,
          }).setOrigin(0.5, 0.5).setAlpha(alpha),
      )

      // ── Question title ────────────────────────────────────────────────────
      const titleColor = !row.unlocked ? SO_MUTED : (row.isCursed ? SO_RED : SO_BLUE)
      const titleText  = row.unlocked
        ? `${row.questionTitle}${row.isCursed ? '  [!]' : ''}`
        : `🔒 [LOCKED] — ${row.displayName}`
      this._contentObjects.push(
        this.add.text(titleX, rowY + 14, titleText, {
          fontFamily: CONFIG.FONT, fontSize: F_TITLE, color: titleColor,
          wordWrap: { width: titleMaxW },
        }).setAlpha(alpha),
      )

      // ── Tags + meta ───────────────────────────────────────────────────────
      if (row.unlocked && row.tags.length) {
        let tagX  = titleX
        const tagY = rowY + ROW_H - 24
        for (const tag of row.tags.slice(0, 5)) {
          const tt = this.add.text(tagX + 6, tagY + 9, tag, {
            fontFamily: CONFIG.FONT, fontSize: F_TAG, color: SO_TAG_TEXT,
          }).setOrigin(0, 0.5).setDepth(1)
          const tw = tt.width + 12
          g.fillStyle(SO_TAG_BG, 1)
          g.fillRect(tagX, tagY, tw, 18)
          this._contentObjects.push(tt)
          tagX += tw + 8
        }
        this._contentObjects.push(
          this.add.text(tagX + 10, rowY + ROW_H - 15, `asked by ${row.askedBy}`, {
            fontFamily: CONFIG.FONT, fontSize: F_META, color: SO_MUTED,
          }).setOrigin(0, 0.5),
        )
      }
    })

    // Scroll indicators
    if (this.listScroll > 0) {
      this._contentObjects.push(
        this.add.text(MAIN_X + MAIN_W / 2, LIST_Y - 18, '▲ scroll up', {
          fontFamily: CONFIG.FONT, fontSize: F_FILTER, color: SO_MUTED,
        }).setOrigin(0.5, 0.5),
      )
    }
    if (this.listScroll + VISIBLE_ROWS < this._rows.length) {
      this._contentObjects.push(
        this.add.text(MAIN_X + MAIN_W / 2, LIST_Y + VISIBLE_ROWS * ROW_H + 14, '▼ more questions', {
          fontFamily: CONFIG.FONT, fontSize: F_FILTER, color: SO_MUTED,
        }).setOrigin(0.5, 0.5),
      )
    }
  }

  _renderDetailTags() {
    const thread = getThreadById(this._currentThreadId)
    if (!thread) return
    const g    = this.add.graphics()
    this._contentObjects.push(g)
    let tagX   = MAIN_X + 16
    const tagY = HEADER_H + HEADING_H + FILTER_H / 2
    for (const tag of (thread.tags ?? []).slice(0, 8)) {
      const tt = this.add.text(tagX + 6, tagY, tag, {
        fontFamily: CONFIG.FONT, fontSize: F_TAG, color: SO_TAG_TEXT,
      }).setOrigin(0, 0.5).setDepth(1)
      const tw = tt.width + 12
      g.fillStyle(SO_TAG_BG, 1)
      g.fillRect(tagX, tagY - 9, tw, 18)
      this._contentObjects.push(tt)
      tagX += tw + 8
    }
  }

  _renderDetail() {
    if (!this._detailLines.length) return
    const startY  = LIST_Y + 8
    const visible = this._detailLines.slice(this.detailScroll, this.detailScroll + DETAIL_PER_PAGE)
    visible.forEach((line, i) => {
      this._contentObjects.push(
        this.add.text(MAIN_X + 24, startY + i * DETAIL_LINE_H, line.text, {
          fontFamily: CONFIG.FONT,
          fontSize:   line.size ?? F_BODY,
          color:      line.color,
          wordWrap:   { width: MAIN_W - 48 },
        }),
      )
    })
    const hasMore = this.detailScroll + DETAIL_PER_PAGE < this._detailLines.length
    if (hasMore) {
      this._contentObjects.push(
        this.add.text(MAIN_X + MAIN_W / 2,
          startY + DETAIL_PER_PAGE * DETAIL_LINE_H + 6, '▼ more   X: back', {
            fontFamily: CONFIG.FONT, fontSize: F_FILTER, color: SO_MUTED,
          }).setOrigin(0.5, 0),
      )
    }
  }
}
