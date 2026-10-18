import type { ReactNode } from 'react'
import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'
import { HEX_COLORS } from '../../../constants/colors'
import Container from '@mui/material/Container'
import { getSelectedOrganizationSelector } from '../core/organizationSelectors'
import { OrganizationHeader } from './OrganizationHeader.tsx'
import { Helmet } from 'react-helmet-async'
import { OrganizationTabs } from './OrganizationTabs.tsx'
import { Box } from '@mui/material'
import { OrganizationWriteInfo } from './OrganizationWriteInfo.tsx'
import { useAppSelector } from '../../../store'

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        background: HEX_COLORS.ADMIN_BACKGROUND_LIGHT,
        minHeight: 'calc(100vh - 50px)',
        overflow: 'hidden',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    content: {
        marginTop: theme.spacing(1),
    },
}))

export interface OrganizationLayoutProps {
    children?: ReactNode
    onClose: () => void
    baseUrl: string
}

export const OrganizationLayout = ({
    children,
    onClose,
    baseUrl,
}: OrganizationLayoutProps) => {
    const classes = useStyles()
    const selectedOrganization = useAppSelector(getSelectedOrganizationSelector)
    // Rendered by <Organization> only once the organization is loaded.
    const orgName = selectedOrganization?.name || ''

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
