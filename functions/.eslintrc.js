module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'google',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json', 'tsconfig.dev.json'],
        sourceType: 'module',
    },
    ignorePatterns: [
        '/lib/**/*', // Ignore built files.
        'jest.config.js', // Ignore jest config.
    ],
    plugins: ['@typescript-eslint', 'import'],
    rules: {
        indent: ['warn', 4],
        semi: [2, 'never'],
        'object-curly-spacing': ['error', 'always'],
        quotes: ['error', 'single'],
        'max-len': ['warn', { code: 120 }],
        'import/no-unresolved': 0,
        'require-jsdoc': ['off'],
        '@typescript-eslint/ban-ts-comment': [
            'error',
            { 'ts-ignore': 'allow-with-description' },
        ],
    },
}
