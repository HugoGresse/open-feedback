import React, { useState } from 'react'
import NewProjectLayout from './NewProjectLayout.jsx'
import { object, string } from 'yup'
import { Form, Formik } from 'formik'
import OFFormControlInputFormiked from '../../baseComponents/form/formControl/OFFormControlInputFormiked.jsx'
import OFButton from '../../baseComponents/button/OFButton.jsx'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import Chip from '@mui/material/Chip'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import ProjectIdChange from './Step1.projectIdChange.jsx'
import { doesProjectIdExistOrIsAllowed } from '../core/projectUtils'

const Step1 = ({ onCancel, onSubmit, initialValues }) => {
    const { t } = useTranslation()
    const [projectIdEditOpen, setProjectIdOpen] = useState(false)
    const [projectIdAnchor, setAnchorEl] = React.useState(null)
    const [idValueBeforeOpeningIdChange, setPrecedentIdValue] = React.useState(
        initialValues.id
    )

    const handleProjectIdClick = (event) => {
        setProjectIdOpen(!projectIdEditOpen)
        setAnchorEl(projectIdAnchor ? null : event.currentTarget)
    }

    return (
        <NewProjectLayout
            stepTitle={t('newEvent.step1.title')}
            title={t('newEvent.step1.name')}
            onCancel={onCancel}>
            <Formik
                validationSchema={object().shape({
                    name: string().required(t('newEvent.step1.nameRequired')),
                    id: string()
                        .lowercase()
                        .trim()
                        .min(3, t('newEvent.step1.eventIdTooShort'))
                        .matches(
                            /^[a-z0-9-]+$/,
                            t('newEvent.step1.eventIdNotValid')
                        )
                        .required(t('newEvent.step1.eventIdRequired'))
                        .test(
                            'alreadyExist',
                            t('newEvent.step1.eventIdExist'),
                            (value) => {
                                if (value) {
                                    return doesProjectIdExistOrIsAllowed(
                                        value
                                    ).then((exist) => !exist)
                                }
                                return Promise.resolve(false)
                            }
                        ),
                })}
                initialValues={initialValues}
                onSubmit={(values) =>
                    onSubmit(values.name.trim(), values.id.trim())
                }>
                {({ isSubmitting, values, setFieldValue, errors }) => (
                    <Form method="POST">
                        <OFFormControlInputFormiked
                            name={t('newEvent.step1.fieldName')}
                            fieldName="name"
                            type="text"
                            isSubmitting={isSubmitting}
                            autoFocus={true}
                        />

                        <Box
                            position="relative"
                            marginTop={errors.name ? 1 : 3}>
                            <Chip
                                avatar={<EditIcon />}
                                label={values.id}
                                onClick={(event) => handleProjectIdClick(event)}
                                variant="outlined"
                                disabled={values.name.length === 0}
                            />

                            {errors.id && (
                                <ErrorIcon
                                    style={{
                                        top: 7,
                                        position: 'relative',
                                        color: 'red',
                                    }}
                                />
                            )}

                            <ProjectIdChange
                                anchorElement={projectIdAnchor}
                                disableSave={isSubmitting || Boolean(errors.id)}
                                onCancel={() => {
                                    setFieldValue(
                                        'id',
                                        idValueBeforeOpeningIdChange
                                    )
                                    setAnchorEl(null)
                                }}
                                onSave={() => {
                                    setPrecedentIdValue(values.id)
                                    setAnchorEl(null)
                                }}
                            />
                        </Box>

                        <Box textAlign="right">
                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                style={{ type: 'big', marginTop: 64 }}>
                                {t('newEvent.step1.submit')}
                            </OFButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </NewProjectLayout>
    );
}

export default Step1
