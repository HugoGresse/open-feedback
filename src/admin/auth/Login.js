import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/colors'
import logoWhite from '../../assets/logo-openfeedback-white.png'
import Box from '../../baseComponents/design/Box'
import { StyledFirebaseAuth } from 'react-firebaseui'
import { auth, authProvider } from '../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { getLoginErrorSelector, isLoggedSelector } from './authSelectors'
import { didSignIn, signOut } from './authActions'
import LoaderMatchParent from '../../baseComponents/customComponent/LoaderMatchParent'

const Wrapper = styled(Box)`
    background: ${COLORS.RED_ORANGE};
    height: 100vh;
    padding: 15px;
    display: flex;
    flex-direction: column;
`

const Login = ({ children }) => {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector(isLoggedSelector)
    const loginError = useSelector(getLoginErrorSelector)
    const [tempUser, setTempUser] = useState(authProvider.currentUser)
    const [loaderDisplayed, setLoaderDisplay] = useState(false)

    useEffect(() => {
        const unregisterAuthObserver = authProvider.onAuthStateChanged(user => {
            if (user) {
                if (user.isAnonymous) {
                    setTempUser(null)
                    dispatch(signOut())
                } else {
                    setTempUser(user)
                    dispatch(didSignIn(user))
                }
                if (!user.emailVerified && !user.phoneNumber) {
                    user.sendEmailVerification({
                        url: `https://${process.env.REACT_APP_AUTH_DOMAIN}/admin/`,
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
        })
        return () => {
            unregisterAuthObserver()
        }
    }, [dispatch, tempUser])

    if (isLoggedIn) {
        return children
    }

    return (
        <Wrapper>
            <Box
                flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                flexGrow="1"
                textAlign="center">
                <img
                    height="40"
                    src={logoWhite}
                    alt="open feedback"
                    style={{ marginBottom: '40px' }}
                />
                {loaderDisplayed && (
                    <LoaderMatchParent style={{ color: 'white' }} height={40} />
                )}
                <StyledFirebaseAuth
                    firebaseAuth={authProvider}
                    uiCallback={firebaseUI => {
                        if (firebaseUI.isPendingRedirect()) {
                            setLoaderDisplay(true)
                        }
                    }}
                    uiConfig={{
                        signInFlow: 'redirect',
                        signInSuccessUrl: '/admin/',
                        signInOptions: [
                            auth.GoogleAuthProvider.PROVIDER_ID,
                            auth.GithubAuthProvider.PROVIDER_ID,
                            auth.EmailAuthProvider.PROVIDER_ID,
                            auth.PhoneAuthProvider.PROVIDER_ID,
                        ],
                        callbacks: {
                            // Avoid redirects after sign-in.
                            signInSuccessWithAuthResult: () => false,
                            signInFailure: error => {
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
                                        if (currentUser.isAnonymous) {
                                            return currentUser.delete()
                                        }
                                    })
                            },
                            uiShown: () => {
                                // Add additional time because for third party sign in (google) the uisown is called but
                                // nothing is displayed...
                                setTimeout(() => setLoaderDisplay(false), 2000)
                            },
                        },
                        autoUpgradeAnonymousUsers: true,
                    }}
                />

                {loginError && <div>{loginError}</div>}
            </Box>
        </Wrapper>
    )
}

export default Login
