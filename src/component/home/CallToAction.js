import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/colors'
import logoWhite from '../../assets/logo-openfeedback-white.png'
import Title from '../design/Title'
import Box from '../design/Box'

const Wrapper = styled(Box)`
    background: ${COLORS.EXTRA_LIGHT_GRAY};
    height: 150px;
    padding: 15px;
    display: flex;
    flex-direction: column;
`

class Header extends Component {
    render() {
        return (
            <Wrapper>
                <Box
                    flex
                    flexDirection="column"
                    justifyContent="center"
                    flexGrow="1"
                    textAlign="center"
                >
                    <Title component="h3" m={0}>
                        Prêt à recevoir des feedback ?
                    </Title>
                </Box>
            </Wrapper>
        )
    }
}

export default Header
