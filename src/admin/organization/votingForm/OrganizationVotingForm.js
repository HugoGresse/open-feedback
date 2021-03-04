import React, { useEffect } from 'react'
import VoteItemList from '../../project/settings/votingForm/VoteItemList'
import VotingFormFooter from '../../project/settings/votingForm/VotingFormFooter'
import { OrganizationSettings } from './OrganizationSettings'
import { useDispatch, useSelector } from 'react-redux'
import {
    getOrganizationLanguagesSelector,
    getSelectedOrganizationIdSelector,
} from '../core/organizationSelectors'
import {
    fillDefaultVotingForm,
    getVoteItems,
    saveVoteItems,
} from '../../project/settings/votingForm/votingFormActions'
import { sleep } from '../../../utils/sleep'
import { useTranslation } from 'react-i18next'
import { getOrganization } from '../core/actions/getOrganization'

export const OrganizationVotingForm = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const selectedOrganizationId = useSelector(
        getSelectedOrganizationIdSelector
    )
    const languages = useSelector(getOrganizationLanguagesSelector)

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch, getVoteItems])

    return (
        <>
            <OrganizationSettings />
            <VoteItemList languages={languages} />
            <VotingFormFooter
                reset={() => {
                    return dispatch(fillDefaultVotingForm(t, true)).then(
                        async () => {
                            await dispatch(saveVoteItems())
                            await sleep(1000) // delay on firestore...
                            await dispatch(
                                getOrganization(selectedOrganizationId)
                            )
                            await dispatch(getVoteItems())
                        }
                    )
                }}
            />
        </>
    )
}
