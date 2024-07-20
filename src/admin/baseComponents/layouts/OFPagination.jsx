import React from 'react'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'

const OFPagination = ({ count, current, onChange }) => {
    return (
        <Box margin="16px auto" component="li">
            <Pagination count={count} page={current} onChange={onChange} />
        </Box>
    )
}

export default OFPagination
