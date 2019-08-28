import { combineReducers } from 'redux'
import sessionsReducer from './core/sessions/sessionsReducer'
import sessionReducer from './feedback/session/core/sessionReducer'
import speakerReducer from './feedback/speaker/core/speakerReducer'
import projectReducer from './feedback/project/projectReducer'
import authReducer from './feedback/auth/authReducer'
import voteReducer from './feedback/vote/voteReducer'
import adminReducer from './admin/adminReducer'

const rootReducer = combineReducers({
    sessions: sessionsReducer,
    session: sessionReducer,
    speakers: speakerReducer,
    project: projectReducer,
    auth: authReducer,
    votes: voteReducer,
    admin: adminReducer
})

export default rootReducer
