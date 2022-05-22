import { fireStoreMainInstance } from '../../../firebase'
import { ADD_VOTE_ERROR, ADD_VOTE_SUCCESS } from '../voteActionTypes'
import { trackVote } from '../../utils/track'

export const addVoteToDb = (
    projectId,
    projectName,
    docId,
    voteContent,
    voteItem,
    onError
) => (dispatch) => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .collection('userVotes')
        .doc(docId)
        .set(voteContent, { merge: true })
        .then(() => {
            dispatch({
                type: ADD_VOTE_SUCCESS,
                payload: {
                    voteId: docId,
                },
            })
            trackVote(projectName, projectId, voteItem.type)
            return Promise.resolve()
        })
        .catch((error) => {
            dispatch({
                type: ADD_VOTE_ERROR,
                payload: {
                    error: `Unable to save the vote, ${error}`,
                    voteId: voteContent.id,
                },
            })

            onError(error)
        })
}
