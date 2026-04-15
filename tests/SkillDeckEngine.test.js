import { describe, expect, it } from 'vitest'
import {
  assignSkillToSlot,
  getActiveSlotCount,
  normalizeActiveDeck,
  removeSkillFromSlot,
  swapActiveSlots,
} from '../src/engine/SkillDeckEngine.js'

describe('SkillDeckEngine', () => {
  it('clamps active slot count to 4-6', () => {
    expect(getActiveSlotCount()).toBe(4)
    expect(getActiveSlotCount(2)).toBe(4)
    expect(getActiveSlotCount(5)).toBe(5)
    expect(getActiveSlotCount(9)).toBe(6)
  })

  it('normalizes active deck to configured slot size', () => {
    expect(normalizeActiveDeck(['a', 'b'], 4)).toEqual(['a', 'b', null, null])
    expect(normalizeActiveDeck(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 6)).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  it('assigns skill to slot and keeps deck unique by moving from previous slot', () => {
    const result = assignSkillToSlot(['a', 'b', null, null], 2, 'b', 4)
    expect(result).toEqual(['a', null, 'b', null])
  })

  it('swaps active slots', () => {
    const result = swapActiveSlots(['a', 'b', 'c', null], 0, 2, 4)
    expect(result).toEqual(['c', 'b', 'a', null])
  })

  it('removes skill from slot', () => {
    const result = removeSkillFromSlot(['a', 'b', 'c', null], 1, 4)
    expect(result).toEqual(['a', null, 'c', null])
  })
})
