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

/** Encode a raw RGBA pixel buffer into a PNG (with alpha channel). */
function encodePngRgba(width, height, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 6  // 8-bit depth, RGBA colour type

  const rowBytes = width * 4
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
// Helpers — paint solid-colour sprites and humanoid character walk-cycles
// ---------------------------------------------------------------------------

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

// Skin and eye colours shared by all humanoid placeholders.
const SKIN_R = 0xe0; const SKIN_G = 0xc0; const SKIN_B = 0x90
const EYE_R  = 0x22; const EYE_G  = 0x11; const EYE_B  = 0x00

/**
 * Paint a 3-col × 4-row walk-cycle character sheet (144×192 px, RGBA).
 *
 * Each 48×48 frame contains a simple pixel-art humanoid in one of four
 * directions (rows 0-3 = down / left / right / up) and one of three walk
 * phases (cols 0-2 = left-step / neutral / right-step).
 *
 * Background is fully transparent (alpha = 0), so the character floats
 * correctly over the tile layer in Phaser without a coloured box border.
 * Hair uses the caller-supplied key colour; clothing uses a slightly
 * lighter tint; shoes use a slightly darker accent.
 */
function paintCharacter(r, g, b) {
  const W = CHAR_W  // 144
  const H = CHAR_H  // 192
  const pixels = Buffer.alloc(W * H * 4)  // RGBA, initialised to 0 (transparent)

  function set(x, y, pr, pg, pb, pa = 255) {
    if (x < 0 || x >= W || y < 0 || y >= H) return
    const off = (y * W + x) * 4
    pixels[off] = pr; pixels[off + 1] = pg; pixels[off + 2] = pb; pixels[off + 3] = pa
  }
  function fill(x0, y0, fw, fh, pr, pg, pb, pa = 255) {
    for (let dy = 0; dy < fh; dy++)
      for (let dx = 0; dx < fw; dx++)
        set(x0 + dx, y0 + dy, pr, pg, pb, pa)
  }

  // Hair = key colour darkened slightly; clothing detail = key colour darkened more.
  const hr = Math.max(0, r - 40); const hg = Math.max(0, g - 40); const hb = Math.max(0, b - 40)
  const dr = Math.max(0, r - 30); const dg = Math.max(0, g - 30); const db = Math.max(0, b - 30)

  // col 0 → left step (left leg raised 3px), col 1 → neutral, col 2 → right step
  const walkOffsets = [[3, 0], [0, 0], [0, 3]]

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const ox = col * FRAME_SIZE  // x origin of this frame in the sheet
      const oy = row * FRAME_SIZE  // y origin
      const [leftDy, rightDy] = walkOffsets[col]

      // --- down (row 0) — full front view ---
      if (row === 0) {
        fill(ox + 18, oy + 3,  12, 5,  hr, hg, hb)          // hair
        fill(ox + 18, oy + 8,  12, 10, SKIN_R, SKIN_G, SKIN_B) // face
        fill(ox + 20, oy + 11, 2,  2,  EYE_R, EYE_G, EYE_B)   // left eye
        fill(ox + 26, oy + 11, 2,  2,  EYE_R, EYE_G, EYE_B)   // right eye
        fill(ox + 18, oy + 18, 12, 13, r, g, b)              // body
        fill(ox + 18, oy + 24, 12, 2,  dr, dg, db)           // belt
        fill(ox + 13, oy + 18, 5,  10, r, g, b)              // left arm
        fill(ox + 30, oy + 18, 5,  10, r, g, b)              // right arm
        fill(ox + 18, oy + 31 + leftDy,  5, 14 - leftDy,  r, g, b) // left leg
        fill(ox + 25, oy + 31 + rightDy, 5, 14 - rightDy, r, g, b) // right leg
        fill(ox + 17, oy + 43, 7,  3,  dr, dg, db)           // left shoe
        fill(ox + 24, oy + 43, 7,  3,  dr, dg, db)           // right shoe
      }

      // --- up (row 3) — back view ---
      if (row === 3) {
        fill(ox + 18, oy + 3,  12, 15, hr, hg, hb)           // full-hair back
        fill(ox + 21, oy + 16, 6,  3,  SKIN_R, SKIN_G, SKIN_B) // neck
        fill(ox + 18, oy + 18, 12, 13, r, g, b)
        fill(ox + 18, oy + 24, 12, 2,  dr, dg, db)
        fill(ox + 13, oy + 18, 5,  10, r, g, b)
        fill(ox + 30, oy + 18, 5,  10, r, g, b)
        fill(ox + 18, oy + 31 + leftDy,  5, 14 - leftDy,  r, g, b)
        fill(ox + 25, oy + 31 + rightDy, 5, 14 - rightDy, r, g, b)
        fill(ox + 17, oy + 43, 7,  3,  dr, dg, db)
        fill(ox + 24, oy + 43, 7,  3,  dr, dg, db)
      }

      // --- left (row 1) — side profile ---
      if (row === 1) {
        fill(ox + 19, oy + 3,  10, 5,  hr, hg, hb)           // hair
        fill(ox + 20, oy + 8,  10, 10, SKIN_R, SKIN_G, SKIN_B)
        fill(ox + 19, oy + 8,  3,  10, hr, hg, hb)           // hair on left edge
        fill(ox + 24, oy + 11, 2,  2,  EYE_R, EYE_G, EYE_B)  // one eye
        fill(ox + 20, oy + 18, 9,  13, r, g, b)
        fill(ox + 20, oy + 24, 9,  2,  dr, dg, db)
        fill(ox + 15, oy + 18, 5,  10, r, g, b)              // front arm
        // Legs stacked — rear leg slightly darker
        fill(ox + 19, oy + 31 + leftDy,  9, 14 - leftDy, r, g, b)
        if (leftDy !== rightDy)
          fill(ox + 20, oy + 31 + rightDy, 7, 12 - rightDy, dr, dg, db)
        fill(ox + 18, oy + 43, 9,  3,  dr, dg, db)
      }

      // --- right (row 2) — side profile, mirrored ---
      if (row === 2) {
        fill(ox + 19, oy + 3,  10, 5,  hr, hg, hb)
        fill(ox + 18, oy + 8,  10, 10, SKIN_R, SKIN_G, SKIN_B)
        fill(ox + 26, oy + 8,  3,  10, hr, hg, hb)           // hair on right edge
        fill(ox + 22, oy + 11, 2,  2,  EYE_R, EYE_G, EYE_B)
        fill(ox + 19, oy + 18, 9,  13, r, g, b)
        fill(ox + 19, oy + 24, 9,  2,  dr, dg, db)
        fill(ox + 28, oy + 18, 5,  10, r, g, b)              // front arm
        fill(ox + 20, oy + 31 + rightDy, 9, 14 - rightDy, r, g, b)
        if (leftDy !== rightDy)
          fill(ox + 21, oy + 31 + leftDy, 7, 12 - leftDy, dr, dg, db)
        fill(ox + 21, oy + 43, 9,  3,  dr, dg, db)
      }
    }
  }

  return pixels
}

