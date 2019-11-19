import React, {Component} from 'react'
import styled from 'styled-components'
import {COLORS} from '../../constants/colors'
import logoWhite from '../../assets/logo-openfeedback-white.png'
import Box from '../../baseComponents/design/Box'
import {auth, authProvider} from '../../firebase'
import {connect} from 'react-redux'
import {getLoginErrorSelector, isLoggedSelector} from './authSelectors'
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
                        style={{marginBottom: '40px'}}
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
