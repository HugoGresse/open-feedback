module.exports = {
    stories: [
        '../docs/app/*.mdx',
        '../docs/app/*.mdx',
        '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        '**/*.md',
    ],

    addons: ['@storybook/addon-essentials', '@chromatic-com/storybook'],
    staticDirs: ['../public'],
    framework: '@storybook/react-vite',

    docs: {
        defaultName: 'Documentation',
    },
}
