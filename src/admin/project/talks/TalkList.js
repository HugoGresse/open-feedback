import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TalkListItem from './TalkListItem'
import {
    getFilteredSessionsSelector,
    getSessionsFilterSelector,
} from '../../../core/sessions/sessionsSelectors'
import { setTalksFilter } from '../../../core/sessions/sessionsActions'
import { getSpeakersListSelector } from '../../../core/speakers/speakerSelectors'
import Grid from '@material-ui/core/Grid'
import OFListHeader from '../../baseComponents/layouts/OFListHeader'
import {
    addTalk,
    editTalk,
    removeTalk,
} from '../../../core/sessions/sessionsActions'
import { projectApi } from '../../../core/setupType/projectApi'
import { addNotification } from '../../notification/notifcationActions'
import TalkAddEditPanel from './TalkAddEditPanel'
import moment from 'moment'

const TalkList = () => {
    const dispatch = useDispatch()
    const talks = useSelector(getFilteredSessionsSelector)
    const speakers = useSelector(getSpeakersListSelector)
    const filter = useSelector(getSessionsFilterSelector)
    const [sidePanelOpen, setSidePanelOpen] = useState(true)
    const [editingTalk, setEditTalk] = useState(null)

    const talkNotReadableCheck = () => {
        if (projectApi.isReadOnly()) {
            dispatch(
                addNotification({
                    type: 'error',
                    message:
                        'Talks cannot be changed from OpenFeedback itself for this project. Refer to your external services configuration to do so.',
                })
            )
            return true
        }
        return false
    }

    const onAddTalkClicked = () => {
        if (talkNotReadableCheck()) return
        setSidePanelOpen(true)
    }

    const onEditTalkClicked = speaker => {
        if (talkNotReadableCheck()) return
        setEditTalk(speaker)
        setSidePanelOpen(true)
    }

    const onRemoveTalkClicked = speaker => {
        if (talkNotReadableCheck()) return
        dispatch(removeTalk(speaker))
    }

    const maybeCloseSidePanel = shouldContinueAfterSubmit => {
        if (shouldContinueAfterSubmit) {
            return
        }
        setSidePanelOpen(false)
        setEditTalk(null)
    }

    const removeMomentFromSpeaker = speaker => ({
        ...speaker,
        startTime: moment(speaker.startTime).toISOString(),
        endTime: moment(speaker.endTime).toISOString(),
    })

    return (
        <Grid container>
            <OFListHeader
                filterValue={filter}
                filterChange={value => dispatch(setTalksFilter(value))}
                buttonProcessing={false}
                buttonClick={() => onAddTalkClicked()}
                buttonText="Add talks"
            />

            <TalkAddEditPanel
                isOpen={sidePanelOpen}
                talk={editingTalk}
                onClose={() => maybeCloseSidePanel()}
                onSubmit={(speaker, shouldContinueAfterSubmit) => {
                    const fixedSpeaker = removeMomentFromSpeaker(speaker)
                    if (editingTalk) {
                        return dispatch(editTalk(fixedSpeaker)).then(() =>
                            maybeCloseSidePanel(shouldContinueAfterSubmit)
                        )
                    }
                    return dispatch(addTalk(fixedSpeaker)).then(() =>
                        maybeCloseSidePanel(shouldContinueAfterSubmit)
                    )
                }}
            />

            {talks.map(talk => (
                <TalkListItem
                    item={talk}
                    key={talk.id}
                    speakers={talk.speakers.map(id => speakers[id])}
                    onEdit={onEditTalkClicked}
                    onRemove={onRemoveTalkClicked}
                />
            ))}
        </Grid>
    )
}

export default TalkList
