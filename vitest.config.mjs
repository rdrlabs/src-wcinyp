import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules', 'dist', 'coverage', 'archive', '.node_modules_old_delete_me'],
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
})