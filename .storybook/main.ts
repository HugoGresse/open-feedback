import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
    stories: ['../docs/app/*.mdx', '../src/**/*.stories.@(ts|tsx)', '**/*.md'],

    addons: ['@chromatic-com/storybook', '@storybook/addon-docs'],
    staticDirs: ['../public'],
    framework: '@storybook/react-vite',

    docs: {
        defaultName: 'Documentation',
    },
}

export default config
