import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import OFPaper from '../../baseComponents/OFPaper'
import TalkList from './TalkList'
import { useDispatch, useSelector } from 'react-redux'
import { getSpeakers } from '../../../core/speakers/speakerActions'
import { getTalks } from '../../../core/talks/talksActions'
import { isProjectApiInitSelector } from '../core/projectSelectors'

const Moderation = () => {
    const dispatch = useDispatch()
    const isProjectApiInit = useSelector(isProjectApiInitSelector)

    useEffect(() => {
        if (isProjectApiInit) {
            dispatch(getSpeakers())
            dispatch(getTalks())
        }
    }, [isProjectApiInit, dispatch])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <OFPaper>
                    <TalkList />
                </OFPaper>
            </Grid>
        </Grid>
    )
}

export default Moderation
