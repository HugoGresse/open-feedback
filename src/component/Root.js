import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import { setFavicon } from './layout/utils'

const styles = theme => ({})

class Root extends Component {
    componentWillMount() {
        setFavicon('/favicon-root.ico')
    }

    render() {
        return (
            <div>
                Access to feedback site with the unique id given by someone.
            </div>
        )
    }
}

export default withStyles(styles)(Root)
