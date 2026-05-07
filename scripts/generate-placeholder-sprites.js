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

/** Paint a solid-colour RGBA square with a 1px darker border. */
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
// Each key gets a distinct hue so characters are visually distinguishable
// during development before the real Ninja Adventure sprites are dropped in.
// ---------------------------------------------------------------------------

const FRAME_SIZE  = 48
const CHAR_COLS   = 3
const CHAR_ROWS   = 4
const CHAR_W      = CHAR_COLS * FRAME_SIZE  // 144
const CHAR_H      = CHAR_ROWS * FRAME_SIZE  // 192

// [R, G, B] per sprite key — each character gets a unique hue.
const SPRITE_COLOURS = {
  ninja_hero:          [0x40, 0x80, 0xFF],  // blue          — player
  ninja_old_samurai:   [0x60, 0xA0, 0x60],  // green
  ninja_mage:          [0x90, 0x50, 0xC0],  // purple
  ninja_sorceress:     [0xD0, 0x60, 0xB0],  // magenta
  ninja_heavy_bandit:  [0xA0, 0x50, 0x30],  // brown-red
  ninja_woman_fighter: [0xE0, 0x80, 0x40],  // orange
  ninja_samurai:       [0x50, 0x70, 0xA0],  // steel blue
  ninja_captain:       [0xD0, 0xA0, 0x30],  // gold
  ninja_archwizard:    [0xB0, 0x40, 0x40],  // dark red
  ninja_knight:        [0x70, 0x70, 0x70],  // grey
  ninja_monk:          [0xC0, 0xA0, 0x60],  // tan
  ninja_soldier:       [0x50, 0x60, 0x50],  // dark green
  ninja_archer:        [0x70, 0x90, 0x40],  // olive
  ninja_magician:      [0x80, 0x50, 0xD0],  // violet
  ninja_warlock:       [0x30, 0x30, 0x60],  // dark navy
  ninja_ninja:         [0x30, 0x30, 0x30],  // near-black
  ninja_robot:         [0x80, 0xB0, 0xB0],  // cyan-grey
  ninja_assassin:      [0x60, 0x30, 0x60],  // dark purple
  ninja_warrior:       [0xC0, 0x50, 0x50],  // red
  ninja_adventurer:    [0x40, 0xA0, 0x80],  // teal
  ninja_burglar:       [0x60, 0x60, 0x40],  // olive-brown
  ninja_demon:         [0xB0, 0x20, 0x20],  // bright red
  ninja_goblin:        [0x50, 0x80, 0x30],  // goblin green
  ninja_ogre:          [0x80, 0x60, 0x40],  // muddy brown
  ninja_skeleton:      [0xD0, 0xD0, 0xC0],  // bone white
  ninja_slime:         [0x60, 0xD0, 0x40],  // slime green
  ninja_sheriff:       [0xB0, 0x90, 0x40],  // badge gold
  ninja_clown:         [0xFF, 0x60, 0x80],  // hot pink
  ninja_pirate:        [0x40, 0x40, 0x80],  // navy
  ninja_king:          [0xD0, 0xC0, 0x30],  // royal gold
}

const CHARS_DIR = path.join(ROOT, 'assets', 'sprites', 'characters')

console.log('\n── Character sprites (144×192px, 3×4 walk-cycle frames) ────────')
for (const [key, [r, g, b]] of Object.entries(SPRITE_COLOURS)) {
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
// Colour derived from the spriteKey each trainer uses so portraits share
// the same hue family as the character sprite (just 70% brightness).
// ---------------------------------------------------------------------------

const PORTRAIT_SIZE = 48
const PORTRAITS_DIR = path.join(ROOT, 'assets', 'sprites', 'portraits')

// Extract trainer id → spriteKey pairs directly from the data file so this
// script stays in sync without importing the ESM module.
function readTrainerSpriteMap() {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'data', 'trainers.js'), 'utf8')
  const map = new Map()
  // Match trainer object blocks: two-space-indented key → spriteKey inside the block.
  // Pattern: ^  <id>: {  ...  spriteKey: '<key>'
  const blockRe = /^  (\w+):\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/gms
  let block
  while ((block = blockRe.exec(src)) !== null) {
    const id       = block[1]
    const body     = block[2]
    const skMatch  = body.match(/spriteKey:\s*'([^']+)'/)
    if (skMatch) map.set(id, skMatch[1])
  }
  return map
}

const trainerSpriteMap = readTrainerSpriteMap()

// Build the portrait list: player first, then all trainers.
const portraitEntries = [{ file: 'player', r: 0x40, g: 0x80, b: 0xFF }]
for (const [id, spriteKey] of trainerSpriteMap) {
  const [r, g, b] = SPRITE_COLOURS[spriteKey] ?? [0x80, 0xA0, 0x80]
  portraitEntries.push({
    file: id,
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
// Biome mapping from src/config.js BATTLE_BACKGROUNDS:
//   localhost_town → plains, pipeline_pass → construction, …
// ---------------------------------------------------------------------------

const ARENA_W   = 1920
const ARENA_H_A = 1080   // full-screen background
const ARENA_H_B =  400   // foreground ground strip

// Sky colour (used for _a layer) and ground colour (_b layer) per biome.
const ARENA_COLOURS = {
  plains:       { sky: [0x87, 0xCE, 0xEB], ground: [0x5D, 0xA0, 0x3C] },
  construction: { sky: [0xB0, 0x90, 0x60], ground: [0x70, 0x60, 0x40] },
  cave:         { sky: [0x20, 0x18, 0x28], ground: [0x40, 0x30, 0x40] },
  factory:      { sky: [0x60, 0x70, 0x80], ground: [0x50, 0x50, 0x60] },
  stadium:      { sky: [0x20, 0x30, 0x80], ground: [0x40, 0x60, 0x30] },
  abyss:        { sky: [0x10, 0x08, 0x20], ground: [0x18, 0x10, 0x30] },
  ruins:        { sky: [0x60, 0x50, 0x40], ground: [0x80, 0x70, 0x50] },
  forest:       { sky: [0x40, 0x70, 0x30], ground: [0x20, 0x50, 0x20] },
  space:        { sky: [0x08, 0x08, 0x20], ground: [0x18, 0x18, 0x40] },
  wasteland:    { sky: [0x80, 0x60, 0x40], ground: [0x60, 0x40, 0x30] },
}

const ARENAS_DIR = path.join(ROOT, 'assets', 'arenas')

console.log('\n── Arena backgrounds (1920×1080 _a + 1920×400 _b per biome) ───')
for (const [name, { sky, ground }] of Object.entries(ARENA_COLOURS)) {
  const [sr, sg, sb] = sky
  const [gr, gg, gb] = ground

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
