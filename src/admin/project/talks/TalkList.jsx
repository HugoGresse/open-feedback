import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import TalkListItem from './TalkListItem.jsx'
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
import Grid from '@mui/material/Grid'
import OFListHeader from '../../baseComponents/layouts/OFListHeader.jsx'
import { addTalk, editTalk, removeTalk } from '../../../core/talks/talksActions'
import { projectApi } from '../../../core/setupType/projectApi'
import { addNotification } from '../../notification/notifcationActions'
import TalkAddEditPanel from './TalkAddEditPanel.jsx'
import { addSpeaker } from '../../../core/speakers/speakerActions'
import { useTranslation } from 'react-i18next'
import {
    getSelectedProjectIdSelector,
    getStartTimeSelector,
} from '../core/projectSelectors'
import SimpleDialog from '../../baseComponents/layouts/SimpleDialog.jsx'
import Typography from '@mui/material/Typography'
import { getTalkVoteCount } from './talkVoteCount'

const TalkList = () => {
    const dispatch = useDispatch()
    const projectVoteStartTime = useSelector(getStartTimeSelector)
    const projectId = useSelector(getSelectedProjectIdSelector)
    const talks = useSelector(getFilteredTalksSelector)
    const speakersMap = useSelector(getSpeakersListSelector)
    const speakersArray = useSelector(getSpeakersAsArraySelector)
    const filter = useSelector(getTalksFilterSelector)
    const tags = useSelector(getTagsSelector)
    const tracks = useSelector(getTracksSelector)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const [editingTalk, setEditTalk] = useState(null)
    const [talkToRemove, setTalkToRemove] = useState(null)
    const [isRemovingTalk, setIsRemovingTalk] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        return () => {
            dispatch(setTalksFilter(null))
        }
    }, [dispatch])

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
        setEditTalk(null)
        setSidePanelOpen(true)
    }

    const onEditTalkClicked = (talk) => {
        if (talkNotReadableCheck()) return
        setEditTalk({
            ...talk,
            startTime: DateTime.fromISO(talk.startTime),
            endTime: DateTime.fromISO(talk.endTime),
            speakers: talk
                ? talk.speakers.map((id) =>
                      speakersMap[id] ? speakersMap[id] : { id: id, name: id }
                  )
                : [],
        })
        setSidePanelOpen(true)
    }

    const onRemoveTalkClicked = async (talk) => {
        if (talkNotReadableCheck()) return
        // Unknown vote count (read failed) still asks for confirmation.
        const voteCount = await getTalkVoteCount(projectId, talk.id).catch(
            () => null
        )
        if (voteCount === 0) {
            dispatch(removeTalk(talk))
            return
        }
        setTalkToRemove({ talk, voteCount })
    }

    const onRemoveTalkConfirmed = () => {
        setIsRemovingTalk(true)
        dispatch(removeTalk(talkToRemove.talk)).then(() => {
            setIsRemovingTalk(false)
            setTalkToRemove(null)
        })
    }

    const maybeCloseSidePanel = (shouldContinueAfterSubmit) => {
        if (shouldContinueAfterSubmit) {
            return
        }
        setSidePanelOpen(false)
    }

    const reformatTalk = (talk) => ({
        ...talk,
        startTime: DateTime.fromISO(talk.startTime).toISO(),
        endTime: DateTime.fromISO(talk.endTime).toISO(),
        speakers: talk.speakers.map((speaker) => speaker.id),
    })

    return (
        <>
            <OFListHeader
                filterValue={filter}
                filterChange={(value) => dispatch(setTalksFilter(value))}
                buttonProcessing={false}
                buttonClick={() => onAddTalkClicked()}
                buttonText={t('talks.addTalks')}
            />

            <SimpleDialog
                onClose={() => setTalkToRemove(null)}
                onConfirm={onRemoveTalkConfirmed}
                title={t('talks.removeConfirmTitle')}
                cancelText={t('common.cancel')}
                confirmText={t('talks.removeConfirmButton')}
                confirmLoading={isRemovingTalk}
                open={!!talkToRemove}>
                {talkToRemove && (
                    <Typography>
                        {talkToRemove.voteCount === null
                            ? t('talks.removeConfirmDescUnknown', {
                                  title: talkToRemove.talk.title,
                              })
                            : t('talks.removeConfirmDesc', {
                                  title: talkToRemove.talk.title,
                                  count: talkToRemove.voteCount,
                              })}
                    </Typography>
                )}
            </SimpleDialog>

            <Grid container component="ul">
                <TalkAddEditPanel
                    isOpen={sidePanelOpen}
                    projectVoteStartTime={projectVoteStartTime}
                    talk={editingTalk}
                    existingTags={tags}
                    existingTracks={tracks}
                    existingSpeakers={speakersArray}
                    onClose={() => maybeCloseSidePanel()}
                    onSpeakerAdd={(speaker) => dispatch(addSpeaker(speaker))}
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

                {talks.map((talk) => (
                    <TalkListItem
                        item={talk}
                        key={talk.id}
                        speakers={speakersMap}
                        onEdit={onEditTalkClicked}
                        onRemove={onRemoveTalkClicked}
                        onSpeakerClicked={(speakerName) =>
                            dispatch(setTalksFilter(speakerName))
                        }
                    />
                ))}
            </Grid>
        </>
    )
}

export default TalkList
