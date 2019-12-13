import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import phone from '../assets/phone.png'
import hoverboard from '../assets/hoverboard.png'
import firebase from '../assets/firebase.png'
import Title from '../baseComponents/design/Title'
import Box from '../baseComponents/design/Box'
import { Grid } from '@material-ui/core/es'
import Hidden from '@material-ui/core/Hidden'

const Wrapper = styled(Grid)`
    padding: 0px 15px 0 15px;
    display: flex;
    .right {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding-right: 10%;
    }
    .left {
        padding: 50px 0;
    }
`

const List = styled.ul`
    li {
        margin-bottom: 40px;
    }
`

const CompatibilityText = styled(Box)`
    color: ${COLORS.GRAY};
    img {
        margin: 0 5px;
    }
`

class Header extends Component {
    render() {
        return (
            <Wrapper container id="howitworks">
                <Hidden xsDown>
                    <Grid className="right" item sm={6}>
                        <img height="300" src={phone} alt="Phone" />
                    </Grid>
                </Hidden>
                <Grid className="left" item xs={12} sm={6}>
                    <Title>Comment ça marche ?</Title>

                    <List>
                        <li>
                            Import or manually add speakers & talks to generate
                            voting form
                        </li>
                        <li>Share a link or a QR Code with the attendees</li>
                        <li>
                            Let the attendees rate and give feedback without any
                            login
                        </li>
                    </List>

                    <CompatibilityText flex alignItems="center">
                        Compatible with{' '}
                        <img height="40" src={hoverboard} alt="hoverboard" /> et{' '}
                        <img height="50" src={firebase} alt="Firebase" />
                    </CompatibilityText>
                </Grid>
            </Wrapper>
        )
    }
}

export default Header
