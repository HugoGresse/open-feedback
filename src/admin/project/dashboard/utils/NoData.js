import React from 'react'
import Box from '@material-ui/core/Box'
import DinoBackground from './DinoBackground'

const NoData = ({ children, datas, speed }) => {
    if (datas.filter(data => !!data).length > 0) {
        return children
    }

    return (
        <Box display="flex" justifyContent="center" height="150px">
            No votes yet
            <DinoBackground speed={speed} />
        </Box>
    )
}

export default NoData
