import HoverboardV2Api from './hoverboardv2/Hoverboardv2Api'
import JsonUrlApi from './jsonurl/JsonUrlApi'

const PROJECT_TYPE_HOVERBOARDV2 = 'hoverboardv2'
const PROJECT_TYPE_JSONURL = 'jsonurl'

const notImplementApi = {
    getSessions(state) {
        logProjectNotInitialized()
    },
    getSession(state, sessionId) {
        logProjectNotInitialized()
    },
    getSpeakers(state) {
        logProjectNotInitialized()
    }
}

export let projectApi = notImplementApi

export const initProjectApi = (projectType, project) => {
    switch (projectType) {
        case PROJECT_TYPE_HOVERBOARDV2: {
            projectApi = new HoverboardV2Api(project)
            break
        }
        case PROJECT_TYPE_JSONURL: {
            projectApi = new JsonUrlApi(project)
            break
        }
        default: {
            console.error('This project type has not been implemented')
            break
        }
    }
}

const logProjectNotInitialized = () => {
    console.warn('The project is not initialized yet.')
}
