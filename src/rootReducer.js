import { combineReducers } from 'redux'
import sessionReducer from './component/session/core/sessionReducer'
import speakerReducer from './component/speaker/core/speakerReducer'
import projectReducer from './component/project/core/projectReducer'
import authReducer from './component/auth/authReducer'

const rootReducer = combineReducers({
    sessions: sessionReducer,
    speakers: speakerReducer,
    project: projectReducer,
    auth: authReducer
})

export default rootReducer
