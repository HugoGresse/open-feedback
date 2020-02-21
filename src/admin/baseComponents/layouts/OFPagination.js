import React from 'react'
import Pagination from '@material-ui/lab/Pagination'
import Box from '@material-ui/core/Box'

const OFPagination = ({ count, current, onChange }) => {
    return (
        <Box margin="16px auto">
            <Pagination count={count} page={current} onChange={onChange} />
        </Box>
    )
}

export default OFPagination
