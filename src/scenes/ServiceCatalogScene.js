import { BaseScene } from '#scenes/BaseScene.js'
import { CONFIG } from '../config.js'
import { GameState } from '#state/GameState.js'
import { getAll, getById } from '#data/skills.js'

const TABS = ['SKILLS', 'CERTS', 'RECORD']

const CERTS = [
  {
    id: 'az_900',
    name: 'AZ-900 — Cloud Fundamentals',
    description: 'You know the cloud basics and can explain them under pressure.',
    hint: 'Complete Act 1.',
    dateFlags: ['az_900_earned_at'],
    earned: () => GameState.story.act > 1 || GameState.story.flags.act_1_complete === true,
  },
  {
    id: 'az_104',
    name: 'AZ-104 — Azure Administrator',
    description: 'Provisioning and identity management are now muscle memory.',
    hint: 'Complete the Azure gym chain.',
    dateFlags: ['az_104_earned_at'],
    earned: () => GameState.story.flags.azure_gym_chain_complete === true,
  },
  {
    id: 'cka',
    name: 'CKA — Kubernetes Administrator',
    description: 'Cluster control restored. The kube demons now respect you.',
    hint: 'Beat The Kube-rnetes Master.',
    dateFlags: ['cka_earned_at'],
    earned: () => GameState.story.flags.beat_kube_rnetes_master === true,
  },
  {
    id: 'ckad',
    name: 'CKAD — Kubernetes Developer',
    description: 'Your manifests are clean, concise, and battle tested.',
    hint: 'Beat Helm Hansen.',
    dateFlags: ['ckad_earned_at'],
    earned: () => GameState.story.flags.beat_helm_hansen === true,
  },
  {
    id: 'aws_saa',
    name: 'AWS-SAA — (cursed cert)',
    description: 'A forbidden cloud detour now stains your professional profile.',
    hint: 'Find the Deprecated Azure Region hidden area.',
    dateFlags: ['aws_saa_earned_at'],
    earned: () => GameState.story.flags.deprecated_azure_region_found === true,
  },
  {
    id: 'linux_plus',
    name: 'CompTIA Linux+',
    description: 'Shell instincts unlocked. You can debug in pure terminal darkness.',
    hint: 'Beat Tux the Terminal Wizard.',
    dateFlags: ['linux_plus_earned_at'],
    earned: () => GameState.story.flags.beat_tux_terminal_wizard === true,
  },
  {
    id: 'terraform_associate',
    name: 'Terraform Associate',
    description: 'Infrastructure now bends to your immutable declarations.',
    hint: 'Complete the IaC quest chain.',
    dateFlags: ['terraform_associate_earned_at'],
    earned: () => GameState.story.flags.iac_quest_chain_complete === true,
  },
  {
    id: 'cism',
    name: 'CISM — (shame-gated)',
    description: 'You have seen things in prod that changed you permanently.',
    hint: 'Accumulate 7+ Shame Points.',
    dateFlags: ['cism_earned_at'],
    earned: () => GameState.player.shamePoints >= 7,
  },
]

const ROWS_PER_PAGE = 6

export class ServiceCatalogScene extends BaseScene {
  constructor() {
    super({ key: 'ServiceCatalogScene' })
    this.activeTab = 0
    this.selectedSkill = 0
    this.selectedCert = 0
    this.expandedSkillId = null
    this.returnSceneKey = 'AzureTerminalScene'
    this.returnSceneData = {}
    this.contentObjects = []
  }

  init(data = {}) {
    this.returnSceneKey = data.returnSceneKey ?? 'AzureTerminalScene'
    this.returnSceneData = data.returnSceneData ?? {}
  }

