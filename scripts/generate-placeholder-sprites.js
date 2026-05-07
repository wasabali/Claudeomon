/**
 * scripts/generate-placeholder-sprites.js
 *
 * Generates placeholder PNG sprites for all game assets that require external
 * downloads (Ninja Adventure pack, Kenney Micro Roguelike, PokeRogue arenas).
 *
 * These are coloured stubs — sufficient to boot and test the game without
 * missing-texture errors.  Replace them with the real upscaled assets when
 * available (see docs/VISUAL_ASSETS.md for the full pipeline).
 *
 * Usage:
 *   node scripts/generate-placeholder-sprites.js [--force]
 *
 *   --force   Overwrite existing files (default: skip non-empty files that
 *             already exist so real assets are never clobbered accidentally)
 *
 * Asset sources — download and run the upscale pipeline when ready:
 *   Characters/trainers: https://pixel-boy.itch.io/ninja-adventure-asset-pack  (CC0)
 *   Portraits:           https://kenney.nl/assets/micro-roguelike               (CC0)
 *   Arena backgrounds:   https://github.com/pagefaultgames/pokerogue-assets      (CC-BY-NC-SA-4.0)
 *
 * PNG encoding uses Node's built-in zlib — no external dependencies.
 * Mirrors the encoder in scripts/generate-ui-stubs.js.
 */

import { fileURLToPath } from 'node:url'
import path              from 'node:path'
import fs                from 'node:fs'
import zlib              from 'node:zlib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// Game data imports — derive asset lists live from source-of-truth modules
// so this script stays in sync automatically as trainers/config evolve.
// ---------------------------------------------------------------------------

const { getAllSpriteKeys, getAll: getAllTrainers, getAllPortraitKeys } =
  await import(path.join(ROOT, 'src', 'data', 'trainers.js'))

const { BATTLE_BACKGROUNDS } =
  await import(path.join(ROOT, 'src', 'config.js'))

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const FORCE = process.argv.includes('--force')

// ---------------------------------------------------------------------------
// Minimal PNG encoder — no external dependencies
// (same CRC32 + chunk helper pattern as generate-ui-stubs.js)
// ---------------------------------------------------------------------------

const CRC32_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ CRC32_TABLE[(c ^ buf[i]) & 0xFF]
  return (c ^ 0xFFFFFFFF) >>> 0
}

function pngChunk(type, data) {
  const typeBuf  = Buffer.from(type, 'ascii')
  const crcInput = Buffer.allocUnsafe(typeBuf.length + data.length)
  typeBuf.copy(crcInput)
  data.copy(crcInput, typeBuf.length)
  const out = Buffer.allocUnsafe(4 + typeBuf.length + data.length + 4)
  out.writeUInt32BE(data.length, 0)
  typeBuf.copy(out, 4)
  data.copy(out, 8)
  out.writeUInt32BE(crc32(crcInput), 8 + data.length)
  return out
}

const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

/** Encode a raw RGB (no alpha) pixel buffer into a PNG. */
function encodePngRgb(width, height, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 2  // 8-bit depth, RGB colour type

  const rowBytes = width * 3
  const raw      = Buffer.alloc(height * (rowBytes + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (rowBytes + 1)] = 0  // filter: None
    pixels.copy(raw, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes)
  }
  const idat = zlib.deflateSync(raw, { level: 9 })

  return Buffer.concat([PNG_SIG, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))])
}

// ---------------------------------------------------------------------------
// Write helper — respects --force flag, never clobbers non-empty real assets
// ---------------------------------------------------------------------------

let written = 0
let skipped = 0

function writePng(destPath, png) {
  if (!FORCE && fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
    console.log(`  skip   ${path.relative(ROOT, destPath)}`)
    skipped++
    return
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, png)
  console.log(`  write  ${path.relative(ROOT, destPath)}`)
  written++
}

// ---------------------------------------------------------------------------
// Helpers — paint solid-colour sprites with a thin frame-cell border grid
// ---------------------------------------------------------------------------

/**
 * Paint a grid of COLS×ROWS solid-colour cells (each CELL×CELL px),
 * separated by a 1px darker border to show individual frame boundaries.
 */
