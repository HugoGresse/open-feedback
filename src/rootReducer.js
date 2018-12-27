import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import sessionReducer from './component/session/core/sessionReducer'
import speakerReducer from './component/speaker/core/speakerReducer'

const rootReducer = combineReducers({
  sessions: sessionReducer,
  speakers: speakerReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
})

export default rootReducer
