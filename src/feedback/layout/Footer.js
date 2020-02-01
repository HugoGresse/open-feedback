import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../../constants/colors'

import logoColor from '../../assets/logo-openfeedback-color.png'
import { useTranslation } from 'react-i18next'

const FooterStyled = styled.div`
    color: ${COLORS.LIGHT_GRAY};
    display: flex;
    align-items: top;
    justify-content: center;
    padding: 20px;
    margin-top: 50px;

    .Footer__Text {
        margin-right: 4px;
    }
`

const Footer = () => {
    const { t } = useTranslation()

    return (
        <FooterStyled>
            <span className="Footer__Text">{t('footer.madeBy')}</span>
            <a
                href="https://github.com/HugoGresse/open-feedback"
                target="_blank"
                rel="noopener noreferrer">
                <img height="25" src={logoColor} alt="open feedback" />
            </a>
        </FooterStyled>
    )
}

export default Footer
