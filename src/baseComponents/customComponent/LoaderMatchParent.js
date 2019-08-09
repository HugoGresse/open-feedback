import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = () => ({
    root: {
        maxWidth: '100%',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: 0,
        transition: 'all 1s ease-in',
        animation: '1s $appearDelayed',
        animationDelay: '500ms',
        animationFillMode: 'forwards'
    },
    '@keyframes appearDelayed': {
        from: { opacity: 0 },
        to: { opacity: 1 }
    }
})

class LoaderMatchParent extends Component {
    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
                <CircularProgress />
            </div>
        )
    }
}

export default withStyles(styles)(LoaderMatchParent)
