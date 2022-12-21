import { isString } from '../../../utils/stringUtils'

class JsonUrlApi {
    constructor(config) {
        if (config.jsonUrl !== this.jsonUrl) {
            this.jsonUrl = config.jsonUrl
            this.data = null
        }
    }

    getJsonData() {
        if (this.data) {
            return Promise.resolve(this.data)
        }
        return fetch(this.jsonUrl).then(async (response) => {
            if (response.ok) {
                this.data = await response.json()
                if (this.data.sessions) {
                    let tempId = ''
                    // Convert numeric id to string
                    Object.values(this.data.sessions).forEach((talk) => {
                        tempId = '' + talk.id
                        this.data.sessions[tempId] = {
                            ...talk,
                            id: tempId,
                        }
                        // Cleanup to only keep strings
                        if (
                            this.data.sessions[tempId].speakers &&
                            Array.isArray(this.data.sessions[tempId].speakers)
                        ) {
                            this.data.sessions[tempId].speakers =
                                this.data.sessions[tempId].speakers.filter(
                                    (id) => isString(id)
                                )
                        }
                        if (
                            this.data.sessions[tempId].tags &&
                            Array.isArray(this.data.sessions[tempId].tags)
                        ) {
                            this.data.sessions[tempId].tags =
                                this.data.sessions[tempId].tags.filter((id) =>
                                    isString(id)
                                )
                        }
                    })
                }
                return this.data
            } else {
                throw new Error(
                    'Something went wrong when loading the data. ' +
                        JSON.stringify(response)
                )
            }
        })
    }

    getTalks() {
        return this.getJsonData().then((data) => data.sessions)
    }

    getTalk(talkId) {
        return this.getJsonData().then((data) => {
            return {
                [talkId]: data.sessions[talkId],
            }
        })
    }

    getSpeakers() {
        return this.getJsonData().then((data) => data.speakers)
    }

    isReadOnly() {
        return true
    }
}

export default JsonUrlApi
