import React, { useState } from 'react'
import OFPagination from './OFPagination'
import Typography from '@material-ui/core/Typography'

export default {
    component: OFPagination,
    title: 'Admin/Pagination',
}

export const defaultUsage = () => {
    const [currentPage, setPage] = useState(1)

    return (
        <>
            <Typography>Page {currentPage}</Typography>
            <OFPagination
                count={10}
                page={currentPage}
                onChange={(event, page) => setPage(page)}
            />
        </>
    )
}
