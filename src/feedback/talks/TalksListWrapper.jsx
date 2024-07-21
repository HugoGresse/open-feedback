import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTalks } from '../../core/talks/talksActions'
import { setSelectedDate } from '../project/projectActions'

import {
    getCurrentTalksGroupByTrackSelector,
    getTalksFilterSelector,
    getExtendedSearchTalksSelector,
    getTalksLoadError,
    isTalksLoadingSelector,
    getTalksAsArraySelector,
} from '../../core/talks/talksSelectors'
import Error from '../../baseComponents/customComponent/Error.jsx'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent.tsx'
import TalksDateMenu from './TalksDateMenu.jsx'
import TalksList from './TalksList.jsx'
import { getSpeakers } from '../../core/speakers/speakerActions'
import { useNavigate, useParams } from 'react-router-dom'
import SearchNoMatch from './SearchNoMatch.jsx'
import SearchExtendedMatch from './SearchExtendedMatch.jsx'
import { getVotesByTalkSelector } from '../vote/voteSelectors'
import { TALK_NO_DATE } from '../../core/talks/talksUtils'
import {
    getProjectSelectedDateSelector,
    getProjectSelector,
} from '../project/projectSelectors'

const TalksListWrapper = () => {
    const dispatch = useDispatch()
    const routerParams = useParams()
    const navigate = useNavigate()

    const project = useSelector(getProjectSelector)
    const errorTalksLoad = useSelector(getTalksLoadError)
    const talks = useSelector(getTalksAsArraySelector)
    const currentTalksByTrack = useSelector(getCurrentTalksGroupByTrackSelector)
    const talkIsLoading = useSelector(isTalksLoadingSelector)
    const filter = useSelector(getTalksFilterSelector)
    const userTalkVote = useSelector(getVotesByTalkSelector)
    const extendedSearchTalks = useSelector(getExtendedSearchTalksSelector)
    const selectedDate = useSelector(getProjectSelectedDateSelector)

    useEffect(() => {
        dispatch(getTalks())
        dispatch(getSpeakers())
    }, [dispatch])

    useEffect(() => {
        dispatch(setSelectedDate(routerParams.date || TALK_NO_DATE))
    }, [routerParams.date, dispatch])

    useEffect(() => {
        if (
            talks &&
            talks.length === 1 &&
            !talkIsLoading &&
            project &&
            !project.disableSoloTalkRedirect &&
            selectedDate
        ) {
            navigate(`/${project.id}/${selectedDate}/${talks[0].id}`)
        }
    }, [talks, project, history, selectedDate, talkIsLoading])

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
