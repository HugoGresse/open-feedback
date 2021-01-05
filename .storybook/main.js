module.exports = {
    stories: [
        '../docs/app/@(home|install).stories.mdx',
        '../docs/app/*.mdx',
        '../src/**/*.stories.@(js|mdx)',
    ],
    addons: [
        '@storybook/preset-create-react-app',
        {
            name: '@storybook/addon-docs',
        },
    ],
}
