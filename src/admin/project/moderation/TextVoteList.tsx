import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import { TextVoteItem } from './TextVoteItem.tsx'

const useStyles = makeStyles(() => ({
    container: {
        background: '#DDD',
        borderRadius: 10,
        padding: '13px 16px',
        wordBreak: 'break-word',
        height: '100%',
        boxSizing: 'border-box',
    },
}))

export const TextVoteList = ({
    textVotes,
    onVoteHideClick,
    onVoteExpandClick,
}) => {
    const classes = useStyles()

    return (
        <Grid container spacing={2} component="ul">
            {textVotes &&
                textVotes.map((vote) => (
                    <Grid
                        item
                        key={vote.voteId}
                        xs={12}
                        sm={6}
                        md={4}
                        component="li"
                    >
                        <div className={classes.container}>
                            <TextVoteItem
                                vote={vote}
                                onVoteExpandClick={onVoteExpandClick}
                                onVoteHideClick={onVoteHideClick}
                            />
                        </div>
                    </Grid>
                ))}
        </Grid>
    )
}
