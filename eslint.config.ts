import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import cypress from 'eslint-plugin-cypress'
import i18nJson from 'eslint-plugin-i18n-json'

// Translation files are compared against the English source of their app.
// Paths are relative to the linted file (src/<app>/translations/languages/).
const englishTranslations = {
    'admin.json': '../../../../src/admin/translations/languages/en.admin.json',
    'feedback.json':
        '../../../../src/feedback/translations/languages/en.feedback.json',
    'root.json': '../../../../src/root/translations/languages/en.root.json',
}

export default defineConfig([
    {
        // functions/ has its own ESLint config and install.
        ignores: [
            'build/**',
            'dist/**',
            'coverage/**',
            'functions/**',
            '**/*.ts',
        ],
    },
    {
        files: ['**/*.{js,jsx,mjs,cjs,tsx}'],
        extends: [
            js.configs.recommended,
            react.configs.flat.recommended,
            tseslint.configs.recommended,
        ],
        // react-hooks is registered so its disable comments resolve; its rules are not enabled.
        plugins: { cypress, 'react-hooks': reactHooks },
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...cypress.configs.globals.languageOptions.globals,
            },
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            'comma-dangle': 'off',
            'react/jsx-uses-vars': 'warn',
            'react/display-name': 'warn',
            'react/prop-types': 'off',
            'no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-vars': 'error',
            'no-console': 'warn',
            'no-unexpected-multiline': 'warn',
            'cypress/no-assigning-return-values': 'error',
            'cypress/no-unnecessary-waiting': 'error',
        },
    },
    {
        files: ['**/translations/languages/*.json'],
        plugins: { 'i18n-json': i18nJson },
        processor: {
            meta: { name: '.json' },
            ...i18nJson.processors['.json'],
        },
        rules: {
            ...i18nJson.configs.recommended.rules,
            'i18n-json/identical-keys': [
                'error',
                { filePath: englishTranslations },
            ],
            'i18n-json/valid-message-syntax': [
                'error',
                { syntax: 'non-empty-string' },
            ],
            'i18n-json/sorted-keys': 'off',
        },
    },
])
