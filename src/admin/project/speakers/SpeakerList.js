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

const SpeakerList = () => {
    const dispatch = useDispatch()
    const speakers = useSelector(getFilteredSpeakers)
    const filter = useSelector(getSpeakersFilter)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const [editingSpeaker, setEditSpeaker] = useState(null)

    const speakerNotReadableCheck = () => {
        if (projectApi.isReadOnly()) {
            dispatch(
                addNotification({
                    type: 'error',
                    message:
                        'Speakers cannot be changed from OpenFeedback itself for this project. Refer to your external services configuration to do so.',
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

    const onRemoveSpeakerClicked = speaker => {
        if (speakerNotReadableCheck()) return
        dispatch(removeSpeaker(speaker))
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
                buttonText="Add speaker"
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
        </Grid>
    )
}

export default SpeakerList
