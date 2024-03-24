import React from 'react'
import Box from '@mui/material/Box'
import InfoIcon from '@mui/icons-material/Info'
import TranslatedTypography from '../../baseComponents/TranslatedTypography.jsx'

export const OrgDataInfo = () => {
    return (
        <Box bgcolor="primary.main" borderRadius="4px" padding={2} color="white">
            <InfoIcon />
            <TranslatedTypography i18nKey="organization.infoData" />
        </Box>
    );
}
