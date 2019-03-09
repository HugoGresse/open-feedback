import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import Title from '../baseComponents/design/Title'
import Box from '../baseComponents/design/Box'
import Button from '../baseComponents/design/Button'

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
                    alignItems="center"
                    flexGrow="1"
                    textAlign="center"
                >
                    <Title component="h3" m={0}>
                        Prêt à recevoir des feedback ?
                    </Title>
                    <Button mt={40} color={COLORS.RED_ORANGE}>
                        Créer votre événement
                    </Button>
                </Box>
            </Wrapper>
        )
    }
}

export default Header
