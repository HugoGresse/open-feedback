import React from 'react'
import { Tab, Tabs } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import { Link, useRouteMatch } from 'react-router-dom'
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

export const OrganizationTabs = () => {
    const { t } = useTranslation()
    const { url } = useRouteMatch()

    const userPath = `${url}${ORGANIZATION_ROUTES.users.url}`
    const votingFormPath = `${url}${ORGANIZATION_ROUTES.votingForm.url}`
    const themePath = `${url}${ORGANIZATION_ROUTES.theme.url}`

    const matchUsers = useRouteMatch({
        path: userPath,
        exact: true,
    })
    const matchVotingForm = useRouteMatch({
        path: votingFormPath,
        exact: true,
    })
    const matchTheme = useRouteMatch({
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
