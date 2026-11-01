import {
    lazy,
    memo,
    type ReactNode,
    Suspense,
    useEffect,
    useState,
} from 'react'
import logoWhite from '../../assets/logo-openfeedback-white.png'
import {
    EmailAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    PhoneAuthProvider,
    sendEmailVerification,
    signInWithCredential,
} from 'firebase/auth'
import { authProvider, isUsingEmulators } from '../../firebase.ts'
import type { AuthUser } from '../../core/models.ts'
import { useAppDispatch, useAppSelector } from '../../store'
import { getLoginErrorSelector, isLoggedSelector } from './authSelectors'
import { didSignIn, signOut } from './authActions'
import { LoaderMatchParent } from '../../baseComponents/customComponent/LoaderMatchParent.tsx'
import Box from '@mui/material/Box'
import { HEX_COLORS } from '../../constants/colors'
import { EmulatorLogin, setLoginCookie } from './EmulatorLogin.tsx'

// firebaseui and the compat Auth it needs load only with the sign-in form
const StyledFirebaseAuth = lazy(() =>
    import('../../baseComponents/StyledFirebaseAuth.tsx').then((module) => ({
        default: module.StyledFirebaseAuth,
    }))
)

interface LoginProps {
    children?: ReactNode
}

export const Login = memo(({ children }: LoginProps) => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(isLoggedSelector)
    const loginError = useAppSelector(getLoginErrorSelector)
    const [tempUser, setTempUser] = useState<AuthUser | null>(
        authProvider.currentUser
    )
    const [loaderDisplayed, setLoaderDisplay] = useState(true)

    const setTempUserIfNeeded = (user: AuthUser | null) => {
        if (JSON.stringify(user) !== JSON.stringify(tempUser)) {
            setTempUser(user)
        }
    }

    useEffect(() => {
        const unregisterAuthObserver = onAuthStateChanged(
            authProvider,
            (user) => {
                if (isUsingEmulators) {
                    setLoginCookie(!!user)
                }
                if (user) {
                    if (user.isAnonymous) {
                        setTempUserIfNeeded(null)
                        dispatch(signOut())
                    } else {
                        setTempUserIfNeeded(user)
                        dispatch(didSignIn(user))
                    }
                    if (!user.emailVerified && !user.phoneNumber) {
                        sendEmailVerification(user, {
                            url: `https://${import.meta.env.VITE_AUTH_DOMAIN}/admin/`,
                        }).then(() => {
                            // Email sent.
                        })
                    }
                } else if (tempUser) {
                    // Checking tempUser prevent signOut if the is no user to signOut currently.
                    // It may happen with the listener is first attached, no user is logged in, and this method is called.
                    // It also prevent the inviteId to be remove from the url.
                    dispatch(signOut())
                }
            }
        )
        return () => {
            unregisterAuthObserver()
        }
    }, [dispatch, tempUser])

    if (isLoggedIn) {
        return children
    }

    return (
        <Box
            height="100vh"
            bgcolor={HEX_COLORS.RED_ORANGE}
            padding={1}
            display="flex"
            boxSizing="border-box"
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                flexGrow="1"
                textAlign="center"
            >
                <img
                    height="40"
                    src={logoWhite}
                    alt="open feedback"
                    style={{ marginBottom: '40px' }}
                />
                {isUsingEmulators && <EmulatorLogin />}
                {loaderDisplayed && (
                    <LoaderMatchParent style={{ color: 'white' }} height={40} />
                )}
                <Box display={loaderDisplayed ? 'none' : 'block'}>
                    <Suspense fallback={null}>
                        <StyledFirebaseAuth
                            uiCallback={(firebaseUI) => {
                                if (firebaseUI.isPendingRedirect()) {
                                    setLoaderDisplay(true)
                                }
                            }}
                            uiConfig={{
                                signInFlow: 'popup',
                                signInSuccessUrl: '/admin/',
                                signInOptions: [
                                    GoogleAuthProvider.PROVIDER_ID,
                                    GithubAuthProvider.PROVIDER_ID,
                                    EmailAuthProvider.PROVIDER_ID,
                                    PhoneAuthProvider.PROVIDER_ID,
                                ],
                                callbacks: {
                                    // Avoid redirects after sign-in.
                                    signInSuccessWithAuthResult: () => false,
                                    signInFailure: (error) => {
                                        if (
                                            error.code !==
                                            'firebaseui/anonymous-upgrade-merge-conflict'
                                        ) {
                                            return Promise.resolve()
                                        }

                                        const currentUser =
                                            authProvider.currentUser

                                        signInWithCredential(
                                            authProvider,
                                            error.credential
                                        ).then(() => {
                                            if (currentUser?.isAnonymous) {
                                                return currentUser.delete()
                                            }
                                        })
                                    },
                                    uiShown: () => {
                                        // Add additional time because for third party sign in (google) the uisown is called but
                                        // nothing is displayed...
                                        setTimeout(
                                            () => setLoaderDisplay(false),
                                            2000
                                        )
                                    },
                                },
                                autoUpgradeAnonymousUsers: true,
                            }}
                        />
                    </Suspense>
                </Box>
                {loginError && <div>{loginError}</div>}
            </Box>
        </Box>
    )
})

Login.displayName = 'Login'
