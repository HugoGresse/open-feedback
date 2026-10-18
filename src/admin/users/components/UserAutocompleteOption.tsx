import type { HTMLAttributes, Key } from 'react'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { Box } from '@mui/material'
import type { OFAutoCompleteOption } from '../../baseComponents/form/autoComplete/OFAutoComplete.tsx'
import type { User } from '../../../core/models'

type UserOption = Pick<User, 'displayName' | 'email' | 'photoURL'>

/**
 * MUI Autocomplete `renderOption(liProps, option)`: the `<li>` props carry
 * the click and keyboard handlers selecting the option.
 */
export const renderUserAutoCompleteOption = (
    props: HTMLAttributes<HTMLLIElement> & { key?: Key },
    option: OFAutoCompleteOption
) => {
    const { key, ...liProps } = props
    if (typeof option === 'string') {
        return (
            <li key={key ?? option} {...liProps}>
                {option}
            </li>
        )
    }
    // The options are the project members details
    const { displayName, email, photoURL } = option as UserOption
    return (
        <li key={key ?? email ?? displayName} {...liProps}>
            <Box display="flex">
                <Avatar
                    alt={displayName ?? undefined}
                    src={photoURL ?? undefined}
                    style={{
                        marginRight: 6,
                        marginTop: 2,
                        width: 24,
                        height: 24,
                    }}
                />
                <Box>
                    <Typography variant="body2">{displayName}</Typography>
                    <Typography variant="body2" style={{ color: '#999' }}>
                        {email}
                    </Typography>
                </Box>
            </Box>
        </li>
    )
}
