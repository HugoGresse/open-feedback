import { combineReducers } from 'redux'
import sessionReducer from './component/session/core/sessionReducer'
import speakerReducer from './component/speaker/core/speakerReducer'
import projectReducer from './component/project/core/projectReducer'

const rootReducer = combineReducers({
    sessions: sessionReducer,
    speakers: speakerReducer,
    project: projectReducer
})

export default rootReducer
