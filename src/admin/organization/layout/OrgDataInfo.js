import React from 'react'
import Box from '@material-ui/core/Box'
import InfoIcon from '@material-ui/icons/Info'
import TranslatedTypography from '../../baseComponents/TranslatedTypography'

export const OrgDataInfo = () => {
    return (
        <Box bgcolor="primary.main" borderRadius={4} padding={2} color="white">
            <InfoIcon />
            <TranslatedTypography i18nKey="organization.infoData" />
        </Box>
    )
}
