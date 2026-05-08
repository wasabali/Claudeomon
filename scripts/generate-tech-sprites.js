/**
 * scripts/generate-tech-sprites.js
 *
 * Generates all 50 individual 48×48 RGBA PNG tile sprites for the
 * kenney_tech_office tileset, then stitches them into
 * assets/tiles/kenney_tech_office.png (5 cols × 10 rows).
 *
 * Usage:
 *   node scripts/generate-tech-sprites.js
 *
 * Output:
 *   assets/tiles/sprites/tile_NNN_name.png  — 50 individual RGBA sprites
 *   assets/tiles/kenney_tech_office.png     — 240×480 RGB tileset (stitched)
 *
 * No external dependencies — uses Node built-in zlib only.
 * Pixel art follows briefs in assets/tiles/custom-tiles-spec.md.
 * Kenney-sourced tiles (IDs 3, 7, 9, 16–20, 23, 31, 32, 35–37) are rendered
 * in a compatible style since the original Kenney pack is not bundled.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT       = path.resolve(__dirname, '..')
const TILES_DIR  = path.join(ROOT, 'assets', 'tiles')
const SPRITES_DIR = path.join(TILES_DIR, 'sprites')
const OUT_PNG    = path.join(TILES_DIR, 'kenney_tech_office.png')

const TILE = 48   // px per tile
const COLS = 5    // tileset columns
const ROWS = 10   // tileset rows

// ---------------------------------------------------------------------------
// Minimal PNG encoder (RGB, no alpha) — reused from generate-tilesets.js
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
  const typeBuf = Buffer.from(type, 'ascii')
  const crcInput = Buffer.concat([typeBuf, data])
  const out = Buffer.allocUnsafe(4 + typeBuf.length + data.length + 4)
  out.writeUInt32BE(data.length, 0)
  typeBuf.copy(out, 4)
  data.copy(out, 8)
  out.writeUInt32BE(crc32(crcInput), 8 + data.length)
  return out
}

/** Encode a w×h RGB pixel buffer as a PNG byte sequence. */
function encodePngRGB(width, height, pixels) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 2  // 8-bit RGB

  const rowBytes = width * 3
  const raw = Buffer.alloc(height * (rowBytes + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (rowBytes + 1)] = 0
    pixels.copy(raw, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes)
  }
  const idat = zlib.deflateSync(raw)
  return Buffer.concat([PNG_SIG, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))])
}

/** Encode a w×h RGBA pixel buffer as a PNG byte sequence. */
function encodePngRGBA(width, height, pixels) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 6  // 8-bit RGBA

  const rowBytes = width * 4
  const raw = Buffer.alloc(height * (rowBytes + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (rowBytes + 1)] = 0
    pixels.copy(raw, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes)
  }
  const idat = zlib.deflateSync(raw)
  return Buffer.concat([PNG_SIG, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))])
}

// ---------------------------------------------------------------------------
// Tile pixel buffer helpers
// ---------------------------------------------------------------------------

/** Create a zeroed TILE×TILE RGBA buffer (transparent black). */
function makeTileBuf() {
  return Buffer.alloc(TILE * TILE * 4, 0)
}

/** Set a pixel in a TILE-width RGBA buffer. */
function sp(buf, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= TILE || y < 0 || y >= TILE) return
  const off = (y * TILE + x) * 4
  buf[off] = r; buf[off + 1] = g; buf[off + 2] = b; buf[off + 3] = a
}

/** Fill a rectangle in the tile buffer with an RGBA colour. */
function fr(buf, x0, y0, w, h, r, g, b, a = 255) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++)
      sp(buf, x0 + dx, y0 + dy, r, g, b, a)
}

/** Draw a horizontal line segment. */
function hl(buf, y, x0, x1, r, g, b, a = 255) {
  for (let x = x0; x <= x1; x++) sp(buf, x, y, r, g, b, a)
}

/** Draw a vertical line segment. */
function vl(buf, x, y0, y1, r, g, b, a = 255) {
  for (let y = y0; y <= y1; y++) sp(buf, x, y, r, g, b, a)
}

/** Draw a 1-pixel border rectangle (outline only). */
function border(buf, x0, y0, w, h, r, g, b, a = 255) {
  hl(buf, y0,         x0, x0 + w - 1, r, g, b, a)
  hl(buf, y0 + h - 1, x0, x0 + w - 1, r, g, b, a)
  vl(buf, x0,         y0, y0 + h - 1, r, g, b, a)
  vl(buf, x0 + w - 1, y0, y0 + h - 1, r, g, b, a)
}

// ---------------------------------------------------------------------------
// Individual tile painter functions — one per tile ID
// ---------------------------------------------------------------------------

// ── Row 0: Floors (IDs 1–5) ─────────────────────────────────────────────────

/** Tile 1 — tech_floor: dark slate with subtle pixel grid */
function tile001_tech_floor() {
  const b = makeTileBuf()
  // Base fill: dark grey-blue #282C34
  fr(b, 0, 0, TILE, TILE, 0x28, 0x2C, 0x34)
  // Subtle grid lines every 12px in #1E2127
  for (let i = 0; i < TILE; i += 12) {
    hl(b, i, 0, TILE - 1, 0x1E, 0x21, 0x27)
    vl(b, i, 0, TILE - 1, 0x1E, 0x21, 0x27)
  }
  return b
}

/** Tile 2 — server_room_floor: anti-static steel-blue with grout lines */
function tile002_server_room_floor() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x34, 0x4E, 0x5E)
  // Grout lines every 24px in #263A4A
  for (let i = 0; i < TILE; i += 24) {
    hl(b, i, 0, TILE - 1, 0x26, 0x3A, 0x4A)
    vl(b, i, 0, TILE - 1, 0x26, 0x3A, 0x4A)
  }
  // Slight sheen in top-left corner
  for (let i = 0; i < 6; i++) sp(b, i, 0, 0x5A, 0x72, 0x84)
  for (let i = 0; i < 4; i++) sp(b, 0, i, 0x5A, 0x72, 0x84)
  return b
}

/** Tile 3 — office_floor (Kenney-inspired): warm light tile floor */
function tile003_office_floor() {
  const b = makeTileBuf()
  // Base: warm light grey #C8C4B8
  fr(b, 0, 0, TILE, TILE, 0xC8, 0xC4, 0xB8)
  // Grout lines every 16px in #A8A49A
  for (let i = 0; i < TILE; i += 16) {
    hl(b, i, 0, TILE - 1, 0xA8, 0xA4, 0x9A)
    vl(b, i, 0, TILE - 1, 0xA8, 0xA4, 0x9A)
  }
  // Slight warm highlight in each tile quadrant
  fr(b, 2,  2,  5, 5, 0xD8, 0xD4, 0xC8)
  fr(b, 18, 2,  5, 5, 0xD8, 0xD4, 0xC8)
  fr(b, 34, 2,  5, 5, 0xD8, 0xD4, 0xC8)
  fr(b, 2,  18, 5, 5, 0xD8, 0xD4, 0xC8)
  fr(b, 18, 18, 5, 5, 0xD8, 0xD4, 0xC8)
  fr(b, 34, 18, 5, 5, 0xD8, 0xD4, 0xC8)
  fr(b, 2,  34, 5, 5, 0xD8, 0xD4, 0xC8)
  fr(b, 18, 34, 5, 5, 0xD8, 0xD4, 0xC8)
  fr(b, 34, 34, 5, 5, 0xD8, 0xD4, 0xC8)
  return b
}

