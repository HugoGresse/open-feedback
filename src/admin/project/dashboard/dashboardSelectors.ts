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
import { countTalkVotesAndComments } from '../talks/talkVoteCount'
import { createAppSelector, type RootState } from '../../../store'
import type { AdminDashboardState } from './dashboardReducer'
import type {
    DashboardTalkVotes,
    DashboardUserVote,
} from './dashboardActionTypes'
import type { Speaker, SpeakersMap, Talk, VoteItem } from '../../../core/models'

/** A talk with its vote and comment counts, as listed by the dashboard. */
export interface TalkWithVotes {
    talkId: string
    voteCount: number
    commentCount: number
    title: string
    trackTitle?: string
    /** `undefined` entries are speaker ids not found in the speakers list. */
    speakers: (Speaker | undefined)[]
    /** Day of the talk (YYYY-MM-DD), from its start time. */
    date?: string | null
}

/** Number of votes created during one hour. */
export interface VotesByHour {
    date: DateTime
    /** YYYY-MM-DD */
    day: string
    hour: number
    voteCount: number
}

/** One point of the votes per hour chart (`x` is the 2 digits hour). */
export interface VoteTimelinePoint {
    x: string
    y: number
    dateTime: DateTime
}

/** Chart points of each day (YYYY-MM-DD), indexed by hour (0-23). */
export type VotesByDay = Record<string, VoteTimelinePoint[]>

const getDashboard = (state: RootState): AdminDashboardState =>
    getAdminStateSelector(state).adminDashboard
const getDashboardData = (state: RootState) => getDashboard(state).data
const getTalkVotes = (state: RootState) => getDashboardData(state).talkVotes
const getUserVotes = (state: RootState) => getDashboardData(state).userVotes

export const getActiveUserVoteSelector = createAppSelector(
    getUserVotes,
    (userVotes) =>
        userVotes.filter((vote) => vote.status === VOTE_STATUS_ACTIVE)
)

// MEMOIZED

export const getTalksWithVotesSelector = createAppSelector(
    getTalkVotes,
    getTalksAsArraySelector,
    isTalkLoadedSelector,
    getSpeakersListSelector,
    (
        talkVotes: Record<string, DashboardTalkVotes>,
        talkList: Talk[],
        isTalkLoaded: boolean,
        speakers: SpeakersMap
    ): TalkWithVotes[] => {
        if (Object.keys(talkList).length <= 0 || !isTalkLoaded) {
            return []
        }

        return talkList.reduce<TalkWithVotes[]>((acc, talk) => {
            const voteCounts = countTalkVotesAndComments(
                talkVotes[talk.id]?.votes
            )

            acc.push({
                talkId: talk.id,
                voteCount: voteCounts.votes,
                commentCount: voteCounts.comments,
                title: talk.title,
                trackTitle: talk.trackTitle,
                speakers:
                    talk.speakers && Object.keys(speakers).length > 0
                        ? talk.speakers.map(
                              (speakerId): Speaker | undefined =>
                                  speakers[speakerId]
                          )
                        : [],
                date: talk.startTime && talk.startTime.split('T')[0],
            })

            return acc
        }, [])
    }
)

export const getMostVotedTalkSelector = createAppSelector(
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

export const getLeastVotedTalkSelector = createAppSelector(
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

export const getMostCommentedTalkSelector = createAppSelector(
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

export const getVotesByHourSelector = createAppSelector(
    getActiveUserVoteSelector,
    (userVotes): VotesByHour[] => {
        let tempDate: DateTime
        let tempDateString: string
        const collection = userVotes.reduce<Record<string, VotesByHour>>(
            (acc, userVote) => {
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
            },
            {}
        )
        return Object.values(collection)
    }
)

export const getVotesByDaySelector = createAppSelector(
    getVotesByHourSelector,
    (votesByHours): VotesByDay => {
        const hours = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
        ]
        return votesByHours.reduce<VotesByDay>((acc, hourVote) => {
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

const getVoteByUserSelector = createAppSelector(
    getActiveUserVoteSelector,
    (userVotes) => groupBy(userVotes, 'userId')
)

const getBooleanVotesSelector = createAppSelector(
    getActiveUserVoteSelector,
    getBooleanVoteItemsSelector,
    (userVotes, booleanVoteItems: VoteItem[]) => {
        const booleansVoteItemIds = booleanVoteItems.map((item) => item.id)
        return userVotes.filter((vote) =>
            booleansVoteItemIds.includes(vote.voteItemId)
        )
    }
)

const getCommentVotesSelector = createAppSelector(
    getActiveUserVoteSelector,
    getCommentVoteItemSelector,
    (userVotes, textVoteItems: VoteItem[] | undefined): DashboardUserVote[] => {
        if (!textVoteItems) {
            return []
        }
        const textVoteItemIds = textVoteItems.map((item) => item.id)
        return userVotes.filter((vote) =>
            textVoteItemIds.includes(vote.voteItemId)
        )
    }
)

export const getTotalVoterCountSelector = createAppSelector(
    getVoteByUserSelector,
    (voteByUser) => Object.keys(voteByUser).length
)

export const getTotalVoteCountSelector = createAppSelector(
    getBooleanVotesSelector,
    (booleanVotes) => booleanVotes.length
)

export const getTotalCommentsSelector = createAppSelector(
    getCommentVotesSelector,
    (commentVotes) => commentVotes.length
)

export const getBooleanCountByUser = createAppSelector(
    getTotalVoteCountSelector,
    getTotalVoterCountSelector,
    (voteCount, voters) => {
        if (!voters) {
            return 0
        }
        return round1Decimals(voteCount / voters)
    }
)

export const getCommentCountByUser = createAppSelector(
    getTotalCommentsSelector,
    getTotalVoterCountSelector,
    (commentCount, voters) => {
        if (!voters) {
            return 0
        }
        return round1Decimals(commentCount / voters)
    }
)
