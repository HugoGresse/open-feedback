import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'

const styles = theme => ({})

class Root extends Component {
    render() {
        return (
            <div>
                Access to feedback site with the unique id given by someone.
            </div>
        )
    }
}

export default withStyles(styles)(Root)
