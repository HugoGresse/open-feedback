import type firebase from 'firebase/compat/app'
import { OFButton } from '../baseComponents/button/OFButton.tsx'
import { authProvider } from '../../firebase.ts'
import { didSignIn } from './authActions'
import { useAppDispatch } from '../../store'

interface EmulatorOobCodesResponse {
    oobCodes: { email: string; oobLink: string }[]
}

const EMAIL = 'hugo@example.com'
const PASSWORD = 'azerty'
export const EmulatorLogin = () => {
    const dispatch = useAppDispatch()

    const onLoginPress = async () => {
        const response = await login(EMAIL, PASSWORD)
        if (response) {
            const user = response.user
            await verifyEmail(user)
            dispatch(
                didSignIn(
                    user && {
                        // A spread of the compat User drops its prototype
                        // toJSON(), the only thing didSignIn reads.
                        toJSON: () => ({
                            ...user.toJSON(),
                            emailVerified: true,
                        }),
                    }
                )
            )
        }
    }

    return (
        <OFButton onClick={onLoginPress} className="fakeLogin">
            Fake login with EMAIL
        </OFButton>
    )
}

const login = async (
    email: string,
    password: string
): Promise<firebase.auth.UserCredential | undefined> => {
    try {
        return await authProvider.createUserWithEmailAndPassword(
            email,
            password
        )
    } catch (caughtError) {
        // Firebase Auth rejects with a firebase.auth.Error
        const error = caughtError as firebase.auth.Error
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

const verifyEmail = async (user: firebase.User | null = null) => {
    if (!user || user.emailVerified) {
        return
    }

    const response = await fetch(
        `http://localhost:9099/emulator/v1/projects/${import.meta.env.VITE_PROJECT_ID}/oobCodes`
    )
    const responseJson = (await response.json()) as EmulatorOobCodesResponse

    for (const oobCodeObject of responseJson.oobCodes) {
        await fetch(oobCodeObject.oobLink.split('&continueUrl')[0])
        // eslint-disable-next-line no-console
        console.log(`Email ${oobCodeObject.email} verified!`)
    }
}

export const setLoginCookie = (isLoggedIn: boolean) => {
    document.cookie = 'isLoggedIn=' + !!isLoggedIn + '; path=/'
}
