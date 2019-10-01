import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isProjectApiInitSelector } from "../core/projectSelectors"
import { getSessions } from "../../../core/sessions/sessionsActions"
import { getSpeakers } from "../../../core/speakers/speakerActions"
import Grid from "@material-ui/core/Grid"
import OFPaper from "../../baseComponents/OFPaper"
import TalkList from "./TalkList"

const Talks = () => {
    const dispatch = useDispatch()
    const isProjectApiInit = useSelector(isProjectApiInitSelector)

    useEffect(() => {
        if (isProjectApiInit) {
            dispatch(getSessions())
            dispatch(getSpeakers())
        }
    }, [isProjectApiInit, dispatch])

    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <OFPaper>
                <TalkList/>
            </OFPaper>
        </Grid>
    </Grid>
}

export default Talks
