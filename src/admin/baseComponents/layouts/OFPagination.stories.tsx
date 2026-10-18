import type { Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { OFPagination } from './OFPagination.tsx'
import Typography from '@mui/material/Typography'

const meta = {
    component: OFPagination,
    title: 'Admin/Pagination',
} satisfies Meta<typeof OFPagination>
export default meta

export const DefaultUsage = () => {
    const [currentPage, setPage] = useState(1)

    return (
        <>
            <Typography>Page {currentPage}</Typography>
            <OFPagination
                count={10}
                current={currentPage}
                onChange={(_event, page) => setPage(page)}
            />
        </>
    )
}
