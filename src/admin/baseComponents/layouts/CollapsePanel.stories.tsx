import type { Meta } from '@storybook/react-vite'
import { CollapsePanel } from './CollapsePanel.tsx'

const meta = {
    component: CollapsePanel,
    title: 'Admin/CollapsePanel',
} satisfies Meta<typeof CollapsePanel>
export default meta

export const defaultUsage = () => (
    <CollapsePanel buttonText="Click me button">
        <ul>
            <li>Some content</li>
            <li>Some content</li>
            <li>Some content</li>
            <li>Some content</li>
            <li>Some content</li>
        </ul>
    </CollapsePanel>
)
