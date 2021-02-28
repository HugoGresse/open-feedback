import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VoteItemList from './VoteItemList'
import {
    addVoteItem,
    getVoteItems,
    onVoteItemChange,
    onVoteItemDelete,
    onVoteItemMoveDown,
    onVoteItemMoveUp,
    onVoteItemSaveConfirmed,
    resetVotingForm,
    saveVoteItems,
} from './votingFormActions'
import OFPaper from '../../../baseComponents/OFPaper'
import VotingFormFooter from './VotingFormFooter'
import { VotingFormTranslationTip } from './VotingFormTranslationTip'
import {
    getSortedVoteItemsSelector,
    isSavingVotingFormSelector,
    shouldConfirmSaveSelector,
} from './votingFormSelectors'
import { getLanguagesSelector } from '../../core/projectSelectors'
import { useTranslation } from 'react-i18next'

const VotingForm = () => {
    const dispatch = useDispatch()
    const voteItems = useSelector(getSortedVoteItemsSelector)
    const isSaving = useSelector(isSavingVotingFormSelector)
    const languages = useSelector(getLanguagesSelector)
    const shouldConfirmSave = useSelector(shouldConfirmSaveSelector)
    const { t } = useTranslation()

    useEffect(() => {
        dispatch(getVoteItems())
    }, [dispatch])

    return (
        <>
            <VotingFormTranslationTip />
            <OFPaper>
                <VoteItemList
                    voteItems={voteItems}
                    isSaving={isSaving}
                    languages={languages}
                    shouldConfirmSave={shouldConfirmSave}
                    save={() => dispatch(saveVoteItems())}
                    onVoteItemChange={(values) =>
                        dispatch(onVoteItemChange(values))
                    }
                    setShouldConfirmSave={() =>
                        dispatch(onVoteItemSaveConfirmed())
                    }
                    addVoteItem={(optionalName, type) =>
                        dispatch(addVoteItem(optionalName, type))
                    }
                    onVoteItemMoveDown={(item) =>
                        dispatch(onVoteItemMoveDown(item))
                    }
                    onVoteItemMoveUp={(item) =>
                        dispatch(onVoteItemMoveUp(item))
                    }
                    onVoteItemDelete={(item) =>
                        dispatch(onVoteItemDelete(item))
                    }
                />
            </OFPaper>
            <VotingFormFooter
                onResetPress={() => dispatch(resetVotingForm(t))}
            />
        </>
    )
}

export default VotingForm
