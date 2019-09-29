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
import SpeakerListItem from "./SpeakerListItem"
import { useDispatch, useSelector } from "react-redux"
import { getFilteredSpeakers, getSpeakersFilter, } from "../../../core/speakers/speakerSelectors"
import { filterSpeakers } from "../../../core/speakers/speakerActions"

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
    }
}))

const SpeakerList = () => {

    const dispatch = useDispatch()
    const classes = useStyles()
    const speakers = useSelector(getFilteredSpeakers)
    const filter = useSelector(getSpeakersFilter)

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <OFInput placeholder="Search"
                                 value={filter}
                                 onChange={(event) => dispatch(filterSpeakers(event.target.value))}/>
                    </TableCell>
                    <TableCell align="right">
                        <Fade in={false}>
                            <CircularProgress
                                size={30}
                                className={classes.progress}
                            />
                        </Fade>

                        <OFButton onClick={() => alert('Speakers are read only here. You can probably update them through your Hoverboard Firestore or json url depending on your setup.')}>
                            Save
                        </OFButton>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {speakers.map(speaker =>  <SpeakerListItem item={speaker} key={speaker.id}/>)}
            </TableBody>
        </Table>
    )
}

export default SpeakerList
