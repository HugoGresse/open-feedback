import type { Meta } from '@storybook/react-vite'
import { OFButton } from './OFButton.tsx'

const meta = {
    component: OFButton,
    title: 'Admin/Button',
} satisfies Meta<typeof OFButton>
export default meta

export const defaultUsage = () => <OFButton>Click me</OFButton>

export const noBackground = () => (
    <OFButton style={{ design: 'text' }}>Cancel</OFButton>
)

export const customBackground = () => (
    <OFButton style={{ customBg: '#4499BB' }}>Cancel</OFButton>
)

export const big = () => <OFButton style={{ type: 'big' }}>Cancel</OFButton>

export const small = () => <OFButton style={{ type: 'small' }}>Cancel</OFButton>

export const loading = () => <OFButton loading>Submitting...</OFButton>
