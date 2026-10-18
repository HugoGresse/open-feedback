import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store'
import { isProjectApiInitSelector } from '../core/projectSelectors'
import { getTalks } from '../../../core/talks/talksActions'
import { getSpeakers } from '../../../core/speakers/speakerActions'
import { OFPaper } from '../../baseComponents/OFPaper.tsx'
import { TalkList } from './TalkList.tsx'

export const Talks = () => {
    const dispatch = useAppDispatch()
    const isProjectApiInit = useAppSelector(isProjectApiInitSelector)

    useEffect(() => {
        if (isProjectApiInit) {
            dispatch(getTalks())
            dispatch(getSpeakers())
        }
    }, [isProjectApiInit, dispatch])

    return (
        <OFPaper style={{ padding: 0 }}>
            <TalkList />
        </OFPaper>
    )
}
