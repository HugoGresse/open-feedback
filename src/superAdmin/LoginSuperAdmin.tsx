import React, { memo, ReactNode, useEffect, useState } from 'react'
import logoWhite from '../assets/logo-openfeedback-white.png'
import { auth, authProvider } from '../firebase'
import LoaderMatchParent from '../baseComponents/customComponent/LoaderMatchParent.tsx'
import Box from '@mui/material/Box'
import StyledFirebaseAuth from '../baseComponents/StyledFirebaseAuth.tsx'
import { Button } from '@mui/material'

export const LoginSuperAdmin = memo(({ children }: { children: ReactNode }) => {
    const [loggedInUser, setUser] = useState<{ uid: string } | null>(authProvider.currentUser)
    const [loaderDisplayed, setLoaderDisplay] = useState(true)

    const setUserIfNeeded = (user: { uid: string } | null) => {
        if (JSON.stringify(user) !== JSON.stringify(loggedInUser)) {
            setUser(user)
        }
    }

    const signOut = () => {
        authProvider.signOut()
            .then(() => {
                setUser(null)
            })
    }

    useEffect(() => {
        const unregisterAuthObserver = authProvider.onAuthStateChanged(
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
            },
        )
        return () => {
            unregisterAuthObserver()
        }
    }, [loggedInUser])


    if (loggedInUser) {
        return <>
            <Button variant="contained" onClick={() => signOut()}>LOGOUT</Button>
            {children}
        </>
    }

    return (
        <Box
            height="100vh"
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
                {loaderDisplayed && (
                    <LoaderMatchParent style={{ color: 'white' }} height={40} />
                )}
                <Box display={loaderDisplayed ? 'none' : 'block'}>
                    <StyledFirebaseAuth
                        firebaseAuth={authProvider}
                        uiCallback={(firebaseUI: { isPendingRedirect: () => boolean }) => {
                            if (firebaseUI.isPendingRedirect()) {
                                setLoaderDisplay(true)
                            }
                        }}
                        uiConfig={{
                            signInFlow: 'redirect',
                            signInSuccessUrl: '/superadmin/',
                            signInOptions: [
                                auth.GoogleAuthProvider.PROVIDER_ID,
                                auth.GithubAuthProvider.PROVIDER_ID,
                                auth.EmailAuthProvider.PROVIDER_ID,
                                auth.PhoneAuthProvider.PROVIDER_ID,
                            ],
                            callbacks: {
                                // Avoid redirects after sign-in.
                                signInSuccessWithAuthResult: () => false,
                                signInFailure: (error: { code: string, credential: unknown }) => {
                                    if (
                                        error.code !==
                                        'firebaseui/anonymous-upgrade-merge-conflict'
                                    ) {
                                        return Promise.resolve()
                                    }

                                    const currentUser = authProvider.currentUser

                                    authProvider
                                        .signInWithCredential(error.credential)
                                        .then(() => {
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
                                        2000,
                                    )
                                },
                            },
                            autoUpgradeAnonymousUsers: true,
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
})
