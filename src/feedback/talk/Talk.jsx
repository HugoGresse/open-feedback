import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getSelectedTalkSelector,
    getTalkLoadErrorSelector,
    getSpeakersForSelectedTalkSelector,
} from './core/talkSelectors'
import { getTalk, setSelectedTalk } from './core/talkActions'
import { getSpeakers } from '../../core/speakers/speakerActions'
import { getVoteResult } from '../project/projectActions'
import {
    getVotes,
    removeVote,
    removeVoteLoadError,
    removeVotePostError,
    updateVote,
    voteFor,
} from '../vote/voteActions'

import {
    getProjectChipColorsSelector,
    getProjectVoteItemsOrderedSelector,
} from '../project/projectSelectors'
import {
    getActiveUserVotesByTalkAndVoteItemSelector,
    getErrorVotePostSelector,
    getErrorVotesLoadSelector,
} from '../vote/voteSelectors'

import Grid from '@mui/material/Grid'
import { TalkVote } from './TalkVote.jsx'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent.jsx'
import Error from '../../baseComponents/customComponent/Error.jsx'
import Snackbar from '../../baseComponents/customComponent/Snackbar.jsx'
import { SPACING } from '../../constants/constants'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../core/contants'
import { useTranslation } from 'react-i18next'
import { TalkHeader } from './TalkHeader.jsx'
import { getVoteResultSelectorSelector } from './core/getVoteResultSelectorSelector'
import useQuery from '../../utils/useQuery'
import { useParams } from 'react-router-dom'

export const Talk = () => {
    const { talkId } = useParams()
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const displayVotes = useQuery().get('displayVotes')

    const id = talkId

    const talk = useSelector(getSelectedTalkSelector)
    const speakers = useSelector(getSpeakersForSelectedTalkSelector)
    const voteItems = useSelector(getProjectVoteItemsOrderedSelector)
    const userVotes = useSelector(state => getActiveUserVotesByTalkAndVoteItemSelector(state, talkId))
    const voteResults = useSelector((state) =>
        getVoteResultSelectorSelector(state, displayVotes),
    )
    const errorTalkLoad = useSelector(getTalkLoadErrorSelector)
    const errorVotePost = useSelector(getErrorVotePostSelector)
    const errorVotesLoad = useSelector(getErrorVotesLoadSelector)
    const chipColors = useSelector(getProjectChipColorsSelector)

    useEffect(() => {
        dispatch(getTalk(id))
        dispatch(setSelectedTalk(id))
        dispatch(getSpeakers())
        const unsubscribe = dispatch(getVoteResult(id))

        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [dispatch, id])

    const onVoteItemChange = (voteItem, data, vote) => {
        if (vote) {
            switch (voteItem.type) {
                case VOTE_TYPE_TEXT:
                    if (data && data.length > 0) {
                        dispatch(updateVote(vote, data, t))
                    } else {
                        dispatch(removeVote(vote, t))
                    }
                    break
                default:
                case VOTE_TYPE_BOOLEAN:
                    dispatch(removeVote(vote, t))
                    break
            }
        } else {
            dispatch(voteFor(talk.id, voteItem, data, t))
        }
    }

    const onRetryLoadVotesClick = () => {
        dispatch(removeVoteLoadError())
        dispatch(getVotes())
    }

    const closeErrorVotePostClick = () => {
        dispatch(removeVotePostError())
    }

    const closeErrorVoteLoadClick = () => {
        dispatch(removeVoteLoadError())
    }

    if (errorTalkLoad) {
        return (
            <Error
                error="Unable to load the talk/speakers/vote options"
                errorDetail={errorTalkLoad}
            />
        )
    }

    if (!talk || !speakers || !voteItems) {
        return <LoaderMatchParent />
    }

    let snackBarError = null
    if (errorVotePost) {
        snackBarError = (
            <Snackbar
                text={errorVotePost}
                closeCallback={closeErrorVotePostClick}
            />
        )
    }

    if (errorVotesLoad) {
        snackBarError = (
            <Snackbar
                text={
                    'Unable to load the vote results, reason: ' + errorVotePost
                }
                actionText="Retry"
                actionCallback={onRetryLoadVotesClick}
                closeCallback={closeErrorVoteLoadClick}
            />
        )
    }
    return (
        <div>
            <TalkHeader talk={talk} speakers={speakers} />
            <Grid container spacing={SPACING.LAYOUT}>
                {voteItems.map((voteItem, key) => (
                    <TalkVote
                        key={key}
                        voteItem={voteItem}
                        userVotes={userVotes[voteItem.id]}
                        voteResult={voteResults[voteItem.id]}
                        chipColors={chipColors}
                        onVoteChange={onVoteItemChange}
                    />
                ))}
            </Grid>
            {snackBarError}
        </div>
    )
}
