import { useState } from 'react'
import { SpeakerListItem } from './SpeakerListItem.tsx'
import { useAppDispatch, useAppSelector } from '../../../store'
import {
    getFilteredSpeakers,
    getSpeakersFilter,
} from '../../../core/speakers/speakerSelectors'
import {
    addSpeaker,
    editSpeaker,
    filterSpeakers,
    removeSpeaker,
} from '../../../core/speakers/speakerActions'
import Grid from '@mui/material/Grid'
import { OFListHeader } from '../../baseComponents/layouts/OFListHeader.tsx'
import { SpeakerAddEditPanel } from './SpeakerAddEditPanel.tsx'
import { projectApi } from '../../../core/setupType/projectApi'
import { addNotification } from '../../notification/notifcationActions'
import { useTranslation } from 'react-i18next'
import { getTalks } from '../../../core/talks/talksActions'
import { filterMap, isEmptyMap } from '../../../utils/mapUtils'
import { SimpleDialog } from '../../baseComponents/layouts/SimpleDialog.tsx'
import { TranslatedTypography } from '../../baseComponents/TranslatedTypography.tsx'
import type { Speaker, TalksMap } from '../../../core/models'

interface SpeakerToRemoveData {
    speaker: Speaker
    /** Talks using the speaker, keyed by talk id. */
    linkedTalks: TalksMap
}

export const SpeakerList = () => {
    const dispatch = useAppDispatch()
    const speakers = useAppSelector(getFilteredSpeakers)
    const filter = useAppSelector(getSpeakersFilter)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const [editingSpeaker, setEditSpeaker] = useState<Speaker | null>(null)
    const [speakerToRemoveData, setSpeakerToRemoveData] =
        useState<SpeakerToRemoveData | null>()
    const [isRemovingSpeaker, setIsRemovingSpeaker] = useState(false)
    const { t } = useTranslation()

    const speakerNotReadableCheck = () => {
        if (projectApi.isReadOnly()) {
            dispatch(
                addNotification({
                    type: 'error',
                    message: t('speakers.cannotChange'),
                })
            )
            return true
        }
        return false
    }

    const onAddSpeakerClicked = () => {
        if (speakerNotReadableCheck()) return
        setSidePanelOpen(true)
    }

    const onEditSpeakerClicked = (speaker: Speaker) => {
        if (speakerNotReadableCheck()) return
        setEditSpeaker(speaker)
        setSidePanelOpen(true)
    }

    const onRemoveSpeakerClicked = async (speaker: Speaker) => {
        if (speakerNotReadableCheck()) return

        const talks = await dispatch(getTalks())
        if (!talks) {
            // Talks failed to load (already notified): the usage is unknown
            return
        }
        const linkedTalks = filterMap(
            talks,
            (talk) => talk.speakers && talk.speakers.includes(speaker.id)
        )
        const isUsed = !isEmptyMap(linkedTalks)

        if (!isUsed) {
            dispatch(removeSpeaker(speaker))
            return
        }
        setSpeakerToRemoveData({
            speaker,
            linkedTalks,
        })
    }

    const maybeCloseSidePanel = (shouldContinueAfterSubmit?: boolean) => {
        if (shouldContinueAfterSubmit) {
            return
        }
        setSidePanelOpen(false)
        setEditSpeaker(null)
    }

    return (
        <>
            <OFListHeader
                filterValue={filter}
                filterChange={(value: string) =>
                    dispatch(filterSpeakers(value))
                }
                buttonClick={onAddSpeakerClicked}
                buttonText={t('speakers.addButton')}
            />

            <SpeakerAddEditPanel
                isOpen={sidePanelOpen}
                speaker={editingSpeaker}
                onClose={() => maybeCloseSidePanel()}
                onSubmit={(speaker, shouldContinueAfterSubmit) => {
                    if (editingSpeaker) {
                        // The form values hold the edited speaker id
                        return dispatch(
                            editSpeaker({ ...speaker, id: editingSpeaker.id })
                        ).then(() =>
                            maybeCloseSidePanel(shouldContinueAfterSubmit)
                        )
                    }
                    return dispatch(addSpeaker(speaker)).then(() =>
                        maybeCloseSidePanel(shouldContinueAfterSubmit)
                    )
                }}
            />

            <SimpleDialog
                onClose={() => setSpeakerToRemoveData(null)}
                onConfirm={() => {
                    // The dialog is only open while a speaker is selected
                    if (!speakerToRemoveData) {
                        return
                    }
                    dispatch(removeSpeaker(speakerToRemoveData.speaker)).then(
                        () => {
                            setSpeakerToRemoveData(null)
                            setIsRemovingSpeaker(false)
                        }
                    )
                }}
                title={t('speakers.removeConfirmTitle')}
                cancelText={t('common.cancel')}
                confirmText={t('speakers.removeConfirmButton')}
                confirmLoading={isRemovingSpeaker}
                open={!!speakerToRemoveData}
            >
                <TranslatedTypography i18nKey="speakers.removeConfirmDesc" />
                {speakerToRemoveData &&
                    Object.keys(speakerToRemoveData.linkedTalks).map(
                        (talkId) => {
                            return (
                                <li key={talkId}>
                                    {
                                        speakerToRemoveData.linkedTalks[talkId]
                                            .title
                                    }
                                </li>
                            )
                        }
                    )}
            </SimpleDialog>

            <Grid container component="ul">
                {speakers.map((speaker) => (
                    <SpeakerListItem
                        speaker={speaker}
                        key={speaker.id}
                        onEdit={onEditSpeakerClicked}
                        onRemove={onRemoveSpeakerClicked}
                    />
                ))}
            </Grid>
        </>
    )
}
