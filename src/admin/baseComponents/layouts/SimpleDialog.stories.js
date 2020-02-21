import React, { useState } from 'react'
import SimpleDialog from './SimpleDialog'
import OFButton from '../button/OFButton'

export default {
    component: SimpleDialog,
    title: 'Admin|Dialog',
}

export const defaultUsage = () => {
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
                open={isOpen}>
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
