/**
 * scripts/generate-ui-stubs.js
 *
 * Generates assets/ui/window.png — a 48×48 pixel-art panel stub that
 * matches the Ninja Adventure HUD panel visual style.
 *
 * This stub is used by the 9-slice UI chrome (DialogBox, Menu, BaseScene
 * createPanel) until the real Ninja Adventure HUD panel is installed via
 * scripts/upscale-assets.js.
 *
 * When the real Ninja Adventure assets are available, replace this stub with
 * the upscaled sprite from HUD/Panel/ (using scripts/upscale-assets.js):
 *
 *   node scripts/upscale-assets.js \
 *     --input /tmp/NinjaAdventure/HUD/Panel \
 *     --output assets/ui \
 *     --scale 3
 *
 *   # Then rename: mv assets/ui/Window.png assets/ui/window.png
 *
 * Sprite spec:
 *   Size:    48×48 px  (Ninja Adventure 16×16 upscaled 3×)
 *   Format:  RGBA PNG (8-bit per channel)
 *   Insets:  8, 8, 8, 8  (used in nineslice() calls)
 *   Source:  https://pixel-boy.itch.io/ninja-adventure-asset-pack (CC0)
 *
 * Usage:
 *   node scripts/generate-ui-stubs.js
 *   node scripts/generate-ui-stubs.js --force   # overwrite if exists
 *
 * Exit codes:
 *   0 — success (written or already exists)
 *   1 — write error
 */

import { deflateSync }       from 'node:zlib'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath }     from 'node:url'
import path                  from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const OUT_PATH  = path.join(ROOT, 'assets', 'ui', 'window.png')

const FORCE = process.argv.includes('--force')

// ---------------------------------------------------------------------------
// Pixel design — 48×48 RGBA, 8 px border, matching the game's dark UI theme.
//
// Border layers (distance d from nearest edge):
//   d 0–1 : outer dark frame   #1a1a2a
//   d 2–5 : blue-gray border   #334155   (matches BaseScene / DialogBox border colour)
//   d 6–7 : inner shadow frame #1a1a2a
//   d 8+  : dark fill          #0d1117   (matches DialogBox fill colour)
// ---------------------------------------------------------------------------

const W      = 48
const H      = 48
const BORDER = 8   // nineslice inset value used by all consumers

// RGBA colour tuples
const COLOR_OUTER_FRAME = [0x1a, 0x1a, 0x2a, 0xff]
const COLOR_BORDER      = [0x33, 0x41, 0x55, 0xff]
const COLOR_FILL        = [0x0d, 0x11, 0x17, 0xff]

function pixelAt(x, y) {
  const d = Math.min(x, y, W - 1 - x, H - 1 - y)
  if (d < 2)          return COLOR_OUTER_FRAME
  if (d < BORDER - 2) return COLOR_BORDER
  if (d < BORDER)     return COLOR_OUTER_FRAME
  return COLOR_FILL
}

// ---------------------------------------------------------------------------
// Minimal PNG encoder (no external deps).
// Writes RGBA 8-bit, filter type 0 (None), deflate-compressed IDAT.
// ---------------------------------------------------------------------------

function makeCrcTable() {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    t[n] = c
  }
  return t
}
const CRC_TABLE = makeCrcTable()

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf  = Buffer.allocUnsafe(4)
  const crcBuf  = Buffer.allocUnsafe(4)
  lenBuf.writeUInt32BE(data.length)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function encodePng(width, height, pixels) {
  // IHDR
  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(width,  0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8]  = 8  // bit depth
  ihdr[9]  = 6  // colour type: RGBA
  ihdr[10] = 0  // compression: deflate
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace: none

  // Raw scanlines with filter byte 0 (None) prepended to each row
  const stride  = width * 4
  const rawRows = Buffer.allocUnsafe(height * (1 + stride))
  for (let y = 0; y < height; y++) {
    rawRows[y * (1 + stride)] = 0  // filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixels[y * width + x]
      const base = y * (1 + stride) + 1 + x * 4
      rawRows[base]     = r
      rawRows[base + 1] = g
      rawRows[base + 2] = b
      rawRows[base + 3] = a
    }
  }

  const idat = deflateSync(rawRows, { level: 9 })

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

if (!FORCE && existsSync(OUT_PATH)) {
  console.log(`assets/ui/window.png already exists (use --force to overwrite)`)
  process.exit(0)
}

const pixels = []
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    pixels.push(pixelAt(x, y))
  }
}

mkdirSync(path.dirname(OUT_PATH), { recursive: true })

try {
  writeFileSync(OUT_PATH, encodePng(W, H, pixels))
  console.log(`Generated assets/ui/window.png (${W}×${H} px, ${BORDER}px inset)`)
} catch (err) {
  console.error(`Failed to write assets/ui/window.png: ${err.message}`)
  process.exit(1)
}
