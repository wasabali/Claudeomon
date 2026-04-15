import { sha256 } from '#utils/crypto.js'
import { download, openFilePicker } from '#utils/fileIO.js'
import { GameState } from './GameState.js'

const SAVE_EXTENSION = '.cloudquest'
const SAVE_VERSION   = 1

// Export the current game state to a .cloudquest file.
// The file is base64-encoded JSON with a SHA-256 checksum.
export async function exportSave(filename = `save${SAVE_EXTENSION}`) {
  const saveData = _buildSaveData()
  const json     = JSON.stringify(saveData)
  const checksum = await sha256(json)
  const payload  = JSON.stringify({ v: SAVE_VERSION, checksum, data: saveData })
  download(filename, btoa(payload))
  GameState._session.isDirty     = false
  GameState._session.lastSavedAt = new Date().toISOString()
}

// Open a file picker, read a .cloudquest file, verify checksum, return save data.
// Throws if the checksum does not match (corrupted or tampered save).
export async function importSave() {
  const file = await openFilePicker(SAVE_EXTENSION)
  if (!file) return null
  const encoded  = await file.text()
  const payload  = JSON.parse(atob(encoded))
  const json     = JSON.stringify(payload.data)
  const checksum = await sha256(json)
  if (checksum !== payload.checksum) {
    throw new Error('Save file is corrupted or has been tampered with.')
  }
  return payload.data
}

// Build the save payload — everything except _session, which is never persisted.
function _buildSaveData() {
  const { _session, ...persisted } = GameState
  return persisted
}
