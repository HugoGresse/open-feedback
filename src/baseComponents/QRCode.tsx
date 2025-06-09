import React, { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface QRCodeProps {
    data: string
    size?: number
    color?: string
    backgroundColor?: string
    className?: string
    showDownload?: boolean
    downloadFileName?: string
    logo?: string
}

export const QRCode: React.FC<QRCodeProps> = ({
    data,
    size = 300,
    color = '#000000',
    backgroundColor = 'transparent',
    className,
    showDownload = false,
    downloadFileName = 'qr-code',
    logo,
}) => {
    const { t } = useTranslation()
    const ref = useRef<HTMLDivElement>(null)
    const qrCode = useRef<QRCodeStyling>()

    const getQRConfig = () => ({
        width: size,
        height: size,
        data,
        dotsOptions: {
            color,
            type: 'rounded' as const,
        },
        backgroundOptions: {
            color: backgroundColor,
        },
        cornersSquareOptions: {
            color,
            type: 'extra-rounded' as const,
        },
        cornersDotOptions: {
            color,
            type: 'dot' as const,
        },
        image: logo,
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5,
        },
    })

    const handleDownload = (format: 'png' | 'svg' = 'png') => {
        if (qrCode.current) {
            qrCode.current.download({
                name: downloadFileName,
                extension: format,
            })
        }
    }

    useEffect(() => {
        qrCode.current = new QRCodeStyling(getQRConfig())

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
            qrCode.current.update(getQRConfig())
        }
    }, [data, size, color, backgroundColor])

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
            {showDownload && (
                <Box
                    display="flex"
                    gap={1}
                    justifyContent="center"
                    alignItems="center"
                    mt={1}>
                    <Button
                        variant="contained"
                        onClick={() => handleDownload('png')}>
                        {t('qrCode.downloadPng')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleDownload('svg')}>
                        {t('qrCode.downloadSvg')}
                    </Button>
                </Box>
            )}
        </Box>
    )
}