/** Tile 4 — raised_floor: dark blue with bolted panel connectors */
function tile004_raised_floor() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x1C, 0x28, 0x52)
  // Panel seams
  for (let i = 0; i < TILE; i += 24) {
    hl(b, i, 0, TILE - 1, 0x14, 0x1E, 0x3C)
    vl(b, i, 0, TILE - 1, 0x14, 0x1E, 0x3C)
  }
  // Corner bolts (2×2 px in #8888CC)
  fr(b, 1,  1,  2, 2, 0x88, 0x88, 0xCC)
  fr(b, 21, 1,  2, 2, 0x88, 0x88, 0xCC)
  fr(b, 45, 1,  2, 2, 0x88, 0x88, 0xCC)
  fr(b, 1,  21, 2, 2, 0x88, 0x88, 0xCC)
  fr(b, 21, 21, 2, 2, 0x88, 0x88, 0xCC)
  fr(b, 45, 21, 2, 2, 0x88, 0x88, 0xCC)
  fr(b, 1,  45, 2, 2, 0x88, 0x88, 0xCC)
  fr(b, 21, 45, 2, 2, 0x88, 0x88, 0xCC)
  fr(b, 45, 45, 2, 2, 0x88, 0x88, 0xCC)
  return b
}

/** Tile 5 — corridor: medium grey with guiding centre stripe */
function tile005_corridor() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x5F, 0x62, 0x6C)
  // Centre horizontal guide stripe (10px wide) in #777A85
  fr(b, 0, 19, TILE, 10, 0x77, 0x7A, 0x85)
  // Edge highlight
  hl(b, 0,        0, TILE - 1, 0x4C, 0x4F, 0x58)
  hl(b, TILE - 1, 0, TILE - 1, 0x4C, 0x4F, 0x58)
  return b
}

// ── Row 1: Walls (IDs 6–10) ─────────────────────────────────────────────────

/** Tile 6 — server_room_wall: very dark panel wall */
function tile006_server_room_wall() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x16, 0x16, 0x19)
  // Vertical panel seams every 16px
  for (let x = 0; x < TILE; x += 16) vl(b, x, 2, TILE - 1, 0x15, 0x16, 0x18)
  // 2px top bracket
  hl(b, 0, 0, TILE - 1, 0x33, 0x33, 0x38)
  hl(b, 1, 0, TILE - 1, 0x28, 0x28, 0x2C)
  return b
}

/** Tile 7 — office_wall (Kenney-inspired): warm beige plaster wall */
function tile007_office_wall() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0xD8, 0xD2, 0xC0)
  // Subtle horizontal plaster lines every 8px
  for (let y = 0; y < TILE; y += 8) hl(b, y, 0, TILE - 1, 0xC4, 0xBE, 0xAC)
  // Top baseboard / trim
  fr(b, 0, 0, TILE, 3, 0xC0, 0xB8, 0xA0)
  // Bottom skirting board
  fr(b, 0, TILE - 4, TILE, 4, 0xB0, 0xA8, 0x90)
  return b
}

/** Tile 8 — datacenter_wall: charcoal brushed-metal wall */
function tile008_datacenter_wall() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x2D, 0x2D, 0x3A)
  // Horizontal highlight lines every 8px
  for (let y = 0; y < TILE; y += 8) hl(b, y, 0, TILE - 1, 0x52, 0x52, 0x62)
  // Side rails
  vl(b, 0,        0, TILE - 1, 0x20, 0x20, 0x2A)
  vl(b, TILE - 1, 0, TILE - 1, 0x20, 0x20, 0x2A)
  return b
}

/** Tile 9 — glass_wall (Kenney-inspired): glass/window pane */
function tile009_glass_wall() {
  const b = makeTileBuf()
  // Frame
  fr(b, 0, 0, TILE, TILE, 0x40, 0x48, 0x52)
  // Inner glass pane
  fr(b, 3, 3, TILE - 6, TILE - 6, 0x80, 0xB8, 0xD8)
  // Glass reflections — diagonal highlight
  for (let i = 0; i < 12; i++) sp(b, 5 + i, 5, 0xC0, 0xE0, 0xF0)
  for (let i = 0; i < 8; i++)  sp(b, 5, 6 + i, 0xC0, 0xE0, 0xF0)
  // Frame divisions (cross bar for double window look)
  hl(b, TILE / 2, 2, TILE - 3, 0x38, 0x40, 0x4A)
  vl(b, TILE / 2, 2, TILE - 3, 0x38, 0x40, 0x4A)
  return b
}

/** Tile 10 — tech_building_exterior: dark glass-and-steel facade */
function tile010_tech_building_exterior() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x3C, 0x41, 0x48)
  // Vertical glass dividers every 12px
  for (let x = 0; x < TILE; x += 12) vl(b, x, 0, TILE - 1, 0x24, 0x28, 0x30)
  // Glass panels between dividers — slightly lighter
  for (let x = 1; x < TILE; x += 12) fr(b, x, 1, 10, TILE - 2, 0x44, 0x4A, 0x52)
  // Reflective glint in top-right corner
  fr(b, 43, 2, 3, 3, 0x9A, 0xBF, 0xCC)
  return b
}

// ── Row 2: Equipment (IDs 11–15) ────────────────────────────────────────────

/** Tile 11 — server_rack: front of a 42U server cabinet */
function tile011_server_rack() {
  const b = makeTileBuf()
  // Rack body
  fr(b, 0, 0, TILE, TILE, 0x19, 0x22, 0x44)
  // Front bezel
  fr(b, 4, 2, 40, 44, 0x1E, 0x28, 0x50)
  // Rack rails (sides)
  fr(b, 2, 2, 2, 44, 0x14, 0x18, 0x30)
  fr(b, 44, 2, 2, 44, 0x14, 0x18, 0x30)
  // 6 visible 1U blade servers (each 4px tall, with 1px gap)
  const bladeColors = [
    [0x2A, 0x30, 0x60], [0x26, 0x2C, 0x58], [0x2E, 0x34, 0x64],
    [0x24, 0x2A, 0x54], [0x2C, 0x32, 0x60], [0x28, 0x2E, 0x5C],
  ]
  for (let i = 0; i < 6; i++) {
    const y = 4 + i * 6
    const [br, bg, bb] = bladeColors[i]
    fr(b, 6, y, 36, 4, br, bg, bb)
    // LED on each blade (alternating green/amber)
    if (i % 2 === 0) sp(b, 41, y + 1, 0x00, 0xC8, 0x53)
    else             sp(b, 41, y + 1, 0xFF, 0x8F, 0x00)
    sp(b, 41, y + 2, 0x00, 0x00, 0x00)
  }
  return b
}

/** Tile 12 — server_rack_leds: active server rack with more LEDs */
function tile012_server_rack_leds() {
  const b = tile011_server_rack()
  // Activity bar across top (4px)
  fr(b, 6, 2, 36, 4, 0x00, 0x55, 0x00)
  // Bright green segments in the activity bar
  fr(b, 8,  2, 8, 4, 0x00, 0xFF, 0x00)
  fr(b, 20, 2, 8, 4, 0x00, 0xFF, 0x00)
  fr(b, 32, 2, 6, 4, 0x00, 0xE6, 0x76)
  // Override a couple LEDs to amber
  sp(b, 41, 7,  0xFF, 0x8F, 0x00)
  sp(b, 41, 25, 0xFF, 0x8F, 0x00)
  return b
}

