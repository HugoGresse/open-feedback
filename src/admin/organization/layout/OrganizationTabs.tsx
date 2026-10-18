import { Tab, Tabs } from '@mui/material'
import withStyles from '@mui/styles/withStyles'
import type { Theme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Link, useMatch } from 'react-router-dom'
import { ORGANIZATION_ROUTES } from '../../RoutingMap'

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    }
}

const OFTabs = withStyles((theme: Theme) => ({
    root: {
        borderBottom: '1px solid #e0e0e0',
    },
    indicator: {
        backgroundColor: theme.palette.primary.main,
    },
}))(Tabs)

export interface OrganizationTabsProps {
    baseUrl: string
}

export const OrganizationTabs = ({ baseUrl }: OrganizationTabsProps) => {
    const { t } = useTranslation()

    const userPath = `${baseUrl}${ORGANIZATION_ROUTES.users.url}`
    const votingFormPath = `${baseUrl}${ORGANIZATION_ROUTES.votingForm.url}`
    const themePath = `${baseUrl}${ORGANIZATION_ROUTES.theme.url}`
    const integrationPath = `${baseUrl}${ORGANIZATION_ROUTES.integration.url}`

    const matchUsers = useMatch(userPath)
    const matchVotingForm = useMatch(votingFormPath)
    const matchTheme = useMatch(themePath)
    const matchIntegration = useMatch(integrationPath)

    const selectedTab = matchUsers
        ? 0
        : matchVotingForm
          ? 1
          : matchTheme
            ? 2
            : matchIntegration
              ? 3
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
                <Tab
                    label={t('rooting.settingIntegration')}
                    {...a11yProps(3)}
                    component={Link}
                    to={integrationPath}
                />
            </OFTabs>
        </Box>
    )
}
