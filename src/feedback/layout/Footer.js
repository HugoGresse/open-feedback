import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/colors'

import logoColor from '../../assets/logo-openfeedback-color.png'

const FooterStyled = styled.div`
    color: ${COLORS.LIGHT_GRAY};
    display: flex;
    align-items: top;
    justify-content: center;
    padding: 20px;

    .Footer__Text {
        margin-right: 4px;
    }
`

class Footer extends Component {
    render() {
        return (
            <FooterStyled>
                <span className="Footer__Text">Fabricoté par</span>
                <img height="25" src={logoColor} alt="open feedback" />
            </FooterStyled>
        )
    }
}

export default Footer
