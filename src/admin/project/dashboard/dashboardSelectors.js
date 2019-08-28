import { createSelector } from 'reselect'
import {
    getSessionsListSelector,
    isSessionLoadedSelector
} from '../../../core/sessions/sessionsSelectors'
import { getAdminStateSelector } from '../../adminSelector'

const getDashboard = state => getAdminStateSelector(state).adminDashboard
const getDashboardData = state => getDashboard(state).data
const getSessionVotes = state => getDashboardData(state).sessionVotes
const getUserVotes = state => getDashboardData(state).userVotes

// MEMOIZED

export const getMostVotedSessionSelector = createSelector(
    getSessionVotes,
    getSessionsListSelector,
    isSessionLoadedSelector,
    (sessionVotes, sessionlist, isSessionLoaded) => {
        if (Object.keys(sessionlist).length <= 0 || !isSessionLoaded) {
            return []
        }

        let votes
        return sessionVotes
            .reduce((acc, session) => {
                votes = session.votes

                const voteCount = Object.keys(votes).reduce((acc, id) => {
                    if (Number.isInteger(votes[id])) {
                        return acc + votes[id]
                    }
                    return acc + 1
                }, 0)

                acc.push({
                    sessionId: session.id,
                    voteCount: voteCount,
                    title: sessionlist[session.id].title,
                    trackTitle: sessionlist[session.id].trackTitle
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
            .slice(0, 5)
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
                    voteCount: acc[tempDateString].voteCount + 1
                }
            } else {
                acc[tempDateString] = {
                    date: tempDateString,
                    day:
                        tempDate.getUTCDate() + ' ' + tempDate.getHours() + 'h',
                    voteCount: 1
                }
            }
            return acc
        }, [])
        return Object.values(collection)
    }
)
