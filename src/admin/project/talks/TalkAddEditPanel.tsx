import { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { object, string, array } from 'yup'
import { SidePanelLayout } from '../../baseComponents/layouts/sidepanel/SidePanelLayout.tsx'
import { OFButton } from '../../baseComponents/button/OFButton.tsx'
import { OFFormControl } from '../../baseComponents/form/formControl/OFFormControl.tsx'
import { OFAutoComplete } from '../../baseComponents/form/autoComplete/OFAutoComplete.tsx'
import { OFFormControlInputFormiked } from '../../baseComponents/form/formControl/OFFormControlInputFormiked.tsx'
import { SpeakerAddEditPanel } from '../speakers/SpeakerAddEditPanel.tsx'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { TalkStartEndTimeFields } from './TalkStartEndTimeFields.tsx'
import type { Speaker, Talk } from '../../../core/models'
import type { SpeakerFormValues } from '../speakers/SpeakerAddEditPanel.tsx'

/** Values of the talk form: a new talk, or the edited one (with its id). */
export interface TalkFormValues extends Omit<
    Talk,
    'id' | 'startTime' | 'endTime' | 'speakers'
> {
    id?: string
    startTime: DateTime | null
    endTime: DateTime | null
    speakers: Speaker[]
}

export interface TalkAddEditPanelProps {
    isOpen: boolean
    /** The edited talk, `null` to add a new one. */
    talk: TalkFormValues | null
    /** ISO date-time of the project vote start. */
    projectVoteStartTime?: string | null
    existingSpeakers: Speaker[]
    existingTags: string[]
    existingTracks: string[]
    onClose: () => void
    onSubmit: (
        talk: TalkFormValues,
        shouldContinueAfterSubmit: boolean
    ) => Promise<unknown>
    onSpeakerAdd: (speaker: SpeakerFormValues) => Promise<Speaker | undefined>
}

export const TalkAddEditPanel = ({
    isOpen,
    talk,
    projectVoteStartTime,
    existingSpeakers,
    existingTags,
    existingTracks,
    onClose,
    onSubmit,
    onSpeakerAdd,
}: TalkAddEditPanelProps) => {
    const [shouldContinueAfterSubmit, setContinueAfterSubmit] = useState(false)
    const [addingASpeaker, setSpeakerAdd] = useState(false)
    const { t } = useTranslation()

    return (
        <>
            <SidePanelLayout
                isOpen={isOpen}
                onClose={onClose}
                title={talk ? t('talks.titleEdit') : t('talks.titleAdd')}
            >
                <Formik<TalkFormValues>
                    validationSchema={object().shape({
                        title: string()
                            .trim()
                            .required(t('talks.fieldTitleRequired')),
                        trackTitle: string().ensure(),
                        tags: array().of(string()),
                        startTime: string().nullable().trim(),
                        endTime: string().nullable().trim(),
                        speakers: array().of(object()),
                    })}
                    initialValues={
                        talk || {
                            title: '',
                            trackTitle: '',
                            tags: [],
                            startTime: null,
                            endTime: null,
                            speakers: [],
                        }
                    }
                    onSubmit={(values, { resetForm }) => {
                        // this is a fix until yup ensure() actually change the output, see https://github.com/jaredpalmer/formik/issues/473
                        values.trackTitle = values.trackTitle
                            ? values.trackTitle
                            : ''
                        if (shouldContinueAfterSubmit) {
                            resetForm()
                        }
                        return onSubmit(values, shouldContinueAfterSubmit)
                    }}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form method="POST">
                            <OFFormControlInputFormiked
                                name={t('talks.fieldTitle')}
                                fieldName="title"
                                type="text"
                                isSubmitting={isSubmitting}
                                autoFocus={true}
                            />

                            <TalkStartEndTimeFields
                                defaultValue={
                                    projectVoteStartTime ||
                                    DateTime.local().toISO()
                                }
                            />

                            <OFFormControl
                                name={t('talks.fieldTrack')}
                                fieldName="trackTitle"
                                type="text"
                            >
                                <Field
                                    name="trackTitle"
                                    dataArray={existingTracks}
                                    freeSolo={true}
                                    component={OFAutoComplete}
                                />
                            </OFFormControl>

                            <OFFormControl
                                name={t('talks.fieldTags')}
                                fieldName="tags"
                                type="text"
                            >
                                <Field
                                    name="tags"
                                    dataArray={existingTags}
                                    freeSolo={true}
                                    multiple={true}
                                    component={OFAutoComplete}
                                />
                            </OFFormControl>

                            <OFFormControl
                                name={t('talks.fieldSpeakers')}
                                fieldName="speakers"
                                type="text"
                            >
                                <Field
                                    name="speakers"
                                    noOptionsText={
                                        <OFButton
                                            onMouseDown={() =>
                                                setSpeakerAdd(true)
                                            }
                                        >
                                            {t('talks.addNewSpeaker')}
                                        </OFButton>
                                    }
                                    dataArray={existingSpeakers}
                                    keyToDisplay="name"
                                    multiple={true}
                                    component={OFAutoComplete}
                                />
                            </OFFormControl>

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
                                {talk ? t('common.save') : t('talks.submit')}
                            </OFButton>
                            {!talk && (
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
                                    {t('talks.submitContinue')}
                                </OFButton>
                            )}

                            <SpeakerAddEditPanel
                                isOpen={addingASpeaker}
                                onClose={() => setSpeakerAdd(false)}
                                onSubmit={(
                                    speaker,
                                    shouldContinueAfterSubmit
                                ) => {
                                    return onSpeakerAdd(speaker).then(
                                        (speaker) => {
                                            if (!speaker) {
                                                // Adding failed, a notification
                                                // reports it, keep the panel open
                                                return
                                            }
                                            if (!shouldContinueAfterSubmit) {
                                                setSpeakerAdd(false)
                                            }
                                            setFieldValue('speakers', [
                                                ...values.speakers,
                                                speaker,
                                            ])
                                            // DOM boundary: an element has the focus (the form button)
                                            ;(
                                                document.activeElement as HTMLElement
                                            ).blur()
                                        }
                                    )
                                }}
                            />
                        </Form>
                    )}
                </Formik>
            </SidePanelLayout>
        </>
    )
}
