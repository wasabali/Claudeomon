import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SaveManager } from '../src/state/SaveManager.js'
import { GameState } from '../src/state/GameState.js'
import { download, openFilePicker } from '#utils/fileIO.js'

vi.mock('#utils/fileIO.js', () => ({
  download: vi.fn(),
  openFilePicker: vi.fn(),
}))

const clone = value => JSON.parse(JSON.stringify(value))

// Minimal localStorage mock
const makeLocalStorage = () => {
  const store = {}
  return {
    getItem:    (k) => store[k] ?? null,
    setItem:    (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear:      () => { for (const k of Object.keys(store)) delete store[k] },
  }
}

describe('SaveManager', () => {
  let initialState

  beforeEach(() => {
    initialState = clone(GameState)
    vi.clearAllMocks()
    globalThis.confirm = vi.fn()
    globalThis.localStorage = makeLocalStorage()
  })

  const restoreState = () => {
    for (const key of Object.keys(GameState)) delete GameState[key]
    Object.assign(GameState, clone(initialState))
  }

  it('stripSession returns a deep copy without mutating source', () => {
    const stripped = SaveManager.stripSession(GameState)
    stripped.player.name = 'Changed'

    expect(stripped).not.toHaveProperty('_session')
    expect(GameState.player.name).not.toBe('Changed')
  })

  it('export downloads a readable .cloudquest JSON file with checksum and no _session', async () => {
    const payload = await SaveManager.export(GameState, 'checkpoint')

    expect(download).toHaveBeenCalledTimes(1)
    const [filename, content] = download.mock.calls[0]
    const parsed = JSON.parse(content)

    expect(filename.endsWith('.cloudquest')).toBe(true)
    expect(parsed.commitMessage).toBe('checkpoint')
    expect(parsed.checksum.startsWith('sha256:')).toBe(true)
    expect(parsed).not.toHaveProperty('_session')
    expect(parsed.player.technicalDebt).toBeDefined()
    expect(payload.checksum).toBe(parsed.checksum)
  })

  it('import restores full state from file', async () => {
    const exported = await SaveManager.export(GameState, 'restore')
    restoreState()
    GameState.player.name = 'Different Name'

    const file = { text: async () => JSON.stringify(exported) }
    const loaded = await SaveManager.import(file)

    expect(loaded.player.name).toBe(initialState.player.name)
    expect(GameState.player.name).toBe(initialState.player.name)
    expect(GameState._session.isDirty).toBe(false)
  })

  it('import accepts legacy numeric save versions', async () => {
    const exported = await SaveManager.export(GameState, 'legacy')
    const { checksum: _checksum, version: _version, ...rest } = exported
    const legacyPayload = { version: 1, ...rest }
    legacyPayload.checksum = await SaveManager.computeChecksum(JSON.stringify(legacyPayload))

    const loaded = await SaveManager.import({ text: async () => JSON.stringify(legacyPayload) })
    expect(loaded).not.toBeNull()
  })

  it('import prompts on checksum mismatch and can load anyway', async () => {
    const exported = await SaveManager.export(GameState, 'tamper')
    const tampered = { ...exported, player: { ...exported.player, budget: 999 } }

    globalThis.confirm = vi.fn(() => true)
    const loaded = await SaveManager.import({ text: async () => JSON.stringify(tampered) })
    expect(globalThis.confirm).toHaveBeenCalled()
    expect(loaded.player.budget).toBe(999)
  })

  it('import returns null when mismatch is declined', async () => {
    const exported = await SaveManager.export(GameState, 'tamper')
    const tampered = { ...exported, player: { ...exported.player, budget: 1 } }

    globalThis.confirm = vi.fn(() => false)
    const loaded = await SaveManager.import({ text: async () => JSON.stringify(tampered) })
    expect(loaded).toBeNull()
  })

  it('import uses file picker when file is omitted', async () => {
    const exported = await SaveManager.export(GameState, 'picker')
    openFilePicker.mockResolvedValue({ text: async () => JSON.stringify(exported) })

    await SaveManager.import()
    expect(openFilePicker).toHaveBeenCalled()
  })

  describe('saveToSlot / loadFromSlot / deleteSlot', () => {
    beforeEach(restoreState)

    it('saveToSlot writes JSON to localStorage under the correct key', async () => {
      GameState.player.name = 'Alice'
      GameState.player.level = 4
      GameState.player.location = 'localhost_town'
      GameState.player.playtime = 3720

      await SaveManager.saveToSlot(0, GameState, 'reached localhost_town')

      const raw = globalThis.localStorage.getItem('cloudquest_save_0')
      expect(raw).not.toBeNull()
      const parsed = JSON.parse(raw)
      expect(parsed.checksum).toMatch(/^sha256:/)
      expect(parsed.commitMessage).toBe('reached localhost_town')
      expect(parsed.slotMeta.playerName).toBe('Alice')
      expect(parsed.slotMeta.level).toBe(4)
      expect(parsed.slotMeta.location).toBe('localhost_town')
      expect(parsed.slotMeta.playtime).toBe(3720)
    })

    it('saveToSlot does not write _session to localStorage', async () => {
      await SaveManager.saveToSlot(1, GameState, 'no session')
      const parsed = JSON.parse(globalThis.localStorage.getItem('cloudquest_save_1'))
      expect(parsed).not.toHaveProperty('_session')
    })

    it('saveToSlot clears isDirty and sets lastSavedAt on the session', async () => {
      GameState._session.isDirty = true
      await SaveManager.saveToSlot(2, GameState, 'dirty')
      expect(GameState._session.isDirty).toBe(false)
      expect(GameState._session.lastSavedAt).not.toBeNull()
    })

    it('saveToSlot uses separate keys per slot', async () => {
      GameState.player.name = 'Slot0'
      await SaveManager.saveToSlot(0, GameState)
      GameState.player.name = 'Slot2'
      await SaveManager.saveToSlot(2, GameState)

      const meta0 = SaveManager.getSlotMeta(0)
      const meta2 = SaveManager.getSlotMeta(2)
      expect(meta0.playerName).toBe('Slot0')
      expect(meta2.playerName).toBe('Slot2')
    })

    it('loadFromSlot restores GameState from the saved slot', async () => {
      GameState.player.name = 'Bob'
      GameState.player.level = 7
      await SaveManager.saveToSlot(0, GameState, 'bob save')

      // Mutate state after saving
      GameState.player.name = 'Tampered'
      GameState.player.level = 1

      const loaded = SaveManager.loadFromSlot(0)
      expect(loaded.player.name).toBe('Bob')
      expect(loaded.player.level).toBe(7)
      expect(GameState.player.name).toBe('Bob')
      expect(GameState._session.isDirty).toBe(false)
    })

    it('loadFromSlot returns null when slot is empty', () => {
      const result = SaveManager.loadFromSlot(1)
      expect(result).toBeNull()
    })

    it('loadFromSlot does not put _session or slotMeta into GameState', async () => {
      await SaveManager.saveToSlot(0, GameState)
      SaveManager.loadFromSlot(0)
      expect(GameState).not.toHaveProperty('slotMeta')
      expect(GameState._session).toBeDefined()
      expect(GameState._session.isDirty).toBe(false)
    })

    it('deleteSlot removes the slot from localStorage', async () => {
      await SaveManager.saveToSlot(0, GameState, 'to delete')
      expect(globalThis.localStorage.getItem('cloudquest_save_0')).not.toBeNull()

      SaveManager.deleteSlot(0)
      expect(globalThis.localStorage.getItem('cloudquest_save_0')).toBeNull()
    })

    it('deleteSlot is a no-op on an empty slot', () => {
      expect(() => SaveManager.deleteSlot(1)).not.toThrow()
    })

    it('getSlotMeta returns null for an empty slot', () => {
      expect(SaveManager.getSlotMeta(0)).toBeNull()
    })

    it('getSlotMeta returns summary fields without full state parse', async () => {
      GameState.player.name = 'Carol'
      GameState.player.level = 3
      GameState.player.location = 'three_am_tavern'
      GameState.player.playtime = 600
      await SaveManager.saveToSlot(0, GameState, 'summary test')

      const meta = SaveManager.getSlotMeta(0)
      expect(meta.slotIndex).toBe(0)
      expect(meta.playerName).toBe('Carol')
      expect(meta.level).toBe(3)
      expect(meta.location).toBe('three_am_tavern')
      expect(meta.playtime).toBe(600)
      expect(meta.savedAt).not.toBeNull()
      expect(meta.commitMessage).toBe('summary test')
    })

    it('getAllSlotMeta returns array of length 3 with nulls for empty slots', async () => {
      GameState.player.name = 'Dan'
      await SaveManager.saveToSlot(1, GameState)

      const all = SaveManager.getAllSlotMeta()
      expect(all).toHaveLength(3)
      expect(all[0]).toBeNull()
      expect(all[1].playerName).toBe('Dan')
      expect(all[2]).toBeNull()
    })
  })
})
