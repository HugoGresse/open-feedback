import Box from '@mui/material/Box'

export const BottomActionLayout = ({ children }) => (
    <Box
        textAlign="center"
        borderTop="1px solid #ccc"
        marginTop={5}
        paddingTop={4}
    >
        {children}
    </Box>
)
