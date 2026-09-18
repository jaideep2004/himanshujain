import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
        somaStudio: resolve(__dirname, 'soma-studio.html'),
        wavehouse: resolve(__dirname, 'wavehouse.html')
      }
    }
  }
})
