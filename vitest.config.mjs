import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      'node_modules', 
      'dist', 
      'coverage', 
      'archive', 
      '.node_modules_old_delete_me',
      'tests/e2e/**', // Exclude e2e tests until PR #10 is merged
      '**/*.spec.ts', // Exclude Playwright spec files
      '**/*.spec.js'
    ],
    testTimeout: 10000, // 10 seconds
    hookTimeout: 10000, // 10 seconds
    pool: 'forks', // Use forks instead of threads for better isolation
    isolate: true, // Isolate tests
    maxConcurrency: 1, // Run tests sequentially to avoid timeouts
    bail: 1, // Stop on first failure
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
})