import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { OFButton } from '../baseComponents/button/OFButton.tsx'
import { authProvider } from '../../firebase.ts'
import { didSignIn } from './authActions'
import { useTranslation } from 'react-i18next'

export const EmailNotVerified = ({ dispatch }) => {
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
                    }}
                >
                    {t('auth.retry')}
                </OFButton>
            </CardContent>
        </Card>
    )
}