/** Tile 13 — cable_bundle: dense colour-coded floor cable run */
function tile013_cable_bundle() {
  const buf = makeTileBuf()
  fr(buf, 0, 0, TILE, TILE, 0x18, 0x18, 0x20)
  // Shadow / floor context
  fr(buf, 0, 38, TILE, 10, 0x12, 0x12, 0x18)
  // Cables — sinuous horizontal runs
  const cables = [
    { y: 12, r: 0xAA, g: 0xAA, blue: 0xAA }, // grey cat5
    { y: 18, r: 0xF0, g: 0xD0, blue: 0x00 }, // yellow fibre
    { y: 24, r: 0x18, g: 0x18, blue: 0x18 }, // black power
    { y: 30, r: 0x44, g: 0x88, blue: 0xCC }, // blue patch
    { y: 36, r: 0xCC, g: 0x44, blue: 0x44 }, // red alert
  ]
  for (const { y, r, g, blue } of cables) {
    // Sinuous path: use (x+y) modulo to create gentle curve
    for (let x = 0; x < TILE; x++) {
      const oy = Math.round(Math.sin((x / TILE) * Math.PI * 2) * 2)
      sp(buf, x, y + oy,     r, g, blue)
      sp(buf, x, y + oy + 1, r, g, blue)
    }
  }
  // Cable bundle wrap every 16px
  for (let x = 8; x < TILE; x += 16) fr(buf, x, 10, 2, 28, 0x60, 0x50, 0x40)
  return buf
}

/** Tile 14 — patch_panel: 24-port RJ45 patch panel */
function tile014_patch_panel() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x4E, 0x54, 0x58)
  // Panel body
  fr(b, 2, 10, 44, 28, 0x58, 0x5E, 0x64)
  // Two rows of 12 ports each
  const portCols = [0xAA, 0x22, 0x22, 0x88, 0xCC, 0x88, 0xCC, 0x22, 0xAA, 0x22, 0x88, 0xCC]
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 12; col++) {
      const px = 3 + col * 3 + (col >= 6 ? 2 : 0)
      const py = 13 + row * 12
      fr(b, px, py, 3, 3, 0x55, 0x55, 0x60)  // port frame
      sp(b, px + 1, py + 1, 0x11, 0x11, 0x18)  // port hole
      // Cable occupying some ports
      if (portCols[col] > 0x50) sp(b, px + 1, py - 1, portCols[col], portCols[(col+4)%12], 0x80)
    }
  }
  // Label strip
  fr(b, 2, 38, 44, 4, 0x70, 0x78, 0x80)
  return b
}

/** Tile 15 — network_switch: managed 24-port gigabit switch */
function tile015_network_switch() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x0F, 0x0F, 0x12)
  // Switch chassis
  fr(b, 2, 8, 44, 32, 0x18, 0x18, 0x20)
  // 24 tiny port pairs (2×2 px each), in two rows
  for (let i = 0; i < 12; i++) {
    const px = 4 + i * 3
    // Port row 1
    fr(b, px, 12, 2, 2, 0x30, 0x30, 0x40)
    // Port row 2
    fr(b, px, 16, 2, 2, 0x30, 0x30, 0x40)
    // Activity LEDs above ports
    const ledR = (i % 3 === 0) ? 0x00 : 0x00
    const ledG = (i % 3 === 0) ? 0x88 : 0xCC
    const ledB = (i % 3 === 0) ? 0xFF : 0xFF
    sp(b, px, 10, ledR, ledG, ledB)
  }
  // Blue power LED
  fr(b, 42, 10, 2, 2, 0x00, 0x44, 0xFF)
  // Uplink ports (slightly larger)
  fr(b, 4, 22, 4, 4, 0x40, 0x40, 0x58)
  fr(b, 10, 22, 4, 4, 0x40, 0x40, 0x58)
  // Chassis label
  fr(b, 2, 28, 44, 6, 0x22, 0x22, 0x30)
  return b
}

// ── Row 3: Office Furniture (IDs 16–20, Kenney-inspired) ────────────────────

/** Tile 16 — desk (Kenney-inspired): top-down view of an office desk */
function tile016_desk() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)  // floor
  // Desk surface (warm wood)
  fr(b, 4, 6, 40, 28, 0x96, 0x6A, 0x3A)
  // Desk edge (darker front)
  fr(b, 4, 32, 40, 4, 0x72, 0x50, 0x2A)
  // Desk side
  fr(b, 4, 6, 4, 28, 0x84, 0x5C, 0x32)
  // Drawer handle
  fr(b, 22, 36, 6, 2, 0xD4, 0xB0, 0x80)
  // Slight wood grain
  for (let i = 0; i < 5; i++) vl(b, 8 + i * 8, 7, 31, 0x88, 0x60, 0x34)
  return b
}

/** Tile 17 — monitor (Kenney-inspired): flat-screen monitor */
function tile017_monitor() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)  // floor
  // Monitor stand
  fr(b, 21, 38, 6, 6, 0x60, 0x60, 0x70)
  fr(b, 18, 42, 12, 3, 0x50, 0x50, 0x60)
  // Monitor body
  fr(b, 8, 10, 32, 26, 0x30, 0x30, 0x3A)
  // Screen (blue-tinted, active)
  fr(b, 10, 12, 28, 22, 0x10, 0x30, 0x60)
  // Screen content: dashboard widgets
  fr(b, 12, 14, 10, 4, 0x00, 0x88, 0xCC)  // blue chart
  fr(b, 24, 14, 10, 4, 0x00, 0xCC, 0x66)  // green chart
  for (let x = 12; x < 36; x += 3) sp(b, x, 24, 0x00, 0xFF, 0x80)
  return b
}

/** Tile 18 — keyboard (Kenney-inspired): QWERTY keyboard top-down */
function tile018_keyboard() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)  // floor
  // Keyboard body
  fr(b, 6, 16, 36, 18, 0x70, 0x70, 0x80)
  // Key rows (3 rows of small rectangles)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 11; col++) {
      fr(b, 8 + col * 3, 18 + row * 5, 2, 3, 0x98, 0x98, 0xA8)
    }
  }
  // Space bar
  fr(b, 14, 33, 20, 2, 0x98, 0x98, 0xA8)
  return b
}

/** Tile 19 — whiteboard (Kenney-inspired): wall-mounted whiteboard */
function tile019_whiteboard() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x40, 0x41, 0x48)  // wall behind
  // Board frame
  fr(b, 4, 6, 40, 36, 0x60, 0x60, 0x68)
  // White surface
  fr(b, 6, 8, 36, 32, 0xF4, 0xF4, 0xF8)
  // Some writing (pixel marks)
  hl(b, 14, 10, 22, 0x60, 0x80, 0xA0)
  hl(b, 20, 10, 18, 0x60, 0x80, 0xA0)
  hl(b, 26, 12, 30, 0x60, 0x80, 0xA0)
  // Marker tray at bottom
  fr(b, 6, 38, 36, 3, 0x70, 0x70, 0x78)
  fr(b, 8, 38, 4, 3, 0xCC, 0x44, 0x44)  // red marker
  fr(b, 14, 38, 4, 3, 0x44, 0x88, 0xCC) // blue marker
  fr(b, 20, 38, 4, 3, 0x44, 0xCC, 0x66) // green marker
  return b
}

/** Tile 20 — office_chair (Kenney-inspired): office chair top-down */
function tile020_office_chair() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)  // floor
  // Chair base (5-star)
  const cx = 24, cy = 36
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const ax = Math.round(cx + Math.cos(angle) * 10)
    const ay = Math.round(cy + Math.sin(angle) * 10)
    hl(b, ay, Math.min(cx, ax), Math.max(cx, ax), 0x50, 0x50, 0x60)
    vl(b, ax, Math.min(cy, ay), Math.max(cy, ay), 0x50, 0x50, 0x60)
  }
  // Seat cushion
  fr(b, 12, 10, 24, 24, 0x44, 0x40, 0x80)
  border(b, 12, 10, 24, 24, 0x30, 0x2C, 0x64)
  // Backrest
  fr(b, 12, 4, 24, 8, 0x50, 0x4C, 0x94)
  border(b, 12, 4, 24, 8, 0x30, 0x2C, 0x64)
  return b
}

