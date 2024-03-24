import React, { lazy, Suspense } from 'react'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent.jsx'
import Box from '@mui/material/Box'
import { OrgDataInfo } from '../layout/OrgDataInfo.jsx'
import {
    disableSoloTalkRedirectSelector,
    displayFullEventDatesSelector,
    getOrganizationLanguagesSelector,
    hideVotesUntilUserVoteSelector,
} from '../core/organizationSelectors'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { editOrganization } from '../core/actions/editOrganization'
const SettingsForm = lazy(() =>
    import('../../project/settings/setup/SettingsForm.jsx')
)

export const OrganizationVotingFormSettings = () => {
    const dispatch = useDispatch()
    const disableSoloTalkRedirect = useSelector(disableSoloTalkRedirectSelector)
    const hideVotesUntilUserVote = useSelector(hideVotesUntilUserVoteSelector)
    // Doing this prevents the selector to be connected to redux directly, thus prevent future update of initialValues
    const initialLanguages = getOrganizationLanguagesSelector(
        useStore().getState()
    )
    const displayFullDates = useSelector(displayFullEventDatesSelector)

    return (
        <Box padding={2} paddingTop={0}>
            <OrgDataInfo />
            <Suspense fallback={<LoaderMatchParent height="100px" />}>
                <SettingsForm
                    onSave={(settings) => dispatch(editOrganization(settings))}
                    initialLanguages={initialLanguages}
                    disableSoloTalkRedirect={disableSoloTalkRedirect}
                    hideVotesUntilUserVote={hideVotesUntilUserVote}
                    displayTitle={false}
                    isOrganizationSettings={true}
                    displayFullDates={displayFullDates}
                />
            </Suspense>
        </Box>
    )
}
