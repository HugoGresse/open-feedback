import React, { useState } from 'react'
import { object, string } from 'yup'
import { Form, Formik } from 'formik'
import OFFormControlInputFormiked from '../../baseComponents/form/formControl/OFFormControlInputFormiked.jsx'
import OFButton from '../../baseComponents/button/OFButton.jsx'
import Collapse from '@mui/material/Collapse'
import { makeStyles } from '@mui/styles'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Box from '@mui/material/Box'
import { FormikObserver } from '../../baseComponents/form/formik/FormikObserver'
import jsonModel from './jsonmodel'
import clipboardCopy from 'clipboard-copy'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    jsonShowButton: {
        width: '100%',
    },
    jsonExample: {
        background: '#EEE',
        padding: 12,
        marginTop: 32,
    },
    jsonExamplePre: {
        overflow: 'auto',
    },
    jsonExampleInnerContainer: {
        position: 'relative',
    },
    jsonCopyButton: {
        position: 'absolute',
        right: 0,
        top: 10,
    },
}))

const SetupJSONForm = ({
    onBack,
    onSubmit,
    submitText,
    backText,
    initialValues,
    onFormChange,
}) => {
    const classes = useStyles()
    const [isExampleOpen, setExampleOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <Formik
            validationSchema={object().shape({
                jsonUrl: string()
                    .url(t('settingsSetup.json.jsonUrlValid'))
                    .required(t('settingsSetup.json.jsonUrlRequired')),
            })}
            initialValues={initialValues}
            onSubmit={(values) =>
                onSubmit({
                    jsonUrl: values.jsonUrl,
                })
            }>
            {({ isSubmitting, values }) => (
                <Form method="POST">
                    {onFormChange && (
                        <FormikObserver
                            value={values}
                            onChange={(values) => onFormChange(values)}
                        />
                    )}
                    <OFFormControlInputFormiked
                        name={t('settingsSetup.json.fieldJsonUrl')}
                        fieldName="jsonUrl"
                        type="text"
                        isSubmitting={isSubmitting}
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
                                onClick={() => onBack(values)}
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
            )}
        </Formik>
    )
}

export default SetupJSONForm
