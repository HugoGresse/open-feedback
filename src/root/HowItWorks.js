import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import phone from '../assets/phone.png'
import hoverboard from '../assets/hoverboard.png'
import firebase from '../assets/firebase.png'
import Title from '../feedback/design/Title'
import Box from '../feedback/design/Box'
import { Grid } from '@material-ui/core/es'

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
                <Grid className="right" item xs={0} sm={6}>
                    <img height="300" src={phone} alt="Phone" />
                </Grid>
                <Grid className="left" item xs={12} sm={6}>
                    <Title>Comment ça marche ?</Title>

                    <List>
                        <li>
                            Importer vos sessions et vos talks pour générer des
                            formulaires
                        </li>
                        <li>
                            Partager un lien ou un QR code avec les participants
                        </li>
                        <li>
                            Laisser les participants noter les talks sans besoin
                            de se connecter
                        </li>
                    </List>

                    <CompatibilityText flex alignItems="center">
                        Compatible avec le programme{' '}
                        <img height="40" src={hoverboard} alt="hoverboard" /> et{' '}
                        <img height="50" src={firebase} alt="Fire base" />
                    </CompatibilityText>
                </Grid>
            </Wrapper>
        )
    }
}

export default Header
