import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import COLORS from '../../constants/colors'
import OFButton from '../baseComponents/button/OFButton.jsx'
import { useTranslation } from 'react-i18next'
import { Box, useTheme } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { Link } from 'react-router-dom'
import { ROUTE_ADMIN, ROUTE_ORGANIZATION_SEGMENT } from '../RoutingMap'

export const OrganizationHeader = ({
    title,
    isOrganization = false,
    organizationId = null,
}) => {
    const { t } = useTranslation()
    const theme = useTheme()

    return (
        <>
            <Grid
                item
                xs={12}
                component="li"
                marginTop={isOrganization ? 4 : 10}>
                <Grid container>
                    <Grid item xs={12} md={isOrganization ? 8 : 12}>
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                color: isOrganization
                                    ? theme.palette.secondary.main
                                    : COLORS.WHITE,
                            }}>
                            {title}
                        </Typography>
                    </Grid>
                    {isOrganization && (
                        <Grid
                            item
                            xs={12}
                            md={4}
                            component={Box}
                            display="flex"
                            alignSelf="center"
                            justifyContent="flex-end">
                            <Link
                                to={`${ROUTE_ADMIN}${ROUTE_ORGANIZATION_SEGMENT}/${organizationId}`}
                                title={`${t('organization.edit')} ${title}`}>
                                <OFButton
                                    color="secondary"
                                    startIcon={<EditIcon />}>
                                    {t('organization.edit')}
                                </OFButton>
                            </Link>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    )
}
