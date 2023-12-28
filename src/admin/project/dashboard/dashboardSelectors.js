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
import { round1Decimals, twoDigits } from '../../../utils/numberUtils'
import { VOTE_STATUS_ACTIVE } from '../../../core/contants'
import { getSpeakersListSelector } from '../../../core/speakers/speakerSelectors'
import { DateTime } from 'luxon'

const getDashboard = (state) => getAdminStateSelector(state).adminDashboard
const getDashboardData = (state) => getDashboard(state).data
const getTalkVotes = (state) => getDashboardData(state).talkVotes
const getUserVotes = (state) => getDashboardData(state).userVotes

export const getActiveUserVoteSelector = createSelector(
    getUserVotes,
    (userVotes) =>
        userVotes.filter((vote) => vote.status === VOTE_STATUS_ACTIVE)
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
                        ? talk.speakers.map((speakerId) => speakers[speakerId])
                        : [],
                date: talk.startTime && talk.startTime.split('T')[0],
            })

            return acc
        }, [])
    }
)

export const getMostVotedTalkSelector = createSelector(
    getTalksWithVotesSelector,
    (talksWithVotes) =>
        talksWithVotes
            .filter((talk) => talk.voteCount > 0)
            .sort((a, b) => {
                if (a.voteCount < b.voteCount) {
                    return 1
                }
                if (a.voteCount > b.voteCount) {
                    return -1
                }
                return 0
            })
            .slice(0, 30)
)

export const getLeastVotedTalkSelector = createSelector(
    getTalksWithVotesSelector,
    (talksWithVotes) =>
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
            .slice(0, 30)
)

export const getMostCommentedTalkSelector = createSelector(
    getTalksWithVotesSelector,
    (talksWithVotes) =>
        talksWithVotes
            .filter((talk) => talk.commentCount > 0)
            .sort((a, b) => {
                if (a.commentCount < b.commentCount) {
                    return 1
                }
                if (a.commentCount > b.commentCount) {
                    return -1
                }
                return 0
            })
            .slice(0, 30)
)

export const getVotesByHourSelector = createSelector(
    getActiveUserVoteSelector,
    (userVotes) => {
        let tempDate
        let tempDateString
        const collection = userVotes.reduce((acc, userVote) => {
            if (!userVote.createdAt) {
                // console.warn(
                //     'userVote.createdAt is null or undefined, this should not happen',
                //     userVote
                // )
                return acc
            }
            tempDate = DateTime.fromJSDate(userVote.createdAt.toDate())
            tempDateString = `${tempDate.year}-${tempDate.month}-${tempDate.day} ${tempDate.hour}`

            if (acc[tempDateString]) {
                acc[tempDateString] = {
                    ...acc[tempDateString],
                    voteCount: acc[tempDateString].voteCount + 1,
                }
            } else {
                acc[tempDateString] = {
                    date: tempDate,
                    day: `${tempDate.year}-${twoDigits(
                        tempDate.month
                    )}-${twoDigits(tempDate.day)}`,
                    hour: tempDate.hour,
                    voteCount: 1,
                }
            }
            return acc
        }, [])
        return Object.values(collection)
    }
)

export const getVotesByDaySelector = createSelector(
    getVotesByHourSelector,
    (votesByHours) => {
        const hours = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
        ]
        return votesByHours.reduce((acc, hourVote) => {
            if (!acc[hourVote.day]) {
                acc[hourVote.day] = []
                // Add missing hours
                hours.forEach((hour) => {
                    acc[hourVote.day][hour] = {
                        x: twoDigits(hour),
                        y: 0,
                        dateTime: hourVote.date.set({ hour, minute: 0 }),
                    }
                })
            }
            acc[hourVote.day][hourVote.hour] = {
                x: twoDigits(hourVote.hour),
                y: hourVote.voteCount,
                dateTime: hourVote.date.set({ minute: 0 }),
            }

            return acc
        }, {})
    }
)

const getVoteByUserSelector = createSelector(
    getActiveUserVoteSelector,
    (userVotes) => groupBy(userVotes, 'userId')
)

const getBooleanVotesSelector = createSelector(
    getActiveUserVoteSelector,
    getBooleanVoteItemsSelector,
    (userVotes, booleanVoteItems) => {
        const booleansVoteItemIds = booleanVoteItems.map((item) => item.id)
        return userVotes.filter((vote) =>
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
        const textVoteItemIds = textVoteItems.map((item) => item.id)
        return userVotes.filter((vote) =>
            textVoteItemIds.includes(vote.voteItemId)
        )
    }
)

export const getTotalVoterCountSelector = createSelector(
    getVoteByUserSelector,
    (voteByUser) => Object.keys(voteByUser).length
)

export const getTotalVoteCountSelector = createSelector(
    getBooleanVotesSelector,
    (booleanVotes) => booleanVotes.length
)

export const getTotalCommentsSelector = createSelector(
    getCommentVotesSelector,
    (commentVotes) => commentVotes.length
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
