import type { EventData } from '../eventDataNormalization'

// Thin API over an in-memory, already-normalized JSON event blob. Exposes the
// getTalks()/getSpeakers() surface the setup validation
// (src/core/setupType/validation.js) expects, so an uploaded/pasted JSON file
// can be validated exactly like a fetched JSON URL. isReadOnly() returns false
// because the import produces a normal, editable openfeedbackv1 event.
export class JsonImportApi {
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
        return this.getJsonData().then((data) => {
            // An unknown id resolves to no talk instead of `{[id]: undefined}`
            const talk = data.sessions?.[talkId]
            return talk ? { [talkId]: talk } : {}
        })
    }

    getSpeakers() {
        return this.getJsonData().then((data) => data.speakers)
    }

    isReadOnly() {
        return false
    }
}
