import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [],
    test: {
        include: ['config/*.spec.js', 'functions/src/**/*.spec.ts'],
        globals: true,
    },
})
