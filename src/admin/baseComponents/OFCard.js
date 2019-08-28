import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { darken, fade, lighten } from '@material-ui/core/styles'
import { Card } from '@material-ui/core'

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

const OFCard = props => {
    const classes = useStyles()

    return (
        <Card
            {...props}
            classes={{
                root: classes.root
            }}
        />
    )
}

export default OFCard
