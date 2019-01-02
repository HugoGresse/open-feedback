import { combineReducers } from 'redux'
import sessionReducer from './component/session/core/sessionReducer'
import speakerReducer from './component/speaker/core/speakerReducer'

const rootReducer = combineReducers({
  sessions: sessionReducer,
  speakers: speakerReducer
})

export default rootReducer
