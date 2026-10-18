/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ADMIN_EMAIL: string
    readonly VITE_RECAPTCHAV3_SITE_KEY: string
    readonly VITE_APPID: string
    readonly VITE_API_KEY: string
    readonly VITE_AUTH_DOMAIN: string
    readonly VITE_DATABASE_URL: string
    readonly VITE_PROJECT_ID: string
    readonly VITE_STORAGE_BUCKET: string
    readonly VITE_MEASUREMENT_ID: string
    readonly VITE_SMALL_CHAT?: string
    readonly VITE_OPEN_SPONSORS?: string
    readonly VITE_EMULATORS?: string
    readonly VITE_API_DOCS_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface Window {
    /** Set by the Redux DevTools browser extension. */
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof import('redux').compose
}
