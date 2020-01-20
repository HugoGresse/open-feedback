import { Box } from '@material-ui/core'
import OFButton from '../../../baseComponents/OFButton'
import React from 'react'

import CheckIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import IdleIcon from '@material-ui/icons/RadioButtonUnchecked'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grow from '@material-ui/core/Grow'
import { useTranslation } from 'react-i18next'

export const STATE_IDLE = 1
export const STATE_LOADING = 2
export const STATE_SUCCESS = 3
export const STATE_ERROR = 4

const SetupValidation = ({
    processing,
    onValidateClick,
    connectionText,
    connectionState,
    modelText,
    modelState,
    modelSubtitleText,
}) => {
    const { t } = useTranslation()
    return (
        <Box>
            <OFButton
                disabled={processing}
                type="submit"
                onClick={onValidateClick}>
                {t('settingsSetup.validateConfig')}
            </OFButton>

            <Grow in={connectionState !== STATE_IDLE}>
                <Box bgcolor="#eee" borderRadius={5} padding={2} marginTop={2}>
                    <Check state={connectionState} text={connectionText} />
                    <Check
                        state={modelState}
                        text={modelText}
                        subText={modelSubtitleText}
                    />
                </Box>
            </Grow>
        </Box>
    )
}

const Check = ({ state, text, subText }) => {
    let stateIcon

    switch (state) {
        default:
        case STATE_IDLE:
            stateIcon = <IdleIcon style={{ color: '#888', marginRight: 10 }} />
            break
        case STATE_LOADING:
            stateIcon = (
                <CircularProgress
                    style={{
                        width: 20,
                        height: 20,
                        color: '#111',
                        marginRight: 14,
                    }}
                />
            )
            break
        case STATE_SUCCESS:
            stateIcon = (
                <CheckIcon style={{ color: '#00cc00', marginRight: 10 }} />
            )
            break
        case STATE_ERROR:
            stateIcon = <ErrorIcon style={{ color: '#F22', marginRight: 10 }} />
            break
    }

    return (
        <Box display="flex" marginBottom={1}>
            {stateIcon}
            <Box>
                <Typography>{text}</Typography>
                <Typography
                    variant="caption"
                    style={{ whiteSpace: 'pre-line' }}>
                    {subText}
                </Typography>
            </Box>
        </Box>
    )
}

export default SetupValidation
