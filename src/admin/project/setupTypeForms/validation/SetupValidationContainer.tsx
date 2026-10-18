import {
    STATE_ERROR,
    STATE_IDLE,
    STATE_LOADING,
    STATE_SUCCESS,
    SetupValidation,
    type ValidationState,
} from './SetupValidation.tsx'
import {
    validate,
    type ValidationApi,
    type ValidationResult,
} from '../../../../core/setupType/validation'
import { useState } from 'react'
import { type ValidatedSetupType, validationText } from './validationString.tsx'
import { sprintf } from '../../../../utils/stringUtils'

interface SetupValidationContainerProps {
    api: ValidationApi
    setupType: ValidatedSetupType
}

const TALK_CHECKS = [
    'idValid',
    'titleValid',
    'startEndTimeValid',
    'trackTitleValid',
    'speakersValid',
    'tagsValid',
] as const
const SPEAKER_CHECKS = ['idValid', 'nameValid', 'photoUrlValid'] as const

export const SetupValidationContainer = ({
    api,
    setupType,
}: SetupValidationContainerProps) => {
    const [validationProcessing, onValidationChange] = useState(false)
    const [validationResult, setValidationResult] =
        useState<ValidationResult | null>(null)

    let connectionText: string | undefined
    let connectionState: ValidationState = STATE_IDLE
    if (validationProcessing) {
        connectionText = validationText.connection[setupType].connecting
        connectionState = STATE_LOADING
    } else if (validationResult) {
        if (validationResult.dataAvailable) {
            connectionText = validationText.connection[setupType].connected
            connectionState = STATE_SUCCESS
        } else {
            connectionText = validationText.connection[setupType].error
            connectionState = STATE_ERROR
        }
    }

    let modelState: ValidationState = STATE_IDLE
    let modelText: string | undefined
    let modelSubtitleText: string | undefined
    if (validationProcessing) {
        modelState = STATE_LOADING
    } else if (connectionState === STATE_ERROR) {
        modelState = STATE_ERROR
        modelText = 'Previous step failed'
    } else if (validationResult) {
        let subtitleText = sprintf(
            validationText.model[setupType].talk.talkCount,
            validationResult.talk.talkCount,
            validationResult.speaker.speakerCount
        )

        if (validationResult.isSuccessful) {
            modelState = STATE_SUCCESS
            modelText = validationText.validModel

            if (validationResult.talk.noSpeakers) {
                subtitleText +=
                    '\n' +
                    sprintf(
                        validationText.model[setupType].talk.noSpeakers,
                        validationResult.talk.noSpeakers
                    )
            }
            if (validationResult.talk.speakersMissing) {
                subtitleText +=
                    '\n' +
                    sprintf(
                        validationText.model[setupType].talk.speakersMissing,
                        validationResult.talk.speakersMissing
                    )
            }
        } else {
            modelState = STATE_ERROR
            modelText = validationText.notValidModel

            if (
                !validationResult.talksObjectFound ||
                !validationResult.speakersObjectFound
            ) {
                let text = ''

                if (!validationResult.talksObjectFound) {
                    text += 'talks'
                }
                if (!validationResult.speakersObjectFound) {
                    text += ' and speakers'
                }
                subtitleText +=
                    '\n' +
                    sprintf(
                        validationText.model[setupType]
                            .speakersOrTalksObjectFound,
                        text
                    )
            } else {
                const resultTalk = validationResult.talk
                const resultSpeaker = validationResult.speaker

                TALK_CHECKS.forEach((el) => {
                    if (!resultTalk[el]) {
                        subtitleText +=
                            '\n' + validationText.model[setupType].talk[el]
                    }
                })
                SPEAKER_CHECKS.forEach((el) => {
                    if (!resultSpeaker[el]) {
                        subtitleText +=
                            '\n' + validationText.model[setupType].speaker[el]
                    }
                })
            }
        }
        modelSubtitleText = subtitleText
    }

    return (
        <SetupValidation
            processing={validationProcessing}
            connectionState={connectionState}
            modelState={modelState}
            onValidateClick={() => {
                onValidationChange(true)
                validate(api).then((result) => {
                    setValidationResult(result)
                    onValidationChange(false)
                })
            }}
            connectionText={connectionText}
            modelText={modelText}
            modelSubtitleText={modelSubtitleText}
        />
    )
}
