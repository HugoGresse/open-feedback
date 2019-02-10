import { combineReducers } from 'redux'
import sessionsReducer from './component/sessions/core/sessionsReducer'
import sessionReducer from './component/session/core/sessionReducer'
import speakerReducer from './component/speaker/core/speakerReducer'
import projectReducer from './component/project/projectReducer'
import authReducer from './component/auth/authReducer'
import voteReducer from './component/vote/voteReducer'

const rootReducer = combineReducers({
    sessions: sessionsReducer,
    session: sessionReducer,
    speakers: speakerReducer,
    project: projectReducer,
    auth: authReducer,
    votes: voteReducer
})

export default rootReducer
