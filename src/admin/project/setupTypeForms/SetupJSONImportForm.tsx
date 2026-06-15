import React, { useRef, useState } from 'react'
import { Form, Formik } from 'formik'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import UploadIcon from '@mui/icons-material/UploadFile'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import clipboardCopy from 'clipboard-copy'
// @ts-expect-error - JS module without types
import OFButton from '../../baseComponents/button/OFButton.jsx'
// @ts-expect-error - JS module without types
import { FormikObserver } from '../../baseComponents/form/formik/FormikObserver'
import jsonModel from './jsonmodel.json'
import {
    EventData,
    parseEventJson,
} from '../../../core/setupType/eventDataNormalization'

const useStyles = makeStyles(() => ({
    jsonExample: {
        background: '#EEE',
        padding: 12,
        marginTop: 32,
    },
    jsonShowButton: {
        width: '100%',
    },
    jsonExampleInnerContainer: {
        position: 'relative',
    },
    jsonExamplePre: {
        overflow: 'auto',
    },
    jsonCopyButton: {
        position: 'absolute',
        right: 0,
        top: 10,
    },
}))

export interface JSONImportFormValues {
    jsonText: string
}

interface SetupJSONImportFormProps {
    onBack?: (values: JSONImportFormValues) => void
    onSubmit: (config: { jsonData: EventData }) => void
    submitText?: string
    backText?: string
    initialValues: JSONImportFormValues
    onFormChange?: (values: JSONImportFormValues) => void
}

const SetupJSONImportForm = ({
    onBack,
    onSubmit,
    submitText,
    backText,
    initialValues,
    onFormChange,
}: SetupJSONImportFormProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [isExampleOpen, setExampleOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
        <Formik
            initialValues={initialValues}
            validate={(values: JSONImportFormValues) => {
                const { data, error } = parseEventJson(values.jsonText)
                if (!values.jsonText || !values.jsonText.trim()) {
                    return { jsonText: t('settingsSetup.jsonImport.required') }
                }
                if (error || !data) {
                    return {
                        jsonText: t('settingsSetup.jsonImport.invalidJson', {
                            error: error || '',
                        }),
                    }
                }
                return {}
            }}
            onSubmit={(values) => {
                const { data } = parseEventJson(values.jsonText)
                if (data) {
                    onSubmit({ jsonData: data })
                }
            }}>
            {({ isSubmitting, values, errors, setFieldValue }) => {
                const readFile = (file?: File) => {
                    if (!file) {
                        return
                    }
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        setFieldValue(
                            'jsonText',
                            String(e.target?.result ?? '')
                        )
                    }
                    reader.readAsText(file)
                }

                return (
                    <Form method="POST">
                        {onFormChange && (
                            <FormikObserver
                                value={values}
                                onChange={(v: JSONImportFormValues) =>
                                    onFormChange(v)
                                }
                            />
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/json,.json"
                            style={{ display: 'none' }}
                            data-testid="json-file-input"
                            onChange={(e) => readFile(e.target.files?.[0])}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            onClick={() => fileInputRef.current?.click()}>
                            {t('settingsSetup.jsonImport.uploadFile')}
                        </Button>

                        <Typography
                            variant="body2"
                            sx={{ marginTop: 2, marginBottom: 1 }}>
                            {t('settingsSetup.jsonImport.orPaste')}
                        </Typography>
                        <TextField
                            name="jsonText"
                            multiline
                            minRows={8}
                            maxRows={20}
                            fullWidth
                            placeholder={'{\n  "sessions": {},\n  "speakers": {}\n}'}
                            value={values.jsonText}
                            onChange={(e) =>
                                setFieldValue('jsonText', e.target.value)
                            }
                            error={Boolean(errors.jsonText)}
                            helperText={errors.jsonText as string}
                            inputProps={{
                                style: {
                                    fontFamily: 'monospace',
                                    fontSize: 12,
                                },
                            }}
                        />

                        <div className={classes.jsonExample}>
                            <Button
                                className={classes.jsonShowButton}
                                onClick={() => setExampleOpen(!isExampleOpen)}>
                                {t('settingsSetup.json.showJsonModel')}{' '}
                                <ArrowDownIcon />
                            </Button>
                            <Collapse
                                in={isExampleOpen}
                                className={classes.jsonExampleInnerContainer}>
                                <OFButton
                                    style={{ design: 'text' }}
                                    variant="outlined"
                                    className={classes.jsonCopyButton}
                                    onClick={() =>
                                        clipboardCopy(
                                            JSON.stringify(jsonModel, undefined, 4)
                                        )
                                    }>
                                    {t('common.copy')}
                                </OFButton>
                                <pre className={classes.jsonExamplePre}>
                                    {JSON.stringify(jsonModel, undefined, 4)}
                                    <br />
                                    Required fields:
                                    <br />
                                    - session.title
                                    <br />
                                    - session.id
                                    <br />- speakers: {'{}'}
                                    <br />
                                    Optional fields: all others
                                </pre>
                            </Collapse>
                        </div>

                        <Box justifyContent="space-between" display="flex">
                            {backText && (
                                <OFButton
                                    disabled={isSubmitting}
                                    onClick={() => onBack && onBack(values)}
                                    style={{
                                        type: 'big',
                                        design: 'text',
                                        marginTop: 64,
                                    }}>
                                    {backText}
                                </OFButton>
                            )}

                            {submitText && (
                                <OFButton
                                    disabled={isSubmitting}
                                    type="submit"
                                    style={{ type: 'big', marginTop: 64 }}>
                                    {submitText}
                                </OFButton>
                            )}
                        </Box>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default SetupJSONImportForm
