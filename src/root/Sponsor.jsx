import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { useOSSSponsors } from '../baseComponents/useOSSSponsors'
import OFButton from '../admin/baseComponents/button/OFButton.jsx'

export const Sponsor = () => {
    const { t } = useTranslation()

    const sponsors = useOSSSponsors()

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="#eee"
            flexGrow="1"
            textAlign="center"
            paddingY={4}
            borderTop="1px solid #ccc">
            <Typography variant="h2" id="sponsor" style={{ marginTop: 16 }}>
                {t('sponsor.title')}
            </Typography>

            <Typography variant="body1" style={{ marginTop: 16 }}>
                {t('sponsor.description')}
            </Typography>

            <Box
                display="flex"
                flexDirection="row"
                marginY={4}
                gap={4}
                alignItems="center"
                justifyContent="center">
                {sponsors.map((sponsor) => (
                    <Box
                        component="a"
                        href={sponsor.website}
                        target="_blank"
                        key={sponsor.name}
                        sx={{ ':hover': { opacity: 0.4 } }}>
                        <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            style={{ height: 50, borderRadius: 5 }}
                        />
                    </Box>
                ))}
            </Box>
            <OFButton
                style={{ marginTop: 26, marginBottom: 32 }}
                href="https://github.com/sponsors/HugoGresse"
                target="_blank"
                rel="noopener noreferrer">
                {t('sponsor.becomeSponsor')}
            </OFButton>
        </Box>
    )
}
