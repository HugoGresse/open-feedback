import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import InfoIcon from '@material-ui/icons/Info'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import TalkVoteTextResult from './TalkVoteTextResult'
import { Trans, withTranslation } from 'react-i18next'
import { VOTE_STATUS_HIDDEN } from '../../core/contants'
import COLORS from '../../constants/colors'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    itemContainer: {
        margin: -1,
    },
    item: {
        overflow: 'hidden',
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        textAlign: 'center',
        fontSize: '17px',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.grey[300],
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: '#f6f6f6',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 200ms ease-out',
    },
    selectedItem: {
        boxShadow: 'inset 0 0 0 5px ' + theme.palette.grey[300],
    },
    voteTitle: {
        color: theme.palette.grey[800],
        zIndex: 2,
    },
    voteResult: {
        position: 'absolute',
        bottom: '5px',
        fontSize: '14px',
        transition: 'all 200ms ease-in-out',
        zIndex: 2,
    },
    backgroundCanvas: {
        width: '100%',
    },
    textArea: {
        width: '100%',
        height: '100%',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
        fontSize: 20,
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    saveButton: {
        backgroundColor: '#6a96ff',
    },
    voteHidden: {
        padding: 10,
        background: COLORS.RED_ORANGE,
        color: 'white',
        margin: '16px 0',
        borderRadius: 6,
    },
    voteHiddenIcon: {
        verticalAlign: 'text-bottom',
    },
})

class TalkVoteText extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comment: '',
            status: null,
            dataLoaded: false,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            (this.props.currentUserVote && !prevProps.currentUserVote) ||
            (this.props.currentUserVote &&
                this.state.comment !== this.props.currentUserVote.text &&
                !this.state.dataLoaded)
        ) {
            this.setState({
                ...this.state,
                dataLoaded: true,
                comment: this.props.currentUserVote.text,
                status: this.props.currentUserVote.status,
            })
        }
    }

    onTextChange = event => {
        this.setState({
            comment: event.target.value,
        })
    }

    onVoteDelete = event => {
        if (this.props.currentUserVote) {
            this.props.onVoteChange(this.props.voteItem, null)
        }
        this.setState({
            comment: '',
            status: null,
        })
    }

    render() {
        const { classes, voteItem, voteResult, t } = this.props

        const saveUpdateKey = this.props.currentUserVote
            ? 'comment.update'
            : 'comment.save'

        return (
            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                className={classes.itemContainer}>
                <Typography variant="h6" color="textPrimary">
                    {voteItem.name}
                </Typography>
                <Paper elevation={1} className={classes.item}>
                    <TextField
                        multiline
                        fullWidth
                        margin="none"
                        InputProps={{
                            disableUnderline: true,
                        }}
                        className={classes.textArea}
                        placeholder={t('comment.placeholder')}
                        onChange={this.onTextChange}
                        value={this.state.comment}
                    />
                </Paper>
                {this.state.status && this.state.status === VOTE_STATUS_HIDDEN && (
                    <div className={classes.voteHidden}>
                        <InfoIcon className={classes.voteHiddenIcon} />
                        <Trans i18nKey="comment.hidden" />
                    </div>
                )}

                {this.state.comment && (
                    <div className={classes.buttonContainer}>
                        <Button onClick={() => this.onVoteDelete()}>
                            <DeleteIcon className={classes.leftIcon} />
                            <Trans i18nKey="comment.delete">
                                Delete comment
                            </Trans>
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
                            }>
                            <SaveIcon className={classes.leftIcon} />
                            <Trans i18nKey={saveUpdateKey} />
                        </Button>
                    </div>
                )}

                {voteResult && <TalkVoteTextResult result={voteResult} />}
            </Grid>
        )
    }
}

TalkVoteText.propTypes = {
    classes: PropTypes.object.isRequired,
    voteItem: PropTypes.object.isRequired,
    chipColors: PropTypes.array,
}

export default withStyles(styles)(withTranslation()(TalkVoteText))
