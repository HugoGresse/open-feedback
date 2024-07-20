import React from 'react'
import { Tab, Tabs } from '@mui/material'
import withStyles from '@mui/styles/withStyles';
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Link, useMatch } from 'react-router-dom'
import { ORGANIZATION_ROUTES } from '../../RoutingMap'

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    }
}

const OFTabs = withStyles((theme) => ({
    root: {
        borderBottom: '1px solid #e0e0e0',
    },
    indicator: {
        backgroundColor: theme.palette.primary.main,
    },
}))(Tabs)

export const OrganizationTabs = ({ baseUrl }) => {
    const { t } = useTranslation()

    const userPath = `${baseUrl}${ORGANIZATION_ROUTES.users.url}`
    const votingFormPath = `${baseUrl}${ORGANIZATION_ROUTES.votingForm.url}`
    const themePath = `${baseUrl}${ORGANIZATION_ROUTES.theme.url}`

    const matchUsers = useMatch({
        path: userPath,
        exact: true,
    })
    const matchVotingForm = useMatch({
        path: votingFormPath,
        exact: true,
    })
    const matchTheme = useMatch({
        path: themePath,
        exact: true,
    })

    const selectedTab = matchUsers
        ? 0
        : matchVotingForm
        ? 1
        : matchTheme
        ? 2
        : 0

    return (
        <Box marginTop={2}>
            <OFTabs value={selectedTab} aria-label="Organization tabs">
                <Tab
                    label={t('rooting.settingUsers')}
                    {...a11yProps(0)}
                    component={Link}
                    to={userPath}
                />
                <Tab
                    label={t('rooting.settingVotingform')}
                    {...a11yProps(1)}
                    component={Link}
                    to={votingFormPath}
                />
                <Tab
                    label={t('organization.tabTheme')}
                    {...a11yProps(2)}
                    component={Link}
                    to={themePath}
                />
            </OFTabs>
        </Box>
    )
}
