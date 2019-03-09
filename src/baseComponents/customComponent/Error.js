import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error'
import Button from '@material-ui/core/es/Button/Button'
import PropTypes from 'prop-types'

const styles = theme => ({
    root: {
        maxWidth: '100%',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    errorDetail: {
        fontFamily: 'monospace'
    },
    button: {
        marginTop: '30px'
    }
})

class Error extends Component {
    render() {
        const { error, errorDetail, classes } = this.props

        const reportString = `mailto:hugo.gresse@gmail.com?subject=OpenFeedback%20Error&body=@error:${JSON.stringify(
            error
        )}@detail:${JSON.stringify(errorDetail)}@url:${JSON.stringify(
            window.location.href
        )}`

        return (
            <div className={classes.root}>
                <ErrorIcon />
                <p>
                    <b>{error}</b>
                </p>
                <p>Error:</p>
                <p className={classes.errorDetail}>{errorDetail}</p>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                >
                    Reload the page
                </Button>
                <Button
                    variant="contained"
                    className={classes.button}
                    href={reportString}
                >
                    Report
                </Button>
            </div>
        )
    }
}

Error.propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
    ErrorDetail: PropTypes.string
}

export default withStyles(styles)(Error)
