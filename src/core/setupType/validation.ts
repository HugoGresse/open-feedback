import { DateTime } from 'luxon'

/** Any source exposing talks & speakers, their content is checked here. */
export interface ValidationApi {
    getTalks(): Promise<unknown>
    getSpeakers(): Promise<unknown>
}

export interface TalkValidation {
    idValid: boolean
    titleValid: boolean
    startEndTimeValid: boolean
    trackTitleValid: boolean
    speakersValid: boolean
    tagsValid: boolean
    noSpeakers: number
    speakersMissing: number
    talkCount: number
}

export interface SpeakerValidation {
    idValid: boolean
    nameValid: boolean
    photoUrlValid: boolean
    speakerCount: number
}

interface TalksValidationResult {
    talksObjectFound: boolean
    talk: TalkValidation
}

interface SpeakersValidationResult {
    speakersObjectFound: boolean
    speaker: SpeakerValidation
}

export interface ValidationResult
    extends TalksValidationResult, SpeakersValidationResult {
    dataAvailable: boolean
    /** Missing when the data could not be loaded. */
    isSuccessful?: boolean
}

// Raw, unchecked entries of the talks/speakers maps (JSON boundary).
interface RawTalk {
    id?: unknown
    title?: unknown
    startTime?: string
    endTime?: string
    tags?: unknown
    speakers?: unknown
}

interface RawSpeaker {
    id?: unknown
    name?: unknown
    photoUrl?: string
}

export const validate = async (
    api: ValidationApi
): Promise<ValidationResult> => {
    const result: ValidationResult = {
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

const validateTalks = (
    talks: unknown,
    speakers: unknown
): TalksValidationResult => {
    const result: TalksValidationResult = {
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

    const talksMap = talks as Record<string, RawTalk>
    const speakersMap = speakers as Record<string, unknown> | null | undefined
    const talkKeys = Object.keys(talksMap)
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
        let tempTalk: RawTalk
        talkKeys.forEach((key) => {
            tempTalk = talksMap[key]
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
                        const talkSpeakers = tempTalk.speakers as string[]
                        talkSpeakers.forEach((speakerId) => {
                            if (!speakersMap || !speakersMap[speakerId]) {
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

const validateSpeakers = (speakers: unknown): SpeakersValidationResult => {
    const result: SpeakersValidationResult = {
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

    const speakersMap = speakers as Record<string, RawSpeaker>
    const speakerKeys = Object.keys(speakersMap)
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
        let speaker: RawSpeaker
        speakerKeys.forEach((key) => {
            speaker = speakersMap[key]
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
