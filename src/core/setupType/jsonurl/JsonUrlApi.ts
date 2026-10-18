import { isString } from '../../../utils/stringUtils'
import type { JsonUrlConfig, SpeakersMap, TalksMap } from '../../models'
import type { ProjectApi } from '../projectApi'

interface JsonUrlEventData {
    sessions: TalksMap
    speakers: SpeakersMap
}

export class JsonUrlApi implements ProjectApi {
    jsonUrl: string
    data: JsonUrlEventData | null

    constructor(config: JsonUrlConfig) {
        this.jsonUrl = config.jsonUrl
        this.data = null
    }

    getJsonData(): Promise<JsonUrlEventData> {
        if (this.data) {
            return Promise.resolve(this.data)
        }
        return fetch(this.jsonUrl).then(async (response) => {
            if (response.ok) {
                // JSON boundary: the file may miss keys or hold numeric ids,
                // the setup validation reports such issues.
                const data = (await response.json()) as JsonUrlEventData
                this.data = data
                if (data.sessions) {
                    let tempId = ''
                    // Convert numeric id to string
                    Object.values(data.sessions).forEach((talk) => {
                        tempId = '' + talk.id
                        data.sessions[tempId] = {
                            ...talk,
                            id: tempId,
                        }
                        // Cleanup to only keep strings
                        const speakers = data.sessions[tempId].speakers
                        if (speakers && Array.isArray(speakers)) {
                            data.sessions[tempId].speakers = speakers.filter(
                                (id) => isString(id)
                            )
                        }
                        const tags = data.sessions[tempId].tags
                        if (tags && Array.isArray(tags)) {
                            data.sessions[tempId].tags = tags.filter((id) =>
                                isString(id)
                            )
                        }
                    })
                }
                return data
            } else {
                throw new Error(
                    'Something went wrong when loading the data. ' +
                        JSON.stringify(response)
                )
            }
        })
    }

    getTalks(): Promise<TalksMap> {
        return this.getJsonData().then((data) => data.sessions)
    }

    getTalk(talkId: string): Promise<TalksMap> {
        return this.getJsonData().then((data) => {
            // An unknown id resolves to no talk instead of `{[id]: undefined}`
            const talk = data.sessions?.[talkId]
            return talk ? { [talkId]: talk } : {}
        })
    }

    getSpeakers(): Promise<SpeakersMap> {
        return this.getJsonData().then((data) => data.speakers)
    }

    isReadOnly() {
        return true
    }
}
