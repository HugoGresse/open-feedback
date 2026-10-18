import { lazy, Suspense } from 'react'
import CardContent from '@mui/material/CardContent'
import { OFCard } from '../../../baseComponents/OFCard.tsx'
import { SetupForm } from './SetupForm.tsx'
import { DeleteProject } from './DeleteProject.tsx'
import { LoaderMatchParent } from '../../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { editProject } from '../../core/actions/editProject'
import { useDispatch, useSelector, useStore } from 'react-redux'
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
    const dispatch = useDispatch()
    const project = useSelector(getSelectedProjectSelector)
    const store = useStore()
    // Doing this prevent the selector to be connected to redux directly, thus prevent future update of initialValues
    const initialLanguages = getLanguagesSelector(store.getState())

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
