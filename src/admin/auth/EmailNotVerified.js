import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import OFButton from '../baseComponents/button/OFButton'
import { authProvider } from '../../firebase'
import { didSignIn } from './authActions'
import { useTranslation } from 'react-i18next'

const EmailNotVerified = ({ dispatch }) => {
    const { t } = useTranslation()

    return (
        <Card>
            <CardContent>
                {t('auth.emailNotVerified')}
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
                    {t('auth.retry')}
                </OFButton>
            </CardContent>
        </Card>
    )
}

export default EmailNotVerified
