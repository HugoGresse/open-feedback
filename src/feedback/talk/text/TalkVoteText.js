import React, { useEffect, useState } from 'react'
import { emphasize } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import InfoIcon from '@material-ui/icons/Info'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import TalkVoteTextResult from './TalkVoteTextResult'
import { Trans, useTranslation } from 'react-i18next'
import { VOTE_STATUS_HIDDEN } from '../../../core/contants'
import COLORS from '../../../constants/colors'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
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
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.paperBorder,
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: emphasize(theme.palette.background.paper, 0.07),
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 200ms ease-out',
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
        marginLeft: 16,
        backgroundColor: '#3673ff',
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
}))

export const TalkVoteText = ({
    currentUserVotes,
    onVoteChange,
    voteItem,
    voteResult,
    chipColors,
}) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const [data, setData] = useState({
        comment: '',
        status: null,
        dataLoaded: false,
    })

    useEffect(() => {
        if (currentUserVotes && !data.dataLoaded) {
            const foundTextVote = currentUserVotes.find((vote) => !!vote.text)
            if (foundTextVote) {
                setData({
                    dataLoaded: true,
                    comment: foundTextVote.text,
                    status: foundTextVote.status,
                    vote: foundTextVote,
                })
            }
        }
    }, [currentUserVotes, data.dataLoaded])

    const onTextChange = (event) => {
        setData({
            ...data,
            comment: event.target.value,
        })
    }

    const onVoteDelete = () => {
        onVoteChange(voteItem, null, data.vote)

        setData({
            ...data,
            comment: '',
            status: null,
            vote: null,
        })
    }

    const saveUpdateKey = currentUserVotes ? 'comment.update' : 'comment.save'

    return (
        <Grid
            item
            xs={12}
            sm={12}
            md={12}
            className={classes.itemContainer}
            data-testid="VoteItem"
        >
            <Typography variant="h6" color="textPrimary" component="h3">
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
                    onChange={onTextChange}
                    value={data.comment}
                />
            </Paper>
            {data.status && data.status === VOTE_STATUS_HIDDEN && (
                <div className={classes.voteHidden}>
                    <InfoIcon className={classes.voteHiddenIcon} />
                    <Trans i18nKey="comment.hidden" />
                </div>
            )}

            {data.comment && (
                <div className={classes.buttonContainer}>
                    <Button onClick={onVoteDelete}>
                        <DeleteIcon className={classes.leftIcon} />
                        <Trans i18nKey="comment.delete">Delete comment</Trans>
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.saveButton}
                        onClick={() => onVoteChange(voteItem, data.comment)}
                    >
                        <SaveIcon className={classes.leftIcon} />
                        <Trans i18nKey={saveUpdateKey} />
                    </Button>
                </div>
            )}

            {voteResult && (
                <TalkVoteTextResult
                    result={voteResult}
                    voteItem={voteItem}
                    chipColors={chipColors}
                    currentUserVotes={currentUserVotes}
                />
            )}
        </Grid>
    )
}
