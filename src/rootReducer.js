import { combineReducers } from 'redux'
import talksReducer from './core/talks/talksReducer'
import talkReducer from './feedback/talk/core/talkReducer'
import speakerReducer from './core/speakers/speakerReducer'
import projectReducer from './feedback/project/projectReducer'
import authReducer from './feedback/auth/authReducer'
import voteReducer from './feedback/vote/voteReducer'
import adminReducer from './admin/adminReducer'

const rootReducer = combineReducers({
    talks: talksReducer,
    talk: talkReducer,
    speakers: speakerReducer,
    project: projectReducer,
    auth: authReducer,
    votes: voteReducer,
    admin: adminReducer,
})

export default rootReducer
