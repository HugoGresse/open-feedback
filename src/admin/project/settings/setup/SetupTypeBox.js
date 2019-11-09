import React from 'react'
import Box from '@material-ui/core/Box'
import {Typography} from '@material-ui/core'
import Radio from '@material-ui/core/Radio'

const SetupTypeBox = ({title, disable, isSelected}) => {
    return <Box
        display="flex"
        alignItems="flex-start"
        width={240}
        marginRight={2}
        marginBottom={2}
        padding={2}
        border={isSelected ? 'none' : '1px solid #eee'}
        bgcolor={isSelected ? "#eeeeee" : "transparent"}
        borderRadius={5}>
        <Radio color="primary"
               disabled={disable}
               checked={isSelected}
               style={{padding: 4}}/>
        <Typography variant="h6" style={{
            marginLeft: 10,
            fontWeight: 400
        }}>
            {title}
        </Typography>
    </Box>
}

export default SetupTypeBox
