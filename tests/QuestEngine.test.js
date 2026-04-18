import { describe, it, expect } from 'vitest'
import {
  resolveBranchChoice,
  resolveBranchBattleOutcome,
  resolveQuizAnswer,
  getBranchLabels,
  resolveChoice,
  isQuestCompleted,
  getCompletedDialog,
  isQuestAvailable,
  getQuestStatus,
  startQuest,
  getCurrentStage,
  advanceStage,
  getIvanLocation,
  canAdvanceAliceStage,
} from '../src/engine/QuestEngine.js'

// ---------------------------------------------------------------------------
// Helper: creates a fresh story state for tests
// ---------------------------------------------------------------------------
function freshStory(overrides = {}) {
  return {
    act:             1,
    completedQuests: [],
    flags:           { act_1_started: true },
    activeQuests:    {},
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Helper: creates a fresh player state for tests
// ---------------------------------------------------------------------------
function freshPlayer(overrides = {}) {
  return {
    hp:          100,
    maxHp:       100,
    reputation:  50,
    shamePoints: 0,
    ...overrides,
  }
}

describe('QuestEngine — branch quest type', () => {
  describe('getBranchLabels', () => {
    it('returns labels for do_not_touch quest', () => {
      const labels = getBranchLabels('do_not_touch')
      expect(labels).toHaveLength(2)
      expect(labels[0]).toEqual({ key: 'open', label: 'Open it anyway' })
      expect(labels[1]).toEqual({ key: 'migrate', label: 'Migrate it properly' })
    })

    it('returns empty array for non-existent quest', () => {
      expect(getBranchLabels('nonexistent')).toEqual([])
    })

    it('returns empty array for non-branch quest', () => {
      expect(getBranchLabels('margaret_website')).toEqual([])
    })
  })

  describe('resolveBranchChoice', () => {
    it('open branch emits trigger_encounter event', () => {
      const events = resolveBranchChoice('do_not_touch', 'open')
      expect(events).toHaveLength(1)
      expect(events[0].type).toBe('trigger_encounter')
      expect(events[0].value).toBe('vb6_billing_horror')
      expect(events[0].branchKey).toBe('open')
    })

    it('migrate branch emits quiz_start event', () => {
      const events = resolveBranchChoice('do_not_touch', 'migrate')
      expect(events).toHaveLength(1)
      expect(events[0].type).toBe('quiz_start')
      expect(events[0].value).toHaveLength(3)
      expect(events[0].branchKey).toBe('migrate')
    })

    it('returns empty for invalid quest', () => {
      expect(resolveBranchChoice('nonexistent', 'open')).toEqual([])
    })

    it('returns empty for invalid branch key', () => {
      expect(resolveBranchChoice('do_not_touch', 'invalid')).toEqual([])
    })
  })

  describe('resolveBranchBattleOutcome', () => {
    it('win on open branch: shame + teach skill + flags', () => {
      const events = resolveBranchBattleOutcome('do_not_touch', 'open', true)
      const types = events.map(e => e.type)
      expect(types).toContain('shame')
      expect(types).toContain('teach_skill')
      expect(types).toContain('set_flag')
      expect(events.find(e => e.type === 'teach_skill').value).toBe('exec_xp_cmdshell')
      expect(events.find(e => e.type === 'shame').value).toBe(1)
      const flags = events.filter(e => e.type === 'set_flag').map(e => e.value)
      expect(flags).toContain('do_not_touch_opened')
      expect(flags).toContain('do_not_touch_resolved')
    })

    it('loss on open branch: damage + reputation + dialog + completion flag', () => {
      const events = resolveBranchBattleOutcome('do_not_touch', 'open', false)
      const types = events.map(e => e.type)
      expect(types).toContain('damage')
      expect(types).toContain('reputation')
      expect(types).toContain('dialog')
      expect(types).toContain('set_flag')
      expect(events.find(e => e.type === 'damage').value).toBe(20)
      expect(events.find(e => e.type === 'reputation').value).toBe(-10)
    })
  })

  describe('resolveQuizAnswer', () => {
    it('wrong answer drains budget', () => {
      const events = resolveQuizAnswer('do_not_touch', 'migrate', 0)
      const drain = events.find(e => e.type === 'budget_drain')
      expect(drain).toBeDefined()
      expect(drain.value).toBe(50)
    })

    it('standard answer awards XP', () => {
      const events = resolveQuizAnswer('do_not_touch', 'migrate', 1)
      const xp = events.find(e => e.type === 'xp_gain')
      expect(xp).toBeDefined()
      expect(xp.value).toBe(80)
    })

    it('optimal answer awards XP + item + flag + dialog + follow-up', () => {
      const events = resolveQuizAnswer('do_not_touch', 'migrate', 2)
      const types = events.map(e => e.type)
      expect(types).toContain('xp_gain')
      expect(types).toContain('item_drop')
      expect(types).toContain('set_flag')
      expect(types).toContain('dialog')
      expect(events.find(e => e.type === 'xp_gain').value).toBe(150)
      expect(events.find(e => e.type === 'item_drop').value).toBe('legacy_migration_badge')
      const flags = events.filter(e => e.type === 'set_flag').map(e => e.value)
      expect(flags).toContain('do_not_touch_migrated_optimal')
      expect(flags).toContain('do_not_touch_resolved')
    })

    it('follow-up line appears for all answers', () => {
      for (let i = 0; i < 3; i++) {
        const events = resolveQuizAnswer('do_not_touch', 'migrate', i)
        const dialogs = events.filter(e => e.type === 'dialog').map(e => e.text)
        expect(dialogs).toContain('Can you also fix my home Wi-Fi?')
      }
    })

    it('returns empty for invalid quiz index', () => {
      expect(resolveQuizAnswer('do_not_touch', 'migrate', 99)).toEqual([])
    })
  })
})

describe('isQuestCompleted', () => {
  it('returns true when quest ID is in completed list', () => {
    expect(isQuestCompleted('margaret_website', ['margaret_website'])).toBe(true)
  })

  it('returns false when quest ID is not in completed list', () => {
    expect(isQuestCompleted('margaret_website', [])).toBe(false)
  })
})

describe('getCompletedDialog', () => {
  it('returns the completedDialog array for a known quest', () => {
    const dialog = getCompletedDialog('margaret_website')
    expect(dialog).toEqual(["The website's been running for 3 days! Best week ever."])
  })

  it('returns fallback for unknown quest', () => {
    const dialog = getCompletedDialog('nonexistent_quest')
    expect(dialog).toEqual(['...'])
  })
})
