import React from 'react'
import OFListItem from '../../baseComponents/layouts/OFListItem'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import TalkListItemSpeakerList from '../talks/TalkListItemSpeakerList'
import TextVoteList from './TextVoteList'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../../core/contants'
import CollapsePanel from '../../baseComponents/layouts/CollapsePanel'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    headerCell: {
        paddingBottom: 16,
    },
}))

const TalkListItem = ({
    talk,
    speakers,
    votes,
    onSpeakerClicked,
    onVoteExpandClick,
    onVoteHideClick,
}) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const activeVotes = votes.filter(vote => vote.status === VOTE_STATUS_ACTIVE)
    const hiddenVotes = votes.filter(vote => vote.status === VOTE_STATUS_HIDDEN)

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
                    textVotes={activeVotes}
                    onVoteHideClick={onVoteHideClick}
                    onVoteExpandClick={onVoteExpandClick}
                />
            </Grid>
            {hiddenVotes.length > 0 && (
                <Grid xs={12} item>
                    <CollapsePanel buttonText={t('moderation.hidden')}>
                        <TextVoteList
                            textVotes={hiddenVotes}
                            onVoteHideClick={onVoteHideClick}
                            onVoteExpandClick={onVoteExpandClick}
                        />
                    </CollapsePanel>
                </Grid>
            )}
        </OFListItem>
    )
}

export default TalkListItem
