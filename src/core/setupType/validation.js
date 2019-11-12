import moment from 'moment'

const validate = async (api) => {
    let result = {
        dataAvailable: false,
        speakersObjectFound: false,
        sessionsObjectFound: false,
        session: {
            idValid: false,
            titleValid: false,
            startEndTimeValid: false,
            trackTitleValid: false,
            speakersValid: false,
            noSpeakers: 0,
            speakersMissing: 0,
            sessionCount: 0
        },
        speaker: {
            idValid: false,
            nameValid: false,
            photoUrlValid: false,
            speakerCount: 0
        }
    }

    try {
        const sessions = await api.getSessions()
        const speakers = await api.getSpeakers()

        result.dataAvailable = true

        const sessionsResult = validateSessions(sessions, speakers)
        const speakerResult = validateSpeakers(speakers)

        return {
            ...result,
            ...sessionsResult,
            ...speakerResult,
            isSuccessful: sessionsResult.sessionsObjectFound && !Object.values(sessionsResult.session).includes(false) &&
                speakerResult.speakersObjectFound && !Object.values(speakerResult.speaker).includes(false)
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
    }

    return result
}

const validateSessions = (sessions, speakers) => {
    const result = {
        sessionsObjectFound: true,
        session: {
            idValid: true,
            titleValid: true,
            startEndTimeValid: true,
            trackTitleValid: true,
            speakersValid: true,
            noSpeakers: 0,
            speakersMissing: 0,
            sessionCount: 0
        }
    }
    if (!sessions || typeof sessions !== 'object') {
        return {
            sessionsObjectFound: false,
            session: {
                idValid: false,
                titleValid: false,
                startEndTimeValid: false,
                trackTitleValid: false,
                speakersValid: false,
                noSpeakers: 0,
                speakersMissing: 0,
                sessionCount: 0
            }
        }
    }

    let tempSession
    Object.keys(sessions).forEach(key => {
        tempSession = sessions[key]
        if (tempSession || typeof sessions === 'object') {
            result.session.sessionCount++

            if (key !== tempSession.id) {
                result.session.idValid = false
            }
            if (!tempSession.title) {
                result.session.titleValid = false
            }
            if (!tempSession.startTime || !tempSession.endTime) {
                result.session.startEndTimeValid = false
            } else if (!moment(tempSession.startTime).isValid() || !moment(tempSession.endTime).isValid()) {
                result.session.startEndTimeValid = false
            }

            if (!tempSession.trackTitle) {
                result.session.trackTitleValid = false
            }
            if (!tempSession.speakers || tempSession.speakers.constructor !== Array) {
                result.session.speakersValid = false
            } else {
                tempSession.speakers.forEach(speakerId => {
                    if (!speakers || !speakers[speakerId]) {
                        result.session.speakersMissing++
                    }
                })
                if (tempSession.speakers.length <= 0) {
                    result.session.noSpeakers++
                }
            }
        }
    })

    return result
}

const validateSpeakers = (speakers) => {
    const result = {
        speakersObjectFound: true,
        speaker: {
            idValid: true,
            nameValid: true,
            photoUrlValid: true,
            speakerCount: 0
        }
    }
    if (!speakers || typeof speakers !== 'object') {
        return {
            speakersObjectFound: false,
            speaker: {
                idValid: false,
                nameValid: false,
                photoUrlValid: false,
                speakerCount: 0
            }
        }
    }

    let speaker
    Object.keys(speakers).forEach(key => {
        speaker = speakers[key]
        result.speaker.speakerCount++
        if (key !== speaker.id) {
            result.speaker.idValid = false
        }

        if (!speaker.name) {
            result.speaker.nameValid = false
        }
        if (!speaker.photoUrl || (!speaker.photoUrl.startsWith("https://") && !speaker.photoUrl.startsWith("http://"))) {
            result.speaker.photoUrlValid = false
        }
    })

    return result
}

export default validate