// ── Row 4: Mechanical / Signage (IDs 21–25) ──────────────────────────────────

/** Tile 21 — cooling_unit: precision CRAC unit */
function tile021_cooling_unit() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x20, 0x20, 0x28)
  // Unit body
  fr(b, 6, 2, 36, 44, 0x00, 0xB4, 0xB8)
  border(b, 6, 2, 36, 44, 0x00, 0x88, 0x90)
  // Air vent louvres (horizontal dark lines every 4px)
  for (let y = 6; y < 38; y += 4) hl(b, y, 8, 41, 0x00, 0x88, 0x90)
  // Brand badge area (blank rect centre)
  fr(b, 14, 38, 20, 6, 0x00, 0x90, 0x94)
  // Status LED (green 2×2)
  fr(b, 38, 39, 2, 2, 0x00, 0xFF, 0x60)
  return b
}

/** Tile 22 — ups_battery: tower UPS unit */
function tile022_ups_battery() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x20, 0x20, 0x28)
  // Chassis
  fr(b, 8, 4, 32, 40, 0x82, 0x82, 0x90)
  border(b, 8, 4, 32, 40, 0x60, 0x60, 0x70)
  // Power button circle
  fr(b, 20, 16, 8, 8, 0x60, 0x60, 0x68)
  fr(b, 22, 18, 4, 4, 0xCC, 0xCC, 0xDD)
  // Battery indicator bar (4 segments on right side)
  fr(b, 36, 8, 4, 32, 0x50, 0x50, 0x58)
  fr(b, 37, 10, 2, 6, 0x00, 0xBB, 0x00)
  fr(b, 37, 18, 2, 6, 0x00, 0xBB, 0x00)
  fr(b, 37, 26, 2, 6, 0x00, 0xBB, 0x00)
  fr(b, 37, 34, 2, 6, 0x33, 0x99, 0x33)  // dim top segment
  // Model tag at top
  fr(b, 10, 5, 28, 5, 0x70, 0x70, 0x78)
  return b
}

/** Tile 23 — warning_sign (Kenney-inspired): caution / floor warning sign */
function tile023_warning_sign() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)
  // Yellow triangle base
  const cx = 24, cy = 26, size = 20
  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      // Triangle via barycentric
      const dx = x - cx, dy = y - cy
      if (Math.abs(dx) < size - dy && dy < size && dy > -size / 2) {
        const isBorder = (Math.abs(dx) === size - 1 - dy - 1 || dy === size - 1 || dy === -size / 2 + 1)
        sp(b, x, y, isBorder ? 0xCC : 0xFF, isBorder ? 0xAA : 0xD0, 0x00)
      }
    }
  }
  // Exclamation mark in black
  fr(b, 22, 14, 4, 10, 0x18, 0x18, 0x18)
  fr(b, 22, 26, 4, 4,  0x18, 0x18, 0x18)
  return b
}

/** Tile 24 — emergency_light: wall-mounted emergency strobe */
function tile024_emergency_light() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x30, 0x30, 0x38)
  // Red housing
  fr(b, 8, 8, 32, 28, 0xD2, 0x1C, 0x1C)
  border(b, 8, 8, 32, 28, 0xA0, 0x14, 0x14)
  // White lens glow (4×4 ellipse centre)
  fr(b, 22, 18, 4, 4, 0xFF, 0xE0, 0xE0)
  sp(b, 24, 19, 0xFF, 0xFF, 0xFF)
  // Glow halo
  for (let r = 6; r < 14; r += 2) {
    const mid = 24
    sp(b, mid - r, 20, 0xFF, 0x80, 0x80)
    sp(b, mid + r, 20, 0xFF, 0x80, 0x80)
    sp(b, mid, 20 - r / 2, 0xFF, 0x80, 0x80)
    sp(b, mid, 20 + r / 2, 0xFF, 0x80, 0x80)
  }
  // Mounting bracket at base
  fr(b, 14, 36, 20, 6, 0x88, 0x88, 0x98)
  return b
}

/** Tile 25 — cable_tray: overhead cable tray (top-down view) */
function tile025_cable_tray() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x20)
  // Metal tray body
  fr(b, 4, 16, TILE - 8, 16, 0x23, 0x20, 0x18)
  border(b, 4, 16, TILE - 8, 16, 0x40, 0x3C, 0x30)
  // Cables running through tray
  hl(b, 19, 5, 42, 0xAA, 0xAA, 0xAA)  // grey
  hl(b, 22, 5, 42, 0xF0, 0xD0, 0x00)  // yellow
  hl(b, 25, 5, 42, 0x44, 0x88, 0xCC)  // blue
  hl(b, 28, 5, 42, 0x88, 0x88, 0x80)  // grey
  // Tray supports at edges
  fr(b, 2, 14, 4, 20, 0x50, 0x4C, 0x40)
  fr(b, 42, 14, 4, 20, 0x50, 0x4C, 0x40)
  return b
}

// ── Row 5: Screens / Terminals (IDs 26–30) ───────────────────────────────────

/** Tile 26 — crt_monitor: old CRT with green phosphor text */
function tile026_crt_monitor() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)
  // CRT body (cream/off-white)
  fr(b, 4, 4, 40, 40, 0xCC, 0xC8, 0xB8)
  border(b, 4, 4, 40, 40, 0xA8, 0xA4, 0x94)
  // Screen (slightly curved look with inner lighter border)
  fr(b, 8, 8, 32, 28, 0x00, 0x12, 0x00)
  border(b, 8, 8, 32, 28, 0x00, 0x22, 0x00)
  // Green phosphor text lines
  hl(b, 11, 10, 36, 0x00, 0xB8, 0x00)
  hl(b, 14, 10, 28, 0x00, 0xB8, 0x00)
  hl(b, 17, 10, 32, 0x00, 0xB8, 0x00)
  hl(b, 20, 10, 24, 0x00, 0xB8, 0x00)
  hl(b, 23, 10, 30, 0x00, 0xB8, 0x00)
  // Blinking cursor (2×4 px bright green)
  fr(b, 10, 26, 2, 4, 0x00, 0xFF, 0x00)
  // Monitor stand
  fr(b, 18, 44, 12, 2, 0x90, 0x8C, 0x7C)
  return b
}

/** Tile 27 — command_prompt: terminal emulator on modern monitor */
function tile027_command_prompt() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)
  // Monitor body
  fr(b, 6, 4, 36, 34, 0x28, 0x28, 0x32)
  // Screen
  fr(b, 8, 6, 32, 28, 0x0D, 0x0D, 0x0D)
  border(b, 8, 6, 32, 28, 0x1A, 0x1A, 0x1A)
  // Terminal text lines
  hl(b, 9,  10, 22, 0x00, 0xDD, 0x00)
  hl(b, 12, 10, 36, 0x00, 0xDD, 0x00)
  hl(b, 15, 10, 28, 0x00, 0xDD, 0x00)
  hl(b, 18, 10, 18, 0x00, 0xDD, 0x00)
  hl(b, 21, 10, 24, 0x00, 0xDD, 0x00)
  hl(b, 24, 10, 32, 0x00, 0xDD, 0x00)
  // Prompt marker ($ in pixel art)
  fr(b, 10, 27, 2, 4, 0x00, 0xFF, 0x44)  // blinking cursor
  // Scroll bar
  fr(b, 38, 6, 2, 28, 0x1E, 0x1E, 0x28)
  fr(b, 38, 10, 2, 6, 0x44, 0x44, 0x58)
  // Stand
  fr(b, 18, 38, 12, 4, 0x38, 0x38, 0x44)
  return b
}

