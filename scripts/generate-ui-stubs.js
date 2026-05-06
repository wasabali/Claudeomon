#!/usr/bin/env node
/**
 * Generate stub UI panel sprites for Cloud Quest.
 *
 * Creates a placeholder 9-slice window texture at assets/ui/window.png that
 * matches the Ninja Adventure aesthetic until the real Ninja Adventure HUD
 * assets are integrated (see GitHub issue [Assets] Source Ninja Adventure HUD sprites).
 *
 * Sprite spec:
 *   Size:    24 × 24 px RGBA PNG
 *   Slices:  4 px on each edge  →  nineslice(x, y, 'ui_window', 0, w, h, 4,4,4,4)
 *
 * Layer breakdown (from outside in):
 *   px 0,  W-1    outer edge          → FILL  (transparent to 9-slice stretching)
 *   px 1–2, W-2–3 main border band    → BORDER
 *   px 3,  W-4    inner highlight     → INNER
 *   px 4 … W-5    fill zone           → FILL
 *
 * Colors (must match the procedural fallback in DialogBox, Menu, BaseScene):
 *   FILL   #0d1827  deep navy fill
 *   BORDER #3d7099  teal border band
 *   INNER  #5a96be  inner highlight strip
 *
 * Usage:
 *   node scripts/generate-ui-stubs.js
 */

import { writeFileSync, mkdirSync } from 'fs'
import { deflateSync } from 'zlib'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── CRC32 ────────────────────────────────────────────────────────────────────

const CRC32_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc = CRC32_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

// ── PNG helpers ──────────────────────────────────────────────────────────────

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const lenBuf    = Buffer.allocUnsafe(4)
  const crcBuf    = Buffer.allocUnsafe(4)
  lenBuf.writeUInt32BE(data.length)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])))
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf])
}

function buildPng(width, height, pixels) {
  // pixels: Uint8Array, length = width * height * 4 (RGBA row-major)
  const PNG_SIG = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])

  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(width,  0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8]  = 8  // bit depth
  ihdr[9]  = 6  // RGBA
  ihdr[10] = 0  // compression: deflate
  ihdr[11] = 0  // filter: adaptive
  ihdr[12] = 0  // interlace: none

  // Build raw (filter-byte-prefixed) scanlines — filter type 0 = None per row.
  const raw = Buffer.allocUnsafe(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0  // filter byte
    for (let x = 0; x < width; x++) {
      const si = (y * width + x) * 4
      const di = y * (1 + width * 4) + 1 + x * 4
      raw[di]     = pixels[si]
      raw[di + 1] = pixels[si + 1]
      raw[di + 2] = pixels[si + 2]
      raw[di + 3] = pixels[si + 3]
    }
  }

  return Buffer.concat([
    PNG_SIG,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Sprite generation ────────────────────────────────────────────────────────

/**
 * Build a W×H RGBA pixel array for the Ninja Adventure-style window panel.
 *
 * Pixel logic mirrors the procedural fallback in DialogBox._ensureTexture(),
 * Menu._ensureTexture(), and BaseScene.createPanel() so both code paths
 * produce an identical appearance.
 */
function makeWindowPanel(W = 24, H = 24) {
  // Named pixel-position constants — must match the 9-slice inset (4 px).
  const BORDER_OUTER = 1   // first border pixel (inclusive)
  const BORDER_INNER = 2   // last border pixel (inclusive from outer)
  const INSET        = 3   // inner highlight pixel
  const INSET_END    = W - 4  // inner highlight pixel (right / bottom side)
  const BORDER_INNER_R = W - 3
  const BORDER_OUTER_R = W - 2

  // Colors: [R, G, B, A] — hex values match 0x0d1827 / 0x3d7099 / 0x5a96be
  const FILL   = [0x0D, 0x18, 0x27, 0xFF]
  const BORDER = [0x3D, 0x70, 0x99, 0xFF]
  const INNER  = [0x5A, 0x96, 0xBE, 0xFF]

  const px = new Uint8Array(W * H * 4)

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Border band: columns 1–2 or W-3–W-2, rows 1–H-2
      const onLeftBorder   = (x === BORDER_OUTER || x === BORDER_INNER) && y >= BORDER_OUTER && y <= H - 2
      const onRightBorder  = (x === BORDER_INNER_R || x === BORDER_OUTER_R) && y >= BORDER_OUTER && y <= H - 2
      // Border band: rows 1–2 or H-3–H-2, cols 1–W-2
      const onTopBorder    = (y === BORDER_OUTER || y === BORDER_INNER) && x >= BORDER_OUTER && x <= W - 2
      const onBottomBorder = (y === H - 3 || y === H - 2) && x >= BORDER_OUTER && x <= W - 2

      // Inner highlight strip: row/column 3 and W-4 / H-4, within fill zone
      const onLeftInner   = x === INSET && y >= INSET && y <= INSET_END
      const onRightInner  = x === INSET_END && y >= INSET && y <= INSET_END
      const onTopInner    = y === INSET && x >= INSET && x <= INSET_END
      const onBottomInner = y === INSET_END && x >= INSET && x <= INSET_END

      let color
      if (onLeftBorder || onRightBorder || onTopBorder || onBottomBorder) {
        color = BORDER
      } else if (onLeftInner || onRightInner || onTopInner || onBottomInner) {
        color = INNER
      } else {
        color = FILL
      }

      const i = (y * W + x) * 4
      px[i]     = color[0]
      px[i + 1] = color[1]
      px[i + 2] = color[2]
      px[i + 3] = color[3]
    }
  }

  return px
}

// ── Main ─────────────────────────────────────────────────────────────────────

mkdirSync(join(ROOT, 'assets/ui'), { recursive: true })

const windowPng = buildPng(24, 24, makeWindowPanel())
writeFileSync(join(ROOT, 'assets/ui/window.png'), windowPng)

console.log('✓ Generated assets/ui/window.png (24×24 px — Ninja Adventure style stub)')
console.log('  Replace with actual Ninja Adventure HUD/Panel sprite once the pack is integrated.')

