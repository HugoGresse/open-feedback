import { fixupPluginRules } from '@eslint/compat'
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import cypress from 'eslint-plugin-cypress'
import i18nJson from 'eslint-plugin-i18n-json'

// eslint-plugin-react and eslint-plugin-i18n-json still call the rule context
// methods removed in ESLint 10 (getFilename...): @eslint/compat adds them back.
const reactPlugin = fixupPluginRules(react)
const i18nJsonPlugin = fixupPluginRules(i18nJson)

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
            'storybook-static/**',
            // scripts/ is a standalone package with its own tsconfig.
            'scripts/**',
        ],
    },
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
        // react-hooks is registered so its disable comments resolve; its rules are not enabled.
        plugins: { react: reactPlugin, cypress, 'react-hooks': reactHooks },
        languageOptions: {
            ...react.configs.flat.recommended.languageOptions,
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
            ...react.configs.flat.recommended.rules,
            ...react.configs.flat['jsx-runtime'].rules,
            'comma-dangle': 'off',
            'react/jsx-uses-vars': 'warn',
            'react/display-name': 'warn',
            'react/prop-types': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            'no-console': 'warn',
            'no-unexpected-multiline': 'warn',
            'cypress/no-assigning-return-values': 'error',
            'cypress/no-unnecessary-waiting': 'error',
        },
    },
    {
        // Named exports only. Storybook CSF stories need their default meta export.
        files: ['src/**/*.{ts,tsx}'],
        ignores: ['**/*.stories.tsx', '**/*.d.ts'],
        rules: {
            'no-restricted-exports': [
                'error',
                {
                    restrictDefaultExports: {
                        direct: true,
                        named: true,
                        defaultFrom: true,
                        namedFrom: true,
                        namespaceFrom: true,
                    },
                },
            ],
        },
    },
    {
        files: ['**/translations/languages/*.json'],
        plugins: { 'i18n-json': i18nJsonPlugin },
        processor: {
            meta: { name: '.json' },
            ...i18nJsonPlugin.processors['.json'],
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
