import { defineConfig } from 'cypress'

export default defineConfig({
    env: {
        firestoreTestProjectId: 'testprojectid',
    },
    viewportWidth: 1000,
    viewportHeight: 1000,
    projectId: '3nv53o',
    retries: {
        runMode: 2,
        openMode: 0,
    },
    e2e: {
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    },
})
