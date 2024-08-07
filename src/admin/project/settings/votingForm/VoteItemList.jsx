import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import VoteItem from './VoteItem.jsx'
import { useDispatch, useSelector } from 'react-redux'
import {
    getSortedVoteItemsSelector,
    shouldConfirmSaveSelector,
    isSavingVotingFormSelector,
} from './votingFormSelectors'
import {
    addVoteItem,
    onVoteItemChange,
    onVoteItemDelete,
    onVoteItemMoveDown,
    onVoteItemMoveUp,
    onVoteItemSaveConfirmed,
    saveVoteItems,
} from './votingFormActions.jsx'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import OFListHeader from '../../../baseComponents/layouts/OFListHeader.jsx'
import OFListItem from '../../../baseComponents/layouts/OFListItem.jsx'
import { useTranslation } from 'react-i18next'
import { VOTE_TYPE_BOOLEAN } from '../../../../core/contants'
import SimpleDialog from '../../../baseComponents/layouts/SimpleDialog.jsx'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography.jsx'
import { useHotkeys } from 'react-hotkeys-hook'
import OFButton from '../../../baseComponents/button/OFButton.jsx'

const VoteItemList = ({ languages, selectedProjectOrOrganizationId }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const voteItems = useSelector(getSortedVoteItemsSelector)
    const isSaving = useSelector(isSavingVotingFormSelector)
    const shouldConfirmSave = useSelector(shouldConfirmSaveSelector)
    const [focusId, setFocusId] = useState()
    const [isTypeChangeDialogOpen, setTypeChangedDialog] = useState(false)
    useHotkeys('ctrl+s, command+s', (event) => {
        event.preventDefault()
        save()
    })

    const save = (bypassConfirm) => {
        if (shouldConfirmSave && !bypassConfirm) {
            setTypeChangedDialog(true)
            return
        }
        dispatch(saveVoteItems(selectedProjectOrOrganizationId))
        setFocusId()
    }

    return (
        <>
            <OFListHeader
                title={t('settingsVotingForm.title')}
                disableFilter={true}
                buttonProcessing={isSaving}
                buttonClick={save}
                buttonText={t('common.save')}
            />

            <Grid container component="ul" spacing={1}>
                {voteItems.map((item, index) => (
                    <VoteItem
                        key={item.id}
                        item={item}
                        languages={languages}
                        onChange={(newValue) =>
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
                        onTypeChange={(type) =>
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
                        onEnterPressed={() => {
                            if (index >= voteItems.length - 1) {
                                dispatch(
                                    addVoteItem(undefined, VOTE_TYPE_BOOLEAN)
                                )
                            } else {
                                setFocusId(voteItems[index + 1].id)
                            }
                        }}
                    />
                ))}
                <OFListItem
                    style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        justifyContent: 'space-between',
                    }}>
                    <Button
                        aria-label="new vote item"
                        onClick={() =>
                            dispatch(addVoteItem(undefined, VOTE_TYPE_BOOLEAN))
                        }>
                        <AddIcon style={{ marginRight: 6 }} />
                        {t('settingsVotingForm.new')}
                    </Button>
                    <OFButton onClick={save} disabled={isSaving}>
                        {t('common.save')}
                    </OFButton>
                </OFListItem>
            </Grid>

            <SimpleDialog
                onClose={() => setTypeChangedDialog(false)}
                onConfirm={() => {
                    setTypeChangedDialog(false)
                    dispatch(onVoteItemSaveConfirmed())
                    save(true)
                }}
                title={t('settingsVotingForm.typeChangeDialogTitle')}
                cancelText={t('common.cancel')}
                confirmText={t('settingsVotingForm.typeChangeDialogConfirm')}
                open={isTypeChangeDialogOpen}>
                <TranslatedTypography i18nKey="settingsVotingForm.typeChangeDialogDesc" />
            </SimpleDialog>
        </>
    )
}

export default VoteItemList
