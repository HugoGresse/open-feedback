import HoverboardV2Api from './hoverboardv2/Hoverboardv2Api'
import JsonUrlApi from './jsonurl/JsonUrlApi'
import OpenfeedbackApi from './openfeedback/OpefeedbackApi'

export const PROJECT_TYPE_HOVERBOARDV2 = 'hoverboardv2'
export const PROJECT_TYPE_JSONURL = 'jsonurl'
export const PROJECT_TYPE_OPENFEEDBACK = 'openfeedbackv1'

const notImplementApi = {
    // eslint-disable-next-line no-unused-vars
    getTalks() {
        logProjectNotInitialized()
    },
    // eslint-disable-next-line no-unused-vars
    getTalk(talkId) {
        logProjectNotInitialized()
    },
    // eslint-disable-next-line no-unused-vars
    addTalk(newTalk) {
        logProjectNotInitialized()
    },
    // eslint-disable-next-line no-unused-vars
    removeTalk(talkId) {
        logProjectNotInitialized()
    },
    // eslint-disable-next-line no-unused-vars
    editTalk(talk) {
        logProjectNotInitialized()
    },
    // eslint-disable-next-line no-unused-vars
    getSpeakers() {
        logProjectNotInitialized()
    },
    // eslint-disable-next-line no-unused-vars
    addSpeaker(speaker) {
        logProjectNotInitialized()
    },
    // eslint-disable-next-line no-unused-vars
    removeSpeaker(speakerId) {
        logProjectNotInitialized()
    },
    // eslint-disable-next-line no-unused-vars
    editSpeaker(speaker) {
        logProjectNotInitialized()
    },
    isReadOnly() {
        logProjectNotInitialized()
    },
}

export let projectApi = notImplementApi

export const getProjectApi = (projectType, project) => {
    switch (projectType) {
        case PROJECT_TYPE_HOVERBOARDV2: {
            return new HoverboardV2Api(project.config)
        }
        case PROJECT_TYPE_JSONURL: {
            return new JsonUrlApi(project.config)
        }
        case PROJECT_TYPE_OPENFEEDBACK: {
            return new OpenfeedbackApi(project.id)
        }
        default: {
            return null
        }
    }
}

export const initProjectApi = (projectType, project) => {
    projectApi = getProjectApi(projectType, project)
}

const logProjectNotInitialized = () => {
    // eslint-disable-next-line no-console
    console.warn('The project is not initialized yet.')
}