/** Tile 28 — error_screen: monitor showing BSOD/critical error */
function tile028_error_screen() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)
  // Monitor
  fr(b, 6, 4, 36, 34, 0x28, 0x28, 0x32)
  // Error screen: full red
  fr(b, 8, 6, 32, 28, 0xB0, 0x00, 0x00)
  // Error text lines (white pixels)
  hl(b, 12, 10, 36, 0xFF, 0xFF, 0xFF)
  hl(b, 16, 12, 28, 0xFF, 0xFF, 0xFF)
  hl(b, 19, 12, 30, 0xFF, 0xFF, 0xFF)
  // Error code in smaller text
  for (let x = 10; x < 38; x += 4) sp(b, x, 24, 0xFF, 0xFF, 0xFF)
  fr(b, 18, 38, 12, 4, 0x38, 0x38, 0x44)
  return b
}

/** Tile 29 — monitoring_dashboard: widescreen metrics monitor */
function tile029_monitoring_dashboard() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)
  // Wide monitor body
  fr(b, 2, 6, 44, 32, 0x28, 0x28, 0x32)
  // Screen
  fr(b, 4, 8, 40, 26, 0x0B, 0x0B, 0x50)
  // Chart dividers
  vl(b, 18, 8, 34, 0x18, 0x18, 0x60)
  vl(b, 30, 8, 34, 0x18, 0x18, 0x60)
  // Green chart (left panel)
  for (let x = 5; x < 18; x++) {
    const barHeight = Math.round(4 + ((x * 3 + 5) % 10))
    fr(b, x, 34 - barHeight, 1, barHeight, 0x00, 0xE0, 0x00)
  }
  // Amber line graph (middle panel)
  for (let x = 19; x < 30; x++) {
    const y = 22 + Math.round(Math.sin((x - 19) * 0.8) * 6)
    sp(b, x, y, 0xFF, 0x99, 0x00)
    sp(b, x, y + 1, 0xFF, 0x99, 0x00)
  }
  // Status indicators (right panel)
  fr(b, 32, 12, 10, 3, 0x00, 0x88, 0x00)
  fr(b, 32, 17, 10, 3, 0x00, 0x88, 0x00)
  fr(b, 32, 22, 10, 3, 0xFF, 0x88, 0x00)
  fr(b, 32, 27, 10, 3, 0xFF, 0x22, 0x22)
  // Stand
  fr(b, 18, 38, 12, 4, 0x38, 0x38, 0x44)
  return b
}

/** Tile 30 — terminal_server: beige 1990s terminal server box */
function tile030_terminal_server() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x18, 0x18, 0x18)
  // Beige chassis
  fr(b, 4, 8, 40, 32, 0xC3, 0xBE, 0xA8)
  border(b, 4, 8, 40, 32, 0xA4, 0x9F, 0x8E)
  // 8 serial port icons (3×3 each)
  for (let i = 0; i < 8; i++) {
    const px = 6 + i * 4
    fr(b, px, 16, 3, 3, 0x80, 0x7C, 0x6C)
    sp(b, px + 1, 17, 0x44, 0x40, 0x38)
  }
  // Model sticker on top
  fr(b, 8, 9, 24, 4, 0xE0, 0xDC, 0xC8)
  // LED row (green and red activity dots)
  sp(b, 38, 14, 0x00, 0xCC, 0x00)
  sp(b, 40, 14, 0xCC, 0x00, 0x00)
  sp(b, 42, 14, 0x00, 0xCC, 0x00)
  // Front port row
  fr(b, 6, 26, 36, 6, 0xAA, 0xA5, 0x94)
  return b
}

// ── Row 6: Exteriors (IDs 31–35) ────────────────────────────────────────────

/** Tile 31 — cloud_office_exterior (Kenney-inspired): modern office building */
function tile031_cloud_office_exterior() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x64, 0x68, 0x82)  // sky
  // Building facade
  fr(b, 2, 10, 44, 38, 0x98, 0xA0, 0xB8)
  border(b, 2, 10, 44, 38, 0x78, 0x80, 0x98)
  // Windows (2 rows of 4)
  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 4; col++) {
      const wx = 6 + col * 10, wy = 14 + row * 14
      fr(b, wx, wy, 7, 9, 0xA0, 0xD0, 0xF0)
      hl(b, wy, wx, wx + 6, 0x80, 0xB8, 0xD8)
    }
  // Door
  fr(b, 18, 36, 12, 12, 0x70, 0x78, 0x90)
  // Company logo hint at top
  fr(b, 18, 11, 12, 3, 0x40, 0xC0, 0xFF)
  return b
}

/** Tile 32 — startup_garage (Kenney-inspired): garage / workshop */
function tile032_startup_garage() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x50, 0x48, 0x40)  // ground
  // Garage door
  fr(b, 4, 4, 40, 40, 0x90, 0x80, 0x60)
  border(b, 4, 4, 40, 40, 0x70, 0x60, 0x48)
  // Door panels (horizontal lines)
  for (let y = 10; y < 44; y += 10) hl(b, y, 5, 42, 0x74, 0x64, 0x4C)
  // Window in door
  fr(b, 16, 8, 16, 10, 0x80, 0xA0, 0xC0)
  border(b, 16, 8, 16, 10, 0x60, 0x80, 0xA0)
  // Handle
  fr(b, 22, 28, 4, 2, 0xC0, 0xB0, 0x90)
  return b
}

/** Tile 33 — noc_building: Network Operations Centre exterior */
function tile033_noc_building() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x10, 0x10, 0x18)
  // Dark building
  fr(b, 2, 4, 44, 44, 0x1C, 0x1C, 0x2D)
  border(b, 2, 4, 44, 44, 0x28, 0x28, 0x3C)
  // Slit windows with red tint
  fr(b, 6, 10, 8, 4, 0x40, 0x08, 0x08)
  fr(b, 34, 10, 8, 4, 0x40, 0x08, 0x08)
  // "NOC" text in pixel art
  // N
  vl(b, 14, 18, 26, 0xCC, 0xCC, 0xFF)
  vl(b, 18, 18, 26, 0xCC, 0xCC, 0xFF)
  vl(b, 15, 19, 19, 0xCC, 0xCC, 0xFF)
  vl(b, 16, 20, 20, 0xCC, 0xCC, 0xFF)
  vl(b, 17, 21, 21, 0xCC, 0xCC, 0xFF)
  // O
  border(b, 21, 18, 5, 9, 0xCC, 0xCC, 0xFF)
  // C
  vl(b, 28, 18, 26, 0xCC, 0xCC, 0xFF)
  hl(b, 18, 28, 32, 0xCC, 0xCC, 0xFF)
  hl(b, 26, 28, 32, 0xCC, 0xCC, 0xFF)
  // Security camera icon
  fr(b, 38, 8, 6, 4, 0x44, 0x44, 0x55)
  sp(b, 41, 9, 0xFF, 0x44, 0x44)
  // Door
  fr(b, 18, 36, 12, 12, 0x30, 0x30, 0x3C)
  fr(b, 24, 40, 2, 8, 0x22, 0x22, 0x2C)
  return b
}

