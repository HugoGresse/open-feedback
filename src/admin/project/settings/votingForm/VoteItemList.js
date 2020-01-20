import React from 'react'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import VoteItem from './VoteItem'
import { useDispatch, useSelector } from 'react-redux'
import {
    getBooleanVoteItemsSelector,
    isSavingSelector,
} from './votingFormSelectors'
import {
    onVoteItemAddBoolean,
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

const VoteItemList = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const voteItems = useSelector(getBooleanVoteItemsSelector)
    const isSaving = useSelector(isSavingSelector)

    return (
        <Grid container>
            <OFListHeader
                title={t('settingsVotingForm.title')}
                disableFilter={true}
                buttonProcessing={isSaving}
                buttonClick={() => dispatch(saveVoteItems())}
                buttonText={t('common.save')}
            />
            {voteItems.map(item => (
                <VoteItem
                    key={item.id}
                    item={item}
                    onChange={newValue =>
                        dispatch(
                            onVoteItemChange({
                                ...item,
                                name: newValue,
                            })
                        )
                    }
                    onMoveUp={() => dispatch(onVoteItemMoveUp(item))}
                    onMoveDown={() => dispatch(onVoteItemMoveDown(item))}
                    onDelete={() => dispatch(onVoteItemDelete(item))}
                    onEnterPressed={() => dispatch(onVoteItemAddBoolean())}
                />
            ))}
            <OFListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
                <Button
                    aria-label="new vote item"
                    onClick={() => dispatch(onVoteItemAddBoolean())}>
                    <AddIcon style={{ marginRight: 6 }} />
                    {t('settingsVotingForm.new')}
                </Button>
            </OFListItem>
        </Grid>
    )
}

export default VoteItemList
