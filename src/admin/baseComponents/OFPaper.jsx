import React from 'react'
import Paper from '@mui/material/Paper'
import { darken, alpha, lighten } from '@mui/material/styles';
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        boxShadow: 'none',
        border: `1px solid
    ${
        theme.palette.mode === 'light'
            ? lighten(alpha(theme.palette.divider, 1), 0.88)
            : darken(alpha(theme.palette.divider, 1), 0.68)
    }`,
    },
}))

const OFPaper = (props) => {
    const classes = useStyles()

    return (
        <Paper
            {...props}
            classes={{
                root: classes.root,
            }}
        />
    )
}

export default OFPaper
