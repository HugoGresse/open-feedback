import React, { useEffect, useMemo, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ColorSelector } from './ColorSelector'
import { invertColor } from '../utils/colorUtils'
import { Download as DownloadIcon } from '@mui/icons-material'

interface QRCodeProps {
    data: string
    size?: number
    color?: string
    eventColor?: string
    className?: string
    showDownload?: boolean
    downloadFileName?: string
    logo?: string
}

export const QRCode: React.FC<QRCodeProps> = ({
    data,
    size = 300,
    eventColor = '#000000',
    className,
    showDownload = false,
    downloadFileName = 'qr-code',
    logo,
}) => {
    const { t } = useTranslation()
    const ref = useRef<HTMLDivElement>(null)
    const qrCode = useRef<QRCodeStyling>()
    const [selectedColor, setSelectedColor] = useState<string>('#000000')

    const qrCodeConfig = useMemo(
        () => ({
            width: size,
            height: size,
            data,
            dotsOptions: {
                color: selectedColor,
                type: 'rounded' as const,
            },
            backgroundOptions: {
                color: invertColor(selectedColor, true),
            },
            cornersSquareOptions: {
                color: selectedColor,
                type: 'extra-rounded' as const,
            },
            cornersDotOptions: {
                color: selectedColor,
                type: 'dot' as const,
            },
            image: logo,
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 5,
            },
        }),
        [size, data, selectedColor, logo]
    )

    const handleDownload = (format: 'png' | 'svg' = 'png') => {
        if (qrCode.current) {
            // Temporarily increase size to 500px for download
            const downloadSize = 500

            const downloadConfig = {
                ...qrCodeConfig,
                width: downloadSize,
                height: downloadSize,
                backgroundOptions: {
                    color: 'transparent',
                },
            }

            qrCode.current.update(downloadConfig)

            qrCode.current
                .download({
                    name: downloadFileName,
                    extension: format,
                })
                .then(() => {
                    if (qrCode.current) {
                        qrCode.current.update(qrCodeConfig)
                    }
                })
        }
    }

    useEffect(() => {
        qrCode.current = new QRCodeStyling(qrCodeConfig)

        if (ref.current) {
            ref.current.innerHTML = ''
            qrCode.current.append(ref.current)
        } else {
            // eslint-disable-next-line no-console
            console.error('QRCode ref is not found')
        }
    }, [])

    useEffect(() => {
        if (qrCode.current) {
            qrCode.current.update(qrCodeConfig)
        }
    }, [qrCodeConfig])

    return (
        <Box
            className={className}
            display="flex"
            flexDirection="column"
            alignItems="center">
            <Typography variant="body1" gutterBottom>
                {data}
            </Typography>
            <div ref={ref} />

            <ColorSelector
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                eventColor={eventColor}
            />
            {showDownload && (
                <Box
                    display="flex"
                    gap={1}
                    justifyContent="center"
                    alignItems="center"
                    mt={1}>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload('png')}>
                        {t('qrCode.downloadPng')}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload('svg')}>
                        {t('qrCode.downloadSvg')}
                    </Button>
                </Box>
            )}
        </Box>
    )
}
