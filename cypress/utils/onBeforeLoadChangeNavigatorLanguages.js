import { APP_LANG } from '../testedProjectContent.js'

export const onBeforeLoadChangeNavigatorLanguages = {
    onBeforeLoad: (win) => {
        Object.defineProperty(win.navigator, 'language', {
            value: APP_LANG,
        })
        Object.defineProperty(win.navigator, 'languages', {
            value: [APP_LANG],
        })
    },
}
