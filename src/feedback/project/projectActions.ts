import type firebase from 'firebase/compat/app'
import {
    GET_PROJECT_ERROR,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_VOTE_RESULT_ERROR,
    GET_PROJECT_VOTE_RESULT_SUCCESS,
    type ProjectAction,
    SET_SELECTED_DATE,
} from './projectActionTypes'
import { fireStoreMainInstance } from '../../firebase.ts'
import { getProjectSelector, isLiveUserVotesSelector } from './projectSelectors'
import { initProjectApi } from '../../core/setupType/projectApi'
import type {
    AggregatedTalkVotes,
    AggregatedTextVotes,
    Project,
    VoteItem,
} from '../../core/models'
import type { AppThunk } from '../../store'

export const getProject =
    (projectId: string): AppThunk<Promise<void>> =>
    (dispatch) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .get()
            .then((projectSnapshot) => {
                if (projectSnapshot.exists) {
                    // Firestore boundary: the document is a project.
                    const project = projectSnapshot.data() as Project
                    project.id = projectId
                    project.voteItems = getVoteLabelInClosestLanguage(
                        project.voteItems,
                        navigator.language ||
                            // Legacy IE property, missing from the DOM typings.
                            (navigator as Navigator & { userLanguage?: string })
                                .userLanguage
                    )

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
            .catch((err: Error) => {
                dispatch({
                    type: GET_PROJECT_ERROR,
                    payload: err.toString(),
                })
            })
    }

export const setSelectedDate = (date: string): ProjectAction => ({
    type: SET_SELECTED_DATE,
    payload: {
        date: date,
    },
})

/**
 * Load the aggregated votes of the talk. When the project uses live votes,
 * the returned function unsubscribes from the updates.
 */
export const getVoteResult =
    (talkId: string): AppThunk<(() => void) | undefined> =>
    (dispatch, getState) => {
        const onNewVotes = (snapshot: firebase.firestore.DocumentSnapshot) => {
            // Firestore boundary: sessionVotes/{talkId} holds the aggregated votes.
            const inputVotes = snapshot.data() as
                AggregatedTalkVotes | undefined

            // Add the vote id inside the actual vote to be re-used on other parts
            const votesWithIds = inputVotes
                ? Object.keys(inputVotes).reduce<AggregatedTalkVotes>(
                      (acc, key) => {
                          const value = inputVotes[key]
                          // A boolean vote item counter has no keys either
                          if (
                              typeof value === 'number' ||
                              Object.keys(value).length === 0
                          ) {
                              acc[key] = value
                          } else {
                              acc[key] = {
                                  ...Object.keys(
                                      value
                                  ).reduce<AggregatedTextVotes>(
                                      (acc2, key2) => {
                                          acc2[key2] = {
                                              ...value[key2],
                                              id: key2,
                                          }
                                          return acc2
                                      },
                                      {}
                                  ),
                              }
                          }
                          return acc
                      },
                      {}
                  )
                : {}

            const talk = {
                id: snapshot.id,
                ...votesWithIds,
            }

            dispatch({
                type: GET_PROJECT_VOTE_RESULT_SUCCESS,
                payload: talk,
            })
        }

        const onError = (error: firebase.firestore.FirestoreError) => {
            dispatch({
                type: GET_PROJECT_VOTE_RESULT_ERROR,
                payload: error,
            })
        }

        // The votes are only loaded once the project is.
        const projectId = getProjectSelector(getState())!.id

        if (isLiveUserVotesSelector(getState())) {
            return fireStoreMainInstance
                .collection('projects')
                .doc(projectId)
                .collection('sessionVotes')
                .doc(talkId)
                .onSnapshot((snapshot) => onNewVotes(snapshot), onError)
        } else {
            fireStoreMainInstance
                .collection('projects')
                .doc(projectId)
                .collection('sessionVotes')
                .doc(talkId)
                .get()
                .then(onNewVotes)
                .catch(onError)
        }
    }

const getVoteLabelInClosestLanguage = (
    voteItems: VoteItem[] | undefined,
    navigatorLang: string | undefined
): VoteItem[] => {
    if (!voteItems) {
        return []
    }
    if (!navigatorLang || voteItems.length === 0) {
        return voteItems
    }

    const firstPick = navigatorLang
    const secondPick = navigatorLang.split('-')[0]

    return voteItems.map((item) => {
        // languages is an object: the former `languages.length === 0` check
        // was always false.
        const languages = item.languages
        if (!languages) {
            return item
        }

        if (languages[firstPick]) {
            return {
                ...item,
                name: languages[firstPick],
            }
        }

        const matchingSecondPicks = Object.keys(languages).filter((lang) => {
            const language = lang.split('-')[0]
            return language && language === secondPick
        })

        if (
            matchingSecondPicks.length > 0 &&
            languages[matchingSecondPicks[0]]
        ) {
            return {
                ...item,
                name: languages[matchingSecondPicks[0]],
            }
        }

        return {
            ...item,
            name: item.name || '',
        }
    })
}
