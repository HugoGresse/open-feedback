import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import Title from '../baseComponents/design/Title'
import Box from '../baseComponents/design/Box'
import InnerWrapper from './component/InnerWrapper'

import adminImage from './images/admin-new.webp'
import newImage from './images/new.png'
import qrcodeImage from './images/qrcode.png'
import bulleImage from './images/bulle.png'
import hoverboard from './images/hoverboard.png'
import { useTranslation } from 'react-i18next'

const InnerWrapperResponsive = styled(InnerWrapper)`
    @media (max-width: 640px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`

const DemoContainer = styled.div`
    background: #000;
    border-radius: 10px;
    padding: 10px;
    max-width: 90%;
    margin: 0 auto;

    img {
        display: block;
        max-height: 600px;
        max-width: 100%;
    }
`

const BoxRight = styled(Box)`
    padding-left: 40px;

    h2 {
        margin-top: 0;
        margin-bottom: 40px;

        @media (max-width: 640px) {
            margin-top: 40px;
        }
    }
`

const List = styled.ul`
    li {
        margin-bottom: 30px;
        list-style: none;

        img {
            width: 30px;
            height: 30px;
            background-color: ${COLORS.RED_ORANGE};
            border-radius: 15px;
            margin: -0 10px 0 -40px;
            top: 10px;
            position: relative;
        }
    }
`

const CompatibilityText = styled(Box)`
    margin-top 20px;
    color: ${COLORS.GRAY};
    img {
        margin: 0 5px;
    }
`

const Header = () => {
    const { t } = useTranslation()

    return (
        <Box backgroundColor="#eee" padding={40}>
            <InnerWrapperResponsive id="howitworks" flex>
                <Box>
                    <DemoContainer>
                        <img src={adminImage} alt="Demo admin" />
                    </DemoContainer>
                </Box>
                <BoxRight>
                    <Title>{t('home.howItWorks')}</Title>

                    <List>
                        <li>
                            <img src={newImage} alt="" />
                            {t('home.3clicks')}
                        </li>
                        <li>
                            <img src={qrcodeImage} alt="" />
                            {t('home.scan')}
                        </li>
                        <li>
                            <img src={bulleImage} alt="" />
                            {t('home.vote')}
                        </li>
                    </List>

                    <CompatibilityText flex alignItems="center">
                        {t('home.compatibleHoverboard')}
                        <img height="40" src={hoverboard} alt="hoverboard" />
                    </CompatibilityText>
                </BoxRight>
            </InnerWrapperResponsive>
        </Box>
    )
}

export default Header
