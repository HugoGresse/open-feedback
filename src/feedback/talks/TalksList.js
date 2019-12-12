import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setSelectedTalk } from '../talk/core/talkActions'
import TalksItem from './TalksItem'
import Grid from '@material-ui/core/Grid'
import { getVotesByTalkSelector } from '../vote/voteSelectors'
import Title from '../../baseComponents/design/Title'

import { getCurrentTalksGroupByTrackSelector } from '../../core/talks/talksSelectors'

class TalksList extends Component {
    onTalkClicked = talk => {
        this.props.setSelectedTalk(talk.id)
    }

    render() {
        const { userTalkVote, talks } = this.props

        return talks.map((track, key) => (
            <div key={key}>
                <Title
                    component="h3"
                    fontSize={20}
                    fontWeight={400}
                    mt={40}
                    mb={30}>
                    {track.track}
                </Title>

                <Grid container spacing={2}>
                    {track.talks.map((talk, key) => (
                        <TalksItem
                            key={key}
                            talk={talk}
                            userVote={userTalkVote[talk.id]}
                            onClick={this.onTalkClicked}
                        />
                    ))}
                </Grid>
            </div>
        ))
    }
}

const mapStateToProps = state => ({
    userTalkVote: getVotesByTalkSelector(state),
    currentTalksByTrack: getCurrentTalksGroupByTrackSelector(state),
})

const mapDispatchToProps = Object.assign(
    {},
    {
        setSelectedTalk: setSelectedTalk,
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(TalksList)
