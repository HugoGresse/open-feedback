import { EventData } from '../eventDataNormalization'

// Read-only API over an in-memory, already-normalized JSON event blob.
// Exposes the same getTalks()/getSpeakers() surface the setup validation
// (src/core/setupType/validation.js) expects, so an uploaded/pasted JSON
// file can be validated exactly like a fetched JSON URL.
class JsonImportApi {
    data: EventData

    constructor(config: { jsonData?: EventData | null }) {
        this.data = config.jsonData || {}
    }

    getJsonData(): Promise<EventData> {
        return Promise.resolve(this.data)
    }

    getTalks() {
        return this.getJsonData().then((data) => data.sessions)
    }

    getTalk(talkId: string) {
        return this.getJsonData().then((data) => ({
            [talkId]: data.sessions?.[talkId],
        }))
    }

    getSpeakers() {
        return this.getJsonData().then((data) => data.speakers)
    }

    isReadOnly() {
        return false
    }
}

export default JsonImportApi