// ---------------------------------------------------------------------------
// Portrait painter — simple face tile (48×48 RGBA)
// ---------------------------------------------------------------------------

function paintPortrait(r, g, b) {
  const SIZE = PORTRAIT_SIZE
  const pixels = Buffer.alloc(SIZE * SIZE * 4)

  function fill(x0, y0, fw, fh, pr, pg, pb, pa = 255) {
    for (let dy = 0; dy < fh; dy++)
      for (let dx = 0; dx < fw; dx++) {
        const xx = x0 + dx; const yy = y0 + dy
        if (xx < 0 || xx >= SIZE || yy < 0 || yy >= SIZE) continue
        const off = (yy * SIZE + xx) * 4
        pixels[off] = pr; pixels[off + 1] = pg; pixels[off + 2] = pb; pixels[off + 3] = pa
      }
  }

  const hr = Math.max(0, r - 40); const hg = Math.max(0, g - 40); const hb = Math.max(0, b - 40)
  const dr = Math.max(0, r - 20); const dg = Math.max(0, g - 20); const db = Math.max(0, b - 20)

  // Background panel (key colour)
  fill(0, 0, SIZE, SIZE, dr, dg, db)
  // Hair
  fill(12, 3, 24, 10, hr, hg, hb)
  // Face
  fill(12, 10, 24, 22, SKIN_R, SKIN_G, SKIN_B)
  // Eyes
  fill(15, 16, 4, 4, EYE_R, EYE_G, EYE_B)
  fill(29, 16, 4, 4, EYE_R, EYE_G, EYE_B)
  // Nose
  fill(23, 22, 2, 3, Math.max(0, SKIN_R - 30), Math.max(0, SKIN_G - 30), Math.max(0, SKIN_B - 30))
  // Mouth
  fill(18, 27, 12, 2, Math.max(0, SKIN_R - 50), Math.max(0, SKIN_G - 60), Math.max(0, SKIN_B - 60))
  // Shoulders/collar
  fill(8, 32, 32, 12, r, g, b)

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

console.log('\n── Character sprites (144×192px, 3×4 walk-cycle humanoid figures) ─')
for (const key of getAllSpriteKeys()) {
  const [r, g, b] = keyToRgb(key)
  const pixels = paintCharacter(r, g, b)
  writePng(path.join(CHARS_DIR, `${key}.png`), encodePngRgba(CHAR_W, CHAR_H, pixels))
}

// ---------------------------------------------------------------------------
// Portrait sprites — 48×48px face tiles
//
// Convention (from BootScene.js):
//   portrait_player  → assets/sprites/portraits/player.png
//   portrait_<id>    → assets/sprites/portraits/<id>.png
//
// Colour is derived from the trainer's spriteKey using the same hash function
// used for character sheets so portraits look visually related.
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
  portraitEntries.push({ file: filename, r, g, b })
}

console.log('\n── Portrait sprites (48×48px face tiles) ───────────────────────')
for (const { file, r, g, b } of portraitEntries) {
  const pixels = paintPortrait(r, g, b)
  writePng(path.join(PORTRAITS_DIR, `${file}.png`), encodePngRgba(PORTRAIT_SIZE, PORTRAIT_SIZE, pixels))
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
