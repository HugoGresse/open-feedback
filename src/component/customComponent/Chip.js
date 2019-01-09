import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'

import { Chip as MUIChip } from '@material-ui/core'

const styles = theme => ({
    root: {
        borderRadius: '3px',
        height: '23px'
    }
})

class Chip extends Component {
    render() {
        const { label, key, color = 'primary', classes } = this.props
        return (
            <MUIChip
                key={key}
                label={label}
                className={classes.root}
                color={color}
            />
        )
    }
}

export default withStyles(styles, { withTheme: true })(Chip)
