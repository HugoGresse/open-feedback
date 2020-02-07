import {
    GET_PROJECT_ERROR,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_VOTE_RESULT_ERROR,
    GET_PROJECT_VOTE_RESULT_SUCCESS,
    SET_SELECTED_DATE,
} from './projectActionTypes'
import { fireStoreMainInstance } from '../../firebase'
import {
    getProjectSelector,
    getProjectVoteItemsSelector,
} from './projectSelectors'
import { initProjectApi } from '../../core/setupType/projectApi'
import { getSelectedTalkIdSelector } from '../talk/core/talkSelectors'
import { VOTE_TYPE_TEXT } from '../vote/voteReducer'

export const getProject = projectId => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .get()
            .then(projectSnapshot => {
                if (projectSnapshot.exists) {
                    const project = projectSnapshot.data()
                    project.id = projectId

                    initProjectApi(project.setupType, project)

                    dispatch({
                        type: GET_PROJECT_SUCCESS,
                        payload: project,
                    })
                } else {
                    dispatch({
                        type: GET_PROJECT_ERROR,
                        payload:
                            'Unknown project id, probably some copy-past issue?',
                    })
                }
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECT_ERROR,
                    payload: err.toString(),
                })
            })
    }
}

export const setSelectedDate = date => ({
    type: SET_SELECTED_DATE,
    payload: {
        date: date,
    },
})

export const getVoteResult = () => {
    return async (dispatch, getState) => {
        const selectedTalkId = getSelectedTalkIdSelector(getState())
        const voteItemList = getProjectVoteItemsSelector(getState())

        if (!voteItemList || voteItemList.length <= 0) {
            return
        }

        try {
            const aggregatesVotesCollectionRef = fireStoreMainInstance
                .collection('projects')
                .doc(getProjectSelector(getState()).id)
                .collection('aggregatedVotes')
                .doc(selectedTalkId)

            const voteItemResults = {}
            for (const voteItem of voteItemList) {
                const querySnapshots = await aggregatesVotesCollectionRef
                    .collection(voteItem.id)
                    .get()

                voteItemResults[voteItem.id] =
                    voteItem.type === VOTE_TYPE_TEXT ? {} : 0

                querySnapshots.forEach(document => {
                    if (voteItem.type === VOTE_TYPE_TEXT) {
                        voteItemResults[voteItem.id] = {
                            ...voteItemResults[voteItem.id],
                            ...document.data().votes,
                        }
                    } else {
                        voteItemResults[voteItem.id] += document.data().votes
                    }
                })
            }

            dispatch({
                type: GET_PROJECT_VOTE_RESULT_SUCCESS,
                payload: {
                    [selectedTalkId]: voteItemResults,
                },
            })
        } catch (error) {
            dispatch({
                type: GET_PROJECT_VOTE_RESULT_ERROR,
                payload: error,
            })
        }
    }
}
