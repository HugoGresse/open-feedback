import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import sessionReducer from "./component/session/core/sessionReducer"

const rootReducer = combineReducers({
    sessions: sessionReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
})

export default rootReducer
