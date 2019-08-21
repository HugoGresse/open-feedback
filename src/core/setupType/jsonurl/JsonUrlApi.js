let data = null
let jsonUrl = ''

class JsonUrlApi {
    constructor(project) {
        if (project.config.jsonUrl !== jsonUrl) {
            jsonUrl = project.config.jsonUrl
            data = null
        }
    }

    getJsonData() {
        if (data) {
            return Promise.resolve(data)
        }
        return fetch(jsonUrl).then(response => {
            if (response.ok) {
                data = response.json()
                return data
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
