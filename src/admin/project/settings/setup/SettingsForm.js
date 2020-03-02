import React from 'react'
import { array, object, string } from 'yup'
import { Field, Form, Formik } from 'formik'
import OFFormControl from '../../../baseComponents/form/formControl/OFFormControl'
import OFAutoComplete from '../../../baseComponents/form/autoComplete/OFAutoComplete'
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'
import LangMap from 'langmap'
import Grid from '@material-ui/core/Grid'
import { useDispatch, useStore } from 'react-redux'
import { getLanguagesSelector } from '../../core/projectSelectors'
import { CircularProgress } from '@material-ui/core'
import FormikAutoSave from '../../../baseComponents/form/autoSave/FormikAutoSave'
import AutoSaveNotice from '../../../baseComponents/layouts/AutoSaveNotice'
import { editProject } from '../../core/projectActions'
import Box from '@material-ui/core/Box'
import langMapArray from '../../utils/convertLangMapArray'

const SettingsForm = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    // Doing this prevent the selector to be connected to redux directly, thus prevent future update of initialValues
    const initialLanguages = getLanguagesSelector(useStore().getState())

    return (
        <Formik
            validationSchema={object().shape({
                languages: array().of(string()),
            })}
            initialValues={{
                languages: initialLanguages.map(tag => ({
                    ...LangMap[tag],
                    tag,
                })),
            }}>
            {({ values }) => (
                <Form method="POST">
                    <TranslatedTypography
                        i18nKey="settingsSetup.settings"
                        variant="h5"
                    />
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <OFFormControl
                                name={t('settingsSetup.languages')}
                                fieldName="languages"
                                type="text">
                                <Field
                                    name="languages"
                                    value={values.languages}
                                    dataArray={langMapArray}
                                    keyToDisplay="englishName"
                                    multiple={true}
                                    component={OFAutoComplete}
                                />
                            </OFFormControl>
                        </Grid>
                    </Grid>

                    <FormikAutoSave
                        onSave={values => {
                            const languages = values.languages.map(
                                value => value.tag
                            )
                            return dispatch(editProject({ languages }))
                        }}
                        render={({ isSaving, lastSavedDate, saveError }) => (
                            <div>
                                {isSaving ? (
                                    <Box textAlign="right">
                                        {' '}
                                        <CircularProgress />{' '}
                                    </Box>
                                ) : saveError ? (
                                    `Error: ${saveError}`
                                ) : lastSavedDate ? (
                                    <AutoSaveNotice saveDate={lastSavedDate} />
                                ) : (
                                    ''
                                )}
                            </div>
                        )}
                    />
                </Form>
            )}
        </Formik>
    )
}

export default SettingsForm
