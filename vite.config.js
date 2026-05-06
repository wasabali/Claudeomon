import { defineConfig } from 'vite'
import { resolve } from 'path'
import { cpSync, existsSync } from 'fs'

const normalizeBasePath = (basePath) => {
  if (!basePath) return '/'

  const trimmedBasePath = basePath.replace(/^\/+|\/+$/g, '')
  return trimmedBasePath ? `/${trimmedBasePath}/` : '/'
}

const getBasePath = () => {
  if (!process.env.GITHUB_PAGES) return '/'

  if (process.env.PAGES_BASE_PATH) {
    return normalizeBasePath(process.env.PAGES_BASE_PATH)
  }

  const repository = process.env.GITHUB_REPOSITORY
  const repoName = repository ? repository.split('/')[1] : ''

  return normalizeBasePath(repoName)
}

export default defineConfig({
  base: getBasePath(),
  resolve: {
    alias: {
      '#engine': resolve('./src/engine'),
      '#data':   resolve('./src/data'),
      '#scenes': resolve('./src/scenes'),
      '#state':  resolve('./src/state'),
      '#ui':     resolve('./src/ui'),
      '#utils':  resolve('./src/utils'),
    },
  },
  server: {
    port: 5173,
    headers: {
      // Required for SharedArrayBuffer and Phaser WebGL context isolation
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    (() => {
      // Copy the game assets/ directory into <outDir>/assets/ so that runtime-loaded
      // files (tilemaps, sprites, audio) are available in production builds and
      // on GitHub Pages deployments.  Vite's dev server already serves the project
      // root, so this plugin only runs during `vite build`.
      let outDir
      return {
        name: 'copy-game-assets',
        apply: 'build',
        configResolved(config) {
          outDir = config.build.outDir
        },
        closeBundle() {
          const srcDir  = resolve('./assets')
          const destDir = resolve(outDir, 'assets')
          if (existsSync(srcDir)) {
            cpSync(srcDir, destDir, { recursive: true })
          }
        },
      }
    })(),
  ],
})
