import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import SessionVoteItemBackground from './SessionVoteItemBackground'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const styles = theme => ({
    itemContainer: {
        margin: -1
    },
    item: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        fontSize: '17px',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.grey[300],
        height: '150px',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: '#f6f6f6'
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
    voteTitle: {
        color: theme.palette.grey[800],
        zIndex: 2
    },
    voteResult: {
        position: 'absolute',
        bottom: '5px',
        fontSize: '14px',
        transition: 'all 200ms ease-in-out',
        zIndex: 2
    },
    backgroundCanvas: {
        width: '100%'
    },
    textArea: {
        width: '100%',
        height: '100%'
    }
})

class VoteItemText extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comment: ''
        }
    }

    onTextChange = event => {
        this.setState({
            comment: event.target.value
        })
    }

    render() {
        const {
            classes,
            voteItem,
            isSelected,
            voteResult,
            chipColors
        } = this.props

        const paperClasses = `${classes.item} ${
            isSelected ? classes.selectedItem : ''
        }`

        return (
            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                className={classes.itemContainer}
            >
                <Paper elevation={1} className={paperClasses}>
                    <TextField
                        multiline
                        fullWidth
                        margin="none"
                        rows="6"
                        rowsMax="6"
                        InputProps={{
                            disableUnderline: true
                        }}
                        className={classes.textArea}
                        placeholder={voteItem.name}
                        onChange={this.onTextChange}
                        value={this.state.comment}
                    />
                </Paper>

                {this.state.comment && (
                    <Button
                        className={classes.button}
                        onClick={event => this.props.onClick(event, voteItem)}
                    >
                        Save comment
                    </Button>
                )}
            </Grid>
        )
    }
}

VoteItemText.propTypes = {
    classes: PropTypes.object.isRequired,
    voteItem: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
    voteResult: PropTypes.number,
    chipColors: PropTypes.array
}

export default withStyles(styles)(VoteItemText)
