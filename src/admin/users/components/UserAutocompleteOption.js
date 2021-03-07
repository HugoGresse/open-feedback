import React from 'react'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { Box } from '@material-ui/core'

export const renderUserAutoCompleteOption = ({
    displayName,
    email,
    photoURL,
}) => {
    return (
        <Box display="flex">
            <Avatar
                alt={displayName}
                src={photoURL}
                style={{ marginRight: 6, marginTop: 2, width: 24, height: 24 }}
            />
            <Box>
                <Typography variant="body2">{displayName}</Typography>
                <Typography variant="body2" style={{ color: '#999' }}>
                    {email}
                </Typography>
            </Box>
        </Box>
    )
}
