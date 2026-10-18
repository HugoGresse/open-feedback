import type { Meta } from '@storybook/react-vite'
import { OFTextArea } from './OFTextArea.tsx'
const meta = {
    component: OFTextArea,
    title: 'Admin/TextArea',
} satisfies Meta<typeof OFTextArea>
export default meta

export const defaultUsage = () => (
    <OFTextArea name="myField" placeholder="Placeholder" />
)

export const disabled = () => (
    <OFTextArea name="myField" placeholder="Placeholder" disabled={true} />
)

export const controlled = () => (
    <OFTextArea name="myField1" placeholder="Placeholder" value="value" />
)
