import type {
    HoverboardV2Config,
    JsonUrlConfig,
    NewSpeaker,
    NewTalk,
    Project,
    Speaker,
    SpeakersMap,
    Talk,
    TalksMap,
} from '../models'
import { Hoverboardv2Api } from './hoverboardv2/Hoverboardv2Api'
import { JsonUrlApi } from './jsonurl/JsonUrlApi'
import { OpenfeedbackApi } from './openfeedback/OpefeedbackApi'

export const PROJECT_TYPE_HOVERBOARDV2 = 'hoverboardv2'
export const PROJECT_TYPE_JSONURL = 'jsonurl'
export const PROJECT_TYPE_OPENFEEDBACK = 'openfeedbackv1'
// Wizard-only pseudo type: importing a JSON file creates a regular,
// editable openfeedbackv1 event (talks/speakers written to Firestore),
// so it never reaches getProjectApi / is never persisted as a setupType.
export const PROJECT_TYPE_JSONIMPORT = 'jsonimport'

/**
 * Source of the talks and speakers of a project, depending on its setupType.
 * Read-only sources (Hoverboard, JSON url) do not implement the write
 * methods: the admin UI checks isReadOnly() before offering any edition.
 */
export interface ProjectApi {
    getTalks(): Promise<TalksMap>
    /** Resolves to a map holding the single talk. */
    getTalk(talkId: string): Promise<TalksMap>
    getSpeakers(): Promise<SpeakersMap>
    isReadOnly(): boolean
    /** Resolves to the id of the new talk. */
    addTalk?(newTalk: NewTalk): Promise<string>
    removeTalk?(talkId: string): Promise<void>
    editTalk?(talk: Talk): Promise<void>
    /** Resolves to the id of the new speaker. */
    addSpeaker?(speaker: NewSpeaker): Promise<string>
    removeSpeaker?(speakerId: string): Promise<void>
    editSpeaker?(speaker: Speaker): Promise<void>
}

const logProjectNotInitialized = () => {
    // biome-ignore lint/suspicious/noConsole: intentional log
    console.warn('The project is not initialized yet.')
}

// Used until a project is loaded. Every call fails synchronously (like the
// former `undefined.then(...)`), except isReadOnly().
const notInitialized = (): never => {
    logProjectNotInitialized()
    throw new TypeError('The project API is not initialized yet.')
}

const notImplementApi: Required<ProjectApi> = {
    getTalks: notInitialized,
    getTalk: notInitialized,
    addTalk: notInitialized,
    removeTalk: notInitialized,
    editTalk: notInitialized,
    getSpeakers: notInitialized,
    addSpeaker: notInitialized,
    removeSpeaker: notInitialized,
    editSpeaker: notInitialized,
    isReadOnly() {
        logProjectNotInitialized()
        return false
    },
}

export let projectApi: ProjectApi = notImplementApi

type ProjectApiSource = Pick<Project, 'id' | 'config'>

export const getProjectApi = (
    projectType: string | undefined,
    project: ProjectApiSource
): ProjectApi | null => {
    switch (projectType) {
        case PROJECT_TYPE_HOVERBOARDV2: {
            // Firestore boundary: a hoverboardv2 project stores its Hoverboard config.
            return new Hoverboardv2Api(project.config as HoverboardV2Config)
        }
        case PROJECT_TYPE_JSONURL: {
            // Firestore boundary: a jsonurl project stores its json url.
            return new JsonUrlApi(project.config as JsonUrlConfig)
        }
        case PROJECT_TYPE_OPENFEEDBACK: {
            return new OpenfeedbackApi(project.id)
        }
        default: {
            return null
        }
    }
}

export const initProjectApi = (
    projectType: string | undefined,
    project: ProjectApiSource
) => {
    // An unknown setupType falls back to the not-initialized API.
    projectApi = getProjectApi(projectType, project) ?? notImplementApi
}
