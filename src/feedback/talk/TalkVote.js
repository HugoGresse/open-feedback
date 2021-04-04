import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TalkVoteText from './text/TalkVoteText'
import TalkVoteBoolean from './boolean/TalkVoteBoolean'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../core/contants'

class TalkItemVote extends Component {
    render() {
        const {
            voteItem,
            userVote,
            voteResult,
            chipColors,
            onVoteChange,
        } = this.props

        switch (voteItem.type) {
            default:
            case VOTE_TYPE_BOOLEAN:
                return (
                    <TalkVoteBoolean
                        onVoteChange={onVoteChange}
                        voteItem={voteItem}
                        isSelected={!!userVote}
                        voteResult={voteResult}
                        chipColors={chipColors}
                    />
                )
            case VOTE_TYPE_TEXT:
                return (
                    <TalkVoteText
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

TalkItemVote.propTypes = {
    voteItem: PropTypes.object.isRequired,
    chipColors: PropTypes.array,
}

export default TalkItemVote
