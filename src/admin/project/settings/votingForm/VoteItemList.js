import React, { useState } from 'react'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import VoteItem from './VoteItem'
import { useDispatch, useSelector } from 'react-redux'
import {
    getSortedVoteItemsSelector,
    isSavingSelector,
} from './votingFormSelectors'
import {
    addVoteItem,
    onVoteItemChange,
    onVoteItemDelete,
    onVoteItemMoveDown,
    onVoteItemMoveUp,
    saveVoteItems,
} from './votingFormActions'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import OFListHeader from '../../../baseComponents/layouts/OFListHeader'
import OFListItem from '../../../baseComponents/layouts/OFListItem'
import { useTranslation } from 'react-i18next'
import { VOTE_TYPE_BOOLEAN } from '../../../../core/contants'
import { getLanguagesSelector } from '../../core/projectSelectors'

const VoteItemList = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const voteItems = useSelector(getSortedVoteItemsSelector)
    const isSaving = useSelector(isSavingSelector)
    const languages = useSelector(getLanguagesSelector)
    const [focusId, setFocusId] = useState()

    return (
        <Grid container>
            <OFListHeader
                title={t('settingsVotingForm.title')}
                disableFilter={true}
                buttonProcessing={isSaving}
                buttonClick={() => dispatch(saveVoteItems())}
                buttonText={t('common.save')}
            />
            {voteItems.map((item, index) => (
                <VoteItem
                    key={item.id}
                    item={item}
                    languages={languages}
                    onChange={newValue =>
                        dispatch(
                            onVoteItemChange({
                                ...item,
                                name: newValue,
                            })
                        )
                    }
                    onLanguagesChange={(langTag, value) => {
                        dispatch(
                            onVoteItemChange({
                                ...item,
                                languages: {
                                    ...item.languages,
                                    [langTag]: value,
                                },
                            })
                        )
                    }}
                    onTypeChange={type =>
                        dispatch(
                            onVoteItemChange({
                                ...item,
                                type,
                            })
                        )
                    }
                    onMoveUp={() => dispatch(onVoteItemMoveUp(item))}
                    onMoveDown={() => dispatch(onVoteItemMoveDown(item))}
                    onDelete={() => dispatch(onVoteItemDelete(item))}
                    onFocus={() => setFocusId(item.id)}
                    focusId={focusId}
                    onEnterPressed={voteItem => {
                        console.log(index, voteItems.length)
                        if (index >= voteItems.length - 1) {
                            dispatch(addVoteItem(undefined, VOTE_TYPE_BOOLEAN))
                        } else {
                            setFocusId(voteItems[index + 1].id)
                        }
                    }}
                />
            ))}
            <OFListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
                <Button
                    aria-label="new vote item"
                    onClick={() =>
                        dispatch(addVoteItem(undefined, VOTE_TYPE_BOOLEAN))
                    }>
                    <AddIcon style={{ marginRight: 6 }} />
                    {t('settingsVotingForm.new')}
                </Button>
            </OFListItem>
        </Grid>
    )
}

export default VoteItemList
