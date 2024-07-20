import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react()],
    test: {
        include: ['config/*.spec.js', 'functions/src/**/*.spec.ts'],
        globals: true,
    },
})
