import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import VoteItemList from './VoteItemList'
import { getVoteItems } from './votingFormActions'
import OFPaper from '../../../baseComponents/OFPaper'
import VotingFormFooter from './VotingFormFooter'
import { VotingFormTranslationTip } from './VotingFormTranslationTip'

const VotingForm = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch])

    return (
        <>
            <VotingFormTranslationTip />
            <OFPaper>
                <VoteItemList />
            </OFPaper>
            <VotingFormFooter />
        </>
    )
}

export default VotingForm
