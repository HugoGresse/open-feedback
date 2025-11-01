import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [],
    test: {
        include: ['**/*.spec.ts'],
        globals: true,
        testTimeout: 1000,
        hookTimeout: 1000,
    },
})
