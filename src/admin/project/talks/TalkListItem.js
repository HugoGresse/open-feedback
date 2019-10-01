import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { getDateFromStartTime } from "../../../core/sessions/sessionsUtils"

const TalkListItem = ({item, speakers}) => {

    const onButtonClick = () => {
        alert('Talks are read only here. You can probably update them through your Hoverboard Firestore or json url ' +
            'depending on your setup.')
    }
    return (
        <TableRow>
            <TableCell component="th" scope="row">{item.title}</TableCell>
            <TableCell component="th" scope="row">{speakers.map(speaker => speaker && speaker.name + ' \n')}</TableCell>
            <TableCell component="th" scope="row">{item.trackTitle}</TableCell>
            <TableCell component="th" scope="row">{getDateFromStartTime(item.startTime)}</TableCell>
            <TableCell align="right">
                <IconButton aria-label="edit" onClick={() => onButtonClick()}>
                    <EditIcon/>
                </IconButton>

                <IconButton aria-label="delete" onClick={() => onButtonClick()}>
                    <DeleteIcon/>
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

export default TalkListItem
