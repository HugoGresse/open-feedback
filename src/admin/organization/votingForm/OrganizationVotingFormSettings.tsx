import { lazy, Suspense } from 'react'
import { LoaderMatchParent } from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import Box from '@mui/material/Box'
import { OrgDataInfo } from '../layout/OrgDataInfo.tsx'
import {
    disableSoloTalkRedirectSelector,
    displayFullEventDatesSelector,
    getOrganizationLanguagesSelector,
    hideVotesUntilUserVoteSelector,
} from '../core/organizationSelectors'
import { useStore } from 'react-redux'
import {
    editOrganization,
    type EditOrganizationData,
} from '../core/actions/editOrganization'
import { type RootState, useAppDispatch, useAppSelector } from '../../../store'
const SettingsForm = lazy(() =>
    import('../../project/settings/setup/SettingsForm.tsx').then((module) => ({
        default: module.SettingsForm,
    }))
)

export const OrganizationVotingFormSettings = () => {
    const dispatch = useAppDispatch()
    const disableSoloTalkRedirect = useAppSelector(
        disableSoloTalkRedirectSelector
    )
    const hideVotesUntilUserVote = useAppSelector(
        hideVotesUntilUserVoteSelector
    )
    // Doing this prevents the selector to be connected to redux directly, thus prevent future update of initialValues
    const initialLanguages = getOrganizationLanguagesSelector(
        useStore<RootState>().getState()
    )
    const displayFullDates = useAppSelector(displayFullEventDatesSelector)

    return (
        <Box padding={2} paddingTop={0}>
            <OrgDataInfo />
            <Suspense fallback={<LoaderMatchParent height="100px" />}>
                <SettingsForm
                    onSave={(settings: EditOrganizationData) =>
                        dispatch(editOrganization(settings))
                    }
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
