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
    testTimeout: 10000, // 10 seconds
    hookTimeout: 10000, // 10 seconds
    pool: 'forks', // Use forks instead of threads for better isolation
    isolate: true, // Isolate tests
    maxConcurrency: 1, // Run tests sequentially to avoid timeouts
    bail: 1, // Stop on first failure
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        'src/test/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/test-*',
        '**/examples/**',
        'scripts/**',
        'content/**',
        'public/**',
        'out/**',
        'coverage/**',
        '.next/**',
        'dist/**',
        'build/**',
        'playwright-report/**',
        'test-results/**',
        'archive/**',
        'docs/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      },
      reportsDirectory: './coverage'
    }
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
})