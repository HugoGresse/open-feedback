import { createSelector } from 'reselect'
import {
    getTalksListSelector,
    isTalkLoadedSelector,
} from '../../../core/talks/talksSelectors'
import { getAdminStateSelector } from '../../adminSelector'
import { groupBy } from 'lodash'
import {
    getBooleanVoteItemsSelector,
    getCommentVoteItemSelector,
} from '../settings/votingForm/votingFormSelectors'
import { round1Decimals } from '../../../utils/numberUtils'

const getDashboard = state => getAdminStateSelector(state).adminDashboard
const getDashboardData = state => getDashboard(state).data
const getTalkVotes = state => getDashboardData(state).talkVotes
const getUserVotes = state => getDashboardData(state).userVotes

// MEMOIZED

export const getMostVotedTalkSelector = createSelector(
    getTalkVotes,
    getTalksListSelector,
    isTalkLoadedSelector,
    (talkVotes, talklist, isTalkLoaded) => {
        if (Object.keys(talklist).length <= 0 || !isTalkLoaded) {
            return []
        }

        let votes
        return talkVotes
            .reduce((acc, talk) => {
                votes = talk.votes

                const voteCount = Object.keys(votes).reduce((acc, id) => {
                    if (Number.isInteger(votes[id])) {
                        return acc + votes[id]
                    }
                    return acc + 1
                }, 0)

                acc.push({
                    talkId: talk.id,
                    voteCount: voteCount,
                    title: talklist[talk.id].title,
                    trackTitle: talklist[talk.id].trackTitle,
                    date:
                        talklist[talk.id].startTime &&
                        talklist[talk.id].startTime.split('T')[0],
                })

                return acc
            }, [])
            .sort((a, b) => {
                if (a.voteCount < b.voteCount) {
                    return 1
                }
                if (a.voteCount > b.voteCount) {
                    return -1
                }
                return 0
            })
            .slice(0, 20)
    }
)

export const getVotesByHourSelector = createSelector(
    getUserVotes,
    userVotes => {
        let tempDate
        let tempDateString
        const collection = userVotes.reduce((acc, userVote) => {
            tempDate = userVote.createdAt.toDate()
            tempDateString =
                tempDate.getUTCFullYear() +
                '-' +
                (tempDate.getUTCMonth() + 1) +
                '-' +
                tempDate.getUTCDate() +
                ' ' +
                tempDate.getHours()

            if (acc[tempDateString]) {
                acc[tempDateString] = {
                    ...acc[tempDateString],
                    voteCount: acc[tempDateString].voteCount + 1,
                }
            } else {
                acc[tempDateString] = {
                    date: tempDateString,
                    day:
                        tempDate.getUTCDate() + ' ' + tempDate.getHours() + 'h',
                    voteCount: 1,
                }
            }
            return acc
        }, [])
        return Object.values(collection)
    }
)

const getVoteByUserSelector = createSelector(getUserVotes, userVotes =>
    groupBy(userVotes, 'userId')
)

const getBooleanVotesSelector = createSelector(
    getUserVotes,
    getBooleanVoteItemsSelector,
    (userVotes, booleanVoteItems) => {
        const booleansVoteItemIds = booleanVoteItems.map(item => item.id)
        return userVotes.filter(vote =>
            booleansVoteItemIds.includes(vote.voteItemId)
        )
    }
)

const getCommentVotesSelector = createSelector(
    getUserVotes,
    getCommentVoteItemSelector,
    (userVotes, textVoteItems) => {
        if (!textVoteItems) {
            return []
        }
        const textVoteItemIds = [textVoteItems.id]
        return userVotes.filter(vote =>
            textVoteItemIds.includes(vote.voteItemId)
        )
    }
)

export const getTotalVotersSelector = createSelector(
    getVoteByUserSelector,
    voteByUser => Object.keys(voteByUser).length
)

export const getTotalVotesSelector = createSelector(
    getBooleanVotesSelector,
    booleanVotes => booleanVotes.length
)

export const getTotalCommentsSelector = createSelector(
    getCommentVotesSelector,
    commentVotes => commentVotes.length
)

export const getBooleanCountByUser = createSelector(
    getTotalVotesSelector,
    getTotalVotersSelector,
    (voteCount, voters) => {
        if (!voters) {
            return 0
        }
        return round1Decimals(voteCount / voters)
    }
)

export const getCommentCountByUser = createSelector(
    getTotalCommentsSelector,
    getTotalVotersSelector,
    (commentCount, voters) => {
        if (!voters) {
            return 0
        }
        return round1Decimals(commentCount / voters)
    }
)
