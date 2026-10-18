import { Box } from '@mui/material'
import { OFButton } from '../../../baseComponents/button/OFButton.tsx'
import CheckIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import IdleIcon from '@mui/icons-material/RadioButtonUnchecked'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Grow from '@mui/material/Grow'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

export const STATE_IDLE = 1
export const STATE_LOADING = 2
export const STATE_SUCCESS = 3
export const STATE_ERROR = 4

export type ValidationState =
    | typeof STATE_IDLE
    | typeof STATE_LOADING
    | typeof STATE_SUCCESS
    | typeof STATE_ERROR

interface SetupValidationProps {
    processing: boolean
    onValidateClick: () => void
    connectionText?: string
    connectionState: ValidationState
    modelText?: string
    modelState: ValidationState
    modelSubtitleText?: string
}

export const SetupValidation = ({
    processing,
    onValidateClick,
    connectionText,
    connectionState,
    modelText,
    modelState,
    modelSubtitleText,
}: SetupValidationProps) => {
    const { t } = useTranslation()
    return (
        <Box>
            <OFButton
                disabled={processing}
                type="submit"
                onClick={onValidateClick}
            >
                {t('settingsSetup.validateConfig')}
            </OFButton>

            <Grow in={connectionState !== STATE_IDLE}>
                <Box
                    bgcolor="#eee"
                    borderRadius="5px"
                    padding={2}
                    marginTop={2}
                >
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

interface CheckProps {
    state: ValidationState
    text?: string
    subText?: string
}

const Check = ({ state, text, subText }: CheckProps) => {
    let stateIcon: ReactNode

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
                    style={{ whiteSpace: 'pre-line' }}
                >
                    {subText}
                </Typography>
            </Box>
        </Box>
    )
}
