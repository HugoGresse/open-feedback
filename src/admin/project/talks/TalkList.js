import React from 'react'
import Fade from "@material-ui/core/Fade"
import CircularProgress from "@material-ui/core/CircularProgress"
import OFButton from "../../baseComponents/OFButton"
import makeStyles from "@material-ui/core/styles/makeStyles"
import OFInput from "../../baseComponents/OFInput"
import { useDispatch, useSelector } from "react-redux"
import TalkListItem from "./TalkListItem"
import { getFilteredSessionsSelector, getSessionsFilterSelector } from "../../../core/sessions/sessionsSelectors"
import { setSessionsFilter } from "../../../core/sessions/sessionsActions"
import { getSpeakersListSelector } from "../../../core/speakers/speakerSelectors"
import Grid from "@material-ui/core/Grid"

const useStyles = makeStyles(theme => ({
    icon: {
        marginRight: 6
    },
    progress: {
        width: 30,
        height: 30,
        marginRight: 10,
        top: 10,
        position: 'relative'
    },
    header: {
        padding: 20
    },
    headerRight: {
        textAlign: "right"
    }
}))

const TalkList = () => {

    const dispatch = useDispatch()
    const classes = useStyles()
    const talks = useSelector(getFilteredSessionsSelector)
    const speakers = useSelector(getSpeakersListSelector)
    const filter = useSelector(getSessionsFilterSelector)

    return (
        <Grid container>
                <Grid container className={classes.header}>
                    <Grid item xs={12} sm={6} >
                        <OFInput placeholder="Search"
                                 value={filter}
                                 onChange={(event) => dispatch(setSessionsFilter(event.target.value))}/>
                    </Grid>

                    <Grid item xs={12} sm={6} className={classes.headerRight}>
                        <Fade in={false}>
                            <CircularProgress
                                size={30}
                                className={classes.progress}
                            />
                        </Fade>

                        <OFButton
                            onClick={() => alert('Talks are read only here. You can probably update them through your Hoverboard Firestore or json url depending on your setup.')}>
                            Save
                        </OFButton>
                    </Grid>
                </Grid>

            {talks.map(talk => <TalkListItem item={talk} key={talk.id}
                                             speakers={talk.speakers.map(id => speakers[id])}/>)}
        </Grid>
    )
}

export default TalkList
