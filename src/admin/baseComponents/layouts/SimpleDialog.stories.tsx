import type { Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { SimpleDialog } from './SimpleDialog.tsx'
import { OFButton } from '../button/OFButton.tsx'

const meta = {
    component: SimpleDialog,
    title: 'Admin/Dialog',
} satisfies Meta<typeof SimpleDialog>
export default meta

export const DefaultUsage = () => {
    const [isOpen, setDialogOpen] = useState(false)

    return (
        <>
            <OFButton onClick={() => setDialogOpen(true)}>Open dialog</OFButton>
            <SimpleDialog
                onClose={() => setDialogOpen(false)}
                onConfirm={() => setDialogOpen(false)}
                title="Dialog title"
                cancelText="Cancel"
                confirmText="Confirm button"
                open={isOpen}
            >
                <ul>
                    <li>Some content</li>
                    <li>Some content</li>
                    <li>Some content</li>
                    <li>Some content</li>
                    <li>Some content</li>
                </ul>
            </SimpleDialog>
        </>
    )
}
