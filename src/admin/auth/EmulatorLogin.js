import React from 'react'
import OFButton from '../baseComponents/button/OFButton'
import { authProvider } from '../../firebase'
import { didSignIn } from './authActions'
import { useDispatch } from 'react-redux'

const EMAIL = 'hugo@example.com'
const PASSWORD = 'azerty'
export const EmulatorLogin = () => {
    const dispatch = useDispatch()

    const onLoginPress = async () => {
        const response = await login(EMAIL, PASSWORD)
        if (response) {
            await verifyEmail(response.user)
            dispatch(
                didSignIn({
                    ...response.user,
                    emailVerified: true,
                })
            )
        }
    }

    return <OFButton onClick={onLoginPress}>Fake login with EMAIL</OFButton>
}

const login = async (email, password) => {
    try {
        return await authProvider.createUserWithEmailAndPassword(
            email,
            password
        )
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            try {
                return await authProvider.signInWithEmailAndPassword(
                    email,
                    password
                )
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log('Login error:', error)
            }
        }
        const { code, message } = error
        // eslint-disable-next-line no-console
        console.log(`Error email auth: ${code}, message: ${message}`)
    }
}

const verifyEmail = async (user = null) => {
    if (!user || user.emailVerified) {
        return
    }

    const response = await fetch(
        `http://localhost:9099/emulator/v1/projects/${process.env.REACT_APP_PROJECT_ID}/oobCodes`
    )
    const responseJson = await response.json()

    for (const oobCodeObject of responseJson.oobCodes) {
        await fetch(oobCodeObject.oobLink.split('&continueUrl')[0])
        // eslint-disable-next-line no-console
        console.log(`Email ${oobCodeObject.email} verified!`)
    }
}

export const setLoginCookie = (isLoggedIn) => {
    document.cookie = isLoggedIn + '=' + !!isLoggedIn + '' + '; path=/'
}
