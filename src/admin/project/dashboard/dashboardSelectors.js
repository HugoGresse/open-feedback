import { createSelector } from 'reselect'
import {
    getTalksAsArraySelector,
    isTalkLoadedSelector,
} from '../../../core/talks/talksSelectors'
import { getAdminStateSelector } from '../../adminSelector'
import { groupBy } from 'lodash'
import {
    getBooleanVoteItemsSelector,
    getCommentVoteItemSelector,
} from '../settings/votingForm/votingFormSelectors'
import { round1Decimals } from '../../../utils/numberUtils'
import { VOTE_STATUS_ACTIVE } from '../../../core/contants'
import { getSpeakersListSelector } from '../../../core/speakers/speakerSelectors'

const getDashboard = state => getAdminStateSelector(state).adminDashboard
const getDashboardData = state => getDashboard(state).data
const getTalkVotes = state => getDashboardData(state).talkVotes
const getUserVotes = state => getDashboardData(state).userVotes

export const getActiveUserVoteSelector = createSelector(
    getUserVotes,
    userVotes => userVotes.filter(vote => vote.status === VOTE_STATUS_ACTIVE)
)

// MEMOIZED

export const getTalksWithVotesSelector = createSelector(
    getTalkVotes,
    getTalksAsArraySelector,
    isTalkLoadedSelector,
    getSpeakersListSelector,
    (talkVotes, talkList, isTalkLoaded, speakers) => {
        if (Object.keys(talkList).length <= 0 || !isTalkLoaded) {
            return []
        }

        let votes
        let voteObject
        let voteItemObject
        let commentCount
        return talkList.reduce((acc, talk) => {
            voteObject = talkVotes[talk.id]

            if (!voteObject) {
                votes = {}
            } else {
                votes = voteObject.votes
            }

            const voteCounts = Object.keys(votes).reduce(
                (acc, id) => {
                    voteItemObject = votes[id]
                    if (Number.isInteger(voteItemObject)) {
                        return {
                            ...acc,
                            votes: acc.votes + voteItemObject,
                        }
                    }
                    commentCount = Object.keys(voteItemObject).length
                    return {
                        ...acc,
                        votes: acc.votes + commentCount,
                        comments: acc.comments + commentCount,
                    }
                },
                { votes: 0, comments: 0 }
            )

            acc.push({
                talkId: talk.id,
                voteCount: voteCounts.votes,
                commentCount: voteCounts.comments,
                title: talk.title,
                trackTitle: talk.trackTitle,
                speakers:
                    talk.speakers && Object.keys(speakers).length > 0
                        ? talk.speakers.map(speakerId => speakers[speakerId])
                        : [],
                date: talk.startTime && talk.startTime.split('T')[0],
            })

            return acc
        }, [])
    }
)

export const getMostVotedTalkSelector = createSelector(
    getTalksWithVotesSelector,
    talksWithVotes =>
        talksWithVotes
            .sort((a, b) => {
                if (a.voteCount < b.voteCount) {
                    return 1
                }
                if (a.voteCount > b.voteCount) {
                    return -1
                }
                return 0
            })
            .slice(0, 10)
)

export const getLeastVotedTalkSelector = createSelector(
    getTalksWithVotesSelector,
    talksWithVotes =>
        talksWithVotes
            .sort((a, b) => {
                if (a.voteCount < b.voteCount) {
                    return -1
                }
                if (a.voteCount > b.voteCount) {
                    return 1
                }
                return 0
            })
            .slice(0, 10)
)

export const getMostCommentedTalkSelector = createSelector(
    getTalksWithVotesSelector,
    talksWithVotes =>
        talksWithVotes
            .sort((a, b) => {
                if (a.commentCount < b.commentCount) {
                    return 1
                }
                if (a.commentCount > b.commentCount) {
                    return -1
                }
                return 0
            })
            .slice(0, 10)
)

export const getVotesByHourSelector = createSelector(
    getActiveUserVoteSelector,
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

const getVoteByUserSelector = createSelector(
    getActiveUserVoteSelector,
    userVotes => groupBy(userVotes, 'userId')
)

const getBooleanVotesSelector = createSelector(
    getActiveUserVoteSelector,
    getBooleanVoteItemsSelector,
    (userVotes, booleanVoteItems) => {
        const booleansVoteItemIds = booleanVoteItems.map(item => item.id)
        return userVotes.filter(vote =>
            booleansVoteItemIds.includes(vote.voteItemId)
        )
    }
)

const getCommentVotesSelector = createSelector(
    getActiveUserVoteSelector,
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

export const getTotalVoterCountSelector = createSelector(
    getVoteByUserSelector,
    voteByUser => Object.keys(voteByUser).length
)

export const getTotalVoteCountSelector = createSelector(
    getBooleanVotesSelector,
    booleanVotes => booleanVotes.length
)

export const getTotalCommentsSelector = createSelector(
    getCommentVotesSelector,
    commentVotes => commentVotes.length
)

export const getBooleanCountByUser = createSelector(
    getTotalVoteCountSelector,
    getTotalVoterCountSelector,
    (voteCount, voters) => {
        if (!voters) {
            return 0
        }
        return round1Decimals(voteCount / voters)
    }
)

export const getCommentCountByUser = createSelector(
    getTotalCommentsSelector,
    getTotalVoterCountSelector,
    (commentCount, voters) => {
        if (!voters) {
            return 0
        }
        return round1Decimals(commentCount / voters)
    }
)
