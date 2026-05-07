/**
 * generate-ui-stubs.js
 *
 * Generates a stub 9-slice window panel PNG at assets/ui/window.png for use
 * in Cloud Quest's UI chrome (dialog boxes, menus, HUD panels).
 *
 * Usage:
 *   node scripts/generate-ui-stubs.js
 *
 * Output:
 *   assets/ui/window.png  —  48×48px, RGB PNG, 4px insets all sides
 *
 * Real asset source
 * -----------------
 * Replace assets/ui/window.png with a panel from the Kenney UI Pack (CC0):
 *   https://kenney.nl/assets/ui-pack
 *
 * Recommended sprite:  panel_brown.png  or  panel_blue.png
 * Dimensions in pack:  typically 190×49px (or any 9-sliceable size)
 *
 * After swapping in the real sprite, confirm the border inset width and update
 * the `slice` constant in the three call-sites if it differs from 4px:
 *   src/ui/DialogBox.js    — nineslice inset argument
 *   src/ui/Menu.js         — nineslice inset argument
 *   src/scenes/BaseScene.js — createPanel() default slice option
 *
 * This stub uses a 48×48px dark-navy panel with 4px borders so the game boots
 * with correctly sized UI chrome until the real Kenney assets are dropped in.
 *
 * PNG encoding uses Node's built-in zlib — no external dependencies.
 */

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import zlib from 'node:zlib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const UI_DIR = path.join(ROOT, 'assets', 'ui')

// Panel sprite dimensions.  4px border insets on every side match all
// call-sites that pass slice=4 to Phaser's add.nineslice().
const WIDTH  = 48
const HEIGHT = 48
const BORDER = 4   // must match the slice value used in DialogBox / Menu / BaseScene

// ---------------------------------------------------------------------------
// Colour palette — dark-navy RPG theme consistent with the procedural stubs
// ---------------------------------------------------------------------------

// Panel interior fill — very dark navy
const FILL   = [0x1a, 0x1a, 0x2a]
// Border — muted blue-slate
const EDGE   = [0x33, 0x41, 0x55]
// Corner accent — slightly lighter blue so corners read as distinct
const CORNER = [0x55, 0x77, 0x99]

// ---------------------------------------------------------------------------
// Minimal RGB PNG encoder — no alpha, no external dependencies
// (mirrors the encoder in scripts/generate-tilesets.js)
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

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
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

function encodePng(width, height, pixels) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 2 // 8-bit depth, RGB colour type

  const rowBytes = width * 3
  const raw = Buffer.alloc(height * (rowBytes + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (rowBytes + 1)] = 0 // filter: None
    pixels.copy(raw, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes)
  }
  const idat = zlib.deflateSync(raw)

  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------------------------------------------------------------------------
// Panel painter — 9-slice layout with BORDER-px edges
// ---------------------------------------------------------------------------

function paintPanel(width, height) {
  const pixels = Buffer.alloc(width * height * 3)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const off = (y * width + x) * 3

      const inTopBorder    = y < BORDER
      const inBottomBorder = y >= height - BORDER
      const inLeftBorder   = x < BORDER
      const inRightBorder  = x >= width - BORDER
      const inCorner = (inTopBorder || inBottomBorder) && (inLeftBorder || inRightBorder)

      let [r, g, b] = FILL

      if (inCorner) {
        ;[r, g, b] = CORNER
      } else if (inTopBorder || inBottomBorder || inLeftBorder || inRightBorder) {
        ;[r, g, b] = EDGE
      }

      pixels[off]     = r
      pixels[off + 1] = g
      pixels[off + 2] = b
    }
  }

  return pixels
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

fs.mkdirSync(UI_DIR, { recursive: true })

const pixels = paintPanel(WIDTH, HEIGHT)
const png    = encodePng(WIDTH, HEIGHT, pixels)
const dest   = path.join(UI_DIR, 'window.png')

fs.writeFileSync(dest, png)
console.log(`[generate-ui-stubs] Written ${WIDTH}×${HEIGHT}px stub panel → ${path.relative(ROOT, dest)}`)
console.log('[generate-ui-stubs] Replace with the real Kenney UI Pack panel when available.')
console.log('[generate-ui-stubs] Source: https://kenney.nl/assets/ui-pack  (CC0)')
