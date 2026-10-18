import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store'
import { DateTime } from 'luxon'
import { TalkListItem } from './TalkListItem.tsx'
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
import { OFListHeader } from '../../baseComponents/layouts/OFListHeader.tsx'
import { addTalk, editTalk } from '../../../core/talks/talksActions'
import { projectApi } from '../../../core/setupType/projectApi'
import { addNotification } from '../../notification/notifcationActions'
import { TalkAddEditPanel } from './TalkAddEditPanel.tsx'
import { addSpeaker } from '../../../core/speakers/speakerActions'
import { useTranslation } from 'react-i18next'
import { getStartTimeSelector } from '../core/projectSelectors'
import type { Speaker, Talk } from '../../../core/models'
import type { TalkFormValues } from './TalkAddEditPanel.tsx'

type EditedTalkFormValues = TalkFormValues & Pick<Talk, 'id'>

export const TalkList = () => {
    const dispatch = useAppDispatch()
    const projectVoteStartTime = useAppSelector(getStartTimeSelector)
    const talks = useAppSelector(getFilteredTalksSelector)
    const speakersMap = useAppSelector(getSpeakersListSelector)
    const speakersArray = useAppSelector(getSpeakersAsArraySelector)
    const filter = useAppSelector(getTalksFilterSelector)
    const tags = useAppSelector(getTagsSelector)
    const tracks = useAppSelector(getTracksSelector)
    const [sidePanelOpen, setSidePanelOpen] = useState(false)
    const [editingTalk, setEditTalk] = useState<EditedTalkFormValues | null>(
        null
    )
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

    const onEditTalkClicked = (talk: Talk) => {
        if (talkNotReadableCheck()) return
        setEditTalk({
            ...talk,
            // An invalid DateTime when the talk has no start/end time
            startTime: DateTime.fromISO(talk.startTime ?? ''),
            endTime: DateTime.fromISO(talk.endTime ?? ''),
            speakers: talk.speakers
                ? talk.speakers.map(
                      (id): Speaker =>
                          speakersMap[id]
                              ? speakersMap[id]
                              : { id: id, name: id }
                  )
                : [],
        })
        setSidePanelOpen(true)
    }

    const maybeCloseSidePanel = (shouldContinueAfterSubmit?: boolean) => {
        if (shouldContinueAfterSubmit) {
            return
        }
        setSidePanelOpen(false)
    }

    // The picker values (DateTime or null) are stringified then parsed back,
    // an empty date ends up as `null`.
    const reformatTalk = (talk: TalkFormValues) => ({
        ...talk,
        startTime: DateTime.fromISO(String(talk.startTime)).toISO(),
        endTime: DateTime.fromISO(String(talk.endTime)).toISO(),
        speakers: talk.speakers.map((speaker) => speaker.id),
    })

    return (
        <>
            <OFListHeader
                filterValue={filter}
                filterChange={(value: string) =>
                    dispatch(setTalksFilter(value))
                }
                buttonProcessing={false}
                buttonClick={() => onAddTalkClicked()}
                buttonText={t('talks.addTalks')}
            />

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
                            // The form values hold the edited talk id
                            return dispatch(
                                editTalk({ ...fixedTalk, id: editingTalk.id })
                            ).then(() =>
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
                        isRemoveBlocked={talkNotReadableCheck}
                        onSpeakerClicked={(speakerName: string) =>
                            dispatch(setTalksFilter(speakerName))
                        }
                    />
                ))}
            </Grid>
        </>
    )
}
