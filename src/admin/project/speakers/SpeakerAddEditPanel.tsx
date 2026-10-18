import { useState } from 'react'
import { Form, Formik } from 'formik'
import { object, string } from 'yup'
import { SidePanelLayout } from '../../baseComponents/layouts/sidepanel/SidePanelLayout.tsx'
import { OFButton } from '../../baseComponents/button/OFButton.tsx'
import { OFFormControlInputFormiked } from '../../baseComponents/form/formControl/OFFormControlInputFormiked.tsx'
import { useTranslation } from 'react-i18next'
import { SidePanelUploadLayout } from '../../baseComponents/layouts/sidepanel/upload/SidePanelUploadLayout.tsx'
import type { NewSpeaker, Speaker } from '../../../core/models'

/** Values of the speaker form: a new speaker, or the edited one (with its id). */
export interface SpeakerFormValues extends NewSpeaker {
    id?: string
    /** Form only field, saved as is with the speaker. */
    socialProfil?: string
}

export interface SpeakerAddEditPanelProps {
    isOpen: boolean
    /** The edited speaker, `null`/missing to add a new one. */
    speaker?: Speaker | null
    onClose: () => void
    onSubmit: (
        speaker: SpeakerFormValues,
        shouldContinueAfterSubmit: boolean
    ) => Promise<unknown>
}

export const SpeakerAddEditPanel = ({
    isOpen,
    speaker,
    onClose,
    onSubmit,
}: SpeakerAddEditPanelProps) => {
    const { t } = useTranslation()
    const [shouldContinueAfterSubmit, setContinueAfterSubmit] = useState(false)

    return (
        <SidePanelLayout
            isOpen={isOpen}
            onClose={onClose}
            title={t('speakers.addTitle')}
        >
            <Formik<SpeakerFormValues>
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
                }}
            >
                {({ isSubmitting }) => (
                    <Form method="POST">
                        <OFFormControlInputFormiked
                            name={t('speakers.name')}
                            fieldName="name"
                            type="text"
                            isSubmitting={isSubmitting}
                            autoFocus={true}
                        />

                        <SidePanelUploadLayout
                            name={t('speakers.photoUrl')}
                            fieldName="photoUrl"
                            isSubmitting={isSubmitting}
                            title={t('speakers.photoUrl')}
                            helpText={t('baseComponents.imageHelp')}
                            finalImageWidthHeight={200}
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
                            onClick={() => setContinueAfterSubmit(false)}
                        >
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
                                onClick={() => setContinueAfterSubmit(true)}
                            >
                                {t('speakers.submitContinue')}
                            </OFButton>
                        )}
                    </Form>
                )}
            </Formik>
        </SidePanelLayout>
    )
}
