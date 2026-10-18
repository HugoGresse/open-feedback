import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [],
    test: {
        include: ['**/*.spec.ts'],
        globals: true,
        testTimeout: 1000,
        // The first beforeEach of each file cold-imports the whole API.
        hookTimeout: 10000,
    },
})
