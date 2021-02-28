import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VoteItemList from './VoteItemList'
import { getVoteItems } from './votingFormActions'
import OFPaper from '../../../baseComponents/OFPaper'
import VotingFormFooter from './VotingFormFooter'
import { VotingFormTranslationTip } from './VotingFormTranslationTip'
import { getLanguagesSelector } from '../../core/projectSelectors'

const VotingForm = () => {
    const dispatch = useDispatch()
    const languages = useSelector(getLanguagesSelector)

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch])

    return (
        <>
            <VotingFormTranslationTip />
            <OFPaper>
                <VoteItemList languages={languages} />
            </OFPaper>
            <VotingFormFooter />
        </>
    )
}

export default VotingForm
