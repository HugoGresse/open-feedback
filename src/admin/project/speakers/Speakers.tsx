import { useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { OFPaper } from '../../baseComponents/OFPaper.tsx'
import { SpeakerList } from './SpeakerList.tsx'
import { useDispatch, useSelector } from 'react-redux'
import { getSpeakers } from '../../../core/speakers/speakerActions'
import { isProjectApiInitSelector } from '../core/projectSelectors'

export const Speakers = () => {
    const dispatch = useDispatch()
    const isProjectApiInit = useSelector(isProjectApiInitSelector)

    useEffect(() => {
        if (isProjectApiInit) {
            dispatch(getSpeakers())
        }
    }, [isProjectApiInit, dispatch])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <OFPaper>
                    <SpeakerList />
                </OFPaper>
            </Grid>
        </Grid>
    )
}
