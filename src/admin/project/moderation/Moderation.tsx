import { useEffect } from 'react'
import { OFPaper } from '../../baseComponents/OFPaper.tsx'
import { TalkList } from './TalkList.tsx'
import { useAppDispatch, useAppSelector } from '../../../store'
import { getSpeakers } from '../../../core/speakers/speakerActions'
import { getTalks } from '../../../core/talks/talksActions'
import { isProjectApiInitSelector } from '../core/projectSelectors'
import { getTextUserVotes } from './moderationActions'

export const Moderation = () => {
    const dispatch = useAppDispatch()
    const isProjectApiInit = useAppSelector(isProjectApiInitSelector)

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
