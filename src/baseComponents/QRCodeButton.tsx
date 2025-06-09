import React, { useState } from 'react'
import { IconButton, Tooltip, useTheme } from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode'
import { QRCodeDialog } from './QRCodeDialog'
import { darken, lighten } from '@mui/material/styles'

interface QRCodeButtonProps {
    url: string
    color?: string
    title?: string
    tooltipTitle?: string
    size?: 'small' | 'medium' | 'large'
    fileName?: string
    logo?: string
}

export const QRCodeButton: React.FC<QRCodeButtonProps> = ({
    url,
    color,
    title = 'QR Code',
    tooltipTitle = 'Show QR Code',
    size = 'medium',
    fileName = 'qr-code',
    logo,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const theme = useTheme()

    // Use the provided color or adapt to theme
    const iconColor =
        color ||
        (theme.palette.mode === 'dark'
            ? lighten(theme.palette.pageBackground, 0.5)
            : darken(theme.palette.pageBackground, 0.5))

    return (
        <>
            <Tooltip title={tooltipTitle}>
                <IconButton
                    onClick={() => setDialogOpen(true)}
                    size={size}
                    sx={{
                        color: iconColor,
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}
                    aria-label={tooltipTitle}>
                    <QrCode2Icon />
                </IconButton>
            </Tooltip>

            <QRCodeDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                value={url}
                title={title}
                fileName={fileName}
                logo={logo}
            />
        </>
    )
}
