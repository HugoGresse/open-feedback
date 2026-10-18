import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
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
import { Error } from '../../baseComponents/customComponent/Error.tsx'
import { LoaderMatchParent } from '../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { TalksDateMenu } from './TalksDateMenu.tsx'
import { TalksList } from './TalksList.tsx'
import { getSpeakers } from '../../core/speakers/speakerActions'
import { useNavigate, useParams } from 'react-router-dom'
import { SearchNoMatch } from './SearchNoMatch.tsx'
import { SearchExtendedMatch } from './SearchExtendedMatch.tsx'
import { getVotesByTalkSelector } from '../vote/voteSelectors'
import { TALK_NO_DATE } from '../../core/talks/talksUtils'
import {
    getProjectSelectedDateSelector,
    getProjectSelector,
} from '../project/projectSelectors'

export const TalksListWrapper = () => {
    const dispatch = useAppDispatch()
    const routerParams = useParams()
    const navigate = useNavigate()

    const project = useAppSelector(getProjectSelector)
    const errorTalksLoad = useAppSelector(getTalksLoadError)
    const talks = useAppSelector(getTalksAsArraySelector)
    const currentTalksByTrack = useAppSelector(
        getCurrentTalksGroupByTrackSelector
    )
    const talkIsLoading = useAppSelector(isTalksLoadingSelector)
    const filter = useAppSelector(getTalksFilterSelector)
    const userTalkVote = useAppSelector(getVotesByTalkSelector)
    const extendedSearchTalks = useAppSelector(getExtendedSearchTalksSelector)
    const selectedDate = useAppSelector(getProjectSelectedDateSelector)

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
