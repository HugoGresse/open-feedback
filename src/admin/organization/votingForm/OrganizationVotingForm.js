import React from 'react'
import VoteItemList from '../../project/settings/votingForm/VoteItemList'
import VotingFormFooter from '../../project/settings/votingForm/VotingFormFooter'
import { OrganizationSettings } from './OrganizationSettings'
import { useSelector } from 'react-redux'
import { getOrganizationLanguagesSelector } from '../core/organizationSelectors'

export const OrganizationVotingForm = () => {
    const languages = useSelector(getOrganizationLanguagesSelector)

    // TODO : voting form, maybe two mode: one organization and one project
    return (
        <>
            <OrganizationSettings />

            <VoteItemList languages={languages} />

            <VotingFormFooter />
        </>
    )
}