  create() {
    this._createPanelTexture()

    this.backgroundPanel = this._addPanel(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, CONFIG.WIDTH - 8, CONFIG.HEIGHT - 8)
    this.tabPanel = this._addPanel(CONFIG.WIDTH / 2, 13, CONFIG.WIDTH - 16, 18)
    this.contentPanel = this._addPanel(CONFIG.WIDTH / 2, 72, CONFIG.WIDTH - 16, 92)
    this.footerPanel = this._addPanel(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 10, CONFIG.WIDTH - 16, 16)

    this.tabText = this.add.text(10, 9, '', {
      fontFamily: CONFIG.FONT,
      fontSize: '8px',
      color: '#0f380f',
    })

    this.footerText = this.add.text(10, CONFIG.HEIGHT - 14, '◄ ► tabs    Z: details    X: back', {
      fontFamily: CONFIG.FONT,
      fontSize: '6px',
      color: '#0f380f',
    })

    this._bindInput()
    this._render()
  }

  update() {
    if (this.activeTab === 2) this._render()
  }

  _bindInput() {
    this.input.keyboard.on('keydown-LEFT', () => {
      this.activeTab = (this.activeTab + TABS.length - 1) % TABS.length
      this.expandedSkillId = null
      this._render()
    })

    this.input.keyboard.on('keydown-RIGHT', () => {
      this.activeTab = (this.activeTab + 1) % TABS.length
      this.expandedSkillId = null
      this._render()
    })

    this.input.keyboard.on('keydown-UP', () => {
      if (this.activeTab === 0) {
        const rows = this._getSkillRows()
        if (rows.selectable.length > 0) {
          this.selectedSkill = (this.selectedSkill + rows.selectable.length - 1) % rows.selectable.length
          this.expandedSkillId = null
          this._render()
        }
      } else if (this.activeTab === 1) {
        this.selectedCert = (this.selectedCert + CERTS.length - 1) % CERTS.length
        this._render()
      }
    })

    this.input.keyboard.on('keydown-DOWN', () => {
      if (this.activeTab === 0) {
        const rows = this._getSkillRows()
        if (rows.selectable.length > 0) {
          this.selectedSkill = (this.selectedSkill + 1) % rows.selectable.length
          this.expandedSkillId = null
          this._render()
        }
      } else if (this.activeTab === 1) {
        this.selectedCert = (this.selectedCert + 1) % CERTS.length
        this._render()
      }
    })

    this.input.keyboard.on('keydown-Z', () => {
      if (this.activeTab !== 0) return
      const rows = this._getSkillRows()
      if (rows.selectable.length === 0) return
      const selected = rows.selectable[this.selectedSkill]
      if (!selected.discovered) return

      this.expandedSkillId = this.expandedSkillId === selected.skillId ? null : selected.skillId
      this._render()
    })

    this.input.keyboard.on('keydown-X', () => {
      this.fadeToScene(this.returnSceneKey, this.returnSceneData)
    })
  }

  _render() {
    this.tabText.setText(TABS.map((tab, index) => (index === this.activeTab ? `[${tab}]` : ` ${tab} `)).join('  '))

    this.contentObjects.forEach((obj) => obj.destroy())
    this.contentObjects = []

    if (this.activeTab === 0) {
      this._renderSkills()
      return
    }

    if (this.activeTab === 1) {
      this._renderCerts()
      return
    }

    this._renderRecord()
  }

  _getSkillRows() {
    const learned = new Set(GameState.skills.learned)
    const allSkills = getAll()
      .map((skill) => getById(skill.id))
      .filter(Boolean)
      .sort((a, b) => a.domain.localeCompare(b.domain) || a.displayName.localeCompare(b.displayName))

    const grouped = allSkills.reduce((acc, skill) => {
      if (!acc[skill.domain]) acc[skill.domain] = []
      acc[skill.domain].push(skill)
      return acc
    }, {})

    const rows = []
    const selectable = []

    Object.keys(grouped).forEach((domain) => {
      const domainSkills = grouped[domain]
      const complete = domainSkills.length > 0 && domainSkills.every((skill) => learned.has(skill.id))
      rows.push({ type: 'header', label: `${domain.toUpperCase()}${complete ? ' ★' : ''}` })

      domainSkills.forEach((skill) => {
        const discovered = learned.has(skill.id)
        const row = {
          type: 'skill',
          skillId: skill.id,
          discovered,
          isCursed: skill.isCursed,
          label: discovered ? `${skill.displayName}${skill.isCursed ? ' [!]' : ''}` : '???????????????',
        }
        rows.push(row)
        selectable.push(row)
      })
    })

    if (this.selectedSkill >= selectable.length) this.selectedSkill = Math.max(0, selectable.length - 1)

    return { rows, selectable }
  }

