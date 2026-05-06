/**
 * scripts/stub-sprites.js
 *
 * Generates placeholder 48×48px RGBA PNG sprite sheets for development use.
 * These stubs allow the game to load and run without the real Ninja Adventure
 * assets. Replace them by running the full upscale + install pipeline once the
 * Ninja Adventure pack is available.
 *
 * Usage:
 *   node scripts/stub-sprites.js
 *
 * Output:
 *   assets/sprites/player/hero.png          — 144×48px (3-frame walk cycle)
 *   assets/sprites/trainers/trainer_01.png  — 144×48px (3-frame walk cycle)
 *   assets/sprites/effects/hit_spark.png    — 96×48px  (2-frame hit spark)
 *
 * Each stub uses the Cloud Quest reference palette so placeholders are
 * visually consistent with the rest of the art in development.
 *
 * PNG encoding uses Node's built-in zlib — no external dependencies.
 */

import { fileURLToPath } from 'node:url'
import path              from 'node:path'
import fs                from 'node:fs'
import zlib              from 'node:zlib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// Minimal RGBA PNG encoder — no external dependencies
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

/**
 * Encode an RGBA image to a PNG Buffer.
 * @param {number} width
 * @param {number} height
 * @param {Uint8Array} pixels  — RGBA bytes, row-major, top-to-bottom
 */
function encodePngRGBA(width, height, pixels) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width,  0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type: RGBA

  const rowBytes = width * 4
  const raw      = Buffer.alloc(height * (rowBytes + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (rowBytes + 1)] = 0  // filter: None
    Buffer.from(pixels).copy(
      raw,
      y * (rowBytes + 1) + 1,
      y * rowBytes,
      (y + 1) * rowBytes
    )
  }
  const idat = zlib.deflateSync(raw)

  return Buffer.concat([
    PNG_SIG,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------------------------------------------------------------------------
// Sprite painter helpers
// ---------------------------------------------------------------------------

const TILE = 48

// Cloud Quest reference palette
const PALETTE = {
  transparent: [0,   0,   0,   0  ],
  outline:     [20,  20,  20,  255],
  white:       [248, 248, 248, 255],
  lightGray:   [200, 200, 210, 255],
  midGray:     [140, 140, 150, 255],
  darkGray:    [60,  60,  70,  255],
  teal:        [60,  180, 200, 255],
  blue:        [80,  130, 220, 255],
  darkBlue:    [40,  60,  120, 255],
  green:       [60,  200, 100, 255],
  yellow:      [255, 220, 60,  255],
  red:         [220, 50,  50,  255],
}

/**
 * Set a single pixel in an RGBA pixel buffer.
 */
function setPixel(buf, x, y, width, [r, g, b, a]) {
  const off = (y * width + x) * 4
  buf[off]     = r
  buf[off + 1] = g
  buf[off + 2] = b
  buf[off + 3] = a
}

/**
 * Fill a rectangle in an RGBA pixel buffer.
 */
function fillRect(buf, x0, y0, x1, y1, width, color) {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      setPixel(buf, x, y, width, color)
    }
  }
}

// ---------------------------------------------------------------------------
// Sprite definitions — each function paints one 48×48 frame into a pixel buf
// ---------------------------------------------------------------------------

/**
 * Paint a simple humanoid silhouette stub — head + body + outline.
 * Suitable for player and trainer placeholder sprites.
 *
 * @param {Uint8Array} buf      RGBA pixel buffer for the entire sheet
 * @param {number}     frameX   X tile position (0-indexed column)
 * @param {number}     totalW   Total width of the sheet in pixels
 * @param {number[]}   bodyColor  RGBA body colour
 */
function paintCharacterFrame(buf, frameX, totalW, bodyColor) {
  const ox = frameX * TILE  // x pixel offset for this frame

  // Transparent background (already zero-initialised)
  // Head (12×12 centred at top)
  const headX  = ox + 18
  const headY  = 8
  const headW  = 12
  const headH  = 12
  fillRect(buf, headX,     headY,     headX + headW,     headY + headH,     totalW, bodyColor)
  fillRect(buf, headX - 1, headY - 1, headX + headW + 1, headY + headH + 1, totalW, PALETTE.outline)
  fillRect(buf, headX,     headY,     headX + headW,     headY + headH,     totalW, bodyColor)

  // Eyes (2×2 each, white with dark pupil)
  fillRect(buf, ox + 21, 11, ox + 23, 13, totalW, PALETTE.white)
  fillRect(buf, ox + 25, 11, ox + 27, 13, totalW, PALETTE.white)
  setPixel(buf, ox + 21, 11, totalW, PALETTE.darkGray)
  setPixel(buf, ox + 25, 11, totalW, PALETTE.darkGray)

  // Body (14×16 centred)
  const bodyX = ox + 17
  const bodyY = 21
  const bodyW = 14
  const bodyH = 16
  fillRect(buf, bodyX - 1, bodyY - 1, bodyX + bodyW + 1, bodyY + bodyH + 1, totalW, PALETTE.outline)
  fillRect(buf, bodyX,     bodyY,     bodyX + bodyW,     bodyY + bodyH,     totalW, bodyColor)

  // Legs (6×8 each)
  const legY = 37
  fillRect(buf, ox + 17, legY, ox + 23, legY + 8, totalW, PALETTE.outline)
  fillRect(buf, ox + 18, legY, ox + 22, legY + 8, totalW, bodyColor)
  fillRect(buf, ox + 25, legY, ox + 31, legY + 8, totalW, PALETTE.outline)
  fillRect(buf, ox + 26, legY, ox + 30, legY + 8, totalW, bodyColor)
}

