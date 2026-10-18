import { useEffect } from 'react'
import { VoteItemList } from '../../project/settings/votingForm/VoteItemList'
import { VotingFormFooter } from '../../project/settings/votingForm/VotingFormFooter.tsx'
import { OrganizationVotingFormSettings } from './OrganizationVotingFormSettings.tsx'
import {
    getOrganizationLanguagesSelector,
    getSelectedOrganizationIdSelector,
} from '../core/organizationSelectors'
import {
    fillDefaultVotingForm,
    getVoteItems,
    saveVoteItems,
} from '../../project/settings/votingForm/votingFormActions.tsx'
import { sleep } from '../../../utils/sleep'
import { useTranslation } from 'react-i18next'
import { getOrganization } from '../core/actions/getOrganization'
import { useAppDispatch, useAppSelector } from '../../../store'

export const OrganizationVotingForm = () => {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const selectedOrganizationId = useAppSelector(
        getSelectedOrganizationIdSelector
    )
    const languages = useAppSelector(getOrganizationLanguagesSelector)

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch])

    return (
        <>
            <OrganizationVotingFormSettings />
            <VoteItemList languages={languages} />
            <VotingFormFooter
                reset={() => {
                    return dispatch(fillDefaultVotingForm(t, true)).then(
                        async () => {
                            await dispatch(saveVoteItems())
                            await sleep(1000) // delay on firestore...
                            // Always set while this page is displayed.
                            if (selectedOrganizationId) {
                                await dispatch(
                                    getOrganization(selectedOrganizationId)
                                )
                            }
                            await dispatch(getVoteItems())
                        }
                    )
                }}
            />
        </>
    )
}