  _renderSkills() {
    const { rows, selectable } = this._getSkillRows()
    const selectedSkill = selectable[this.selectedSkill]
    const selectedIndex = rows.findIndex((row) => row.type === 'skill' && row.skillId === selectedSkill?.skillId)

    const start = Math.max(0, selectedIndex - Math.floor(ROWS_PER_PAGE / 2))
    const visible = rows.slice(start, start + ROWS_PER_PAGE)

    if (rows.length === 0) {
      this.contentObjects.push(this.add.text(12, 50, 'No skills in catalog yet.', {
        fontFamily: CONFIG.FONT,
        fontSize: '6px',
        color: '#0f380f',
      }))
      return
    }

    visible.forEach((row, index) => {
      if (row.type === 'header') {
        this.contentObjects.push(this.add.text(14, 26 + (index * 10), row.label, {
          fontFamily: CONFIG.FONT,
          fontSize: '6px',
          color: '#8bac0f',
        }))
        return
      }

      const isSelected = row.skillId === selectedSkill?.skillId
      this.contentObjects.push(this.add.text(14, 26 + (index * 10), `${isSelected ? '► ' : '  '}${row.label}`, {
        fontFamily: CONFIG.FONT,
        fontSize: '6px',
        color: isSelected ? '#0f380f' : '#306230',
      }))
    })

    if (!selectedSkill) return

    const skill = getById(selectedSkill.skillId)
    if (!selectedSkill.discovered) {
      this.contentObjects.push(this.add.text(12, 95, '???????????????', {
        fontFamily: CONFIG.FONT,
        fontSize: '6px',
        color: '#306230',
      }))
      this.contentObjects.push(this.add.text(12, 103, '??? · ???', {
        fontFamily: CONFIG.FONT,
        fontSize: '6px',
        color: '#8bac0f',
      }))
      this.contentObjects.push(this.add.text(12, 111, 'Learn this from a trainer.', {
        fontFamily: CONFIG.FONT,
        fontSize: '6px',
        color: '#8bac0f',
      }))
      return
    }

    const useCount = GameState.stats.skillUseCounts?.[skill.id] ?? 0
    this.contentObjects.push(this.add.text(12, 95, `${skill.domain} · ${skill.tier}`, {
      fontFamily: CONFIG.FONT,
      fontSize: '6px',
      color: '#8bac0f',
    }))

    const description = this.expandedSkillId === skill.id
      ? `${skill.description || ''}${skill.budgetCost > 0 ? `\nBudget: ${skill.budgetCost}` : '\nBudget: 0'}${skill.isCursed ? '\nCursed: YES' : '\nCursed: NO'}`
      : `${skill.description || ''}`

    this.contentObjects.push(this.add.text(12, 103, description, {
      fontFamily: CONFIG.FONT,
      fontSize: '6px',
      color: '#306230',
      wordWrap: { width: 136 },
      maxLines: 3,
    }))

    this.contentObjects.push(this.add.text(12, 127, `Used: ${useCount} times`, {
      fontFamily: CONFIG.FONT,
      fontSize: '6px',
      color: '#306230',
    }))
  }

  _resolveCertDate(cert) {
    for (const flag of cert.dateFlags) {
      const value = GameState.story.flags[flag]
      if (typeof value === 'string' && value.length > 0) return value
    }
    return 'Unknown'
  }

