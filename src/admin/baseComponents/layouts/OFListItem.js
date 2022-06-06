import Grid from '@material-ui/core/Grid'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { darken, alpha, lighten } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '12px 30px',
        borderBottom: `1px solid ${
            theme.palette.type === 'light'
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
