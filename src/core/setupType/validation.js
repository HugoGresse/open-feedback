import { DateTime } from 'luxon'

const validate = async (api) => {
    let result = {
        dataAvailable: false,
        speakersObjectFound: false,
        talksObjectFound: false,
        talk: {
            idValid: false,
            titleValid: false,
            startEndTimeValid: false,
            trackTitleValid: false,
            speakersValid: false,
            tagsValid: false,
            noSpeakers: 0,
            speakersMissing: 0,
            talkCount: 0,
        },
        speaker: {
            idValid: false,
            nameValid: false,
            photoUrlValid: false,
            speakerCount: 0,
        },
    }

    try {
        const talks = await api.getTalks()
        const speakers = await api.getSpeakers()

        result.dataAvailable = true

        const talksResult = validateTalks(talks, speakers)
        const speakerResult = validateSpeakers(speakers)

        return {
            ...result,
            ...talksResult,
            ...speakerResult,
            isSuccessful:
                talksResult.talksObjectFound &&
                !Object.values(talksResult.talk).includes(false) &&
                speakerResult.speakersObjectFound &&
                !Object.values(speakerResult.speaker).includes(false),
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
    }

    return result
}

const validateTalks = (talks, speakers) => {
    const result = {
        talksObjectFound: true,
        talk: {
            idValid: true,
            titleValid: true,
            startEndTimeValid: true,
            trackTitleValid: true,
            speakersValid: true,
            tagsValid: true,
            noSpeakers: 0,
            speakersMissing: 0,
            talkCount: 0,
        },
    }
    if (!talks || typeof talks !== 'object') {
        return {
            talksObjectFound: false,
            talk: {
                idValid: false,
                titleValid: false,
                startEndTimeValid: true,
                trackTitleValid: false,
                speakersValid: false,
                tagsValid: false,
                noSpeakers: 0,
                speakersMissing: 0,
                talkCount: 0,
            },
        }
    }

    const talkKeys = Object.keys(talks)
    if (talkKeys.length <= 0) {
        return {
            talksObjectFound: false,
            talk: {
                idValid: false,
                titleValid: false,
                startEndTimeValid: true,
                trackTitleValid: false,
                speakersValid: false,
                tagsValid: false,
                noSpeakers: 0,
                speakersMissing: 0,
                talkCount: 0,
            },
        }
    } else {
        let tempTalk
        talkKeys.forEach((key) => {
            tempTalk = talks[key]
            if (tempTalk || typeof talks === 'object') {
                result.talk.talkCount++

                if (key !== tempTalk.id) {
                    result.talk.idValid = false
                }
                if (!tempTalk.title) {
                    result.talk.titleValid = false
                }
                if (
                    (tempTalk.startTime &&
                        !DateTime.fromISO(tempTalk.startTime).isValid) ||
                    (tempTalk.endTime &&
                        !DateTime.fromISO(tempTalk.endTime).isValid)
                ) {
                    result.talk.startEndTimeValid = false
                }

                if (
                    (tempTalk.tags || tempTalk.tags === '') &&
                    !Array.isArray(tempTalk.tags)
                ) {
                    result.talk.tagsValid = false
                }

                if (tempTalk.speakers) {
                    if (tempTalk.speakers.constructor !== Array) {
                        result.talk.speakersValid = false
                    } else {
                        tempTalk.speakers.forEach((speakerId) => {
                            if (!speakers || !speakers[speakerId]) {
                                result.talk.speakersMissing++
                            }
                        })
                    }
                }
            }
        })
    }

    return result
}

const validateSpeakers = (speakers) => {
    const result = {
        speakersObjectFound: true,
        speaker: {
            idValid: true,
            nameValid: true,
            photoUrlValid: true,
            speakerCount: 0,
        },
    }
    if (!speakers || typeof speakers !== 'object') {
        return {
            speakersObjectFound: false,
            speaker: {
                idValid: false,
                nameValid: false,
                photoUrlValid: false,
                speakerCount: 0,
            },
        }
    }

    const speakerKeys = Object.keys(speakers)
    if (speakerKeys.length <= 0) {
        return {
            speakersObjectFound: true,
            speaker: {
                idValid: true,
                nameValid: true,
                photoUrlValid: true,
                speakerCount: 0,
            },
        }
    } else {
        let speaker
        speakerKeys.forEach((key) => {
            speaker = speakers[key]
            result.speaker.speakerCount++
            if (key !== speaker.id) {
                result.speaker.idValid = false
            }

            if (!speaker.name) {
                result.speaker.nameValid = false
            }
            if (
                !speaker.photoUrl ||
                (!speaker.photoUrl.startsWith('https://') &&
                    !speaker.photoUrl.startsWith('http://'))
            ) {
                result.speaker.photoUrlValid = false
            }
        })
    }

    return result
}

export default validate
