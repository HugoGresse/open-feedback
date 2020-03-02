import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'

const InputLangAdornment = ({ children, tooltipContent }) => {
    return (
        <Tooltip title={tooltipContent} aria-label={tooltipContent}>
            <InputAdornment
                position="start"
                style={{
                    padding: '9.5px 12px',
                    background: '#EEE',
                    marginTop: -1,
                    height: 'auto',
                }}>
                <p
                    style={{
                        overflow: 'hidden',
                        width: '100%',
                        textOverflow: 'ellipsis',
                        maxWidth: 70,
                        minWidth: 70,
                        margin: 0,
                    }}>
                    {children}
                </p>
            </InputAdornment>
        </Tooltip>
    )
}

export default InputLangAdornment
