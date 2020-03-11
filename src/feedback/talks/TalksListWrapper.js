import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTalks } from '../../core/talks/talksActions'
import { setSelectedDate } from './../project/projectActions'

import {
    getCurrentTalksGroupByTrackSelector,
    getTalksFilterSelector,
    getExtendedSearchTalksSelector,
    getTalksLoadError,
    isTalksLoadingSelector,
} from '../../core/talks/talksSelectors'
import Error from '../../baseComponents/customComponent/Error'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import TalksDateMenu from './TalksDateMenu'
import TalksList from './TalksList'
import { getSpeakers } from '../../core/speakers/speakerActions'
import { useParams } from 'react-router-dom'
import SearchNoMatch from './SearchNoMatch'
import SearchExtendedMatch from './SearchExtendedMatch'
import { getVotesByTalkSelector } from '../vote/voteSelectors'

const TalksListWrapper = () => {
    const dispatch = useDispatch()
    const routerParams = useParams()

    const errorTalksLoad = useSelector(getTalksLoadError)
    const currentTalksByTrack = useSelector(getCurrentTalksGroupByTrackSelector)
    const talkIsLoading = useSelector(isTalksLoadingSelector)
    const filter = useSelector(getTalksFilterSelector)
    const userTalkVote = useSelector(getVotesByTalkSelector)
    const extendedSearchTalks = useSelector(getExtendedSearchTalksSelector)

    useEffect(() => {
        dispatch(getTalks())
        dispatch(getSpeakers())
    }, [dispatch])

    useEffect(() => {
        dispatch(setSelectedDate(routerParams.date))
    }, [routerParams.date, dispatch])

    if (errorTalksLoad) {
        return (
            <Error
                error="Unable to load the talks. This is bad."
                errorDetail={errorTalksLoad}
            />
        )
    }

    if (
        talkIsLoading &&
        (!currentTalksByTrack || currentTalksByTrack.length < 1)
    )
        return <LoaderMatchParent />

    const noMatch = !talkIsLoading && currentTalksByTrack.length === 0

    return (
        <div>
            <TalksDateMenu />

            {currentTalksByTrack.length > 0 && (
                <TalksList
                    talks={currentTalksByTrack}
                    userTalkVote={userTalkVote}
                />
            )}

            {noMatch && (
                <SearchNoMatch otherMatch={extendedSearchTalks.length > 0} />
            )}

            {filter && (
                <SearchExtendedMatch
                    talks={extendedSearchTalks}
                    userTalkVote={userTalkVote}
                />
            )}
        </div>
    )
}

export default TalksListWrapper