/** Tile 34 — datacenter_entrance: secure airlock entry */
function tile034_datacenter_entrance() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x50, 0x54, 0x60)
  // Wall
  fr(b, 0, 0, TILE, TILE, 0x60, 0x64, 0x70)
  // Brushed metal door
  fr(b, 10, 4, 28, 44, 0x88, 0x88, 0x90)
  border(b, 10, 4, 28, 44, 0x70, 0x70, 0x78)
  // Door horizontal brush lines
  for (let y = 6; y < 46; y += 3) hl(b, y, 11, 37, 0x98, 0x98, 0xA0)
  // Access denied light above
  fr(b, 20, 2, 8, 3, 0xCC, 0x00, 0x00)
  // Keycard reader (right side, 4×8)
  fr(b, 40, 18, 6, 10, 0x30, 0x30, 0x38)
  border(b, 40, 18, 6, 10, 0x50, 0x50, 0x58)
  fr(b, 42, 22, 2, 2, 0x00, 0xCC, 0x00)  // ready light
  return b
}

/** Tile 35 — tech_park_path (Kenney-inspired): paved office park path */
function tile035_tech_park_path() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x88, 0x88, 0x80)  // concrete base
  // Paving slab lines
  for (let i = 0; i < TILE; i += 16) {
    hl(b, i, 0, TILE - 1, 0x70, 0x70, 0x68)
    vl(b, i, 0, TILE - 1, 0x70, 0x70, 0x68)
  }
  // Slab highlight (top-left of each slab)
  for (let sy = 0; sy < TILE; sy += 16)
    for (let sx = 0; sx < TILE; sx += 16) {
      fr(b, sx + 1, sy + 1, 3, 2, 0x9C, 0x9C, 0x94)
    }
  return b
}

// ── Row 7: Small Items (IDs 36–40) ───────────────────────────────────────────

/** Tile 36 — sticky_notes (Kenney-inspired): cluster of sticky notes */
function tile036_sticky_notes() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x28, 0x28, 0x30)  // dark surface
  // Three overlapping sticky notes
  fr(b, 6,  8,  18, 18, 0xFF, 0xEE, 0x44)  // yellow
  fr(b, 18, 14, 18, 18, 0x66, 0xEE, 0xAA)  // teal
  fr(b, 10, 20, 18, 18, 0xFF, 0x88, 0x88)  // pink/red
  // Fold corner on each note
  fr(b, 22, 8,  2, 2, 0xCC, 0xBB, 0x22)
  fr(b, 34, 14, 2, 2, 0x44, 0xCC, 0x88)
  fr(b, 26, 20, 2, 2, 0xCC, 0x66, 0x66)
  // Lines on yellow note
  hl(b, 12, 8,  22, 0xCC, 0xBB, 0x22)
  hl(b, 15, 8,  22, 0xCC, 0xBB, 0x22)
  return b
}

/** Tile 37 — coffee_cup (Kenney-inspired): top-down view of a coffee mug */
function tile037_coffee_cup() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x28, 0x28, 0x30)  // surface
  // Mug body (circle approximation)
  fr(b, 12, 8, 24, 28, 0x8C, 0x64, 0x3C)
  border(b, 12, 8, 24, 28, 0x70, 0x4E, 0x2C)
  // Coffee surface (dark brown circle inside)
  fr(b, 14, 10, 20, 24, 0x4A, 0x2C, 0x14)
  // Steam wisps
  for (let i = 0; i < 3; i++) {
    const sx = 16 + i * 7
    vl(b, sx, 2, 7, 0xCC, 0xCC, 0xDD)
    sp(b, sx - 1, 4, 0xCC, 0xCC, 0xDD)
    sp(b, sx + 1, 6, 0xCC, 0xCC, 0xDD)
  }
  // Handle (right side)
  fr(b, 36, 14, 6, 14, 0x70, 0x4E, 0x2C)
  fr(b, 37, 16, 4, 10, 0x28, 0x28, 0x30)  // cutout
  return b
}

/** Tile 38 — decommissioned_server: rusty dust-covered old server */
function tile038_decommissioned_server() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x20, 0x1C, 0x18)
  // Old chassis (rust-brown base)
  fr(b, 4, 6, 40, 36, 0x76, 0x4E, 0x26)
  border(b, 4, 6, 40, 36, 0x60, 0x3C, 0x18)
  // Rust streaks (amber-brown diagonal marks)
  for (let i = 0; i < 6; i++) {
    const sx = 6 + i * 6, sy = 8
    vl(b, sx, sy, sy + 16, 0xA0, 0x60, 0x20)
    sp(b, sx + 1, sy + 4, 0xA0, 0x60, 0x20)
  }
  // Masking tape (diagonal stripe) over ports
  for (let i = 0; i < 20; i++) sp(b, 10 + i, 20 + i / 3, 0xD0, 0xD0, 0xC0)
  for (let i = 0; i < 20; i++) sp(b, 10 + i, 22 + i / 3, 0xD0, 0xD0, 0xC0)
  // Dust dots
  for (let i = 0; i < 12; i++) sp(b, 8 + i * 3, 12 + (i % 3) * 4, 0xE0, 0xDC, 0xD8)
  // Dead LED row
  for (let i = 0; i < 6; i++) sp(b, 8 + i * 4, 36, 0x22, 0x22, 0x22)
  return b
}

/** Tile 39 — dusty_rack: old server rack covered in dust */
function tile039_dusty_rack() {
  // Start from server_rack but desaturate
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x50, 0x4C, 0x48)
  fr(b, 4, 2, 40, 44, 0x8A, 0x84, 0x7A)
  border(b, 4, 2, 40, 44, 0x70, 0x6C, 0x64)
  // Rails
  fr(b, 2, 2, 2, 44, 0x60, 0x5C, 0x54)
  fr(b, 44, 2, 2, 44, 0x60, 0x5C, 0x54)
  // Blade servers (desaturated)
  for (let i = 0; i < 6; i++) {
    const y = 4 + i * 6
    fr(b, 6, y, 36, 4, 0x78, 0x74, 0x6C)
    sp(b, 41, y + 1, 0x22, 0x22, 0x22)  // dead LED
  }
  // Dust overlay (noise pattern)
  for (let y = 2; y < TILE; y += 2)
    for (let x = 2; x < TILE; x += 3) {
      if ((x + y) % 5 === 0) sp(b, x, y, 0xAA, 0xA4, 0x9A)
    }
  return b
}

/** Tile 40 — blinking_led: bright LED indicator on floor */
function tile040_blinking_led() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x0A, 0x0A, 0x0A)
  // Dark housing (20×20 px centred)
  fr(b, 14, 14, 20, 20, 0x18, 0x18, 0x18)
  border(b, 14, 14, 20, 20, 0x28, 0x28, 0x28)
  // Glow halo (1px ring)
  border(b, 20, 20, 8, 8, 0x00, 0x88, 0x2A)
  // LED lens (bright green, 4×4)
  fr(b, 22, 22, 4, 4, 0x00, 0xFF, 0x3C)
  // Specular highlight
  sp(b, 23, 23, 0xFF, 0xFF, 0xFF)
  return b
}

// ── Row 8: Interactive Objects (IDs 41–45) ───────────────────────────────────

/** Tile 41 — server_rack_interact: rack with gold interaction border */
function tile041_server_rack_interact() {
  const b = tile011_server_rack()
  // Outer 2px border in gold #FFD700
  for (let x = 0; x < TILE; x++) {
    sp(b, x, 0, 0xFF, 0xD7, 0x00)
    sp(b, x, 1, 0xFF, 0xD7, 0x00)
    sp(b, x, TILE - 2, 0xFF, 0xD7, 0x00)
    sp(b, x, TILE - 1, 0xFF, 0xD7, 0x00)
  }
  for (let y = 0; y < TILE; y++) {
    sp(b, 0, y, 0xFF, 0xD7, 0x00)
    sp(b, 1, y, 0xFF, 0xD7, 0x00)
    sp(b, TILE - 2, y, 0xFF, 0xD7, 0x00)
    sp(b, TILE - 1, y, 0xFF, 0xD7, 0x00)
  }
  return b
}

