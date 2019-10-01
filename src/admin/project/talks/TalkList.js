import React from 'react'
import Table from "@material-ui/core/Table"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import Fade from "@material-ui/core/Fade"
import CircularProgress from "@material-ui/core/CircularProgress"
import OFButton from "../../baseComponents/OFButton"

import TableBody from "@material-ui/core/TableBody"
import makeStyles from "@material-ui/core/styles/makeStyles"
import OFInput from "../../baseComponents/OFInput"
import { useDispatch, useSelector } from "react-redux"
import TalkListItem from "./TalkListItem"
import { getFilteredSessionsSelector, getSessionsFilterSelector } from "../../../core/sessions/sessionsSelectors"
import { setSessionsFilter } from "../../../core/sessions/sessionsActions"
import { getSpeakersListSelector } from "../../../core/speakers/speakerSelectors"

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
    table: {
        minWidth: 600
    }
}))

const TalkList = () => {

    const dispatch = useDispatch()
    const classes = useStyles()
    const talks = useSelector(getFilteredSessionsSelector)
    const speakers = useSelector(getSpeakersListSelector)
    const filter = useSelector(getSessionsFilterSelector)

    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <OFInput placeholder="Search"
                                 value={filter}
                                 onChange={(event) => dispatch(setSessionsFilter(event.target.value))}/>
                    </TableCell>
                    <TableCell/>
                    <TableCell/>
                    <TableCell style={{ minWidth: "80px"}}/>
                    <TableCell align="right"  style={{ width: "120px"}}>
                        <Fade in={false}>
                            <CircularProgress
                                size={30}
                                className={classes.progress}
                            />
                        </Fade>

                        <OFButton onClick={() => alert('Talks are read only here. You can probably update them through your Hoverboard Firestore or json url depending on your setup.')}>
                            Save
                        </OFButton>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {talks.map(talk =>  <TalkListItem item={talk} key={talk.id} speakers={talk.speakers.map(id => speakers[id])}/>)}
            </TableBody>
        </Table>
    )
}

export default TalkList
