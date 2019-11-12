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
                    let tempId = ""
                    // Convert numeric id to string
                    Object.values(this.data.sessions).forEach(session => {
                        tempId = "" + session.id
                        this.data.sessions[tempId] = {
                            ...session,
                            id: tempId
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

    getSessions(state) {
        return this.getJsonData(state).then(data => data.sessions)
    }

    getSession(state, sessionId) {
        return this.getJsonData(state).then(data => {
            return {
                [sessionId]: data.sessions[sessionId]
            }
        })
    }

    getSpeakers(state) {
        return this.getJsonData(state).then(data => data.speakers)
    }
}

export default JsonUrlApi
