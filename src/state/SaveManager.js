import { sha256 } from '#utils/crypto.js'
import { download, openFilePicker } from '#utils/fileIO.js'
import { GameState } from '#state/GameState.js'

const SAVE_EXTENSION = '.cloudquest'
const SAVE_VERSION = '1.0'
const CHECKSUM_WARNING = "Save file checksum mismatch. Someone's been poking around the config. Load anyway? [Y/N]"
const LEGACY_SAVE_VERSION = 1
const SLOT_COUNT = 3
const slotKey = (slotIndex) => `cloudquest_save_${slotIndex}`

const deepCopy = value => {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value))
}

export const SaveManager = {
  async export(gameState, commitMessage = '') {
    const persisted = this.stripSession(gameState)
    const payloadWithoutChecksum = {
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      commitMessage: String(commitMessage).slice(0, 72),
      ...persisted,
    }

    const checksum = await this.computeChecksum(JSON.stringify(payloadWithoutChecksum))
    const payload = {
      ...payloadWithoutChecksum,
      checksum,
    }

    const filename = `save${SAVE_EXTENSION}`
    download(filename, `${JSON.stringify(payload, null, 2)}\n`)

    if (gameState?._session) {
      gameState._session.isDirty = false
      gameState._session.lastSavedAt = payload.savedAt
    }

    return payload
  },

  async import(file) {
    const selectedFile = file ?? await openFilePicker(SAVE_EXTENSION)
    if (!selectedFile) return null

    const raw = await selectedFile.text()
    const parsed = JSON.parse(raw)
    const { checksum, ...payloadWithoutChecksum } = parsed

    if (!checksum || payloadWithoutChecksum.version == null) {
      throw new Error('Malformed save file: missing required fields.')
    }
    if (payloadWithoutChecksum.version !== SAVE_VERSION && payloadWithoutChecksum.version !== LEGACY_SAVE_VERSION) {
      throw new Error(`Unsupported save version: ${payloadWithoutChecksum.version}`)
    }

    const computedChecksum = await this.computeChecksum(JSON.stringify(payloadWithoutChecksum))
    if (computedChecksum !== checksum) {
      const confirmFn = globalThis.confirm
      const shouldLoad = typeof confirmFn === 'function' ? confirmFn(CHECKSUM_WARNING) : false
      if (!shouldLoad) return null
    }

    const restoredState = deepCopy(payloadWithoutChecksum)
    delete restoredState.version
    delete restoredState.savedAt
    delete restoredState.commitMessage

    for (const key of Object.keys(GameState)) {
      if (key !== '_session') delete GameState[key]
    }
    Object.assign(GameState, restoredState)
    GameState._session = { isDirty: false, lastSavedAt: payloadWithoutChecksum.savedAt ?? null, dialogActive: false }

    return GameState
  },

  async computeChecksum(payloadString) {
    return `sha256:${await sha256(payloadString)}`
  },

  stripSession(gameState) {
    const copy = deepCopy(gameState)
    delete copy._session
    return copy
  },

  async saveToSlot(slotIndex, gameState, commitMessage = '') {
    const persisted = this.stripSession(gameState)
    const payloadWithoutChecksum = {
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      commitMessage: String(commitMessage).slice(0, 72),
      slotMeta: {
        playerName: gameState.player.name,
        level:      gameState.player.level,
        location:   gameState.player.location,
        playtime:   gameState.player.playtime,
      },
      ...persisted,
    }

    const checksum = await this.computeChecksum(JSON.stringify(payloadWithoutChecksum))
    const payload = { ...payloadWithoutChecksum, checksum }

    globalThis.localStorage.setItem(slotKey(slotIndex), JSON.stringify(payload))

    if (gameState?._session) {
      gameState._session.isDirty = false
      gameState._session.lastSavedAt = payload.savedAt
    }

    return payload
  },

  loadFromSlot(slotIndex) {
    const raw = globalThis.localStorage.getItem(slotKey(slotIndex))
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const { checksum, ...payloadWithoutChecksum } = parsed

    if (!checksum || payloadWithoutChecksum.version === null || payloadWithoutChecksum.version === undefined) {
      throw new Error('Malformed slot save: missing required fields.')
    }

    const restoredState = deepCopy(payloadWithoutChecksum)
    delete restoredState.version
    delete restoredState.savedAt
    delete restoredState.commitMessage
    delete restoredState.slotMeta

    for (const key of Object.keys(GameState)) {
      if (key !== '_session') delete GameState[key]
    }
    Object.assign(GameState, restoredState)
    GameState._session = { isDirty: false, lastSavedAt: payloadWithoutChecksum.savedAt ?? null, dialogActive: false }

    return GameState
  },

  deleteSlot(slotIndex) {
    globalThis.localStorage.removeItem(slotKey(slotIndex))
  },

  getSlotMeta(slotIndex) {
    const raw = globalThis.localStorage.getItem(slotKey(slotIndex))
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      return {
        slotIndex,
        playerName:    parsed.slotMeta?.playerName ?? '',
        level:         parsed.slotMeta?.level ?? 1,
        location:      parsed.slotMeta?.location ?? '',
        playtime:      parsed.slotMeta?.playtime ?? 0,
        savedAt:       parsed.savedAt ?? null,
        commitMessage: parsed.commitMessage ?? '',
      }
    } catch {
      return null
    }
  },

  getAllSlotMeta() {
    return Array.from({ length: SLOT_COUNT }, (_, i) => this.getSlotMeta(i))
  },
}

export const exportSave = () => SaveManager.export(GameState)
export const importSave = file => SaveManager.import(file)
