import React, { useEffect } from 'react'
import OFPaper from '../../baseComponents/OFPaper'
import TalkList from './TalkList'
import { useDispatch, useSelector } from 'react-redux'
import { getSpeakers } from '../../../core/speakers/speakerActions'
import { getTalks } from '../../../core/talks/talksActions'
import { isProjectApiInitSelector } from '../core/projectSelectors'
import { getTextUserVotes } from './moderationActions'

const Moderation = () => {
    const dispatch = useDispatch()
    const isProjectApiInit = useSelector(isProjectApiInitSelector)

    useEffect(() => {
        if (isProjectApiInit) {
            dispatch(getSpeakers())
            dispatch(getTalks())
            dispatch(getTextUserVotes())
        }
    }, [dispatch, isProjectApiInit])

    return (
        <OFPaper>
            <TalkList />
        </OFPaper>
    )
}

export default Moderation
