import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TalkListItem from './TalkListItem'
import {
    getFilteredTalksSelector,
    getTalksFilterSelector,
    getTagsSelector,
    getTracksSelector,
} from '../../../core/talks/talksSelectors'
import { setTalksFilter } from '../../../core/talks/talksActions'
import {
    getSpeakersAsArraySelector,
    getSpeakersListSelector,
} from '../../../core/speakers/speakerSelectors'
import Grid from '@material-ui/core/Grid'
import OFListHeader from '../../baseComponents/layouts/OFListHeader'
import { addTalk, editTalk, removeTalk } from '../../../core/talks/talksActions'
import { projectApi } from '../../../core/setupType/projectApi'
import { addNotification } from '../../notification/notifcationActions'
import TalkAddEditPanel from './TalkAddEditPanel'
import moment from 'moment'
import { addSpeaker } from '../../../core/speakers/speakerActions'
import { useTranslation } from 'react-i18next'

const TalkList = () => {
    const dispatch = useDispatch()
    const talks = useSelector(getFilteredTalksSelector)
    const speakersMap = useSelector(getSpeakersListSelector)
    const speakersArray = useSelector(getSpeakersAsArraySelector)
    const filter = useSelector(getTalksFilterSelector)
    const tags = useSelector(getTagsSelector)
    const tracks = useSelector(getTracksSelector)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const [editingTalk, setEditTalk] = useState(null)
    const { t } = useTranslation()

    const talkNotReadableCheck = () => {
        if (projectApi.isReadOnly()) {
            dispatch(
                addNotification({
                    type: 'error',
                    message: t('talks.cannotChange'),
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
            speakers: talk
                ? talk.speakers.map(id =>
                      speakersMap[id] ? speakersMap[id] : { id: id, name: id }
                  )
                : [],
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
                buttonText={t('talks.addTalks')}
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
                    speakers={speakersMap}
                    onEdit={onEditTalkClicked}
                    onRemove={onRemoveTalkClicked}
                    onSpeakerClicked={speakerName =>
                        dispatch(setTalksFilter(speakerName))
                    }
                />
            ))}
        </Grid>
    )
}

export default TalkList
