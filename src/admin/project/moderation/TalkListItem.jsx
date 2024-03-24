import React from 'react'
import OFListItem from '../../baseComponents/layouts/OFListItem.jsx'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import TalkListItemSpeakerList from '../talks/TalkListItemSpeakerList.jsx'
import TextVoteList from './TextVoteList.jsx'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../../core/contants'
import CollapsePanel from '../../baseComponents/layouts/CollapsePanel.jsx'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    headerCell: {
        paddingBottom: 16,
    },
    title: {
        wordBreak: 'break-word',
        fontWeight: 'bold',
        lineHeight: '40px',
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

    const activeVotes = votes.filter(
        (vote) => vote.status === VOTE_STATUS_ACTIVE
    )
    const hiddenVotes = votes.filter(
        (vote) => vote.status === VOTE_STATUS_HIDDEN
    )

    return (
        <OFListItem>
            <Grid item xs={12} sm={8} className={classes.headerCell}>
                <Typography className={classes.title} variant="h6">
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
