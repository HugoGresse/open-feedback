import React from 'react'
import { COLORS } from '../../../constants/colors'
import Button from '@mui/material/Button'
import { darken, alpha, lighten } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material'

const OFButton = ({
    children,
    loading = false,
    color = 'primary',
    style = {},
    ...otherProps
}) => {
    const theme = useTheme()

    return (
        <Button
            style={style}
            {...otherProps}
            sx={{
                background:
                    style.design === 'text'
                        ? 'none'
                        : style.customBg
                          ? style.customBg
                          : theme.palette[color].main,
                color: style.customText
                    ? style.customText
                    : style.design === 'text'
                      ? theme.palette.text.primary
                      : COLORS.WHITE,
                padding:
                    style.type === 'big'
                        ? '12px 32px'
                        : style.type === 'small'
                          ? '3px 4px'
                          : '6px 8px',
                ':hover': {
                    background:
                        style.design === 'text'
                            ? lighten(alpha(theme.palette[color].dark, 1), 0.8)
                            : style.customBg
                              ? darken(style.customBg, 0.2)
                              : theme.palette[color].dark,
                },
                ':disabled': {
                    color: theme.palette[color].dark,
                },
            }}>
            {children}
            {loading && (
                <CircularProgress
                    size={20}
                    sx={{
                        color: 'white',
                        marginLeft: 10,
                    }}
                />
            )}
        </Button>
    )
}

export default OFButton
