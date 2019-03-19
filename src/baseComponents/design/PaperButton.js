import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import { COLORS } from '../../constants/colors'

const styles = theme => ({
    itemContainer: {
        margin: -1
    },
    item: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        fontSize: '17px',
        borderRadius: '0',
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.grey[300],
        height: '150px',
        boxSizing: 'border-box',
        backgroundColor: COLORS.RED_ORANGE,
        '&:hover': {
            filter: 'brightness(85%)',
            cursor: 'pointer'
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 200ms ease-out'
    },
    selectedItem: {
        boxShadow: 'inset 0 0 0 5px ' + theme.palette.grey[300]
    },
    title: {
        color: '#FFFFFF',
        zIndex: 2
    }
})

class PaperButton extends Component {
    render() {
        const { classes, content, isSelected } = this.props

        const paperClasses = `${classes.item} ${
            isSelected ? classes.selectedItem : ''
        }`

        return (
            <Grid
                item
                xs={6}
                sm={4}
                md={3}
                className={classes.itemContainer}
                onClick={event => this.props.onClick()}
            >
                <Paper elevation={1} className={paperClasses}>
                    <span className={classes.title}>{content.title}</span>
                </Paper>
            </Grid>
        )
    }
}

PaperButton.propTypes = {
    classes: PropTypes.object.isRequired,
    isSelected: PropTypes.bool
}

export default withStyles(styles)(PaperButton)
