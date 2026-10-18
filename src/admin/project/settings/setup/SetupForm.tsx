import { useAppDispatch, useAppSelector } from '../../../../store'
import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import { SetupJSON } from '../../setupTypeForms/SetupJSON.tsx'
import { SetupTypeBox } from './SetupTypeBox.tsx'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_JSONURL,
    PROJECT_TYPE_OPENFEEDBACK,
} from '../../../../core/setupType/projectApi'
import { SetupHoverboardv2 } from '../../setupTypeForms/SetupHoverboardv2.tsx'
import { useTranslation } from 'react-i18next'
import { TranslatedTypography } from '../../../baseComponents/TranslatedTypography.tsx'
import { editProject } from '../../core/actions/editProject'

export const SetupForm = () => {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const project = useAppSelector(getSelectedProjectSelector)

    // Rendered under <Project>, which only renders its children once the
    // project is loaded.
    if (!project) return null

    let setupTypeComponent: ReactNode

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
                        // Firestore boundary: a hoverboardv2 project always has its config.
                        projectId: project.config?.projectId as string,
                        apiKey: project.config?.apiKey as string,
                        databaseURL: project.config?.databaseURL as string,
                    }}
                    onSubmit={(values) =>
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
                        // Firestore boundary: a jsonurl project always has its config.
                        jsonUrl: project.config?.jsonUrl as string,
                    }}
                    onSubmit={(values) =>
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
                    i18nKey="settingsSetup.setupMode"
                >
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
