import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import type { ReactNode } from 'react'

interface InputLangAdornmentProps {
    children?: ReactNode
    tooltipContent: string
}

export const InputLangAdornment = ({
    children,
    tooltipContent,
}: InputLangAdornmentProps) => {
    return (
        <Tooltip title={tooltipContent} aria-label={tooltipContent}>
            <InputAdornment
                position="start"
                style={{
                    padding: '9.5px 12px',
                    background: '#EEE',
                    marginTop: -1,
                    height: 'auto',
                }}
            >
                <p
                    style={{
                        overflow: 'hidden',
                        width: '100%',
                        textOverflow: 'ellipsis',
                        maxWidth: 70,
                        minWidth: 70,
                        margin: 0,
                    }}
                >
                    {children}
                </p>
            </InputAdornment>
        </Tooltip>
    )
}
