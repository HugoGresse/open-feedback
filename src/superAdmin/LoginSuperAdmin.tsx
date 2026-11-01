import {
    lazy,
    memo,
    type ReactNode,
    Suspense,
    useEffect,
    useState,
} from 'react'
import logoWhite from '../assets/logo-openfeedback-white.png'
import {
    EmailAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    PhoneAuthProvider,
    signInWithCredential,
    signOut as firebaseSignOut,
} from 'firebase/auth'
import { authProvider } from '../firebase'
import { LoaderMatchParent } from '../baseComponents/customComponent/LoaderMatchParent.tsx'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import { useIsSuperAdmin } from './hooks/useIsSuperAdmin.ts'

// firebaseui and the compat Auth it needs load only with the sign-in form
const StyledFirebaseAuth = lazy(() =>
    import('../baseComponents/StyledFirebaseAuth.tsx').then((module) => ({
        default: module.StyledFirebaseAuth,
    }))
)

export const LoginSuperAdmin = memo(({ children }: { children: ReactNode }) => {
    const [loggedInUser, setUser] = useState<{ uid: string } | null>(
        authProvider.currentUser
    )
    const [loaderDisplayed, setLoaderDisplay] = useState(true)
    const isSuperAdmin = useIsSuperAdmin(loggedInUser)

    const setUserIfNeeded = (user: { uid: string } | null) => {
        if (JSON.stringify(user) !== JSON.stringify(loggedInUser)) {
            setUser(user)
        }
    }

    const signOut = () => {
        firebaseSignOut(authProvider).then(() => {
            setUser(null)
        })
    }

    useEffect(() => {
        const unregisterAuthObserver = onAuthStateChanged(
            authProvider,
            (user) => {
                if (user) {
                    if (user.isAnonymous) {
                        setUserIfNeeded(null)
                    } else {
                        setUserIfNeeded(user)
                    }
                } else if (loggedInUser) {
                    setUserIfNeeded(null)
                }
            }
        )
        return () => {
            unregisterAuthObserver()
        }
    }, [loggedInUser])

    if (loggedInUser && !isSuperAdmin) {
        return (
            <Box color={'white'}>
                <p>NOT A SUPER ADMIN, YOU CAN&apos;T SEE THIS OUST!</p>
                <Button variant="contained" onClick={() => signOut()}>
                    LOGOUT
                </Button>
            </Box>
        )
    }

    if (loggedInUser) {
        return (
            <>
                <Button variant="contained" onClick={() => signOut()}>
                    LOGOUT
                </Button>
                {children}
            </>
        )
    }

    return (
        <Box height="100vh" padding={1} display="flex" boxSizing="border-box">
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
                {loaderDisplayed && (
                    <LoaderMatchParent style={{ color: 'white' }} height={40} />
                )}
                <Box display={loaderDisplayed ? 'none' : 'block'}>
                    <Suspense fallback={null}>
                        <StyledFirebaseAuth
                            uiCallback={(firebaseUI: {
                                isPendingRedirect: () => boolean
                            }) => {
                                if (firebaseUI.isPendingRedirect()) {
                                    setLoaderDisplay(true)
                                }
                            }}
                            uiConfig={{
                                signInFlow: 'popup',
                                signInSuccessUrl: '/superadmin/',
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
            </Box>
        </Box>
    )
})
