import React from 'react'
import { makeStyles } from '@mui/styles'
import COLORS from '../../../constants/colors'
import Container from '@mui/material/Container'
import { useSelector } from 'react-redux'
import { getSelectedOrganizationSelector } from '../core/organizationSelectors'
import { OrganizationHeader } from './OrganizationHeader.jsx'
import { Helmet } from 'react-helmet-async'
import { OrganizationTabs } from './OrganizationTabs.jsx'
import { Box } from '@mui/material'
import { OrganizationWriteInfo } from './OrganizationWriteInfo.jsx'

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
