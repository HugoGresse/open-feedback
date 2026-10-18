import { fireStoreMainInstance } from '../../../firebase.ts'
import { ADD_VOTE_ERROR, ADD_VOTE_SUCCESS } from '../voteActionTypes'
import { trackVote } from '../../utils/track'
import type { Vote, VoteItem } from '../../../core/models'
import type { AppThunk } from '../../../store'

export const addVoteToDb =
    (
        projectId: string,
        projectName: string,
        docId: string,
        voteContent: Vote,
        voteItem: VoteItem,
        onError: (error: unknown) => void
    ): AppThunk<Promise<void>> =>
    (dispatch) => {
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
            .catch((error: unknown) => {
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
