import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import OFInput from "../../baseComponents/OFInput"

const SpeakerListItem = ({item, onChange}) => {

    const onButtonClick = () => {
        alert('Speakers are read only here. You can probably update them through your Hoverboard Firestore or json url ' +
            'depending on your setup.')
    }

    return (
        <TableRow>
            <TableCell component="th" scope="row">
                <OFInput
                    value={item.name}
                    disabled
                    onChange={event => onChange(event.target.value)}
                />
            </TableCell>
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

export default SpeakerListItem
