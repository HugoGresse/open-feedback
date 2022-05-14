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
    ],
    plugins: ['@typescript-eslint', 'import'],
    rules: {
        indent: ['error', 4],
        semi: [2, 'never'],
        'object-curly-spacing': ['error', 'always'],
        quotes: ['error', 'single'],
        'max-len': ['error', { code: 120 }],
        'import/no-unresolved': 0,
    },
}