/** Tile 42 — terminal_interact: terminal with cyan interaction border */
function tile042_terminal_interact() {
  const b = tile027_command_prompt()
  // Outer 2px border in cyan #00E5FF
  for (let x = 0; x < TILE; x++) {
    sp(b, x, 0, 0x00, 0xE5, 0xFF)
    sp(b, x, 1, 0x00, 0xE5, 0xFF)
    sp(b, x, TILE - 2, 0x00, 0xE5, 0xFF)
    sp(b, x, TILE - 1, 0x00, 0xE5, 0xFF)
  }
  for (let y = 0; y < TILE; y++) {
    sp(b, 0, y, 0x00, 0xE5, 0xFF)
    sp(b, 1, y, 0x00, 0xE5, 0xFF)
    sp(b, TILE - 2, y, 0x00, 0xE5, 0xFF)
    sp(b, TILE - 1, y, 0x00, 0xE5, 0xFF)
  }
  return b
}

/** Tile 43 — control_panel: wall-mounted button/indicator panel */
function tile043_control_panel() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x28, 0x28, 0x30)
  // Panel chassis
  fr(b, 4, 4, 40, 40, 0x22, 0x22, 0x35)
  border(b, 4, 4, 40, 40, 0x40, 0x40, 0x58)
  // 3×3 button grid (left area)
  const btnColors = [
    [0xCC, 0x22, 0x22], [0x22, 0xCC, 0x22], [0x88, 0x88, 0x88],
    [0x22, 0xCC, 0x22], [0xCC, 0x22, 0x22], [0x22, 0xCC, 0x22],
    [0x88, 0x88, 0x88], [0xFF, 0x99, 0x00], [0xCC, 0x22, 0x22],
  ]
  for (let i = 0; i < 9; i++) {
    const bx = 8 + (i % 3) * 7, by = 8 + Math.floor(i / 3) * 7
    const [br, bg, bb] = btnColors[i]
    fr(b, bx, by, 5, 5, br, bg, bb)
    border(b, bx, by, 5, 5, 0x18, 0x18, 0x22)
  }
  // Vertical meter bars (right side, 3×16)
  fr(b, 36, 8, 3, 16, 0x30, 0x30, 0x40)
  fr(b, 36, 8, 3, 10, 0x00, 0xCC, 0x00)  // fill
  fr(b, 40, 8, 3, 16, 0x30, 0x30, 0x40)
  fr(b, 40, 8, 3, 8, 0xFF, 0x88, 0x00)   // fill
  // LED row at bottom
  sp(b, 10, 40, 0x00, 0xCC, 0x00)
  sp(b, 15, 40, 0x00, 0xCC, 0x00)
  sp(b, 20, 40, 0xFF, 0x99, 0x00)
  sp(b, 25, 40, 0xFF, 0x22, 0x22)
  sp(b, 30, 40, 0x66, 0x66, 0x77)
  return b
}

/** Tile 44 — server_tombstone: broken server as tombstone */
function tile044_server_tombstone() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x20, 0x1C, 0x18)
  // Rubble/debris at base
  for (let dx = 0; dx < TILE; dx += 4) sp(b, dx + 1, TILE - 2, 0x60, 0x5C, 0x54)
  fr(b, 2, TILE - 5, TILE - 4, 4, 0x50, 0x4C, 0x44)
  // Leaning chassis (shifted 2px right for lean)
  fr(b, 12, 6, 26, 38, 0x64, 0x5A, 0x52)
  border(b, 12, 6, 26, 38, 0x44, 0x3C, 0x36)
  // Crack lines on front
  vl(b, 22, 8, 30, 0x18, 0x16, 0x14)
  sp(b, 23, 16, 0x18, 0x16, 0x14)
  sp(b, 21, 22, 0x18, 0x16, 0x14)
  // "R.I.P." in pixel font (very small)
  // R
  vl(b, 16, 24, 32, 0xCC, 0xCC, 0xDD)
  hl(b, 24, 16, 20, 0xCC, 0xCC, 0xDD)
  hl(b, 28, 16, 20, 0xCC, 0xCC, 0xDD)
  vl(b, 20, 24, 28, 0xCC, 0xCC, 0xDD)
  sp(b, 21, 30, 0xCC, 0xCC, 0xDD)
  sp(b, 22, 31, 0xCC, 0xCC, 0xDD)
  // . (period)
  sp(b, 22, 33, 0xCC, 0xCC, 0xDD)
  // Cracked screen (black with white crack)
  fr(b, 15, 8, 20, 14, 0x08, 0x08, 0x0C)
  for (let i = 0; i < 8; i++) sp(b, 20 + i, 8 + i * 1, 0xFF, 0xFF, 0xFF)
  return b
}

/** Tile 45 — reserved slot (dark tech floor variant) */
function tile045_reserved() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x28, 0x2C, 0x34)
  for (let i = 0; i < TILE; i += 12) {
    hl(b, i, 0, TILE - 1, 0x1E, 0x21, 0x27)
    vl(b, i, 0, TILE - 1, 0x1E, 0x21, 0x27)
  }
  return b
}

// ── Row 9: Reserved Custom Slots (IDs 46–50) ────────────────────────────────

/** Tile 46 — custom_slot_1: variant tech floor (teal tint) */
function tile046_custom_slot_1() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x22, 0x30, 0x34)
  for (let i = 0; i < TILE; i += 12) {
    hl(b, i, 0, TILE - 1, 0x18, 0x24, 0x28)
    vl(b, i, 0, TILE - 1, 0x18, 0x24, 0x28)
  }
  return b
}

/** Tile 47 — custom_slot_2: variant server room floor (teal) */
function tile047_custom_slot_2() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x26, 0x3A, 0x4A)
  for (let i = 0; i < TILE; i += 24) {
    hl(b, i, 0, TILE - 1, 0x1C, 0x2E, 0x3C)
    vl(b, i, 0, TILE - 1, 0x1C, 0x2E, 0x3C)
  }
  return b
}

/** Tile 48 — custom_slot_3: dark corridor variant */
function tile048_custom_slot_3() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x3A, 0x3C, 0x44)
  fr(b, 0, 20, TILE, 8, 0x48, 0x4A, 0x54)
  return b
}

/** Tile 49 — custom_slot_4: hazard floor (yellow stripes) */
function tile049_custom_slot_4() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x30, 0x30, 0x38)
  // Hazard diagonal stripes
  for (let i = -TILE; i < TILE * 2; i += 8) {
    for (let x = 0; x < TILE; x++) {
      const y = i + x
      if (y >= 0 && y < TILE) {
        if (((i / 8) % 2 === 0)) sp(b, x, y, 0xFF, 0xCC, 0x00)
        else sp(b, x, y, 0x22, 0x22, 0x28)
      }
    }
  }
  return b
}

/** Tile 50 — custom_slot_5: decorative circuit board floor */
function tile050_custom_slot_5() {
  const b = makeTileBuf()
  fr(b, 0, 0, TILE, TILE, 0x10, 0x18, 0x22)
  // Circuit trace lines
  hl(b, 8,  4, 44, 0x00, 0x88, 0x44)
  hl(b, 16, 4, 44, 0x00, 0x88, 0x44)
  hl(b, 24, 4, 44, 0x00, 0x88, 0x44)
  hl(b, 32, 4, 44, 0x00, 0x88, 0x44)
  hl(b, 40, 4, 44, 0x00, 0x88, 0x44)
  vl(b, 8,  4, 44, 0x00, 0x88, 0x44)
  vl(b, 20, 4, 44, 0x00, 0x88, 0x44)
  vl(b, 32, 4, 44, 0x00, 0x88, 0x44)
  vl(b, 44, 4, 44, 0x00, 0x88, 0x44)
  // Solder pads
  const pads = [[8,8],[20,8],[32,8],[44,8],[8,16],[20,16],[32,16],[8,24],[20,24]]
  for (const [px, py] of pads) fr(b, px - 1, py - 1, 2, 2, 0x00, 0xEE, 0x88)
  return b
}

