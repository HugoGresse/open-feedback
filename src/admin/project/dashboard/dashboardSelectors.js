import { createSelector } from 'reselect'
import {
    getSessionsList,
    isSessionLoadedSelector
} from '../../../core/sessions/sessionsSelectors'

const getDashboard = state => state.adminDashboard
const getDashboardData = state => getDashboard(state).data
const getSessionVotes = state => getDashboardData(state).sessionVotes

// MEMOIZED

export const getMostVotedSessionSelector = createSelector(
    getSessionVotes,
    getSessionsList,
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

                if (!sessionlist[session.id]) {
                    console.log('Sessions not found: ' + session.id)
                }

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
