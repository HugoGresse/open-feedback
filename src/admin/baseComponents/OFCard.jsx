import React from 'react'
import { alpha, darken, lighten } from '@mui/material/styles';
import { Card, makeStyles } from '@mui/material'

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

const OFCard = (props) => {
    const classes = useStyles()

    return (
        <Card
            {...props}
            classes={{
                root: classes.root,
            }}
        />
    )
}

export default OFCard
