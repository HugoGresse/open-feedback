import React from 'react'
import { useSelector } from 'react-redux'
import {
    getSortedProjectsByOrganizationIdsSelector,
    isProjectsLoadedSelector,
} from '../project/core/projectSelectors'
import Paper from '@mui/material/Paper'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent.jsx'
import { makeStyles } from '@mui/styles'
import { OrganizationListItem } from './OrganizationListItem.jsx'
import { NO_ORGANIZATION_FAKE_ID } from '../organization/core/organizationConstants'
import { useTranslation } from 'react-i18next'
import { isOrganizationsLoadedSelector } from '../organization/core/organizationSelectors'
import { OrganizationHeader } from './OrganizationHeader.jsx'
import Grid from '@mui/material/Grid'
import OFButton from '../baseComponents/button/OFButton.jsx'
import AddIcon from '@mui/icons-material/Add'

const useStyles = makeStyles((theme) => ({
    loaderContainer: {
        margin: theme.spacing(2),
        padding: theme.spacing(2, 2),
    },
    newOrg: {
        marginTop: 32,
        marginBottom: 32,
    },
}))

export const OrganizationList = ({
    onNewEventClick,
    onNewOrganizationClick,
}) => {
    const classes = useStyles()
    const projectsByOrganizations = useSelector(
        getSortedProjectsByOrganizationIdsSelector
    )
    const isProjectsLoaded = useSelector(isProjectsLoadedSelector)
    const isOrganizationsLoaded = useSelector(isOrganizationsLoadedSelector)
    const { t } = useTranslation()

    const organizationIds = Object.keys(projectsByOrganizations)

    if (!isProjectsLoaded || !isOrganizationsLoaded) {
        return (
            <>
                <OrganizationHeader title={t('root.loading')} />
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
                    organizationId={id}
                    organizationName={
                        id === NO_ORGANIZATION_FAKE_ID
                            ? t('root.organization.noOrganizationName')
                            : projectsByOrganizations[id].name
                    }
                    projects={projectsByOrganizations[id].projects}
                    onNewEventClick={onNewEventClick}
                />
            ))}

            <Grid item xs={12} key="new-org" component="li">
                <OFButton
                    onClick={onNewOrganizationClick}
                    color="secondary"
                    className={classes.newOrg}
                    startIcon={<AddIcon />}>
                    {t('organization.new')}
                </OFButton>
            </Grid>
        </>
    )
}
