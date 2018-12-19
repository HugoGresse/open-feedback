import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import sessionReducer from "./component/session/core/sessionReducer"
import scheduleReducer from "./component/schedule/core/scheduleReducer"

const rootReducer = combineReducers({
    sessions: sessionReducer,
    schedule: scheduleReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
})

export default rootReducer
