import React, { useState } from 'react'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import VoteItem from './VoteItem'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import OFListHeader from '../../../baseComponents/layouts/OFListHeader'
import OFListItem from '../../../baseComponents/layouts/OFListItem'
import { useTranslation } from 'react-i18next'
import { VOTE_TYPE_BOOLEAN } from '../../../../core/contants'
import SimpleDialog from '../../../baseComponents/layouts/SimpleDialog'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'
import { useHotkeys } from 'react-hotkeys-hook'
import OFButton from '../../../baseComponents/button/OFButton'

const VoteItemList = ({
    voteItems,
    isSaving,
    languages,
    shouldConfirmSave,
    setShouldConfirmSave,
    save,
    onVoteItemChange,
    onVoteItemMoveUp,
    onVoteItemMoveDown,
    onVoteItemDelete,
    addVoteItem,
}) => {
    const { t } = useTranslation()
    const [focusId, setFocusId] = useState()

    const [isTypeChangeDialogOpen, setTypeChangedDialog] = useState(false)
    useHotkeys('ctrl+s, command+s', (event) => {
        event.preventDefault()
        onSave()
    })

    const onSave = (bypassConfirm) => {
        if (shouldConfirmSave && !bypassConfirm) {
            setTypeChangedDialog(true)
            return
        }
        save()
        setFocusId()
    }

    return (
        <Grid container>
            <OFListHeader
                title={t('settingsVotingForm.title')}
                disableFilter={true}
                buttonProcessing={isSaving}
                buttonClick={onSave}
                buttonText={t('common.save')}
            />
            {voteItems.map((item, index) => (
                <VoteItem
                    key={item.id}
                    item={item}
                    languages={languages}
                    onChange={(newValue) =>
                        onVoteItemChange({
                            ...item,
                            name: newValue,
                        })
                    }
                    onLanguagesChange={(langTag, value) =>
                        onVoteItemChange({
                            ...item,
                            languages: {
                                ...item.languages,
                                [langTag]: value,
                            },
                        })
                    }
                    onTypeChange={(type) =>
                        onVoteItemChange({
                            ...item,
                            type,
                        })
                    }
                    onMoveUp={() => onVoteItemMoveUp(item)}
                    onMoveDown={() => onVoteItemMoveDown(item)}
                    onDelete={() => onVoteItemDelete(item)}
                    onFocus={() => setFocusId(item.id)}
                    focusId={focusId}
                    onEnterPressed={() => {
                        if (index >= voteItems.length - 1) {
                            addVoteItem(undefined, VOTE_TYPE_BOOLEAN)
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
                    onClick={() => addVoteItem(undefined, VOTE_TYPE_BOOLEAN)}>
                    <AddIcon style={{ marginRight: 6 }} />
                    {t('settingsVotingForm.new')}
                </Button>
                <OFButton onClick={onSave} disabled={isSaving}>
                    {t('common.save')}
                </OFButton>
            </OFListItem>

            <SimpleDialog
                onClose={() => setTypeChangedDialog(false)}
                onConfirm={() => {
                    setTypeChangedDialog(false)
                    setShouldConfirmSave()
                    onSave(true)
                }}
                title={t('settingsVotingForm.typeChangeDialogTitle')}
                cancelText={t('common.cancel')}
                confirmText={t('settingsVotingForm.typeChangeDialogConfirm')}
                open={isTypeChangeDialogOpen}>
                <TranslatedTypography i18nKey="settingsVotingForm.typeChangeDialogDesc" />
            </SimpleDialog>
        </Grid>
    )
}

export default VoteItemList
