import React, { lazy, Suspense } from 'react'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import Box from '@material-ui/core/Box'
import { OrgDataInfo } from '../layout/OrgDataInfo'
import {
    disableSoloTalkRedirectSelector,
    getOrganizationLanguagesSelector,
} from '../core/organizationSelectors'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { editOrganization } from '../core/actions/editOrganization'
const SettingsForm = lazy(() =>
    import('../../project/settings/setup/SettingsForm')
)

export const OrganizationVotingFormSettings = () => {
    const dispatch = useDispatch()
    const disableSoloTalkRedirect = useSelector(disableSoloTalkRedirectSelector)
    // Doing this prevent the selector to be connected to redux directly, thus prevent future update of initialValues
    const initialLanguages = getOrganizationLanguagesSelector(
        useStore().getState()
    )

    return (
        <Box padding={2} paddingTop={0}>
            <OrgDataInfo />
            <Suspense fallback={<LoaderMatchParent height="100px" />}>
                <SettingsForm
                    onSave={(settings) => dispatch(editOrganization(settings))}
                    initialLanguages={initialLanguages}
                    disableSoloTalkRedirect={disableSoloTalkRedirect}
                    displayTitle={false}
                />
            </Suspense>
        </Box>
    )
}
