import React, { useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import VoteItem, { VoteItemType } from './VoteItem.tsx'
import { useDispatch, useSelector } from 'react-redux'
import {
    getSortedVoteItemsSelector,
    shouldConfirmSaveSelector,
    isSavingVotingFormSelector,
    // @ts-expect-error - JS module without types
} from './votingFormSelectors'
import {
    addVoteItem,
    onVoteItemChange,
    onVoteItemDelete,
    onVoteItemSaveConfirmed,
    onVoteItemsReorder,
    saveVoteItems,
    // @ts-expect-error - JS module without types
} from './votingFormActions'
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    KeyboardSensor,
    MouseSensor,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
// @ts-expect-error - JS module without types
import OFListHeader from '../../../baseComponents/layouts/OFListHeader'
import OFListItem from '../../../baseComponents/layouts/OFListItem.tsx'
import { useTranslation } from 'react-i18next'
// @ts-expect-error - JS module without types
import { VOTE_TYPE_BOOLEAN } from '../../../../core/contants'
// @ts-expect-error - JS module without types
import SimpleDialog from '../../../baseComponents/layouts/SimpleDialog'
// @ts-expect-error - JS module without types
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'
import { useHotkeys } from 'react-hotkeys-hook'
// @ts-expect-error - JS module without types
import OFButton from '../../../baseComponents/button/OFButton'

export interface VoteItemListProps {
    languages: string[]
}

const VoteItemList: React.FC<VoteItemListProps> = ({ languages }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const voteItems: VoteItemType[] = useSelector(getSortedVoteItemsSelector)
    const isSaving: boolean = useSelector(isSavingVotingFormSelector)
    const shouldConfirmSave: boolean = useSelector(shouldConfirmSaveSelector)
    const [focusId, setFocusId] = useState<string | undefined>()
    const [isTypeChangeDialogOpen, setTypeChangedDialog] =
        useState<boolean>(false)
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(MouseSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )
    useHotkeys('ctrl+s, command+s', (event) => {
        event.preventDefault()
        save()
    })

    const save = (bypassConfirm?: boolean): void => {
        if (shouldConfirmSave && !bypassConfirm) {
            setTypeChangedDialog(true)
            return
        }
        dispatch(saveVoteItems())
        setFocusId(undefined)
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id && over) {
            dispatch(
                onVoteItemsReorder(active.id as string, over?.id as string)
            )
        }

        setActiveId(null)
    }

    const activeVoteItem = useMemo(() => {
        if (!activeId) {
            return undefined
        }
        return voteItems.find((item) => item.id === activeId)
    }, [voteItems, activeId])

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
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={voteItems.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}>
                        {voteItems.map((item, index) => (
                            <VoteItem
                                key={item.id}
                                id={item.id}
                                item={item}
                                languages={languages}
                                onChange={(newValue: string) =>
                                    dispatch(
                                        onVoteItemChange({
                                            ...item,
                                            name: newValue,
                                        })
                                    )
                                }
                                onLanguagesChange={(
                                    langTag: string,
                                    value: string
                                ) => {
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
                                onTypeChange={(type: string) =>
                                    dispatch(
                                        onVoteItemChange({
                                            ...item,
                                            type,
                                        })
                                    )
                                }
                                onDelete={() =>
                                    dispatch(onVoteItemDelete(item))
                                }
                                onFocus={() => setFocusId(item.id)}
                                focusId={focusId}
                                onEnterPressed={() => {
                                    if (index >= voteItems.length - 1) {
                                        dispatch(
                                            addVoteItem(
                                                undefined,
                                                VOTE_TYPE_BOOLEAN
                                            )
                                        )
                                    } else {
                                        setFocusId(voteItems[index + 1].id)
                                    }
                                }}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeVoteItem && activeId ? (
                            <VoteItem
                                id={activeId}
                                item={activeVoteItem}
                                languages={languages}
                                onChange={() => {}}
                                onLanguagesChange={() => {}}
                                onTypeChange={() => {}}
                                onDelete={() => {}}
                                onFocus={() => {}}
                                focusId={undefined}
                                onEnterPressed={() => {}}
                                noBorderBottom={true}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>

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