// ---------------------------------------------------------------------------
// Tile registry — maps ID to { name, painter }
// ---------------------------------------------------------------------------

const TILE_REGISTRY = [
  { id: 1,  name: 'tech_floor',             paint: tile001_tech_floor },
  { id: 2,  name: 'server_room_floor',       paint: tile002_server_room_floor },
  { id: 3,  name: 'office_floor',            paint: tile003_office_floor },
  { id: 4,  name: 'raised_floor',            paint: tile004_raised_floor },
  { id: 5,  name: 'corridor',                paint: tile005_corridor },
  { id: 6,  name: 'server_room_wall',        paint: tile006_server_room_wall },
  { id: 7,  name: 'office_wall',             paint: tile007_office_wall },
  { id: 8,  name: 'datacenter_wall',         paint: tile008_datacenter_wall },
  { id: 9,  name: 'glass_wall',              paint: tile009_glass_wall },
  { id: 10, name: 'tech_building_exterior',  paint: tile010_tech_building_exterior },
  { id: 11, name: 'server_rack',             paint: tile011_server_rack },
  { id: 12, name: 'server_rack_leds',        paint: tile012_server_rack_leds },
  { id: 13, name: 'cable_bundle',            paint: tile013_cable_bundle },
  { id: 14, name: 'patch_panel',             paint: tile014_patch_panel },
  { id: 15, name: 'network_switch',          paint: tile015_network_switch },
  { id: 16, name: 'desk',                    paint: tile016_desk },
  { id: 17, name: 'monitor',                 paint: tile017_monitor },
  { id: 18, name: 'keyboard',                paint: tile018_keyboard },
  { id: 19, name: 'whiteboard',              paint: tile019_whiteboard },
  { id: 20, name: 'office_chair',            paint: tile020_office_chair },
  { id: 21, name: 'cooling_unit',            paint: tile021_cooling_unit },
  { id: 22, name: 'ups_battery',             paint: tile022_ups_battery },
  { id: 23, name: 'warning_sign',            paint: tile023_warning_sign },
  { id: 24, name: 'emergency_light',         paint: tile024_emergency_light },
  { id: 25, name: 'cable_tray',              paint: tile025_cable_tray },
  { id: 26, name: 'crt_monitor',             paint: tile026_crt_monitor },
  { id: 27, name: 'command_prompt',          paint: tile027_command_prompt },
  { id: 28, name: 'error_screen',            paint: tile028_error_screen },
  { id: 29, name: 'monitoring_dashboard',    paint: tile029_monitoring_dashboard },
  { id: 30, name: 'terminal_server',         paint: tile030_terminal_server },
  { id: 31, name: 'cloud_office_exterior',   paint: tile031_cloud_office_exterior },
  { id: 32, name: 'startup_garage',          paint: tile032_startup_garage },
  { id: 33, name: 'noc_building',            paint: tile033_noc_building },
  { id: 34, name: 'datacenter_entrance',     paint: tile034_datacenter_entrance },
  { id: 35, name: 'tech_park_path',          paint: tile035_tech_park_path },
  { id: 36, name: 'sticky_notes',            paint: tile036_sticky_notes },
  { id: 37, name: 'coffee_cup',              paint: tile037_coffee_cup },
  { id: 38, name: 'decommissioned_server',   paint: tile038_decommissioned_server },
  { id: 39, name: 'dusty_rack',              paint: tile039_dusty_rack },
  { id: 40, name: 'blinking_led',            paint: tile040_blinking_led },
  { id: 41, name: 'server_rack_interact',    paint: tile041_server_rack_interact },
  { id: 42, name: 'terminal_interact',       paint: tile042_terminal_interact },
  { id: 43, name: 'control_panel',           paint: tile043_control_panel },
  { id: 44, name: 'server_tombstone',        paint: tile044_server_tombstone },
  { id: 45, name: 'reserved',               paint: tile045_reserved },
  { id: 46, name: 'custom_slot_1',           paint: tile046_custom_slot_1 },
  { id: 47, name: 'custom_slot_2',           paint: tile047_custom_slot_2 },
  { id: 48, name: 'custom_slot_3',           paint: tile048_custom_slot_3 },
  { id: 49, name: 'custom_slot_4',           paint: tile049_custom_slot_4 },
  { id: 50, name: 'custom_slot_5',           paint: tile050_custom_slot_5 },
]

// ---------------------------------------------------------------------------
// Main — generate sprites and stitch tileset
// ---------------------------------------------------------------------------

function zeroPad(n, width) { return String(n).padStart(width, '0') }

mkdirSync(SPRITES_DIR, { recursive: true })

// Build full RGBA tileset canvas (240×480)
const tilesetW = COLS * TILE  // 240
const tilesetH = ROWS * TILE  // 480
const tilesetBuf = Buffer.alloc(tilesetW * tilesetH * 4, 0)

console.log(`Generating ${TILE_REGISTRY.length} tech tileset sprites…`)
console.log(`  sprites → ${SPRITES_DIR}`)
console.log(`  tileset → ${OUT_PNG}`)
console.log()

for (const { id, name, paint } of TILE_REGISTRY) {
  const tileBuf = paint()

  // ── Write individual sprite PNG ──
  const filename = `tile_${zeroPad(id, 3)}_${name}.png`
  const spritePath = path.join(SPRITES_DIR, filename)
  writeFileSync(spritePath, encodePngRGBA(TILE, TILE, tileBuf))
  console.log(`  ${filename}`)

  // ── Copy pixels into stitched tileset ──
  const row = Math.floor((id - 1) / COLS)
  const col = (id - 1) % COLS
  const ox = col * TILE
  const oy = row * TILE

  for (let ty = 0; ty < TILE; ty++) {
    for (let tx = 0; tx < TILE; tx++) {
      const srcOff = (ty * TILE + tx) * 4
      const dstOff = ((oy + ty) * tilesetW + (ox + tx)) * 4
      tilesetBuf[dstOff]     = tileBuf[srcOff]
      tilesetBuf[dstOff + 1] = tileBuf[srcOff + 1]
      tilesetBuf[dstOff + 2] = tileBuf[srcOff + 2]
      tilesetBuf[dstOff + 3] = tileBuf[srcOff + 3]
    }
  }
}

// Convert RGBA tileset to RGB (drop alpha, set opaque) for compatibility with
// generate-tilesets.js output format and Tiled's expectations.
const tilesetRGB = Buffer.alloc(tilesetW * tilesetH * 3)
for (let i = 0; i < tilesetW * tilesetH; i++) {
  tilesetRGB[i * 3]     = tilesetBuf[i * 4]
  tilesetRGB[i * 3 + 1] = tilesetBuf[i * 4 + 1]
  tilesetRGB[i * 3 + 2] = tilesetBuf[i * 4 + 2]
}
writeFileSync(OUT_PNG, encodePngRGB(tilesetW, tilesetH, tilesetRGB))

console.log()
console.log(`Done. ${TILE_REGISTRY.length} sprites written to sprites/`)
console.log(`Tileset PNG written: ${OUT_PNG}`)
