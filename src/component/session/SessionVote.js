import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../vote/voteReducer'
import SessionVoteText from './SessionVoteText'
import SessionVoteBoolean from './SessionVoteBoolean'

class SessionItemVote extends Component {
    render() {
        const {
            voteItem,
            userVote,
            voteResult,
            chipColors,
            onVoteChange
        } = this.props

        switch (voteItem.type) {
            default:
            case VOTE_TYPE_BOOLEAN:
                return (
                    <SessionVoteBoolean
                        onVoteChange={onVoteChange}
                        voteItem={voteItem}
                        isSelected={!!userVote}
                        voteResult={voteResult}
                        chipColors={chipColors}
                    />
                )
            case VOTE_TYPE_TEXT:
                return (
                    <SessionVoteText
                        onVoteChange={onVoteChange}
                        voteItem={voteItem}
                        currentUserVote={userVote}
                        voteResult={voteResult}
                        chipColors={chipColors}
                    />
                )
        }
    }
}

SessionItemVote.propTypes = {
    voteItem: PropTypes.object.isRequired,
    chipColors: PropTypes.array
}

export default SessionItemVote