  _renderCerts() {
    const start = Math.max(0, this.selectedCert - Math.floor(ROWS_PER_PAGE / 2))
    const visible = CERTS.slice(start, start + ROWS_PER_PAGE)

    visible.forEach((cert, index) => {
      const certIndex = start + index
      const selected = certIndex === this.selectedCert
      const earned = cert.earned()

      this.contentObjects.push(this.add.text(12, 25 + (index * 18), `${selected ? '►' : ' '} ${earned ? '▣' : '▢'} ${cert.name}`, {
        fontFamily: CONFIG.FONT,
        fontSize: '6px',
        color: selected ? '#0f380f' : '#306230',
      }))

      this.contentObjects.push(this.add.text(18, 33 + (index * 18), earned
        ? `${cert.description}\nEarned: ${this._resolveCertDate(cert)}`
        : `[LOCKED] ${cert.hint}`, {
        fontFamily: CONFIG.FONT,
        fontSize: '6px',
        color: earned ? '#8bac0f' : '#306230',
        wordWrap: { width: 126 },
      }))
    })
  }

  _renderRecord() {
    const shame = GameState.player.shamePoints
    const cursed = GameState.stats.cursedTechniquesUsed
    const cursedColor = cursed > 0 ? '#ff4d4d' : '#306230'

    const title = GameState.player.level >= 10 ? 'Senior Engineer' : 'Engineer'
    const techDebtPenalty = GameState.player.technicalDebt * 2

    const lines = [
      'CAREER RECORD',
      '',
      `Title          ${title}`,
      `Current Rep    ${GameState.player.reputation} / 100`,
      `Shame          ${'█'.repeat(Math.min(10, shame)) || '░'}  ${shame} pts ${shame > 0 ? '☠' : ''}`,
      `Technical Debt ${'█'.repeat(Math.min(10, GameState.player.technicalDebt)) || '░'}  ${GameState.player.technicalDebt} stacks (-${techDebtPenalty} max HP)`,
      '',
      `Battles Won    ${GameState.stats.battlesWon}`,
      `Battles Lost   ${GameState.stats.battlesLost}`,
      `Incidents Resolved ${GameState.stats.incidentsResolved}`,
      `Deployments    ${GameState.stats.deployments ?? 0}`,
      `Longest Uptime ${GameState.stats.longestUptimeTurns ?? 0} turns`,
    ]

    this.contentObjects.push(this.add.text(12, 24, lines.join('\n'), {
      fontFamily: CONFIG.FONT,
      fontSize: '6px',
      color: '#306230',
      lineSpacing: 1,
    }))

    this.contentObjects.push(this.add.text(12, 122, `Cursed Techniques  ${cursed}`, {
      fontFamily: CONFIG.FONT,
      fontSize: '6px',
      color: cursedColor,
    }))

    if (shame >= 7) {
      this.contentObjects.push(this.add.text(12, 130, 'THROTTLEMASTER: "Someone is watching your record..."', {
        fontFamily: CONFIG.FONT,
        fontSize: '6px',
        color: '#ff4d4d',
      }))
    }
  }

  _createPanelTexture() {
    const key = 'ui_service_catalog_panel_9slice'
    if (this.textures.exists(key)) return

    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(0xe0f8d0, 1)
    graphics.fillRect(0, 0, 24, 24)
    graphics.fillStyle(0x306230, 1)
    graphics.fillRect(0, 0, 24, 2)
    graphics.fillRect(0, 22, 24, 2)
    graphics.fillRect(0, 0, 2, 24)
    graphics.fillRect(22, 0, 2, 24)
    graphics.fillStyle(0x0f380f, 1)
    graphics.fillRect(0, 0, 24, 1)
    graphics.fillRect(0, 23, 24, 1)
    graphics.fillRect(0, 0, 1, 24)
    graphics.fillRect(23, 0, 1, 24)
    graphics.generateTexture(key, 24, 24)
    graphics.destroy()
  }

  _addPanel(x, y, width, height) {
    if (typeof this.add.nineslice === 'function') {
      return this.add.nineslice(x, y, 'ui_service_catalog_panel_9slice', undefined, width, height, 4, 4, 4, 4)
    }

    return this.add.rectangle(x, y, width, height, 0xe0f8d0).setStrokeStyle(1, 0x306230)
  }
}
