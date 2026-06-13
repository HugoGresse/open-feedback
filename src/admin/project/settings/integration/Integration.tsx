import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import OFCard from '../../../baseComponents/OFCard.jsx'
import OFButton from '../../../baseComponents/button/OFButton.jsx'
import SimpleDialog from '../../../baseComponents/layouts/SimpleDialog.jsx'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import { updateProjectApiKey } from '../../core/actions/updateProjectApiKey'
import { addNotification } from '../../../notification/notifcationActions'

export const API_DOCS_URL = 'https://api-open-feedback-42-ew.a.run.app/'

interface FirestoreTimestamp {
    toDate: () => Date
}

type LastUsedValue = FirestoreTimestamp | string | number | null | undefined

interface ProjectWithApiKey {
    apiKey?: string
    apiKeyLastUsedAt?: LastUsedValue
}

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

const Integration: React.FC = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const project = useSelector(getSelectedProjectSelector) as
        | ProjectWithApiKey
        | null
        | undefined

    const [revealed, setRevealed] = useState(false)
    const [rotateOpen, setRotateOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    if (!project) {
        return <LoaderMatchParent />
    }

    const apiKey = project.apiKey
    const lastUsed = formatLastUsed(project.apiKeyLastUsedAt)

    const generateOrRotate = async () => {
        setLoading(true)
        await dispatch(updateProjectApiKey() as never)
        setLoading(false)
        setRotateOpen(false)
        setRevealed(true)
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
                    {t('settingsIntegration.description')}{' '}
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
                                {t('settingsIntegration.noKey')}
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

export default Integration
