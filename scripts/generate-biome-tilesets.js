/**
 * generate-biome-tilesets.js
 *
 * Generates 48×48px tileset PNG images and matching Tiled .tsj files for the
 * two supplemental biome tilesets required by Cloud Quest regions that Ninja
 * Adventure does not cover:
 *
 *   - void_tiles      — /dev/null Void  (space / void aesthetic)
 *   - wasteland_tiles — Deprecated Azure Region  (wasteland / ruins aesthetic)
 *
 * Usage:
 *   node scripts/generate-biome-tilesets.js
 *
 * Output:
 *   assets/tiles/void_tiles.{png,tsj}
 *   assets/tiles/wasteland_tiles.{png,tsj}
 *
 * Each tileset is a single-row strip of 12 tiles (576 × 48 px).
 * Tiles are 48×48px to match the game's TILE_SIZE constant.
 * PNGs are RGBA so overlay tiles can carry transparency.
 */

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import zlib from 'node:zlib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const TILES_DIR = path.join(ROOT, 'assets', 'tiles')

const TILE = 48
const COLS = 12
const ROWS = 1

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

function chunk(type, data) {
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

function encodePngRgba(width, height, pixels) {
  // pixels: Buffer of RGBA quads, width*height*4 bytes, top-to-bottom
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 6 // 8-bit RGBA

  const rowBytes = width * 4
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
// Tile painter — fills a 48×48 tile region in the pixel buffer
// ---------------------------------------------------------------------------

function paintTile(pixels, tileCol, tileRow, sheetWidth, r, g, b, a, style = 'flat') {
  const px = tileCol * TILE
  const py = tileRow * TILE

  for (let dy = 0; dy < TILE; dy++) {
    for (let dx = 0; dx < TILE; dx++) {
      const x   = px + dx
      const y   = py + dy
      const off = (y * sheetWidth + x) * 4

      let pr = r, pg = g, pb = b, pa = a

      if (style === 'flat') {
        if (dx === 0 || dy === 0 || dx === TILE - 1 || dy === TILE - 1) {
          pr = Math.max(0, r - 20); pg = Math.max(0, g - 20); pb = Math.max(0, b - 20)
        }
      } else if (style === 'stars') {
        // Scattered star pixels on near-black
        const star = ((dx * 13 + dy * 7 + dx * dy) % 37) === 0
        if (star) { pr = 200; pg = 200; pb = 255; pa = 255 }
        else { pr = r; pg = g; pb = b; pa = a }
      } else if (style === 'glitch_h') {
        // Horizontal glitch streaks
        if (dy % 8 === 0 || dy % 8 === 1) {
          pr = r; pg = g; pb = b; pa = Math.min(255, a + 60)
        } else {
          pa = Math.max(0, a - 80)
        }
      } else if (style === 'glitch_v') {
        // Vertical glitch streaks
        if (dx % 8 === 0 || dx % 8 === 1) {
          pr = r; pg = g; pb = b; pa = Math.min(255, a + 60)
        } else {
          pa = Math.max(0, a - 80)
        }
      } else if (style === 'glow') {
        // Radial glow from centre
        const cx = TILE / 2, cy = TILE / 2
        const dist = Math.sqrt((dx - cx) ** 2 + (dy - cy) ** 2)
        const maxDist = TILE / 2
        pa = Math.max(0, Math.floor(a * (1 - dist / maxDist)))
        pr = r; pg = g; pb = b
      } else if (style === 'cracked') {
        // Cracked earth — thin dark crack lines on warm ground
        const cx = dx % 16, cy = dy % 12
        if ((cx === 0 && cy > 2 && cy < 10) || (cy === 0 && cx > 3 && cx < 13)) {
          pr = Math.max(0, r - 40); pg = Math.max(0, g - 30); pb = Math.max(0, b - 10)
        } else {
          pr = r + ((dx * 3 + dy * 5) % 8) - 4
          pg = g + ((dx * 5 + dy * 3) % 6) - 3
          pb = b
        }
        pr = Math.max(0, Math.min(255, pr))
        pg = Math.max(0, Math.min(255, pg))
        if (dx === 0 || dy === 0 || dx === TILE - 1 || dy === TILE - 1) {
          pr = Math.max(0, pr - 15); pg = Math.max(0, pg - 10)
        }
      } else if (style === 'rubble') {
        // Scattered rubble chunks
        const chunk = ((dx * 7 + dy * 11) % 5)
        if (chunk === 0) { pr = Math.max(0, r - 20); pg = Math.max(0, g - 20); pb = Math.max(0, b - 20) }
        else if (chunk === 4) { pr = Math.min(255, r + 15); pg = Math.min(255, g + 10); pb = Math.min(255, b + 5) }
      } else if (style === 'stripes') {
        // Caution tape: alternating yellow/black diagonal stripes
        const stripe = Math.floor((dx + dy) / 6) % 2
        if (stripe === 0) { pr = 255; pg = 204; pb = 0 }
        else { pr = 20; pg = 20; pb = 20 }
      } else if (style === 'fence') {
        // Chain-link fence: grid of thin lines, semi-transparent fill
        const hline = dy % 6 === 0
        const vline = dx % 6 === 0
        if (hline || vline) { pr = 140; pg = 140; pb = 140; pa = 220 }
        else { pr = 180; pg = 180; pb = 180; pa = 80 }
      }

      pixels[off]     = pr
      pixels[off + 1] = pg
      pixels[off + 2] = pb
      pixels[off + 3] = pa
    }
  }
}

function generatePng(name, tileSpecs) {
  const width  = COLS * TILE
  const height = ROWS * TILE
  const pixels = Buffer.alloc(width * height * 4, 0) // transparent by default

  for (let col = 0; col < COLS; col++) {
    const t = tileSpecs[col]
    paintTile(pixels, col, 0, width, t.r, t.g, t.b, t.a ?? 255, t.style ?? 'flat')
  }

  const png = encodePngRgba(width, height, pixels)
  fs.writeFileSync(path.join(TILES_DIR, `${name}.png`), png)
  console.log(`  wrote  ${name}.png (${COLS} tiles, ${width}×${height}px)`)
}

// ---------------------------------------------------------------------------
// TSJ generator — Tiled JSON tileset format
// ---------------------------------------------------------------------------

function generateTsj(name, tileSpecs) {
  const tsj = {
    columns:      COLS,
    image:        `${name}.png`,
    imageheight:  ROWS * TILE,
    imagewidth:   COLS * TILE,
    margin:       0,
    name,
    spacing:      0,
    tilecount:    COLS * ROWS,
    tiledversion: '1.10.0',
    tileheight:   TILE,
    tilewidth:    TILE,
    tiles: tileSpecs.map((t, i) => ({
      id: i,
      properties: [
        { name: 'name',        type: 'string', value: t.id },
        { name: 'tileType',    type: 'string', value: t.type },
        { name: 'collision',   type: 'bool',   value: t.solid ?? false },
        { name: 'description', type: 'string', value: t.description },
      ],
      ...(t.solid ? {
        objectgroup: {
          draworder: 'index',
          id: 2,
          name: '',
          objects: [{
            height: TILE, id: 1, name: '', rotation: 0,
            type: '', visible: true, width: TILE, x: 0, y: 0,
          }],
          opacity: 1,
          type: 'objectgroup',
          visible: true,
          x: 0, y: 0,
        },
      } : {}),
      type: t.type,
    })),
    type: 'tileset',
    version: '1.10',
  }
  fs.writeFileSync(path.join(TILES_DIR, `${name}.tsj`), JSON.stringify(tsj, null, 2) + '\n')
  console.log(`  wrote  ${name}.tsj (${COLS * ROWS} tiles)`)
}

// ---------------------------------------------------------------------------
// Tileset definitions — colours from TILE_SPECS.md
// ---------------------------------------------------------------------------

const tile = (id, r, g, b, type, solid, description, style = 'flat', a = 255) =>
  ({ id, r, g, b, a, type, solid, description, style })

// /dev/null Void — 12 tiles (space/void aesthetic)
const VOID_TILES = [
  tile('void_ground',           5,   5,  16, 'floor',   false, 'Deep space base tile — scattered tiny stars on near-black', 'stars'),
  tile('void_ground_corrupted', 10,  10,  26, 'floor',   false, 'Ground tile with magenta/cyan glitch lines across it', 'glitch_h'),
  tile('void_platform',         30,  30,  63, 'object',  false, 'Floating island tile — dark slate with neon edge', 'flat'),
  tile('void_platform_edge_l', 102,   0, 204, 'object',  false, 'Platform left-edge tile', 'flat'),
  tile('void_platform_edge_r', 102,   0, 204, 'object',  false, 'Platform right-edge tile', 'flat'),
  tile('void_star_dense',       26,  26,  46, 'floor',   false, 'Star cluster tile — brighter star field, used for accents', 'stars'),
  tile('void_debris',           42,  26,  62, 'object',  false, 'Floating bit-debris — scattered pixel fragments', 'rubble'),
  tile('void_glitch_h',          0, 255, 204, 'overlay', false, 'Horizontal glitch streak — decorative overlay tile', 'glitch_h', 180),
  tile('void_glitch_v',         74,   0, 128, 'overlay', false, 'Vertical glitch streak — decorative overlay tile', 'glitch_v', 180),
  tile('void_dissolution',     255,   0, 255, 'overlay', false, 'Dissolving ground edge — ground fading into void', 'flat', 128),
  tile('void_portal_glow',     102,   0, 204, 'object',  false, 'Soft circular glow tile — marks the exit portal', 'glow', 200),
  tile('void_wall',              0,   0,   0, 'wall',    true,  'Solid collision tile — invisible/transparent', 'flat', 0),
]

// Deprecated Azure Region — 12 tiles (wasteland/ruins aesthetic)
const WASTELAND_TILES = [
  tile('waste_ground',         139, 105,  20, 'floor',   false, 'Base cracked-earth tile — warm brown with subtle crack pattern', 'cracked'),
  tile('waste_ground_heavy',   122,  88,  16, 'floor',   false, 'Heavily cracked ground — large crack network', 'cracked'),
  tile('waste_concrete',       154, 154, 138, 'floor',   false, 'Broken concrete slab — weathered grey with crack', 'cracked'),
  tile('waste_rubble',         122, 106,  90, 'object',  false, 'Pile of rubble/debris — mixed brown and grey fragments', 'rubble'),
  tile('waste_dead_grass',      74,  90,  32, 'object',  false, 'Dead/dry grass tuft — thin, yellowed blades', 'flat'),
  tile('waste_rusted_pipe',    139,  58,  26, 'object',  false, 'Rusted horizontal pipe section', 'flat'),
  tile('waste_server_rack',     28,  28,  45, 'object',  true,  'Abandoned server rack silhouette', 'flat'),
  tile('waste_caution_tape',   255, 204,   0, 'overlay', false, 'Horizontal caution tape strip — yellow/black stripe', 'stripes'),
  tile('waste_warning_sign',   255, 204,   0, 'object',  false, 'Small warning sign icon tile — caution on faded yellow', 'flat'),
  tile('waste_azure_logo',      32,  96, 160, 'object',  false, 'Faded Azure logo on concrete — decorative flavour tile', 'flat'),
  tile('waste_wire_fence',     136, 136, 136, 'overlay', false, 'Chain-link fence section — semi-transparent overlay', 'fence', 180),
  tile('waste_wall',             0,   0,   0, 'wall',    true,  'Solid collision tile — invisible/transparent', 'flat', 0),
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

fs.mkdirSync(TILES_DIR, { recursive: true })
console.log('Generating Cloud Quest biome tilesets…')
console.log(`  output → ${TILES_DIR}`)
console.log()

for (const [name, specs] of [['void_tiles', VOID_TILES], ['wasteland_tiles', WASTELAND_TILES]]) {
  generatePng(name, specs)
  generateTsj(name, specs)
  console.log()
}

console.log('Done.')
