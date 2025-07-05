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
    testTimeout: 30000, // 30 seconds
    hookTimeout: 30000, // 30 seconds
    pool: 'forks', // Use forks instead of threads for better isolation
    isolate: true, // Isolate tests
    maxConcurrency: 5, // Limit concurrent tests
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
})