import {
    GET_PROJECT_ERROR,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_VOTE_RESULT_ERROR,
    GET_PROJECT_VOTE_RESULT_SUCCESS,
    SET_SELECTED_DATE,
} from './projectActionTypes'
import { fireStoreMainInstance } from '../../firebase'
import { getProjectSelector } from './projectSelectors'
import { initProjectApi } from '../../core/setupType/projectApi'

export const getProject = (projectId) => (dispatch) => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .get()
        .then((projectSnapshot) => {
            if (projectSnapshot.exists) {
                const project = projectSnapshot.data()
                project.id = projectId
                // noinspection JSDeprecatedSymbols
                project.voteItems = getVoteLabelInClosestLanguage(
                    project.voteItems,
                    navigator.language || navigator.userLanguage
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
        .catch((err) => {
            dispatch({
                type: GET_PROJECT_ERROR,
                payload: err.toString(),
            })
        })
}

export const setSelectedDate = (date) => ({
    type: SET_SELECTED_DATE,
    payload: {
        date: date,
    },
})

export const getVoteResult = (talkId) => (dispatch, getState) => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(getProjectSelector(getState()).id)
        .collection('sessionVotes')
        .doc(talkId)
        .get()
        .then((talkSnapshot) => {
            const inputVotes = talkSnapshot.data()

            // Add the vote id inside the actual vote to be re-used on other parts
            const votesWithIds = inputVotes
                ? Object.keys(inputVotes).reduce((acc, key) => {
                      if (Object.keys(inputVotes[key]).length === 0) {
                          acc[key] = inputVotes[key]
                      } else {
                          acc[key] = {
                              ...Object.keys(inputVotes[key]).reduce(
                                  (acc2, key2) => {
                                      acc2[key2] = {
                                          ...inputVotes[key][key2],
                                          id: key2,
                                      }
                                      return acc2
                                  },
                                  {}
                              ),
                          }
                      }
                      return acc
                  }, {})
                : {}

            const talk = {
                id: talkSnapshot.id,
                ...votesWithIds,
            }

            dispatch({
                type: GET_PROJECT_VOTE_RESULT_SUCCESS,
                payload: talk,
            })
        })
        .catch((err) => {
            dispatch({
                type: GET_PROJECT_VOTE_RESULT_ERROR,
                payload: err,
            })
        })
}

const getVoteLabelInClosestLanguage = (voteItems, navigatorLang) => {
    if (!voteItems) {
        return []
    }
    if (!navigatorLang || voteItems.length === 0) {
        return voteItems
    }

    const firstPick = navigatorLang
    const secondPick = navigatorLang.split('-')[0]

    return voteItems.map((item) => {
        if (!item.languages || item.languages.length === 0) {
            return item
        }

        if (item.languages[firstPick]) {
            return {
                ...item,
                name: item.languages[firstPick],
            }
        }

        const matchingSecondPicks = Object.keys(item.languages).filter(
            (lang) => {
                const language = lang.split('-')[0]
                return language && language === secondPick
            }
        )

        if (
            matchingSecondPicks.length > 0 &&
            item.languages[matchingSecondPicks[0]]
        ) {
            return {
                ...item,
                name: item.languages[matchingSecondPicks[0]],
            }
        }

        return {
            ...item,
            name: item.name || '',
        }
    })
}
