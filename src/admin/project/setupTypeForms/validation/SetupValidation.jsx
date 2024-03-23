import { Box } from '@mui/material'
import OFButton from '../../../baseComponents/button/OFButton.jsx'
import React from 'react'

import CheckIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import IdleIcon from '@mui/icons-material/RadioButtonUnchecked'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Grow from '@mui/material/Grow'
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
                <Box bgcolor="#eee" borderRadius="5px" padding={2} marginTop={2}>
                    <Check state={connectionState} text={connectionText} />
                    <Check
                        state={modelState}
                        text={modelText}
                        subText={modelSubtitleText}
                    />
                </Box>
            </Grow>
        </Box>
    );
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
