import React, { useEffect } from 'react'
import Grid from "@material-ui/core/Grid"
import OFPaper from "../../baseComponents/OFPaper"
import SpeakerList from "./SpeakerList"
import { useDispatch, useSelector } from "react-redux"
import { getSpeakers } from "../../../core/speakers/speakerActions"
import { isProjectApiInitSelector } from "../core/projectSelectors"

const Speakers = () => {
    const dispatch = useDispatch()
    const isProjectApiInit = useSelector(isProjectApiInitSelector)

    useEffect(() => {
        if (isProjectApiInit) {
            dispatch(getSpeakers())
        }
    }, [isProjectApiInit, dispatch])

    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <OFPaper>
                <SpeakerList/>
            </OFPaper>
        </Grid>
    </Grid>
}

export default Speakers
