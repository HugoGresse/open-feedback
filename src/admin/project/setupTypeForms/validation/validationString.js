import {PROJECT_TYPE_HOVERBOARDV2, PROJECT_TYPE_JSONURL} from '../../../../core/setupType/projectApi'

const sessionIdValid = 'Some session IDs are not valid (empty string or no data).'
const sessionTitleValid = 'Some session titles are not valid (empty string or no data).'
const sessionStartEndValid = 'Some session start or end times are not valid.'
const sessionTrackTitleValid = 'Some track titles are not valid (empty string or no data).'
const sessionSpeakersValid = 'Some session speakers are not valid. It should be an array of string ids.'
const noSpeaker = 'There is %s session(s) without speaker(s).'
const speakersMissing = 'There is %s speaker(s) missing from the speaker data.'
const sessionPlusSpeakerCount = 'We\'ve found %s session(s) and %s speaker(s).'

const speakerIdValid = 'Some speaker IDs are not valid (empty string or no data).'
const speakerNameValid = 'Some speaker names are not valid (empty string or no data).'
const speakerPhotoUrlValid = 'Some speaker photo urls are not valid (empty string, not http(s) url or no data).'

const validationText = {
    connection: {
        [PROJECT_TYPE_JSONURL]: {
            connecting: 'We are fetching your json.',
            connected: 'We received your data.',
            error: 'We failed to get your data, they server may be offline, or the url may be wrong.'
        },
        [PROJECT_TYPE_HOVERBOARDV2]: {
            connecting: 'We are connecting to your Firestore database.',
            connected: 'We are connected to Firestore.',
            error: 'We failed to connected to your Firestore. Are the credentials valid? Did you setup additional restriction on the domain?'
        },
    },
    validModel: 'Model valid.',
    notValidModel: 'Model not valid.',
    model: {
        [PROJECT_TYPE_JSONURL]: {
            speakersOrSessionsObjectFound: 'We did not found the %s object(s) in your json. It may be missing or may not be an object with key:value inside. Check the json model for more information.',
            session: {
                idValid: sessionIdValid,
                titleValid: sessionTitleValid,
                startEndTimeValid: sessionStartEndValid + ' The date formatting should match this format: 2019-06-27T16:20:00+02:00',
                trackTitleValid: sessionTrackTitleValid,
                speakersValid: sessionSpeakersValid,
                noSpeakers: noSpeaker,
                speakersMissing: speakersMissing,
                sessionCount: sessionPlusSpeakerCount
            },
            speaker: {
                idValid: speakerIdValid,
                nameValid: speakerNameValid,
                photoUrlValid: speakerPhotoUrlValid
            }
        },
        [PROJECT_TYPE_HOVERBOARDV2]: {
            speakersOrSessionsObjectFound: 'We did not found the %s object(s) in your data. It may be missing or not named correctly. Is your database model matching Hoverboard v2 Firestore model?',
            session: {
                idValid: sessionIdValid,
                titleValid: sessionTitleValid,
                startEndTimeValid: sessionStartEndValid + ' The date should be correctly set within the schedule collection in Firestore.',
                trackTitleValid: sessionTrackTitleValid,
                speakersValid: sessionSpeakersValid,
                noSpeakers: noSpeaker,
                speakersMissing: speakersMissing,
                sessionCount: sessionPlusSpeakerCount
            },
            speaker: {
                idValid: speakerIdValid,
                nameValid: speakerNameValid,
                photoUrlValid: speakerPhotoUrlValid
            }
        }
    }
}
export default validationText