function paintGrid(cols, rows, cell, r, g, b) {
  const w  = cols * cell
  const h  = rows * cell
  const br = Math.max(0, r - 60)
  const bg = Math.max(0, g - 60)
  const bb = Math.max(0, b - 60)

  const pixels = Buffer.alloc(w * h * 3)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const off = (y * w + x) * 3
      // Draw 1px border at every cell edge
      const localX = x % cell
      const localY = y % cell
      const onBorder = localX === 0 || localY === 0 || localX === cell - 1 || localY === cell - 1
      if (onBorder) {
        pixels[off] = br; pixels[off + 1] = bg; pixels[off + 2] = bb
      } else {
        pixels[off] = r;  pixels[off + 1] = g;  pixels[off + 2] = b
      }
    }
  }

  return pixels
}

/** Paint a solid-colour RGB square with a 1px darker border. */
function paintSolid(size, r, g, b) {
  const br = Math.max(0, r - 60)
  const bg = Math.max(0, g - 60)
  const bb = Math.max(0, b - 60)
  const pixels = Buffer.alloc(size * size * 3)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const off = (y * size + x) * 3
      const onBorder = x === 0 || y === 0 || x === size - 1 || y === size - 1
      if (onBorder) {
        pixels[off] = br; pixels[off + 1] = bg; pixels[off + 2] = bb
      } else {
        pixels[off] = r;  pixels[off + 1] = g;  pixels[off + 2] = b
      }
    }
  }
  return pixels
}

/** Paint a solid-colour arena background — fills every pixel with one colour. */
function paintArena(w, h, r, g, b) {
  const pixels = Buffer.alloc(w * h * 3)
  for (let i = 0; i < pixels.length; i += 3) {
    pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b
  }
  return pixels
}

// ---------------------------------------------------------------------------
// Character sprite sheets
//
// Layout: 3 columns × 4 rows of 48×48px frames (total 144×192px).
//   Row 0 — walk south (toward camera)
//   Row 1 — walk west
//   Row 2 — walk east
//   Row 3 — walk north (away from camera)
//   Columns 0–2 — step-left, neutral, step-right
//
// This matches the comment in BootScene.js ("4-row × 3-col walk-cycle") and
// the Ninja Adventure spritesheet layout used after the 3× upscale pipeline.
//
// Colour is derived deterministically from the sprite key string (djb2 hash
// → hue angle) so every key referenced by getAllSpriteKeys() gets a unique
// placeholder automatically — including keys added in the future.
// ---------------------------------------------------------------------------

const FRAME_SIZE  = 48
const CHAR_COLS   = 3
const CHAR_ROWS   = 4
const CHAR_W      = CHAR_COLS * FRAME_SIZE  // 144
const CHAR_H      = CHAR_ROWS * FRAME_SIZE  // 192

/**
 * Deterministic RGB colour from a string key.
 * Uses a djb2 hash to pick a hue, then converts HSL(hue, 70%, 55%) → RGB.
 * Returns [r, g, b] in 0–255.
 */
function keyToRgb(key) {
  // djb2 hash → hue in [0, 360)
  let hash = 5381
  for (let i = 0; i < key.length; i++) hash = ((hash << 5) + hash) + key.charCodeAt(i)
  const hue = ((hash >>> 0) % 360)

  // HSL(hue, 0.70, 0.55) → RGB
  const s = 0.70
  const l = 0.55
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((hue / 60) % 2 - 1))
  const m = l - c / 2
  let r1, g1, b1
  if      (hue < 60)  { r1 = c;  g1 = x;  b1 = 0  }
  else if (hue < 120) { r1 = x;  g1 = c;  b1 = 0  }
  else if (hue < 180) { r1 = 0;  g1 = c;  b1 = x  }
  else if (hue < 240) { r1 = 0;  g1 = x;  b1 = c  }
  else if (hue < 300) { r1 = x;  g1 = 0;  b1 = c  }
  else                { r1 = c;  g1 = 0;  b1 = x  }
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ]
}

const CHARS_DIR = path.join(ROOT, 'assets', 'sprites', 'characters')

console.log('\n── Character sprites (144×192px, 3×4 walk-cycle frames) ────────')
for (const key of getAllSpriteKeys()) {
  const [r, g, b] = keyToRgb(key)
  const pixels = paintGrid(CHAR_COLS, CHAR_ROWS, FRAME_SIZE, r, g, b)
  writePng(path.join(CHARS_DIR, `${key}.png`), encodePngRgb(CHAR_W, CHAR_H, pixels))
}

