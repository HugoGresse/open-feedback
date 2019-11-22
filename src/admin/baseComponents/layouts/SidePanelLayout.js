import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box  from '@material-ui/core/Box'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

const SidePanelLayout = ({title, onClose, children}) => {

    return <Box margin={1}>
        <Box textAlign="right" marginBottom={2}>
            <IconButton aria-label="Close the side panel" onClick={onClose}>
                <CloseIcon/>
            </IconButton>
        </Box>
        <Typography variant="h6">{title}</Typography>
        {children}
    </Box>
}

export default SidePanelLayout
