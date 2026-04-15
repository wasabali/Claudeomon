import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = (p) => resolve(__dirname, 'src', p)

export default defineConfig({
  resolve: {
    alias: {
      '#engine': src('engine'),
      '#data':   src('data'),
      '#scenes': src('scenes'),
      '#state':  src('state'),
      '#ui':     src('ui'),
      '#utils':  src('utils'),
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
  test: {
    environment: 'node',
    include:     ['tests/**/*.test.js'],
  },
})
