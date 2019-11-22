import React, {Component} from 'react'
import styled from 'styled-components'
import {COLORS} from '../../constants/colors'
import logoWhite from '../../assets/logo-openfeedback-white.png'
import Box from '../../baseComponents/design/Box'
import {StyledFirebaseAuth} from 'react-firebaseui'
import {auth, authProvider} from '../../firebase'
import {connect} from 'react-redux'
import {getLoginErrorSelector, getUserSelector, isLoggedSelector} from './authSelectors'
import {didSignIn, signOut} from './authActions'

const Wrapper = styled(Box)`
    background: ${COLORS.RED_ORANGE};
    height: 100vh;
    padding: 15px;
    display: flex;
    flex-direction: column;
`

class Login extends Component {
    componentDidMount() {
        let tempUser = authProvider.currentUser
        this.unregisterAuthObserver = authProvider.onAuthStateChanged(user => {
            if (user) {
                if (user.isAnonymous) {
                    tempUser = null
                    this.props.signOut()
                } else {
                    tempUser = user
                    this.props.didSignIn(user)
                }
                if(!user.emailVerified && !user.phoneNumber){
                    user.sendEmailVerification().then(() => {
                        // Email sent.
                    })
                }
            } else if (tempUser) {
                // Checking tempUser prevent signOut if the is no user to signOut currently.
                // It may happen with the listener is first attached, no user is logged in, and this method is called.
                // It also prevent the inviteId to be remove from the url.
                this.props.signOut()
            }
        })
    }

    componentWillUnmount() {
        this.unregisterAuthObserver()
    }

    render() {
        if(this.props.user && !this.props.user.emailVerified && !this.props.user.phoneNumber && !this.props.user.isAnonymous) {
            return "You need to verify your email using the link you've received in your inbox and refresh this page after. Thanks."
        }

        if (this.props.isLoggedIn) {
            return this.props.children
        }

        return (
            <Wrapper>
                <Box
                    flex
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
                        style={{marginBottom: '40px'}}
                    />
                    <StyledFirebaseAuth
                        uiConfig={{
                            signInFlow: 'popup',
                            signInSuccessUrl: '/',
                            signInOptions: [
                                auth.GoogleAuthProvider.PROVIDER_ID,
                                auth.GithubAuthProvider.PROVIDER_ID,
                                auth.EmailAuthProvider.PROVIDER_ID,
                                auth.PhoneAuthProvider.PROVIDER_ID
                            ],
                            callbacks: {
                                // Avoid redirects after sign-in.
                                signInSuccessWithAuthResult: () => false,
                                signInFailure: error => {
                                    if (error.code !== 'firebaseui/anonymous-upgrade-merge-conflict') {
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
                                }
                            },
                            autoUpgradeAnonymousUsers: true
                        }
                        }
                        firebaseAuth={authProvider}
                    />

                    {this.props.loginError && <div>
                        {this.props.loginError}
                    </div>}
                </Box>
            </Wrapper>
        )
    }
}

const mapStateToProps = state => ({
    isLoggedIn: isLoggedSelector(state),
    loginError: getLoginErrorSelector(state),
    user: getUserSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        didSignIn: didSignIn,
        signOut: signOut
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)
