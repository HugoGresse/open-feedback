import { object, string } from 'yup'
import { Form, Formik } from 'formik'
import { OFFormControlInputFormiked } from '../../baseComponents/form/formControl/OFFormControlInputFormiked.tsx'
import { OFButton } from '../../baseComponents/button/OFButton.tsx'
import Box from '@mui/material/Box'
import { FormikObserver } from '../../baseComponents/form/formik/FormikObserver'
import { useTranslation } from 'react-i18next'
import type { HoverboardV2Config } from '../../../core/models'

interface SetupHoverboardv2FormProps {
    onBack?: (values: HoverboardV2Config) => void
    onSubmit: (config: HoverboardV2Config) => void
    submitText?: string
    backText?: string
    initialValues: HoverboardV2Config
    onFormChange?: (values: HoverboardV2Config) => void
}

export const SetupHoverboardv2Form = ({
    onBack,
    onSubmit,
    submitText,
    backText,
    initialValues,
    onFormChange,
}: SetupHoverboardv2FormProps) => {
    const { t } = useTranslation()
    return (
        <Formik<HoverboardV2Config>
            validationSchema={object().shape({
                projectId: string().required(
                    t('settingsSetup.hoverboard.projectIdRequired')
                ),
                apiKey: string().required(
                    t('settingsSetup.hoverboard.apiKeyRequired')
                ),
                databaseURL: string()
                    .url(t('settingsSetup.hoverboard.dbUrlValid'))
                    .required(t('settingsSetup.hoverboard.dbUrlRequired')),
            })}
            initialValues={initialValues}
            onSubmit={(values) =>
                onSubmit({
                    apiKey: values.apiKey,
                    projectId: values.projectId,
                    databaseURL: values.databaseURL,
                })
            }
        >
            {({ isSubmitting, values }) => (
                <Form method="POST">
                    {onFormChange && (
                        <FormikObserver
                            value={values}
                            onChange={(values) => onFormChange(values)}
                        />
                    )}
                    <OFFormControlInputFormiked
                        name="Project ID"
                        fieldName="projectId"
                        type="text"
                        isSubmitting={isSubmitting}
                    />

                    <OFFormControlInputFormiked
                        name="Api Key"
                        fieldName="apiKey"
                        type="text"
                        isSubmitting={isSubmitting}
                    />

                    <OFFormControlInputFormiked
                        name="Database URL"
                        fieldName="databaseURL"
                        type="text"
                        isSubmitting={isSubmitting}
                    />

                    <Box justifyContent="space-between" display="flex">
                        {backText && (
                            <OFButton
                                disabled={isSubmitting}
                                onClick={() => onBack?.(values)}
                                style={{
                                    type: 'big',
                                    design: 'text',
                                    marginTop: 64,
                                }}
                            >
                                {backText}
                            </OFButton>
                        )}

                        {submitText && (
                            <OFButton
                                disabled={isSubmitting}
                                type="submit"
                                style={{ type: 'big', marginTop: 64 }}
                            >
                                {submitText}
                            </OFButton>
                        )}
                    </Box>
                </Form>
            )}
        </Formik>
    )
}
