import React from 'react'
import { useSelector } from 'react-redux'
import { isOrganizationRightAllowed } from '../core/organizationSelectors'
import Box from '@material-ui/core/Box'
import InfoIcon from '@material-ui/icons/Info'
import TranslatedTypography from '../../baseComponents/TranslatedTypography'

export const OrganizationRightsInfo = () => {
    const isRightAllowed = useSelector(isOrganizationRightAllowed)
    if (isRightAllowed) {
        return null
    }
    return (
        <Box bgcolor="primary.main" borderRadius={4} marginY={4} padding={2}>
            <InfoIcon />
            <TranslatedTypography i18nKey="organization.rightDenied" />
        </Box>
    )
}
