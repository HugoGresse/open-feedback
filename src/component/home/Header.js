import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/colors'
import logoWhite from '../../assets/logo-openfeedback-white.png'
import Title from '../design/Title'
import Box from '../design/Box'

const Wrapper = styled(Box)`
    background: ${COLORS.RED_ORANGE};
    height: 400px;
    padding: 15px;
    display: flex;
    flex-direction: column;
`
const Menu = styled.ul`
    color: ${COLORS.WHITE};
    li {
        display: inline;
        margin-left: 10px;
    }
`
class Header extends Component {
    render() {
        return (
            <Wrapper>
                <Box flex justifyContent="space-between">
                    <img height="40" src={logoWhite} alt="open feedback" />
                    <Menu>
                        <li>Comment ça marche ?</li>
                        <li>Démo</li>
                        <li>Connexion</li>
                    </Menu>
                </Box>
                <Box
                    flex
                    flexDirection="column"
                    justifyContent="center"
                    flexGrow="1"
                    textAlign="center"
                >
                    <Title component="h1" m={0} color={COLORS.WHITE}>
                        Collecter des feedback simplement
                    </Title>
                    <Title component="h3" m={0} color={COLORS.WHITE}>
                        Conférences, meetups, évènements,...
                    </Title>
                </Box>
            </Wrapper>
        )
    }
}

export default Header
