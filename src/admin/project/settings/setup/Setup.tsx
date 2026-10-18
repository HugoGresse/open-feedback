import { lazy, Suspense } from 'react'
import CardContent from '@mui/material/CardContent'
import { OFCard } from '../../../baseComponents/OFCard.tsx'
import { SetupForm } from './SetupForm.tsx'
import { DeleteProject } from './DeleteProject.tsx'
import { LoaderMatchParent } from '../../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { editProject } from '../../core/actions/editProject'
import { useStore } from 'react-redux'
import {
    type RootState,
    useAppDispatch,
    useAppSelector,
} from '../../../../store'
import {
    getLanguagesSelector,
    getSelectedProjectSelector,
} from '../../core/projectSelectors'
import { ResetVotes } from './ResetVotes.tsx'
import { BottomActionLayout } from '../../layout/BottomActionLayout.tsx'

const SettingsForm = lazy(() =>
    import('./SettingsForm.tsx').then((module) => ({
        default: module.SettingsForm,
    }))
)

export const Setup = () => {
    const dispatch = useAppDispatch()
    const project = useAppSelector(getSelectedProjectSelector)
    const store = useStore<RootState>()
    // Doing this prevent the selector to be connected to redux directly, thus prevent future update of initialValues
    const initialLanguages = getLanguagesSelector(store.getState())

    // Rendered under <Project>, which only renders its children once the
    // project is loaded.
    if (!project) return null

    return (
        <>
            <OFCard style={{ marginBottom: 32 }}>
                <CardContent>
                    <Suspense fallback={<LoaderMatchParent height="100px" />}>
                        <SettingsForm
                            onSave={(settings) =>
                                dispatch(editProject(settings))
                            }
                            initialLanguages={initialLanguages}
                            disableSoloTalkRedirect={
                                project.disableSoloTalkRedirect
                            }
                            hideVotesUntilUserVote={
                                project.hideVotesUntilUserVote
                            }
                            displayFullDates={project.displayFullDates}
                            liveUserVotes={project.liveUserVotes}
                        />
                    </Suspense>
                </CardContent>
            </OFCard>
            <OFCard>
                <CardContent>
                    <SetupForm />
                </CardContent>
            </OFCard>

            <BottomActionLayout>
                <ResetVotes />
                <DeleteProject />
            </BottomActionLayout>
        </>
    )
}