/**
 * Paint a simple sparkle/star VFX stub — two crossed lines with a glow centre.
 */
function paintSparkFrame(buf, frameX, totalW, color) {
  const ox = frameX * TILE
  const cx = ox + TILE / 2
  const cy = TILE / 2

  // Rays (horizontal + vertical cross)
  for (let i = -12; i <= 12; i++) {
    if (Math.abs(i) < 2) continue
    const alpha = Math.max(0, 255 - Math.abs(i) * 15)
    setPixel(buf, cx + i, cy, totalW, [color[0], color[1], color[2], alpha])
    setPixel(buf, cx, cy + i, totalW, [color[0], color[1], color[2], alpha])
  }

  // Diagonal rays (shorter)
  for (let i = -8; i <= 8; i++) {
    if (Math.abs(i) < 2) continue
    const alpha = Math.max(0, 220 - Math.abs(i) * 20)
    const px = cx + i, py = cy + i
    if (px >= ox && px < ox + TILE && py >= 0 && py < TILE) {
      setPixel(buf, px, py, totalW, [color[0], color[1], color[2], alpha])
    }
    const px2 = cx + i, py2 = cy - i
    if (px2 >= ox && px2 < ox + TILE && py2 >= 0 && py2 < TILE) {
      setPixel(buf, px2, py2, totalW, [color[0], color[1], color[2], alpha])
    }
  }

  // Bright centre
  fillRect(buf, cx - 1, cy - 1, cx + 2, cy + 2, totalW, PALETTE.white)
  fillRect(buf, cx - 3, cy - 1, cx + 4, cy + 2, totalW, [color[0], color[1], color[2], 200])
  fillRect(buf, cx - 1, cy - 3, cx + 2, cy + 4, totalW, [color[0], color[1], color[2], 200])
}

// ---------------------------------------------------------------------------
// Sprite sheet definitions
// ---------------------------------------------------------------------------

const STUBS = [
  {
    path:   'assets/sprites/player/hero.png',
    frames: 3,
    paint(buf, w) {
      for (let f = 0; f < 3; f++) paintCharacterFrame(buf, f, w, PALETTE.teal)
    },
  },
  {
    path:   'assets/sprites/trainers/trainer_01.png',
    frames: 3,
    paint(buf, w) {
      for (let f = 0; f < 3; f++) paintCharacterFrame(buf, f, w, PALETTE.yellow)
    },
  },
  {
    path:   'assets/sprites/effects/hit_spark.png',
    frames: 2,
    paint(buf, w) {
      paintSparkFrame(buf, 0, w, PALETTE.yellow)
      paintSparkFrame(buf, 1, w, PALETTE.red)
    },
  },
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let generated = 0
let skipped   = 0

for (const stub of STUBS) {
  const dst = path.join(ROOT, ...stub.path.split('/'))

  if (fs.existsSync(dst)) {
    console.log(`  [skip]  ${stub.path}  (already exists)`)
    skipped++
    continue
  }

  const sheetW = stub.frames * TILE
  const sheetH = TILE
  const pixels = new Uint8Array(sheetW * sheetH * 4)  // zero = transparent

  stub.paint(pixels, sheetW)

  const png = encodePngRGBA(sheetW, sheetH, pixels)

  fs.mkdirSync(path.dirname(dst), { recursive: true })
  fs.writeFileSync(dst, png)
  console.log(`  [gen]   ${stub.path}  (${sheetW}×${sheetH}px, ${stub.frames} frame${stub.frames > 1 ? 's' : ''})`)
  generated++
}

console.log()
console.log(`Done — ${generated} generated, ${skipped} skipped`)
console.log()
console.log('Replace these stubs by running the full Ninja Adventure upscale + install pipeline:')
console.log('  node scripts/upscale-assets.js --input /path/to/NinjaAdventure --output /tmp/ninja-upscaled')
console.log('  node scripts/install-ninja-assets.js --input /tmp/ninja-upscaled --force')
