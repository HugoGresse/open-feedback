import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/colors'
import logoWhite from '../../assets/logo-openfeedback-white.png'
import Box from '../../baseComponents/design/Box'
import { StyledFirebaseAuth } from 'react-firebaseui'
import { auth, authProvider } from '../../firebase'
import { connect } from 'react-redux'
import { getLoginErrorSelector, isLoggedSelector } from './authSelectors'
import { didSignIn, signOut } from './authActions'

const Wrapper = styled(Box)`
    background: ${COLORS.RED_ORANGE};
    height: 100vh;
    padding: 15px;
    display: flex;
    flex-direction: column;
`

const uiConfig = {
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
            this.props.didSignIn(
                null,
                'Unable to upgrade you from anonymous user'
            )
        }
    },
    autoUpgradeAnonymousUsers: true
}

class Login extends Component {
    componentDidMount() {
        this.unregisterAuthObserver = authProvider.onAuthStateChanged(user => {
            if (user) {
                if (user.isAnonymous) {
                    this.props.signOut()
                } else {
                    this.props.didSignIn(user)
                }
            } else {
                this.props.signOut()
            }
        })
    }

    componentWillUnmount() {
        this.unregisterAuthObserver()
    }

    render() {
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
                        style={{ marginBottom: '40px' }}
                    />
                    <StyledFirebaseAuth
                        uiConfig={uiConfig}
                        firebaseAuth={authProvider}
                    />
                </Box>
            </Wrapper>
        )
    }
}

const mapStateToProps = state => ({
    isLoggedIn: isLoggedSelector(state),
    loginError: getLoginErrorSelector(state)
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
