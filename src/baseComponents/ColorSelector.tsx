import React, { useMemo, useRef } from 'react'
import {
    Box,
    ButtonGroup,
    Button,
    Typography,
    Input,
    useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface ColorSelectorProps {
    selectedColor: string
    // eslint-disable-next-line no-unused-vars
    onColorChange: (color: string) => void
    eventColor?: string
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
    selectedColor,
    onColorChange,
    eventColor = '#000000',
}) => {
    const { t } = useTranslation()
    const colorInputRef = useRef<HTMLInputElement>(null)
    const theme = useTheme()
    const colorOptions: {
        label: string
        color: string
    }[] = useMemo(() => {
        return [
            {
                label: t('qrCode.colorBlack'),
                color: '#000000',
            },
            {
                label: t('qrCode.colorWhite'),
                color: '#FFFFFF',
            },
            {
                label: t('qrCode.colorEvent'),
                color: eventColor,
            },
        ]
    }, [t, eventColor, selectedColor])

    const handleCustomColorChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onColorChange(event.target.value)
    }

    return (
        <Box display="flex" gap={6} py={2}>
            <ButtonGroup
                variant="contained"
                orientation="vertical"
                aria-label="QR Code color selection">
                {colorOptions.map((option) => (
                    <Button
                        key={option.color}
                        onClick={() => {
                            if (option.color) {
                                onColorChange(option.color)
                            }
                        }}
                        variant={
                            selectedColor === option.color
                                ? 'contained'
                                : 'text'
                        }
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            borderColor: theme.palette.divider,
                        }}>
                        <Box
                            width={16}
                            height={16}
                            borderRadius="50%"
                            bgcolor={option.color}
                            border={1}
                            borderColor="divider"
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    selectedColor === option.color
                                        ? option.color
                                        : theme.palette.text.primary,
                            }}>
                            {option.label}
                        </Typography>
                    </Button>
                ))}
            </ButtonGroup>
            <Box>
                <Input
                    ref={colorInputRef}
                    type="color"
                    value={selectedColor}
                    onChange={handleCustomColorChange}
                    sx={{
                        minWidth: 50,
                    }}
                />
            </Box>
        </Box>
    )
}
