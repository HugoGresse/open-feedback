import React, { useState } from 'react'
import SpeakerListItem from './SpeakerListItem'
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
import Grid from '@material-ui/core/Grid'
import OFListHeader from '../../baseComponents/layouts/OFListHeader'
import SpeakerAddEditPanel from './SpeakerAddEditPanel'
import { projectApi } from '../../../core/setupType/projectApi'
import { addNotification } from '../../notification/notifcationActions'
import { useTranslation } from 'react-i18next'
import { getTalks } from '../../../core/talks/talksActions'
import { filterMap, isEmptyMap } from '../../../utils/mapUtils'
import SimpleDialog from '../../baseComponents/layouts/SimpleDialog'
import TranslatedTypography from '../../baseComponents/TranslatedTypography'

const SpeakerList = () => {
    const dispatch = useDispatch()
    const speakers = useSelector(getFilteredSpeakers)
    const filter = useSelector(getSpeakersFilter)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const [editingSpeaker, setEditSpeaker] = useState(null)
    const [speakerToRemove, setSpeakerToRemove] = useState()
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

    const onEditSpeakerClicked = speaker => {
        if (speakerNotReadableCheck()) return
        setEditSpeaker(speaker)
        setSidePanelOpen(true)
    }

    const onRemoveSpeakerClicked = async speaker => {
        if (speakerNotReadableCheck()) return

        const talks = await dispatch(getTalks())
        const isUsed = !isEmptyMap(
            filterMap(
                talks,
                talk => talk.speakers && talk.speakers.includes(speaker.id)
            )
        )

        if (!isUsed) {
            dispatch(removeSpeaker(speaker))
            return
        }
        setSpeakerToRemove(speaker)
    }

    const maybeCloseSidePanel = shouldContinueAfterSubmit => {
        if (shouldContinueAfterSubmit) {
            return
        }
        setSidePanelOpen(false)
        setEditSpeaker(null)
    }

    return (
        <Grid container>
            <OFListHeader
                filterValue={filter}
                filterChange={value => dispatch(filterSpeakers(value))}
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

            {speakers.map(speaker => (
                <SpeakerListItem
                    speaker={speaker}
                    key={speaker.id}
                    onEdit={onEditSpeakerClicked}
                    onRemove={onRemoveSpeakerClicked}
                />
            ))}

            <SimpleDialog
                onClose={() => setSpeakerToRemove(null)}
                onConfirm={() => {
                    dispatch(removeSpeaker(speakerToRemove)).then(() => {
                        setSpeakerToRemove(null)
                        setIsRemovingSpeaker(false)
                    })
                }}
                title={t('speakers.removeConfirmTitle')}
                cancelText={t('common.cancel')}
                confirmText={t('speakers.removeConfirmButton')}
                confirmLoading={isRemovingSpeaker}
                open={!!speakerToRemove}>
                <TranslatedTypography i18nKey="speakers.removeConfirmDesc" />
            </SimpleDialog>
        </Grid>
    )
}

export default SpeakerList
