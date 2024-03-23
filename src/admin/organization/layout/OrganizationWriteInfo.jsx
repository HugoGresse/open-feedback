import React from 'react'
import { useSelector } from 'react-redux'
import { isOrganizationRightAllowed } from '../core/organizationSelectors'
import Box from '@mui/material/Box'
import InfoIcon from '@mui/icons-material/Info'
import TranslatedTypography from '../../baseComponents/TranslatedTypography.jsx'

export const OrganizationWriteInfo = () => {
    const isRightAllowed = useSelector(isOrganizationRightAllowed)
    if (isRightAllowed) {
        return null
    }
    return (
        <Box bgcolor="primary.main" borderRadius="4px" marginY={4} padding={2}>
            <InfoIcon />
            <TranslatedTypography i18nKey="organization.rightDenied" />
        </Box>
    );
}
