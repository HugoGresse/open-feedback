import React from 'react'
import { useSelector } from 'react-redux'
import {
    getSortedProjectsByOrganizationIdsSelector,
    isProjectsLoadedSelector,
} from '../project/core/projectSelectors'
import { useHistory } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { OrganizationListItem } from './OrganizationListItem'
import { redirectToProject } from '../project/utils/redirectToProject'
import { NO_ORGANIZATION_FAKE_ID } from '../organization/core/organizationConstants'
import { useTranslation } from 'react-i18next'
import { isOrganizationsLoadedSelector } from '../organization/core/organizationSelectors'
import { OrganizationTitle } from './OrganizationTitle'
import Grid from '@material-ui/core/Grid'
import OFButton from '../baseComponents/button/OFButton'
import AddIcon from '@material-ui/icons/Add'
import { Box, useTheme } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    loaderContainer: {
        padding: theme.spacing(2, 2),
    },
}))

export const OrganizationList = ({
    onNewEventClick,
    onNewOrganizationClick,
}) => {
    const classes = useStyles()
    const history = useHistory()
    const projectsByOrganizations = useSelector(
        getSortedProjectsByOrganizationIdsSelector
    )
    const isProjectsLoaded = useSelector(isProjectsLoadedSelector)
    const isOrganizationsLoaded = useSelector(isOrganizationsLoadedSelector)
    const theme = useTheme()
    const { t } = useTranslation()

    const organizationIds = Object.keys(projectsByOrganizations)

    if (!isProjectsLoaded || !isOrganizationsLoaded) {
        return (
            <>
                <OrganizationTitle title={t('root.loading')} />
                <Paper className={classes.loaderContainer}>
                    <LoaderMatchParent height="50" />
                </Paper>
            </>
        )
    }

    return (
        <>
            {organizationIds.map((id) => (
                <OrganizationListItem
                    key={id}
                    organizationName={
                        id === NO_ORGANIZATION_FAKE_ID
                            ? t('root.organization.noOrganizationName')
                            : 'toto'
                    }
                    projects={projectsByOrganizations[id]}
                    onNewEventClick={onNewEventClick}
                    onProjectSelected={(projectId) => {
                        redirectToProject(null, projectId, history)
                    }}
                />
            ))}

            <Grid item xs={12} key="new-org" component={Box}>
                <OFButton
                    onClick={onNewOrganizationClick}
                    style={{
                        marginTop: 32,
                        customBg: theme.palette.secondary.main,
                    }}>
                    <AddIcon />
                    {t('organization.new')}
                </OFButton>
            </Grid>
        </>
    )
}
