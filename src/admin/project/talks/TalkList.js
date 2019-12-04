import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import TalkListItem from './TalkListItem'
import {
    getFilteredSessionsSelector,
    getSessionsFilterSelector,
    getTagsSelector,
    getTracksSelector,
} from '../../../core/sessions/sessionsSelectors'
import { setTalksFilter } from '../../../core/sessions/sessionsActions'
import {
    getSpeakersAsArraySelector,
    getSpeakersListSelector,
} from '../../../core/speakers/speakerSelectors'
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
import { addSpeaker } from '../../../core/speakers/speakerActions'

const TalkList = () => {
    const dispatch = useDispatch()
    const talks = useSelector(getFilteredSessionsSelector)
    const speakersMap = useSelector(getSpeakersListSelector)
    const speakersArray = useSelector(getSpeakersAsArraySelector)
    const filter = useSelector(getSessionsFilterSelector)
    const tags = useSelector(getTagsSelector)
    const tracks = useSelector(getTracksSelector)
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

    const onEditTalkClicked = talk => {
        if (talkNotReadableCheck()) return
        setEditTalk({
            ...talk,
            speakers: talk ? talk.speakers.map(id => speakersMap[id]) : [],
        })
        setSidePanelOpen(true)
    }

    const onRemoveTalkClicked = talk => {
        if (talkNotReadableCheck()) return
        dispatch(removeTalk(talk))
    }

    const maybeCloseSidePanel = shouldContinueAfterSubmit => {
        if (shouldContinueAfterSubmit) {
            return
        }
        setSidePanelOpen(false)
        setEditTalk(null)
    }

    const reformatTalk = talk => ({
        ...talk,
        startTime: moment(talk.startTime).toISOString(),
        endTime: moment(talk.endTime).toISOString(),
        speakers: talk.speakers.map(speaker => speaker.id),
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
                existingTags={tags}
                existingTracks={tracks}
                existingSpeakers={speakersArray}
                onClose={() => maybeCloseSidePanel()}
                onSpeakerAdd={speaker => dispatch(addSpeaker(speaker))}
                onSubmit={(talk, shouldContinueAfterSubmit) => {
                    const fixedTalk = reformatTalk(talk)
                    if (editingTalk) {
                        return dispatch(editTalk(fixedTalk)).then(() =>
                            maybeCloseSidePanel(shouldContinueAfterSubmit)
                        )
                    }
                    return dispatch(addTalk(fixedTalk)).then(() =>
                        maybeCloseSidePanel(shouldContinueAfterSubmit)
                    )
                }}
            />

            {talks.map(talk => (
                <TalkListItem
                    item={talk}
                    key={talk.id}
                    speakers={
                        isEmpty(speakersMap)
                            ? []
                            : talk.speakers.map(id => speakersMap[id])
                    }
                    onEdit={onEditTalkClicked}
                    onRemove={onRemoveTalkClicked}
                />
            ))}
        </Grid>
    )
}

export default TalkList
