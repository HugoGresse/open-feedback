import type { ChangeEvent } from 'react'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'

export interface OFPaginationProps {
    count: number
    current: number
    onChange: (event: ChangeEvent<unknown>, page: number) => void
}

export const OFPagination = ({
    count,
    current,
    onChange,
}: OFPaginationProps) => {
    return (
        <Box margin="16px auto" component="li">
            <Pagination count={count} page={current} onChange={onChange} />
        </Box>
    )
}
