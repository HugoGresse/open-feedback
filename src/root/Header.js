import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import logoWhite from '../assets/logo-openfeedback-white.png'
import Title from '../baseComponents/design/Title'
import Box from '../baseComponents/design/Box'

const Wrapper = styled(Box)`
    background: ${COLORS.RED_ORANGE};
    height: 100vh;
    padding: 15px;
    display: flex;
    flex-direction: column;

    @media (max-width: 640px) {
        .wrapperLogoMenu {
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    }
`
const Menu = styled.ul`
    @media (max-width: 640px) {
        padding-left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    li {
        display: inline;
        margin-left: 30px;
        margin: 10px;
    }
    a {
        color: ${COLORS.WHITE};
        opacity: 0.7;
        transition: all 0.2s ease;
        padding: 10px;
        &:hover {
            opacity: 1;
        }
    }
`

const LinkButton = styled.a`
    color: ${COLORS.WHITE};
    transition: all 0.2s ease;
    border: 1px solid ${COLORS.WHITE};
    border-radius: 5px;
    margin: 40px 10px 10px;
    padding: 10px;
    &:hover {
        opacity: 1;
    }
`

class Header extends Component {
    render() {
        return (
            <Wrapper>
                <Box
                    className="wrapperLogoMenu"
                    flex
                    justifyContent="space-between">
                    <img height="40" src={logoWhite} alt="open feedback" />
                    <Menu>
                        <li>
                            <a href="#howitworks">How it works</a>
                        </li>
                        <li>
                            <a href="/eaJnyMXD3oNfhrrnBYDT">Demo</a>
                        </li>
                        <li>
                            <a href="/admin/">Admin</a>
                        </li>
                    </Menu>
                </Box>
                <Box
                    flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    flexGrow="1"
                    textAlign="center">
                    <Title component="h1" m={0} color={COLORS.WHITE}>
                        Collect feedbacks easily
                    </Title>
                    <Title component="h3" m={0} color={COLORS.WHITE}>
                        Conferences, meetups, events, summit...
                    </Title>
                    <LinkButton href="/admin/">
                        Create your event now
                    </LinkButton>
                </Box>
            </Wrapper>
        )
    }
}

export default Header
