import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import COLORS from '../../../constants/colors'
import Container from '@material-ui/core/Container'
import { useSelector } from 'react-redux'
import { getSelectedOrganizationSelector } from '../core/organizationSelectors'
import { OrganizationHeader } from './OrganizationHeader'
import { Helmet } from 'react-helmet-async'
import { OrganizationTabs } from './OrganizationTabs'
import { Box } from '@material-ui/core'
import { OrganizationWriteInfo } from './OrganizationWriteInfo'

const useStyles = makeStyles((theme) => ({
    container: {
        background: COLORS.ADMIN_BACKGROUND_LIGHT,
        minHeight: 'calc(100vh - 50px)',
        overflow: 'hidden',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    content: {
        marginTop: theme.spacing(1),
    },
}))

export const OrganizationLayout = ({ children, onClose, baseUrl }) => {
    const classes = useStyles()
    const selectedOrganization = useSelector(getSelectedOrganizationSelector)
    const orgName = selectedOrganization.name

    return (
        <Box>
            <Helmet>
                <title>{orgName} - Admin</title>
            </Helmet>
            <Container className={classes.container}>
                <OrganizationHeader
                    organizationName={orgName}
                    onClose={onClose}
                />
                <OrganizationWriteInfo />
                <OrganizationTabs baseUrl={baseUrl} />
                <div className={classes.content}>{children}</div>
            </Container>
        </Box>
    )
}
