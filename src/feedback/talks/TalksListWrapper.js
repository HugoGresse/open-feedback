import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTalks } from '../../core/talks/talksActions'
import { setSelectedDate } from './../project/projectActions'

import {
    getCurrentTalksGroupByTrackSelector,
    getTalksLoadError,
    isTalksLoadingSelector,
} from '../../core/talks/talksSelectors'
import Error from '../../baseComponents/customComponent/Error'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'
import TalksDateMenu from './TalksDateMenu'
import TalksList from './TalksList'
import Typography from '@material-ui/core/Typography'
import { getSpeakers } from '../../core/speakers/speakerActions'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const TalksListWrapper = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const routerParams = useParams()

    const errorTalksLoad = useSelector(getTalksLoadError)
    const currentTalksByTrack = useSelector(getCurrentTalksGroupByTrackSelector)
    const talkIsLoading = useSelector(isTalksLoadingSelector)

    useEffect(() => {
        dispatch(getTalks())
        dispatch(getSpeakers())
    }, [dispatch])

    useEffect(() => {
        dispatch(setSelectedDate(routerParams.date))
    }, [routerParams.date])

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

    return (
        <div>
            <TalksDateMenu />

            {!talkIsLoading && currentTalksByTrack.length === 0 && (
                <Typography color="textPrimary">
                    {t('searchNoMatch')}
                </Typography>
            )}
            {currentTalksByTrack.length > 0 && (
                <TalksList talks={currentTalksByTrack} />
            )}
        </div>
    )
}

export default TalksListWrapper
