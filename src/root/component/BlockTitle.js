import React from 'react'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(() => ({
    title: {
        marginBottom: 32,
    },
}))

const BlockTitle = ({ children, ...props }) => {
    const classes = useStyles()

    return (
        <Typography className={classes.title} variant="h2" {...props}>
            {children}
        </Typography>
    )
}

export default BlockTitle
