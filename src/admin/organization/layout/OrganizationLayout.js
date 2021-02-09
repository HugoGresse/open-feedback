import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import COLORS from '../../../constants/colors'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { useSelector } from 'react-redux'
import { getSelectedOrganizationSelector } from '../core/organizationSelectors'
import { OrganizationHeader } from './OrganizationHeader'
import { Helmet } from 'react-helmet-async'
import { OrganizationTabs } from './OrganizationTabs'
import { Box } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    container: {
        background: COLORS.ADMIN_BACKGROUND_LIGHT,
        minHeight: '100vh',
        overflow: 'hidden',
        paddingTop: theme.spacing(2),
    },
}))

export const OrganizationLayout = ({ children }) => {
    const classes = useStyles()
    const selectedOrganization = useSelector(getSelectedOrganizationSelector)
    const orgName = selectedOrganization.name

    return (
        <Box bgcolor={COLORS.ADMIN_BACKGROUND}>
            <Helmet>
                <title>{orgName} - Admin</title>
            </Helmet>
            <Container maxWidth="md" fixed className={classes.container}>
                <OrganizationHeader organizationName={orgName} />
                <OrganizationTabs />
                <Grid container spacing={3}>
                    {children}
                </Grid>
            </Container>
        </Box>
    )
}
