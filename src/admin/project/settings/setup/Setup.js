import React, { lazy, Suspense } from 'react'
import CardContent from '@material-ui/core/CardContent'
import OFCard from '../../../baseComponents/OFCard'
import SetupForm from './SetupForm'
import DeleteProject from './DeleteProject'
import LoaderMatchParent from '../../../../baseComponents/customComponent/LoaderMatchParent'

const SettingsForm = lazy(() => import('./SettingsForm'))

const Setup = () => {
    return (
        <>
            <OFCard style={{ marginBottom: 32 }}>
                <CardContent>
                    <Suspense fallback={<LoaderMatchParent />}>
                        <SettingsForm />
                    </Suspense>
                </CardContent>
            </OFCard>
            <OFCard>
                <CardContent>
                    <SetupForm />
                </CardContent>
            </OFCard>
            <DeleteProject />
        </>
    )
}

export default Setup
