import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VoteItemList from './VoteItemList.jsx'
import {
    fillDefaultVotingForm,
    getVoteItems,
    saveVoteItems,
} from './votingFormActions.jsx'
import OFPaper from '../../../baseComponents/OFPaper.jsx'
import VotingFormFooter from './VotingFormFooter.jsx'
import { VotingFormTranslationTip } from './VotingFormTranslationTip.jsx'
import { getLanguagesSelector } from '../../core/projectSelectors'
import { sleep } from '../../../../utils/sleep'
import { getProject } from '../../core/actions/getProject'
import { useTranslation } from 'react-i18next'

const VotingForm = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
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
            <VotingFormFooter
                reset={() => {
                    return dispatch(fillDefaultVotingForm(t, true)).then(
                        async () => {
                            await dispatch(saveVoteItems())
                            await sleep(1000) // delay on firestore...
                            await dispatch(getProject())
                            await dispatch(getVoteItems())
                        }
                    )
                }}
            />
        </>
    )
}

export default VotingForm