// ---------------------------------------------------------------------------
// Portrait sprites — 48×48px solid-colour tiles
//
// Convention (from BootScene.js):
//   portrait_player  → assets/sprites/portraits/player.png
//   portrait_<id>    → assets/sprites/portraits/<id>.png
//
// Colour is derived from the trainer's spriteKey using the same hash function
// used for character sheets, dimmed to 70% brightness so portraits look
// visually related but distinct from the full-size character sprites.
// getAllPortraitKeys() / getAll() are imported live from src/data/trainers.js.
// ---------------------------------------------------------------------------

const PORTRAIT_SIZE = 48
const PORTRAITS_DIR = path.join(ROOT, 'assets', 'sprites', 'portraits')

// Build id → spriteKey map from the live trainer objects.
const _spriteKeyById = new Map(getAllTrainers().filter(t => t.spriteKey).map(t => [t.id, t.spriteKey]))

// Build the portrait list: player first, then all trainers.
// getAllPortraitKeys() returns ['portrait_player', 'portrait_<id>', …].
const portraitEntries = []
for (const portKey of getAllPortraitKeys()) {
  const filename = portKey.replace(/^portrait_/, '')
  let [r, g, b] = keyToRgb(filename)
  if (filename !== 'player') {
    const spriteKey = _spriteKeyById.get(filename)
    if (spriteKey) {
      [r, g, b] = keyToRgb(spriteKey)
    }
  }
  portraitEntries.push({
    file: filename,
    r: Math.floor(r * 0.7),
    g: Math.floor(g * 0.7),
    b: Math.floor(b * 0.7),
  })
}

console.log('\n── Portrait sprites (48×48px) ──────────────────────────────────')
for (const { file, r, g, b } of portraitEntries) {
  const pixels = paintSolid(PORTRAIT_SIZE, r, g, b)
  writePng(path.join(PORTRAITS_DIR, `${file}.png`), encodePngRgb(PORTRAIT_SIZE, PORTRAIT_SIZE, pixels))
}

// ---------------------------------------------------------------------------
// Arena backgrounds — two layers per biome
//
// Layer convention (from assets/arenas/CREDITS.md):
//   <arena>_a.png  — far background layer  (1920×1080px)
//   <arena>_b.png  — near foreground strip  (1920×400px)
//
// Dimensions match PokeRogue's arena asset format.  Using solid colours here
// so files compress to <1 KB each; replace with real PokeRogue backgrounds
// (CC-BY-NC-SA-4.0) once downloaded.
//
// The unique arena IDs are derived live from BATTLE_BACKGROUNDS in
// src/config.js so this script stays in sync with gameplay configuration.
// Each biome gets a deterministic sky/ground colour from keyToRgb().
// ---------------------------------------------------------------------------

const ARENA_W   = 1920
const ARENA_H_A = 1080   // full-screen background
const ARENA_H_B =  400   // foreground ground strip

// Derive unique arena names from BATTLE_BACKGROUNDS (single source of truth).
const arenaNames = [...new Set(Object.values(BATTLE_BACKGROUNDS).map(v => v.arena))]

const ARENAS_DIR = path.join(ROOT, 'assets', 'arenas')

console.log('\n── Arena backgrounds (1920×1080 _a + 1920×400 _b per biome) ───')
for (const name of arenaNames) {
  // Sky (_a): full-brightness hue derived from the arena name.
  const [sr, sg, sb] = keyToRgb(name)
  // Ground (_b): same hue, but 40% brightness so it reads as a floor/terrain strip.
  const [gr, gg, gb] = keyToRgb(`${name}_ground`)

  writePng(
    path.join(ARENAS_DIR, `${name}_a.png`),
    encodePngRgb(ARENA_W, ARENA_H_A, paintArena(ARENA_W, ARENA_H_A, sr, sg, sb)),
  )
  writePng(
    path.join(ARENAS_DIR, `${name}_b.png`),
    encodePngRgb(ARENA_W, ARENA_H_B, paintArena(ARENA_W, ARENA_H_B, gr, gg, gb)),
  )
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\nDone — ${written} written, ${skipped} skipped.`)
if (!FORCE && skipped > 0) {
  console.log('Re-run with --force to overwrite existing placeholder files.')
}
console.log()
console.log('Replace placeholder files with real assets:')
console.log('  Characters/trainers: https://pixel-boy.itch.io/ninja-adventure-asset-pack  (CC0)')
console.log('  Portraits:           https://kenney.nl/assets/micro-roguelike               (CC0)')
console.log('  Arena backgrounds:   https://github.com/pagefaultgames/pokerogue-assets      (CC-BY-NC-SA-4.0)')
console.log('  Then run: node scripts/upscale-assets.js --input <raw-dir> --output <out-dir>')
