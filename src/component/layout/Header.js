import { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import React from 'react'
import { COLORS } from '../../constants/colors'
import Title from '../design/Title'
import { SPACING } from '../../constants/constants'

const Logo = styled.img`
    margin-right: 20px;
`

const HeaderStyled = styled.div`
    top: 0;
    left: auto;
    right: 0;
    position: sticky;
    z-index: 1;
    background: ${COLORS.WHITE};
    display: flex;
    align-items: center;
    padding: 10px ${SPACING.HEADER};
`

class Header extends Component {
    render() {
        const { logo } = this.props
        return (
            <HeaderStyled>
                <Logo src={logo} width={60} height={60} alt="logo" />
                <Title component="h1" fontSize={24} fontWeight={400}>
                    Sunny Tech
                </Title>
            </HeaderStyled>
        )
    }
}

Header.propTypes = {
    logo: PropTypes.string.isRequired,
    displayHeader: PropTypes.bool
}

export default Header
