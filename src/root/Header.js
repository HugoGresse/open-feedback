import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import logoWhite from '../assets/logo-openfeedback-white.png'
import Title from '../feedback/design/Title'
import Box from '../feedback/design/Box'
import Button from '../feedback/design/Button'

const Wrapper = styled(Box)`
    background: ${COLORS.RED_ORANGE};
    height: 100vh;
    padding: 15px;
    display: flex;
    flex-direction: column;
`
const Menu = styled.ul`
    li {
        display: inline;
        margin-left: 30px;
    }
    a {
        color: ${COLORS.WHITE};
        opacity: 0.7;
        transition: all 0.2s ease;
        &:hover {
            opacity: 1;
        }
    }
`
class Header extends Component {
    render() {
        return (
            <Wrapper>
                <Box flex justifyContent="space-between">
                    <img height="40" src={logoWhite} alt="open feedback" />
                    <Menu>
                        <li>
                            <a href="#howitworks">Comment ça marche ?</a>
                        </li>
                        <li>
                            <a href="/eaJnyMXD3oNfhrrnBYDT">Démo</a>
                        </li>
                        <li>
                            <a href="/">Connexion</a>
                        </li>
                    </Menu>
                </Box>
                <Box
                    flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    flexGrow="1"
                    textAlign="center"
                >
                    <Title component="h1" m={0} color={COLORS.WHITE}>
                        Collecter des feedback simplement
                    </Title>
                    <Title component="h3" m={0} color={COLORS.WHITE}>
                        Conférences, meetups, évènements,...
                    </Title>
                    <Button mt={40} outline color={COLORS.WHITE}>
                        Créer votre événement
                    </Button>
                </Box>
            </Wrapper>
        )
    }
}

export default Header
