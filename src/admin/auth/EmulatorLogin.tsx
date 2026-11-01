import {
    type AuthError,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    type UserCredential,
} from 'firebase/auth'
import { OFButton } from '../baseComponents/button/OFButton.tsx'
import { authProvider } from '../../firebase.ts'
import type { AuthUser } from '../../core/models.ts'
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
                        // A spread of the User drops its prototype
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
): Promise<UserCredential | undefined> => {
    try {
        return await createUserWithEmailAndPassword(
            authProvider,
            email,
            password
        )
    } catch (caughtError) {
        // Firebase Auth rejects with an AuthError
        const error = caughtError as AuthError
        if (error.code === 'auth/email-already-in-use') {
            try {
                return await signInWithEmailAndPassword(
                    authProvider,
                    email,
                    password
                )
            } catch (error) {
                // biome-ignore lint/suspicious/noConsole: intentional log
                console.log('Login error:', error)
            }
        }
        const { code, message } = error
        // biome-ignore lint/suspicious/noConsole: intentional log
        console.log(`Error email auth: ${code}, message: ${message}`)
    }
}

const verifyEmail = async (user: AuthUser | null = null) => {
    if (!user || user.emailVerified) {
        return
    }

    const response = await fetch(
        `http://localhost:9099/emulator/v1/projects/${import.meta.env.VITE_PROJECT_ID}/oobCodes`
    )
    const responseJson = (await response.json()) as EmulatorOobCodesResponse

    for (const oobCodeObject of responseJson.oobCodes) {
        await fetch(oobCodeObject.oobLink.split('&continueUrl')[0])
        // biome-ignore lint/suspicious/noConsole: intentional log
        console.log(`Email ${oobCodeObject.email} verified!`)
    }
}

export const setLoginCookie = (isLoggedIn: boolean) => {
    document.cookie = 'isLoggedIn=' + !!isLoggedIn + '; path=/'
}
