import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SessionVoteTextResult from './SessionVoteTextResult'

const styles = theme => ({
    itemContainer: {
        margin: -1
    },
    item: {
        overflow: 'hidden',
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        fontSize: '17px',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.grey[300],
        height: '95px',
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
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
        fontSize: 20
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    saveButton: {
        backgroundColor: '#6a96ff'
    }
})

class SessionVoteText extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comment: ''
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.currentUserVote) {
            this.setState({
                ...this.state,
                comment: nextProps.currentUserVote.text
            })
        }
    }

    onTextChange = event => {
        this.setState({
            comment: event.target.value
        })
    }

    onVoteDelete = event => {
        this.props.onVoteChange(this.props.voteItem, null)
        this.setState({
            comment: ''
        })
    }

    render() {
        const { classes, voteItem, voteResult } = this.props

        return (
            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                className={classes.itemContainer}
            >
                <Paper elevation={1} className={classes.item}>
                    <TextField
                        multiline
                        fullWidth
                        margin="none"
                        rows="3"
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
                    <div className={classes.buttonContainer}>
                        <Button onClick={() => this.onVoteDelete()}>
                            <DeleteIcon className={classes.leftIcon} />
                            Delete comment
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.saveButton}
                            onClick={() =>
                                this.props.onVoteChange(
                                    voteItem,
                                    this.state.comment
                                )
                            }
                        >
                            <SaveIcon className={classes.leftIcon} />
                            Save comment
                        </Button>
                    </div>
                )}

                {voteResult && <SessionVoteTextResult result={voteResult} />}
            </Grid>
        )
    }
}

SessionVoteText.propTypes = {
    classes: PropTypes.object.isRequired,
    voteItem: PropTypes.object.isRequired,
    chipColors: PropTypes.array
}

export default withStyles(styles)(SessionVoteText)
