import React, { Component } from 'react'
import PropTypes from 'prop-types'
import VoteItemBoolean from './VoteItemBoolean'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../vote/voteReducer'
import VoteItemText from './VoteItemText'

class SessionVoteItem extends Component {
    render() {
        const {
            voteItem,
            userVote,
            voteResult,
            chipColors,
            onClick
        } = this.props

        const isSelected = !!userVote

        switch (voteItem.type) {
            default:
            case VOTE_TYPE_BOOLEAN:
                return (
                    <VoteItemBoolean
                        onClick={onClick}
                        voteItem={voteItem}
                        isSelected={isSelected}
                        voteResult={voteResult}
                        chipColors={chipColors}
                    />
                )
            case VOTE_TYPE_TEXT:
                return (
                    <VoteItemText
                        onClick={onClick}
                        voteItem={voteItem}
                        isSelected={isSelected}
                        voteResult={voteResult}
                        chipColors={chipColors}
                    />
                )
        }
    }
}

SessionVoteItem.propTypes = {
    voteItem: PropTypes.object.isRequired,
    userVote: PropTypes.object,
    chipColors: PropTypes.array
}

export default SessionVoteItem
