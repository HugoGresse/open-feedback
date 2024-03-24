import React, { useState } from 'react'
import { array, bool, object, string } from 'yup'
import { Field, Form, Formik } from 'formik'
import OFFormControl from '../../../baseComponents/form/formControl/OFFormControl.jsx'
import OFAutoComplete from '../../../baseComponents/form/autoComplete/OFAutoComplete.jsx'
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography.jsx'
import LangMap from 'langmap'
import Grid from '@mui/material/Grid'
import { CircularProgress } from '@mui/material'
import FormikAutoSave from '../../../baseComponents/form/autoSave/FormikAutoSave.jsx'
import AutoSaveNotice from '../../../baseComponents/layouts/AutoSaveNotice.jsx'
import Box from '@mui/material/Box'
import langMapArray from '../../utils/convertLangMapArray'
import FormControlLabel from '@mui/material/FormControlLabel'
import { OFSwitch } from '../../../baseComponents/form/switch/OFSwitch.jsx'
import { DonateToActivateDialog } from '../../../baseComponents/DonateToActivateDialog.jsx'

const SettingsForm = ({
    onSave,
    initialLanguages,
    disableSoloTalkRedirect,
    hideVotesUntilUserVote = false,
    displayTitle = true,
    liveUserVotes = false,
    isOrganizationSettings = false,
    displayFullDates = false,
}) => {
    const { t } = useTranslation()
    const [donationDialogOpen, setDonationDialogOpen] = useState(false)

    return (
        <>
            <Formik
                validationSchema={object().shape({
                    languages: array().of(string()),
                    disableSoloTalkRedirect: bool(),
                    hideVotesUntilUserVote: bool(),
                    liveUserVotes: bool(),
                    displayFullDates: bool(),
                })}
                initialValues={{
                    languages: initialLanguages.map((tag) => ({
                        ...LangMap[tag],
                        tag,
                    })),
                    disableSoloTalkRedirect: !disableSoloTalkRedirect,
                    hideVotesUntilUserVote: hideVotesUntilUserVote,
                    liveUserVotes: liveUserVotes,
                    displayFullDates: displayFullDates,
                }}
            >
                {({ values }) => (
                    <Form method="POST">
                        {displayTitle && (
                            <TranslatedTypography
                                i18nKey="settingsSetup.settings"
                                variant="h5"
                            />
                        )}
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <OFFormControl
                                    name={t('settingsSetup.languages')}
                                    fieldName="languages"
                                    type="text"
                                >
                                    <Field
                                        name="languages"
                                        value={values.languages}
                                        dataArray={langMapArray}
                                        keysToDisplay={[
                                            'nativeName',
                                            'englishName',
                                            'tag',
                                        ]}
                                        multiple={true}
                                        component={OFAutoComplete}
                                    />
                                </OFFormControl>
                                <OFFormControl fieldName="displayFullDates">
                                    <FormControlLabel
                                        label={t(
                                            'settingsSetup.displayFullDates'
                                        )}
                                        labelPlacement="start"
                                        control={
                                            <Field
                                                name="displayFullDates"
                                                component={OFSwitch}
                                            />
                                        }
                                    />
                                </OFFormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <OFFormControl fieldName="disableSoloTalkRedirect">
                                    <FormControlLabel
                                        label={t(
                                            'settingsSetup.disableSoloTalkRedirect'
                                        )}
                                        labelPlacement="start"
                                        control={
                                            <Field
                                                name="disableSoloTalkRedirect"
                                                component={OFSwitch}
                                            />
                                        }
                                    />
                                </OFFormControl>
                                <OFFormControl fieldName="hideVotesUntilUserVote">
                                    <FormControlLabel
                                        label={t(
                                            'settingsSetup.hideVotesUntilUserVote'
                                        )}
                                        labelPlacement="start"
                                        control={
                                            <Field
                                                name="hideVotesUntilUserVote"
                                                component={OFSwitch}
                                            />
                                        }
                                    />
                                </OFFormControl>
                                {!isOrganizationSettings && (
                                    <OFFormControl fieldName="liveUserVotes">
                                        <FormControlLabel
                                            label={t(
                                                'settingsSetup.liveUserVotes'
                                            )}
                                            labelPlacement="start"
                                            control={
                                                <Field
                                                    name="liveUserVotes"
                                                    component={OFSwitch}
                                                    onClick={() => {
                                                        if (
                                                            !values.liveUserVotes
                                                        ) {
                                                            setDonationDialogOpen(
                                                                true
                                                            )
                                                        }
                                                    }}
                                                />
                                            }
                                        />
                                    </OFFormControl>
                                )}
                            </Grid>
                        </Grid>

                        <FormikAutoSave
                            onSave={(values) => {
                                const languages = values.languages.map(
                                    (value) => value.tag
                                )
                                return onSave({
                                    ...values,
                                    languages,
                                    disableSoloTalkRedirect:
                                        !values.disableSoloTalkRedirect,
                                    hideVotesUntilUserVote:
                                        values.hideVotesUntilUserVote,
                                    liveUserVotes: values.liveUserVotes,
                                })
                            }}
                            render={({
                                isSaving,
                                lastSavedDate,
                                saveError,
                            }) => (
                                <div>
                                    {isSaving ? (
                                        <Box textAlign="right">
                                            {' '}
                                            <CircularProgress />{' '}
                                        </Box>
                                    ) : saveError ? (
                                        `Error: ${saveError}`
                                    ) : lastSavedDate ? (
                                        <AutoSaveNotice
                                            saveDate={lastSavedDate}
                                        />
                                    ) : (
                                        ''
                                    )}
                                </div>
                            )}
                        />
                    </Form>
                )}
            </Formik>
            {donationDialogOpen && (
                <DonateToActivateDialog
                    isDialogOpen={donationDialogOpen}
                    onClose={() => setDonationDialogOpen(false)}
                />
            )}
        </>
    )
}

export default SettingsForm
