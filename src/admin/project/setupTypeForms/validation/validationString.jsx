import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_JSONURL,
} from '../../../../core/setupType/projectApi'

const talkIdValid = 'Some talk IDs are not valid (empty string or no data).'
const talkTitleValid =
    'Some talk titles are not valid (empty string or no data).'
const talkStartEndValid = 'Some talk start or end times are not valid.'
const talkTrackTitleValid =
    'Some track titles are not valid (empty string or no data).'
const talkTagsValid =
    'Some talk tags are not valid (tags key is optional, but if present should be an array).'
const talkSpeakersValid =
    'Some talk speakers are not valid. It should be an array of string ids.'
const noSpeaker = 'There is %s talk(s) without speaker(s).'
const speakersMissing = 'There is %s speaker(s) missing from the speaker data.'
const talkPlusSpeakerCount = "We've found %s talk(s) and %s speaker(s)."

const speakerIdValid =
    'Some speaker IDs are not valid (empty string or no data).'
const speakerNameValid =
    'Some speaker names are not valid (empty string or no data).'
const speakerPhotoUrlValid =
    'Some speaker photo urls are not valid (empty string, not http(s) url or no data).'

const validationText = {
    connection: {
        [PROJECT_TYPE_JSONURL]: {
            connecting: 'We are fetching your json.',
            connected: 'We received your data.',
            error:
                'We failed to get your data, the server may be offline, or the url may be wrong.',
        },
        [PROJECT_TYPE_HOVERBOARDV2]: {
            connecting: 'We are connecting to your Firestore database.',
            connected: 'We are connected to Firestore.',
            error:
                'We failed to connected to your Firestore. Are the credentials valid? Did you setup additional restriction on the domain?',
        },
    },
    validModel: 'Model valid.',
    notValidModel: 'Model not valid.',
    model: {
        [PROJECT_TYPE_JSONURL]: {
            speakersOrTalksObjectFound:
                'We did not found the %s object(s) in your json. It may be missing, may not be an object with key:value inside or be empty. Check the json model for more information.',
            talk: {
                idValid: talkIdValid,
                titleValid: talkTitleValid,
                startEndTimeValid:
                    talkStartEndValid +
                    ' The date formatting should match this format: 2019-06-27T16:20:00+02:00',
                trackTitleValid: talkTrackTitleValid,
                speakersValid: talkSpeakersValid,
                noSpeakers: noSpeaker,
                speakersMissing: speakersMissing,
                talkCount: talkPlusSpeakerCount,
                tagsValid: talkTagsValid,
            },
            speaker: {
                idValid: speakerIdValid,
                nameValid: speakerNameValid,
                photoUrlValid: speakerPhotoUrlValid,
            },
        },
        [PROJECT_TYPE_HOVERBOARDV2]: {
            speakersOrTalksObjectFound:
                'We did not found the %s object(s) in your data. It may be missing, empty or not named correctly. Is your database model matching Hoverboard v2 Firestore model?',
            talk: {
                idValid: talkIdValid,
                titleValid: talkTitleValid,
                startEndTimeValid:
                    talkStartEndValid +
                    ' The date should be correctly set within the schedule collection in Firestore.',
                trackTitleValid: talkTrackTitleValid,
                speakersValid: talkSpeakersValid,
                noSpeakers: noSpeaker,
                speakersMissing: speakersMissing,
                talkCount: talkPlusSpeakerCount,
                tagsValid: talkTagsValid,
            },
            speaker: {
                idValid: speakerIdValid,
                nameValid: speakerNameValid,
                photoUrlValid: speakerPhotoUrlValid,
            },
        },
    },
}
export default validationText
