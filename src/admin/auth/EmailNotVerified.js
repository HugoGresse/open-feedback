import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import OFButton from '../baseComponents/OFButton'
import { authProvider } from '../../firebase'
import { didSignIn } from './authActions'

const EmailNotVerified = ({ dispatch }) => {
    return (
        <Card>
            <CardContent>
                You need to verify your email using the link you&apos;ve
                received in your inbox.
                <br />
                <br />
                <OFButton
                    onClick={() => {
                        authProvider.currentUser
                            .getIdToken(true)
                            .then(() => authProvider.currentUser.reload())
                            .then(() => {
                                dispatch(didSignIn(authProvider.currentUser))
                            })
                    }}>
                    Retry
                </OFButton>
            </CardContent>
        </Card>
    )
}

export default EmailNotVerified
