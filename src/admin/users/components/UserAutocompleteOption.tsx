import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { Box } from '@mui/material'
import type { User } from '../../../core/models'

export const renderUserAutoCompleteOption = ({
    displayName,
    email,
    photoURL,
}: Pick<User, 'displayName' | 'email' | 'photoURL'>) => {
    return (
        <Box display="flex">
            <Avatar
                alt={displayName ?? undefined}
                src={photoURL ?? undefined}
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
