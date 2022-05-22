import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TalkVoteBoolean from './boolean/TalkVoteBoolean'
import { TalkVoteText } from './text/TalkVoteText'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../core/contants'

class TalkItemVote extends Component {
    render() {
        const {
            voteItem,
            userVotes,
            voteResult,
            chipColors,
            onVoteChange,
        } = this.props

        switch (voteItem.type) {
            default:
            case VOTE_TYPE_BOOLEAN:
                return (
                    <TalkVoteBoolean
                        onVoteChange={(voteItem) => {
                            onVoteChange(
                                voteItem,
                                null,
                                userVotes && userVotes[0]
                            )
                        }}
                        voteItem={voteItem}
                        isSelected={!!userVotes}
                        voteResult={voteResult}
                        chipColors={chipColors}
                    />
                )
            case VOTE_TYPE_TEXT:
                return (
                    <TalkVoteText
                        onVoteChange={onVoteChange}
                        voteItem={voteItem}
                        currentUserVotes={userVotes}
                        voteResult={voteResult}
                        chipColors={chipColors}
                    />
                )
        }
    }
}

TalkItemVote.propTypes = {
    voteItem: PropTypes.object.isRequired,
    chipColors: PropTypes.array,
}

export default TalkItemVote
