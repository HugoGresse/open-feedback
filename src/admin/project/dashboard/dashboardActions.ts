import {
    type DashboardTalkVotes,
    type DashboardUserVote,
    GET_TALK_VOTES_ERROR,
    GET_TALK_VOTES_SUCCESS,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS,
} from './dashboardActionTypes'
import { fireStoreMainInstance } from '../../../firebase.ts'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import type { AppThunk } from '../../../store'
import type { AggregatedTalkVotes } from '../../../core/models'

/** Reads the `sessionVotes` documents of a project, keyed by talk id. */
export const fetchTalkVotes = (
    projectId: string
): Promise<Record<string, DashboardTalkVotes>> =>
    fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .collection('sessionVotes')
        .get()
        .then((snapshots) => {
            const talkVotes: Record<string, DashboardTalkVotes> = {}
            snapshots.forEach((doc) => {
                talkVotes[doc.id] = {
                    id: doc.id,
                    votes: doc.data() as AggregatedTalkVotes,
                }
            })
            return talkVotes
        })

export const getTalkVotes = (): AppThunk<Promise<void> | undefined> => {
    return (dispatch, getState) => {
        const projectId = getSelectedProjectIdSelector(getState())

        if (!projectId) {
            return
        }

        return fetchTalkVotes(projectId)
            .then((talkVotes) => {
                dispatch({
                    type: GET_TALK_VOTES_SUCCESS,
                    payload: talkVotes,
                })
            })
            .catch((err: unknown) => {
                dispatch({
                    type: GET_TALK_VOTES_ERROR,
                    payload: String(err),
                })
            })
    }
}

export const getUserVotes = (): AppThunk<Promise<void> | undefined> => {
    return (dispatch, getState) => {
        const projectId = getSelectedProjectIdSelector(getState())

        if (!projectId) {
            return
        }
        return fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .collection('userVotes')
            .orderBy('createdAt')
            .get()
            .then((snapshot) => {
                const userVotes: DashboardUserVote[] = []
                snapshot.forEach((doc) => {
                    userVotes.push({
                        fireStoreId: doc.id,
                        ...(doc.data() as Omit<
                            DashboardUserVote,
                            'fireStoreId'
                        >),
                    })
                })

                dispatch({
                    type: GET_USER_VOTES_SUCCESS,
                    payload: userVotes,
                })
            })
            .catch((err: unknown) => {
                dispatch({
                    type: GET_USER_VOTES_ERROR,
                    payload: String(err),
                })
            })
    }
}
