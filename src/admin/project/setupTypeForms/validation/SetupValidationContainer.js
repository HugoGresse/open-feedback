import SetupValidation, {STATE_ERROR, STATE_IDLE, STATE_LOADING, STATE_SUCCESS} from './SetupValidation'
import validate from '../../../../core/setupType/validation'
import React, {useState} from 'react'
import validationText from './validationString'
import {sprintf} from '../../../../utils/stringUtils'

const SetupValidationContainer = ({api, setupType}) => {

    const [validationProcessing, onValidationChange] = useState(false)
    const [validationResult, setValidationResult] = useState(null)

    let connectionText
    let connectionState = STATE_IDLE
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

    let modelState = STATE_IDLE
    let modelText, modelSubtitleText
    if (validationProcessing) {
        modelState = STATE_LOADING
    } else if (connectionState === STATE_ERROR) {
        modelState = STATE_ERROR
        modelText = "Previous step failed"
    } else if (validationResult) {
        modelSubtitleText = sprintf(
            validationText.model[setupType].session.sessionCount,
            validationResult.session.sessionCount,
            validationResult.speaker.speakerCount)

        if (validationResult.isSuccessful) {
            modelState = STATE_SUCCESS
            modelText = validationText.validModel

            if(validationResult.session.noSpeakers) {
                modelSubtitleText += '\n' + sprintf(validationText.model[setupType].session.noSpeakers, validationResult.session.noSpeakers)
            }
            if(validationResult.session.speakersMissing) {
                modelSubtitleText += '\n' + sprintf(validationText.model[setupType].session.speakersMissing, validationResult.session.speakersMissing)
            }
        } else {
            modelState = STATE_ERROR
            modelText = validationText.notValidModel

            if (!validationResult.sessionsObjectFound || !validationResult.speakersObjectFound) {
                let text = ''

                if (!validationResult.sessionsObjectFound) {
                    text += "sessions"
                }
                if (!validationResult.speakersObjectFound) {
                    text += " and speakers"
                }
                modelSubtitleText += '\n' + sprintf(validationText.model[setupType].speakersOrSessionsObjectFound, text)
            } else {
                const resultSession = validationResult.session
                const resultSpeaker = validationResult.speaker

                ;['idValid', 'titleValid', 'startEndTimeValid', 'trackTitleValid', 'speakersValid'].forEach(el => {
                    if (!resultSession[el]) {
                        modelSubtitleText += '\n' + validationText.model[setupType].session[el]
                    }
                })
                ;['idValid', 'nameValid', 'photoUrlValid'].forEach(el => {
                    if (!resultSpeaker[el]) {
                        modelSubtitleText += '\n' + validationText.model[setupType].speaker[el]
                    }
                })


            }
        }
    }

    return <SetupValidation processing={validationProcessing}
                            connectionState={connectionState}
                            modelState={modelState}
                            onValidateClick={() => {
                                onValidationChange(true)
                                validate(api).then(result => {
                                    setValidationResult(result)
                                    onValidationChange(false)
                                })
                            }}
                            connectionText={connectionText}
                            modelText={modelText}
                            modelSubtitleText={modelSubtitleText}/>
}

export default SetupValidationContainer
