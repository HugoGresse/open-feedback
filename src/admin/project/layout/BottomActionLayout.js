import React from 'react'
import Box from '@material-ui/core/Box'

const BottomActionLayout = ({ children }) => (
    <Box
        textAlign="center"
        borderTop="1px solid #ccc"
        marginTop={5}
        paddingTop={4}>
        {children}
    </Box>
)

export default BottomActionLayout
