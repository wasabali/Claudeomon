import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  GameState,
  addItem,
  hasItem,
  markDirty,
  removeItem,
} from '../src/state/GameState.js'

describe('GameState inventory helpers', () => {
  beforeEach(() => {
    GameState.inventory.tools       = []
    GameState.inventory.keyItems    = []
    GameState.inventory.credentials = []
    GameState.inventory.docs        = []
    GameState.inventory.junk        = []
    GameState._session.isDirty      = false
  })

  it('markDirty sets dirty session state', () => {
    markDirty()
    expect(GameState._session.isDirty).toBe(true)
  })

  it('adds and increments item quantities in a tab', () => {
    addItem('tools', 'red_bull', 1)
    addItem('tools', 'red_bull', 2)

    expect(GameState.inventory.tools).toEqual([{ id: 'red_bull', qty: 3 }])
    expect(GameState._session.isDirty).toBe(true)
  })

  it('removes item quantity and removes entry at zero', () => {
    addItem('tools', 'red_bull', 3)
    GameState._session.isDirty = false

    expect(removeItem('tools', 'red_bull', 2)).toBe(true)
    expect(GameState.inventory.tools).toEqual([{ id: 'red_bull', qty: 1 }])
    expect(GameState._session.isDirty).toBe(true)

    GameState._session.isDirty = false
    expect(removeItem('tools', 'red_bull', 1)).toBe(true)
    expect(GameState.inventory.tools).toEqual([])
    expect(GameState._session.isDirty).toBe(true)
  })

  it('supports string inventory entries and hasItem checks', () => {
    GameState.inventory.docs = ['incident_postmortem']
    expect(hasItem('docs', 'incident_postmortem')).toBe(true)
    expect(hasItem('docs', 'terraform_state')).toBe(false)

    addItem('docs', 'incident_postmortem', 1)
    expect(GameState.inventory.docs).toEqual([{ id: 'incident_postmortem', qty: 2 }])
  })

  it('returns false when removing missing item', () => {
    expect(removeItem('junk', 'missing_item', 1)).toBe(false)
    expect(GameState._session.isDirty).toBe(false)
  })

  it('adds new item alongside existing object entries', () => {
    GameState.inventory.tools = [{ id: 'red_bull', qty: 1 }]
    addItem('tools', 'rollback_potion', 1)

    expect(GameState.inventory.tools).toEqual([
      { id: 'red_bull', qty: 1 },
      { id: 'rollback_potion', qty: 1 },
    ])
  })
})

let originalSkillUseCounts = {}

beforeEach(() => {
  originalSkillUseCounts = { ...GameState.stats.skillUseCounts }
})

afterEach(() => {
  GameState.stats.skillUseCounts = { ...originalSkillUseCounts }
})

describe('GameState.stats', () => {
  it('includes skillUseCounts map for skill tracking', () => {
    expect(GameState.stats.skillUseCounts).toEqual({})
  })

  it('tracks per-skill usage values in the map', () => {
    GameState.stats.skillUseCounts.kubectl_rollout_restart = 14

    expect(GameState.stats.skillUseCounts.kubectl_rollout_restart).toBe(14)
  })

  it('includes stepsTaken counter starting at 0', () => {
    expect(GameState.stats).toHaveProperty('stepsTaken')
    expect(typeof GameState.stats.stepsTaken).toBe('number')
  })
})
