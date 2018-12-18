import { GET_SESSION_SUCCESS, GET_SESSION_ERROR, SET_SESSION_FILTER } from "./sessionActionTypes"

export const getSessions = () => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();

        firestore.collection('sessions')
            .get()
            .then((querySnapshot) => {
                let map = {}
                querySnapshot.forEach((doc) => {
                    map[doc.id] = doc.data()
                })
                dispatch({
                    type: GET_SESSION_SUCCESS,
                    payload: map
                });
            })
            .catch(err => {
                dispatch({
                    type: GET_SESSION_ERROR,
                    error: err
                });
            });
    }
}

export const setSessionFilter = (filter) => {
    return (dispatch) => {
        dispatch({
            type: SET_SESSION_FILTER,
            payload: filter
        });
    }

}