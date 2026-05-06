/**
 * scripts/install-ninja-assets.js
 *
 * Post-upscale install step — copies Ninja Adventure assets from an upscaled
 * output directory into the Cloud Quest asset tree.
 *
 * Run AFTER scripts/upscale-assets.js (or scripts/upscale_assets.py) has already
 * produced the 3× upscaled output directory.
 *
 * Usage:
 *   node scripts/install-ninja-assets.js --input <upscaled-dir> [--force]
 *
 * Example (full pipeline):
 *   node scripts/upscale-assets.js \
 *     --input /path/to/NinjaAdventure \
 *     --output /tmp/ninja-upscaled
 *
 *   node scripts/install-ninja-assets.js --input /tmp/ninja-upscaled
 *
 * Folder mapping (Ninja Adventure → Cloud Quest):
 *
 *   Actor/Characters/  →  assets/sprites/player/
 *   Actor/Monsters/    →  assets/sprites/incidents/
 *   FX/                →  assets/sprites/effects/
 *   Items/Icons/       →  assets/sprites/items/
 *   Maps/Tilesets/     →  assets/tilesets/
 *   Audio/BGM/         →  assets/audio/bgm/
 *   Audio/SFX/         →  assets/audio/sfx/
 *
 * Notes:
 *   - Only .png and .ogg files are installed; other file types are skipped.
 *   - Existing destination files are skipped unless --force is passed.
 *   - Audio: only .ogg files are copied (source may include .wav or .mp3 variants).
 *   - Trainer character sprites are a subset of Actor/Characters/ — all
 *     characters are copied to assets/sprites/player/ for selection at game start.
 *     The trainers/ folder is populated by hand or a separate curation step.
 *
 * Exit codes:
 *   0  — success (at least one file installed, or nothing to do)
 *   1  — input directory not found or other fatal error
 */

import { fileURLToPath } from 'node:url'
import path              from 'node:path'
import fs                from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { input: null, force: false }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--input' && argv[i + 1]) { args.input = argv[++i]; continue }
    if (argv[i] === '--force') { args.force = true; continue }
  }
  return args
}

const args = parseArgs(process.argv)

if (!args.input) {
  console.error('Usage: node scripts/install-ninja-assets.js --input <upscaled-dir> [--force]')
  process.exit(1)
}

const INPUT = path.resolve(ROOT, args.input)

if (!fs.existsSync(INPUT)) {
  console.error(`Input directory not found: ${INPUT}`)
  process.exit(1)
}

if (!fs.statSync(INPUT).isDirectory()) {
  console.error(`Input path is not a directory: ${INPUT}`)
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Folder mapping — Ninja Adventure source → Cloud Quest destination
// ---------------------------------------------------------------------------

// Each entry: [sourceSubpath, destSubpath, allowedExtensions]
const MAPPINGS = [
  ['Actor/Characters', 'assets/sprites/player',    ['.png']],
  ['Actor/Monsters',   'assets/sprites/incidents',  ['.png']],
  ['FX',               'assets/sprites/effects',    ['.png']],
  ['Items/Icons',      'assets/sprites/items',      ['.png']],
  ['Maps/Tilesets',    'assets/tilesets',            ['.png']],
  ['Audio/BGM',        'assets/audio/bgm',           ['.ogg']],
  ['Audio/SFX',        'assets/audio/sfx',           ['.ogg']],
]

// ---------------------------------------------------------------------------
// Counters
// ---------------------------------------------------------------------------

let installed = 0
let skipped   = 0
let notFound  = 0

// ---------------------------------------------------------------------------
// Copy helpers
// ---------------------------------------------------------------------------

/**
 * Recursively copy all files from srcDir to dstDir, keeping the subdirectory
 * structure. Only files whose extension is in allowedExts are copied.
 */
function copyDir(srcDir, dstDir, allowedExts) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`  [skip]  source not found: ${path.relative(ROOT, srcDir)}`)
    notFound++
    return
  }

  fs.mkdirSync(dstDir, { recursive: true })

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name)
    const dstPath = path.join(dstDir, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath, allowedExts)
      continue
    }

    if (!entry.isFile()) continue

    const ext = path.extname(entry.name).toLowerCase()
    if (!allowedExts.includes(ext)) continue

    installFile(srcPath, dstPath)
  }
}

function installFile(src, dst) {
  const rel = path.relative(ROOT, dst)

  if (!args.force && fs.existsSync(dst)) {
    console.log(`  [skip]  ${rel}  (already exists — pass --force to overwrite)`)
    skipped++
    return
  }

  fs.mkdirSync(path.dirname(dst), { recursive: true })
  fs.copyFileSync(src, dst)
  console.log(`  [copy]  ${rel}`)
  installed++
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('Installing Ninja Adventure assets into Cloud Quest asset tree')
console.log(`  Input: ${INPUT}`)
console.log()

for (const [srcSub, dstSub, exts] of MAPPINGS) {
  const srcDir = path.join(INPUT, ...srcSub.split('/'))
  const dstDir = path.join(ROOT,  ...dstSub.split('/'))

  console.log(`${srcSub}/  →  ${dstSub}/`)
  copyDir(srcDir, dstDir, exts)
  console.log()
}

console.log(
  `Done — ${installed} installed, ${skipped} skipped, ${notFound} source folder(s) not found`
)

if (installed === 0 && notFound === MAPPINGS.length) {
  console.error(
    '\nNo source folders were found in the input directory.\n' +
    'Check that --input points to the root of the upscaled Ninja Adventure pack.\n' +
    'Expected subfolders: Actor/Characters, Actor/Monsters, FX, Items/Icons, Maps/Tilesets, Audio/BGM, Audio/SFX'
  )
  process.exit(1)
}
