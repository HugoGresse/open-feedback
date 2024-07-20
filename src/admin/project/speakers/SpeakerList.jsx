import React, { useState } from 'react'
import SpeakerListItem from './SpeakerListItem.jsx'
import { useDispatch, useSelector } from 'react-redux'
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
import OFListHeader from '../../baseComponents/layouts/OFListHeader.jsx'
import SpeakerAddEditPanel from './SpeakerAddEditPanel.jsx'
import { projectApi } from '../../../core/setupType/projectApi'
import { addNotification } from '../../notification/notifcationActions'
import { useTranslation } from 'react-i18next'
import { getTalks } from '../../../core/talks/talksActions'
import { filterMap, isEmptyMap } from '../../../utils/mapUtils'
import SimpleDialog from '../../baseComponents/layouts/SimpleDialog.jsx'
import TranslatedTypography from '../../baseComponents/TranslatedTypography.jsx'

const SpeakerList = () => {
    const dispatch = useDispatch()
    const speakers = useSelector(getFilteredSpeakers)
    const filter = useSelector(getSpeakersFilter)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const [editingSpeaker, setEditSpeaker] = useState(null)
    const [speakerToRemoveData, setSpeakerToRemoveData] = useState()
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

    const onEditSpeakerClicked = (speaker) => {
        if (speakerNotReadableCheck()) return
        setEditSpeaker(speaker)
        setSidePanelOpen(true)
    }

    const onRemoveSpeakerClicked = async (speaker) => {
        if (speakerNotReadableCheck()) return

        const talks = await dispatch(getTalks())
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

    const maybeCloseSidePanel = (shouldContinueAfterSubmit) => {
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
                filterChange={(value) => dispatch(filterSpeakers(value))}
                buttonClick={onAddSpeakerClicked}
                buttonText={t('speakers.addButton')}
            />

            <SpeakerAddEditPanel
                isOpen={sidePanelOpen}
                speaker={editingSpeaker}
                onClose={() => maybeCloseSidePanel()}
                onSubmit={(speaker, shouldContinueAfterSubmit) => {
                    if (editingSpeaker) {
                        return dispatch(editSpeaker(speaker)).then(() =>
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
                open={!!speakerToRemoveData}>
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

export default SpeakerList
