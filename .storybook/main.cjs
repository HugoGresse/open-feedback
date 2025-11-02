module.exports = {
    stories: [
        '../docs/app/*.mdx',
        '../docs/app/*.mdx',
        '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        '**/*.md',
    ],

    addons: ['@chromatic-com/storybook', '@storybook/addon-docs'],
    staticDirs: ['../public'],
    framework: '@storybook/react-vite',

    docs: {
        defaultName: 'Documentation',
    },
}
