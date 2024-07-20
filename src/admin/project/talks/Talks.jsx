import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isProjectApiInitSelector } from '../core/projectSelectors'
import { getTalks } from '../../../core/talks/talksActions'
import { getSpeakers } from '../../../core/speakers/speakerActions'
import OFPaper from '../../baseComponents/OFPaper.jsx'
import TalkList from './TalkList.jsx'

const Talks = () => {
    const dispatch = useDispatch()
    const isProjectApiInit = useSelector(isProjectApiInitSelector)

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

export default Talks
