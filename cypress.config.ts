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

        setupNodeEvents(on) {
            on('before:browser:launch', (browser, launchOptions) => {
                if (browser.family === 'chromium') {
                    // running headless chrome in a virtualized environment forces pointer type to default to `NONE`
                    // to mimic "desktop" environment more correctly we force blink to have `pointer: fine` support
                    // this allows correct pickers behavior.
                    // This impact the used DateTimePicker in Material UI (MUI) between DesktopDateTimePicker and MobileDateTimePicker
                    launchOptions.args.push(
                        '--blink-settings=primaryPointerType=4'
                    )
                }

                return launchOptions
            })
        },
    },
})
