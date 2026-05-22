/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/hooks/**'],
      reporter: ['text', 'html'],
    },
  },
})
