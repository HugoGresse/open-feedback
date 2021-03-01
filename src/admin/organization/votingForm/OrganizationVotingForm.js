import React, { useEffect } from 'react'
import VoteItemList from '../../project/settings/votingForm/VoteItemList'
import VotingFormFooter from '../../project/settings/votingForm/VotingFormFooter'
import { OrganizationSettings } from './OrganizationSettings'
import { useDispatch, useSelector } from 'react-redux'
import { getOrganizationLanguagesSelector } from '../core/organizationSelectors'
import { getVoteItems } from '../../project/settings/votingForm/votingFormActions'

export const OrganizationVotingForm = () => {
    const dispatch = useDispatch()
    const languages = useSelector(getOrganizationLanguagesSelector)

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch, getVoteItems])

    return (
        <>
            <OrganizationSettings />
            <VoteItemList languages={languages} />
            <VotingFormFooter />
        </>
    )
}
