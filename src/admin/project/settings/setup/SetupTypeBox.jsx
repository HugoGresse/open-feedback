import React from 'react'
import Box from '@mui/material/Box'
import {Typography} from '@mui/material'
import Radio from '@mui/material/Radio'

const SetupTypeBox = ({title, isSelected}) => {
    return (
        <Box
            display="flex"
            alignItems="flex-start"
            width={240}
            marginRight={2}
            marginBottom={2}
            padding={2}
            border={isSelected ? 'none' : '1px solid #eee'}
            bgcolor={isSelected ? "#eeeeee" : "transparent"}
            borderRadius="5px">
            <Radio color="primary"
                   disabled={!isSelected}
                   checked={isSelected}
                   style={{padding: 4}}/>
            <Typography variant="h6" style={{
                marginLeft: 10,
                fontWeight: 400,
                color: !isSelected ? "rgba(0,0,0,0.26)": "#000"
            }}>
                {title}
            </Typography>
        </Box>
    );
}

export default SetupTypeBox
