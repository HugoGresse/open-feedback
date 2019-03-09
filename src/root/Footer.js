import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import logoColorWhite from '../assets/logo-openfeedback-color&white.png'

const Wrapper = styled.div`
    background-color: ${COLORS.DARK_GRAY};
    color: ${COLORS.WHITE};
    text-align: center;
    padding: 50px 0 30px 0;
`

class Footer extends Component {
    render() {
        return (
            <Wrapper>
                <img height="30" src={logoColorWhite} alt="open feedback" />
                <p>Copyright 2019</p>
            </Wrapper>
        )
    }
}

export default Footer
