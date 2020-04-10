import React, { useState } from 'react'
import { Form, Formik } from 'formik'
import { object, string } from 'yup'
import SidePanelLayout from '../../baseComponents/layouts/sidepanel/SidePanelLayout'
import OFButton from '../../baseComponents/button/OFButton'
import OFFormControlInputFormiked from '../../baseComponents/form/formControl/OFFormControlInputFormiked'
import { useTranslation } from 'react-i18next'
import SidePanelUploadLayout from '../../baseComponents/layouts/sidepanel/upload/SidePanelUploadLayout'

const SpeakerAddEditPanel = ({ isOpen, speaker, onClose, onSubmit }) => {
    const { t } = useTranslation()
    const [shouldContinueAfterSubmit, setContinueAfterSubmit] = useState(false)

    return (
        <SidePanelLayout
            isOpen={isOpen}
            onClose={onClose}
            title={t('speakers.addTitle')}>
            <Formik
                validationSchema={object().shape({
                    name: string().trim().required(t('speakers.addTitle')),
                    photoUrl: string()
                        .notRequired()
                        .url(t('speakers.photoValid'))
                        .trim(),
                    socialProfil: string()
                        .notRequired()
                        .url(t('speakers.socialValid'))
                        .trim(),
                })}
                initialValues={
                    speaker || {
                        name: '',
                        photoUrl: '',
                        socialProfil: '',
                    }
                }
                onSubmit={(values, { resetForm }) => {
                    if (shouldContinueAfterSubmit) {
                        resetForm()
                    }
                    return onSubmit(values, shouldContinueAfterSubmit)
                }}>
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <OFFormControlInputFormiked
                            name={t('speakers.name')}
                            fieldName="name"
                            type="text"
                            isSubmitting={isSubmitting}
                        />

                        <SidePanelUploadLayout
                            name={t('speakers.photoUrl')}
                            fieldName="photoUrl"
                            isSubmitting={isSubmitting}
                            title={t('speakers.photoUrl')}
                            helpText={t('baseComponents.imageHelp')}
                            finalImageWidth={200}
                            finalImageHeight={200}
                        />

                        <OFFormControlInputFormiked
                            name={t('speakers.social')}
                            fieldName="socialProfil"
                            type="url"
                            isSubmitting={isSubmitting}
                        />

                        <OFButton
                            disabled={isSubmitting}
                            type="submit"
                            style={{
                                type: 'big',
                                marginTop: 64,
                                width: '100%',
                            }}
                            onClick={() => setContinueAfterSubmit(false)}>
                            {speaker ? t('common.save') : t('speakers.submit')}
                        </OFButton>
                        {!speaker && (
                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                variant="outlined"
                                style={{
                                    design: 'text',
                                    marginTop: 12,
                                    width: '100%',
                                }}
                                onClick={() => setContinueAfterSubmit(true)}>
                                {t('speakers.submitContinue')}
                            </OFButton>
                        )}
                    </Form>
                )}
            </Formik>
        </SidePanelLayout>
    )
}

export default SpeakerAddEditPanel
