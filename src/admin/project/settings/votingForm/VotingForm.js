import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VoteItemList from './VoteItemList'
import { getVoteItems } from './votingFormActions'
import OFPaper from '../../../baseComponents/OFPaper'
import VotingFormFooter from './VotingFormFooter'
import { VotingFormTranslationTip } from './VotingFormTranslationTip'
import {
    getLanguagesSelector,
    getSelectedProjectIdSelector,
} from '../../core/projectSelectors'

const VotingForm = () => {
    const dispatch = useDispatch()
    const languages = useSelector(getLanguagesSelector)
    const selectedProjectId = useSelector(getSelectedProjectIdSelector)

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch])

    return (
        <>
            <VotingFormTranslationTip />
            <OFPaper>
                <VoteItemList languages={languages} />
            </OFPaper>
            <VotingFormFooter selectedProjectId={selectedProjectId} />
        </>
    )
}

export default VotingForm
