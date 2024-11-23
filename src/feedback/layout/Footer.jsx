import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, useTheme } from '@mui/material'
import Link from '@mui/material/Link'
import { useOSSSponsors } from '../../baseComponents/useOSSSponsors.ts'

export const Footer = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'
    const logoColor = isDarkMode ? 'white' : 'black'

    const sponsors = useOSSSponsors()

    return (
        <Box
            display="flex"
            alignItems="top"
            justifyContent="center"
            padding={1}
            marginTop={2}
            color={theme.palette.textDimmed}
            component="footer">
            <span style={{ marginRight: 6, marginTop: -2 }}>
                {t('footer.madeBy')}
            </span>
            <a
                href="https://github.com/HugoGresse/open-feedback"
                target="_blank"
                rel="noopener noreferrer">
                <img
                    height="25"
                    src={`/static/logos/openfeedback-${logoColor}-orange.svg`}
                    alt="open feedback"
                />
            </a>

            <Box
                display="flex"
                flexDirection="row"
                paddingRight={1.8}
                paddingTop={0.5}
                gap={2}
                borderRadius={10}
                border="1px solid #888"
                alignItems="center"
                marginTop={-2}
                marginLeft={2}
                justifyContent="center">
                <Box marginInlineEnd={2}>
                    <Link
                        href="https://github.com/sponsors/HugoGresse"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: theme.palette.textDimmed }}>
                        <span
                            style={{ left: 16, top: -2, position: 'relative' }}>
                            {t('common.becomeSponsor')}
                        </span>
                    </Link>
                </Box>
                {sponsors.map((sponsor) => (
                    <Box
                        component="a"
                        href={sponsor.website}
                        target="_blank"
                        key={sponsor.name}
                        sx={{ ':hover': { opacity: 0.4 } }}>
                        <img
                            src={
                                (isDarkMode && sponsor.logoDark) || sponsor.logo
                            }
                            alt={sponsor.name}
                            style={{ height: 30, borderRadius: 5 }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    )
}
