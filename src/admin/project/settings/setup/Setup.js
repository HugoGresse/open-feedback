import React from 'react'
import CardContent from '@material-ui/core/CardContent'
import OFCard from '../../../baseComponents/OFCard'
import SetupForm from './SetupForm'
import DeleteProject from './DeleteProject'

const Setup = () => {
    return (
        <>
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
