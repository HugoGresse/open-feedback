import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Paper from '@material-ui/core/Paper'
import { darken, fade, lighten } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: 'none',
        border: `1px solid
    ${
        theme.palette.type === 'light'
            ? lighten(fade(theme.palette.divider, 1), 0.88)
            : darken(fade(theme.palette.divider, 1), 0.68)
    }`
    }
}))

const OFPaper = props => {
    const classes = useStyles()

    return (
        <Paper
            {...props}
            classes={{
                root: classes.root
            }}
        />
    )
}

export default OFPaper
