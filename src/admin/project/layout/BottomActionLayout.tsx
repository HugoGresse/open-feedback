import Box from '@mui/material/Box'
import type { ReactNode } from 'react'

export interface BottomActionLayoutProps {
    children?: ReactNode
}

export const BottomActionLayout = ({ children }: BottomActionLayoutProps) => (
    <Box
        textAlign="center"
        borderTop="1px solid #ccc"
        marginTop={5}
        paddingTop={4}
    >
        {children}
    </Box>
)
