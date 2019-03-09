import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/colors'
import logo from '../../assets/logo-openfeedback-color.png'
import Box from '../../baseComponents/design/Box'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { getUserSelector } from './authSelectors'
import { didSignIn, signOut } from './authActions'

const Wrapper = styled(Box)`
    background: ${COLORS.LIGHT_GRAY};
    height: 100vh;
    width: 200px;
    padding: 15px;
    display: flex;
`

class SideBar extends Component {
    render() {
        const { user } = this.props
        return (
            <Wrapper>
                <Box
                    flex
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    flexGrow="1"
                    textAlign="center"
                >
                    <img height="40" src={logo} alt="open feedback logo" />

                    <Box flex alignItems="flex-start">
                        <img
                            height="40"
                            src={user.providerData[0].photoURL}
                            alt="user picture"
                        />
                        <Box
                            flex
                            flexDirection="column"
                            alignItems="flex-start"
                        >
                            {user.providerData[0].displayName}
                            <a onClick={() => firebase.auth().signOut()}>
                                Sign-out
                            </a>
                        </Box>
                    </Box>
                </Box>
            </Wrapper>
        )
    }
}

const mapStateToProps = state => ({
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
)(SideBar)
