import Grid from '@mui/material/Grid'
import React from 'react'
import { darken, alpha, lighten } from '@mui/material/styles';

import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '12px 30px',
        borderBottom: `1px solid ${
            theme.palette.mode === 'light'
                ? lighten(alpha(theme.palette.divider, 1), 0.88)
                : darken(alpha(theme.palette.divider, 1), 0.68)
        }`,
        alignItems: 'flex-start',
    },
}))

const OFListItem = ({ children, style, ...props }) => {
    const classes = useStyles()

    return (
        <Grid
            container
            component={'li'}
            className={classes.container}
            style={style}
            {...props}
        >
            {children}
        </Grid>
    )
}

export default OFListItem
