import React, { useEffect, useState } from 'react'
import { emphasize, styled } from '@mui/material'
import Grid from '@mui/material/Grid'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import TalkVoteTextResult from './TalkVoteTextResult.jsx'
import { Trans, useTranslation } from 'react-i18next'
import { VOTE_STATUS_HIDDEN, VOTE_TYPE_TEXT_PLUS } from '../../../core/contants'
import COLORS from '../../../constants/colors'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    itemContainer: {
        margin: -1,
    },
    item: {
        overflow: 'hidden',
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
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

const VoteTextField = styled(TextField)({
    width: '100%',
    height: '100%',
    border: "none",
    '& .MuiInput-underline:after, & .MuiInput-underline:before': {
        borderBottom: 'none !important',
    },
});

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
        if (currentUserVotes && (!data.dataLoaded || !data.vote)) {
            const foundTextVote = currentUserVotes.find(
                (vote) => !!vote.text && vote.voteType !== VOTE_TYPE_TEXT_PLUS
            )
            if (foundTextVote) {
                setData({
                    dataLoaded: true,
                    comment: foundTextVote.text,
                    status: foundTextVote.status,
                    vote: foundTextVote,
                })
            }
        }
    }, [currentUserVotes, data.vote, data.dataLoaded])

    const onTextChange = (event) => {
        setData({
            ...data,
            comment: event.target.value,
        })
    }

    const onVoteDelete = () => {
        setData({
            ...data,
            comment: '',
            status: null,
            vote: null,
        })
        if (data.vote) {
            onVoteChange(voteItem, null, data.vote)
        }
    }

    const saveUpdateKey =
        currentUserVotes && data.dataLoaded ? 'comment.update' : 'comment.save'

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
                <VoteTextField
                    multiline
                    fullWidth
                    variant="standard"
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
