import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, useTheme } from '@mui/material'
import Link from '@mui/material/Link'

export const Footer = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const logoColor = theme.palette.mode === 'dark' ? 'white' : 'black'

    return (
        <Box
            display="flex"
            alignItems="top"
            justifyContent="center"
            padding={1}
            marginTop={2}
            color={theme.palette.textDimmed}
            component="footer"
        >
            <span style={{ marginRight: 6, marginTop: -2 }}>
                {t('footer.madeBy')}
            </span>
            <a
                href="https://github.com/HugoGresse/open-feedback"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    height="25"
                    src={`/static/logos/openfeedback-${logoColor}-orange.svg`}
                    alt="open feedback"
                />
            </a>

            <Link
                href="https://github.com/sponsors/HugoGresse"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.palette.primary.contrastText }}
            >
                <span style={{ left: 16, top: -2, position: 'relative' }}>
                    {t('common.donate')}
                </span>
            </Link>
        </Box>
    )
}
