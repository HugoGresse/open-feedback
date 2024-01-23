import React, { lazy, Suspense } from 'react'
import CardContent from '@material-ui/core/CardContent'
import OFCard from '../../../baseComponents/OFCard'
import SetupForm from './SetupForm'
import { DeleteProject } from './DeleteProject'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent'
import { editProject } from '../../core/actions/editProject'
import { useDispatch, useSelector, useStore } from 'react-redux'
import {
    getLanguagesSelector,
    getSelectedProjectSelector,
} from '../../core/projectSelectors'
import { ResetVotes } from './ResetVotes'
import BottomActionLayout from '../../layout/BottomActionLayout'

const SettingsForm = lazy(() => import('./SettingsForm'))

const Setup = () => {
    const dispatch = useDispatch()
    const project = useSelector(getSelectedProjectSelector)
    // Doing this prevent the selector to be connected to redux directly, thus prevent future update of initialValues
    const initialLanguages = getLanguagesSelector(useStore().getState())

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

export default Setup
