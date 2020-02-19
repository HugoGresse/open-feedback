import React from 'react'
import OFListItem from '../../baseComponents/layouts/OFListItem'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import TalkListItemSpeakerList from '../talks/TalkListItemSpeakerList'
import TextVoteList from './TextVoteList'

const useStyles = makeStyles(() => ({
    headerCell: {
        paddingBottom: 16,
    },
}))

const TalkListItem = ({ talk, speakers, votes, onSpeakerClicked }) => {
    const classes = useStyles()

    return (
        <OFListItem>
            <Grid item xs={12} sm={8} className={classes.headerCell}>
                <Typography
                    style={{ fontWeight: 600, lineHeight: '40px' }}
                    variant="h6">
                    {talk.title}
                </Typography>
            </Grid>
            <Grid xs={12} sm={4} className={classes.headerCell} item>
                <TalkListItemSpeakerList
                    speakersIds={talk.speakers}
                    speakers={speakers}
                    onSpeakerClicked={onSpeakerClicked}
                />
            </Grid>
            <Grid xs={12} item>
                <TextVoteList
                    textVotes={votes}
                    onVoteHideClick={voteId => {
                        // TODO
                        console.log('TODO : hide vote')
                    }}
                />
            </Grid>
        </OFListItem>
    )
}

export default TalkListItem
