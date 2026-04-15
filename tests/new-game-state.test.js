import { beforeEach, describe, expect, it } from 'vitest'
import { GameState, initNewGame, STARTING_ACTIVE_SKILLS } from '../src/state/GameState.js'

const ORIGINAL_STATE = structuredClone(GameState)

function resetGameState() {
  const snapshot = structuredClone(ORIGINAL_STATE)
  GameState.player = snapshot.player
  GameState.skills = snapshot.skills
  GameState.inventory = snapshot.inventory
  GameState.emblems = snapshot.emblems
  GameState.story = snapshot.story
  GameState.stats = snapshot.stats
  GameState._session = snapshot._session
}

describe('initNewGame', () => {
  beforeEach(() => {
    resetGameState()
  })

  it('sets required starting player fields', () => {
    initNewGame('ENGINEER', 'DOCKERTLE')

    expect(GameState.player).toMatchObject({
      name: 'ENGINEER',
      mascot: 'DOCKERTLE',
      level: 1,
      xp: 0,
      hp: 100,
      maxHp: 100,
      budget: 500,
      reputation: 50,
      shamePoints: 0,
      technicalDebt: 0,
      title: 'Intern',
      location: 'localhost_town',
      activeSlots: 4,
    })
  })

  it('sets the exact starting active and learned skills and marks session dirty', () => {
    initNewGame('ENGINEER', 'VMSAUR')

    expect(GameState.skills.active).toEqual(STARTING_ACTIVE_SKILLS)
    expect(GameState.skills.learned).toEqual(STARTING_ACTIVE_SKILLS)
    expect(GameState._session.isDirty).toBe(true)
  })
})
