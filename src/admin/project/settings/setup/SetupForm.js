import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import SetupJSON from '../../setupTypeForms/SetupJSON'
import SetupTypeBox from './SetupTypeBox'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_JSONURL,
    PROJECT_TYPE_OPENFEEDBACK,
} from '../../../../core/setupType/projectApi'
import SetupHoverboardv2 from '../../setupTypeForms/SetupHoverboardv2'
import { editProject } from '../../core/projectActions'
import { useTranslation } from 'react-i18next'
import TranslatedTypography from '../../../baseComponents/TranslatedTypography'

const SetupForm = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const project = useSelector(getSelectedProjectSelector)

    let setupTypeComponent

    switch (project.setupType) {
        case PROJECT_TYPE_OPENFEEDBACK:
            setupTypeComponent = <div></div>
            break
        case PROJECT_TYPE_HOVERBOARDV2:
            setupTypeComponent = (
                <SetupHoverboardv2
                    submitText={t('common.save')}
                    leftColumnTitle={t('settingsSetup.config')}
                    rightColumnTitle={t('settingsSetup.validation')}
                    initialValues={{
                        projectId: project.config.projectId,
                        apiKey: project.config.apiKey,
                        databaseURL: project.config.databaseURL,
                    }}
                    onSubmit={values =>
                        dispatch(
                            editProject({
                                config: values,
                            })
                        )
                    }
                />
            )
            break
        case PROJECT_TYPE_JSONURL:
            setupTypeComponent = (
                <SetupJSON
                    submitText={t('common.save')}
                    leftColumnTitle={t('settingsSetup.config')}
                    rightColumnTitle={t('settingsSetup.validation')}
                    initialValues={{
                        jsonUrl: project.config.jsonUrl,
                    }}
                    onSubmit={values =>
                        dispatch(
                            editProject({
                                config: values,
                            })
                        )
                    }
                />
            )
            break
        default:
            setupTypeComponent = <p>Not developed</p>
            break
    }

    return (
        <>
            <Box marginBottom={2}>
                <TranslatedTypography
                    variant="h5"
                    i18nKey="settingsSetup.setupMode">
                    Setup Mode
                </TranslatedTypography>
                <TranslatedTypography i18nKey="settingsSetup.cannotChange">
                    You cannot change the setup mode after creating the project.
                </TranslatedTypography>
            </Box>
            <Box display="flex" flexWrap="wrap" marginBottom={2}>
                <SetupTypeBox
                    title="OpenFeedback Database"
                    isSelected={project.setupType === PROJECT_TYPE_OPENFEEDBACK}
                />
                <SetupTypeBox
                    title="Hoverboard v2 Firestore"
                    isSelected={project.setupType === PROJECT_TYPE_HOVERBOARDV2}
                />
                <SetupTypeBox
                    title="JSON link"
                    isSelected={project.setupType === PROJECT_TYPE_JSONURL}
                />
            </Box>
            {setupTypeComponent}
        </>
    )
}

export default SetupForm
