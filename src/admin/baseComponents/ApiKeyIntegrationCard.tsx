import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import clipboardCopy from 'clipboard-copy'
import {
    Box,
    CardContent,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import OFCard from './OFCard.jsx'
import OFButton from './button/OFButton.jsx'
import SimpleDialog from './layouts/SimpleDialog.jsx'
import { addNotification } from '../notification/notifcationActions'

export const API_DOCS_URL =
    import.meta.env.VITE_API_DOCS_URL ||
    'https://api.openfeedback.io/'

interface FirestoreTimestamp {
    toDate: () => Date
}

export type LastUsedValue =
    | FirestoreTimestamp
    | string
    | number
    | null
    | undefined

const hasToDate = (value: unknown): value is FirestoreTimestamp =>
    typeof (value as FirestoreTimestamp)?.toDate === 'function'

const formatLastUsed = (value: LastUsedValue): string | null => {
    if (!value) {
        return null
    }
    // Firestore Timestamp -> Date, otherwise assume a parseable string/number.
    const date = hasToDate(value) ? value.toDate() : new Date(value)
    if (Number.isNaN(date.getTime())) {
        return null
    }
    return date.toLocaleString()
}

interface ApiKeyIntegrationCardProps {
    // Sentence shown under the title, before the docs link.
    description: string
    // Shown when no key exists yet.
    noKeyText: string
    apiKey?: string
    lastUsedRaw?: LastUsedValue
    // Generates (or rotates) the key and returns the new key. State is owned by
    // the caller; the card only drives the UI (reveal/rotate dialog/loading).
    onGenerateOrRotate: () => Promise<string | void>
}

/**
 * Presentational card for an API key integration panel (key reveal, copy,
 * generate/rotate). Shared by the event and organization integration tabs so
 * the two stay in lockstep; only the data layer (fetch + write) differs.
 */
const ApiKeyIntegrationCard: React.FC<ApiKeyIntegrationCardProps> = ({
    description,
    noKeyText,
    apiKey,
    lastUsedRaw,
    onGenerateOrRotate,
}) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const [revealed, setRevealed] = useState(false)
    const [rotateOpen, setRotateOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const lastUsed = formatLastUsed(lastUsedRaw)

    const generateOrRotate = async () => {
        setLoading(true)
        const newKey = await onGenerateOrRotate()
        setLoading(false)
        setRotateOpen(false)
        if (newKey) {
            setRevealed(true)
        }
    }

    const copyKey = () => {
        if (!apiKey) {
            return
        }
        clipboardCopy(apiKey)
        dispatch(
            addNotification({
                type: 'success',
                i18nkey: 'settingsIntegration.keyCopied',
            })
        )
    }

    return (
        <OFCard>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {t('settingsIntegration.title')}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {description}{' '}
                    <Link
                        href={API_DOCS_URL}
                        target="_blank"
                        rel="noopener noreferrer">
                        {t('settingsIntegration.documentationLink')}
                        <OpenInNewIcon
                            fontSize="inherit"
                            sx={{ ml: 0.5, verticalAlign: 'middle' }}
                        />
                    </Link>
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        {t('settingsIntegration.apiKey')}
                    </Typography>

                    {apiKey ? (
                        <>
                            <TextField
                                fullWidth
                                value={
                                    revealed
                                        ? apiKey
                                        : '•'.repeat(Math.min(apiKey.length, 32))
                                }
                                InputProps={{
                                    readOnly: true,
                                    sx: { fontFamily: 'monospace' },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={t(
                                                    'settingsIntegration.toggleVisibility'
                                                )}
                                                onClick={() =>
                                                    setRevealed(!revealed)
                                                }>
                                                {revealed ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                            <IconButton
                                                aria-label={t('common.copy')}
                                                onClick={copyKey}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ display: 'block', mt: 1 }}>
                                {lastUsed
                                    ? t('settingsIntegration.lastUsed', {
                                          date: lastUsed,
                                      })
                                    : t('settingsIntegration.neverUsed')}
                            </Typography>

                            <Box sx={{ mt: 2 }}>
                                <OFButton
                                    color="error"
                                    onClick={() => setRotateOpen(true)}>
                                    {t('settingsIntegration.rotateKey')}
                                </OFButton>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ mt: 1 }}>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                gutterBottom>
                                {noKeyText}
                            </Typography>
                            <OFButton
                                loading={loading}
                                onClick={generateOrRotate}>
                                {t('settingsIntegration.generateKey')}
                            </OFButton>
                        </Box>
                    )}
                </Box>

                <SimpleDialog
                    open={rotateOpen}
                    onClose={() => setRotateOpen(false)}
                    onConfirm={generateOrRotate}
                    title={t('settingsIntegration.rotateConfirmTitle')}
                    confirmText={t('settingsIntegration.rotateKey')}
                    cancelText={t('common.cancel')}
                    confirmLoading={loading}>
                    {t('settingsIntegration.rotateConfirmBody')}
                </SimpleDialog>
            </CardContent>
        </OFCard>
    )
}

export default ApiKeyIntegrationCard
