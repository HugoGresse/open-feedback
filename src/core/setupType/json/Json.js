import { isString } from '../../../utils/stringUtils'

class Json {
    constructor(json) {
        this.data = json
    }

    getJsonData() {
        try {
            this.data = JSON.parse(this.data)
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
                            this.data.sessions[tempId].speakers.filter((id) =>
                                isString(id)
                            )
                    }
                    if (
                        this.data.sessions[tempId].tags &&
                        Array.isArray(this.data.sessions[tempId].tags)
                    ) {
                        this.data.sessions[tempId].tags = this.data.sessions[
                            tempId
                        ].tags.filter((id) => isString(id))
                    }
                })
            }
            return this.data
        } catch (error) {
            throw new Error(
                'Something went wrong when loading the data. ' +
                    JSON.stringify(error)
            )
        }
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

export default Json
