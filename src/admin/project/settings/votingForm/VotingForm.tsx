import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VoteItemList } from './VoteItemList'
import {
    fillDefaultVotingForm,
    getVoteItems,
    saveVoteItems,
} from './votingFormActions.tsx'
import { OFPaper } from '../../../baseComponents/OFPaper.tsx'
import { VotingFormFooter } from './VotingFormFooter.tsx'
import { VotingFormTranslationTip } from './VotingFormTranslationTip.tsx'
import { getLanguagesSelector } from '../../core/projectSelectors'
import { sleep } from '../../../../utils/sleep'
import { getProject } from '../../core/actions/getProject'
import { useTranslation } from 'react-i18next'

export const VotingForm = () => {
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
