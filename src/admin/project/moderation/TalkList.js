import React, { useEffect, useState } from 'react'
import TalkListItem from './TalkListItem'
import { useDispatch, useSelector } from 'react-redux'
import { getSpeakersListSelector } from '../../../core/speakers/speakerSelectors'
import Grid from '@material-ui/core/Grid'
import OFListHeader from '../../baseComponents/layouts/OFListHeader'
import {
    getFilteredTalksAsMapSelector,
    getTalksFilterSelector,
} from '../../../core/talks/talksSelectors'
import { setTalksFilter } from '../../../core/talks/talksActions'
import { getTextUserVotes } from './moderationActions'
import { getTextVotesSelector } from './moderationSelectors'

const TalkList = () => {
    const dispatch = useDispatch()
    const talks = useSelector(getFilteredTalksAsMapSelector)
    const votesWithTalkId = useSelector(getTextVotesSelector)
    const filter = useSelector(getTalksFilterSelector)
    const speakersMap = useSelector(getSpeakersListSelector)

    const [fromIndex, setFromIndex] = useState(0)
    const [toIndex, setToIndex] = useState(50)

    const talkKeys = Object.keys(votesWithTalkId)
    const selectedKeys = talkKeys.slice(fromIndex, toIndex)

    useEffect(() => {
        dispatch(getTextUserVotes())
        return () => {
            dispatch(setTalksFilter(null))
        }
    }, [dispatch])

    return (
        <Grid container>
            <OFListHeader
                filterValue={filter}
                filterChange={value => dispatch(setTalksFilter(value))}
            />

            {selectedKeys.map(talkId => {
                if (!talks[talkId]) {
                    return ''
                }

                return (
                    <TalkListItem
                        talk={talks[talkId]}
                        key={talkId}
                        speakers={speakersMap}
                        votes={votesWithTalkId[talkId]}
                        onSpeakerClicked={value =>
                            dispatch(setTalksFilter(value))
                        }
                    />
                )
            })}
        </Grid>
    )
}

export default TalkList
