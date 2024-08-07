import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'

import BackgroundHeader from './images/background-header.png'
import MokckupBG from './images/mockup-phone-bg.png'
import MokckupOverlay from './images/mockup-phone-overlay.png'
import DemoOF from './images/of-demo.webp'
import Menu from './Menu.jsx'
import InnerWrapper from './component/InnerWrapper.jsx'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { isUsingEmulators } from '../firebase.ts'

const Wrapper = styled.header`
    background: ${COLORS.RED_ORANGE};
    background-image: url(${BackgroundHeader});
    background-size: contain;
    background-position: bottom;
    background-repeat: no-repeat;
    min-height: 600px;
    padding: 15px 15px 0;
    display: flex;
    flex-direction: column;
    overlay: hidden;
    position: relative;

    .mockupContainerPosition {
        position: absolute;
        bottom: 0;
        margin-left: -40px;
    }

    .headerHeroText {
        padding: 200px 0;
        flex-grow: 0.5;
        max-width: 500px;
    }

    @media (max-width: 640px) {
        .wrapperLogoMenu {
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .headerContent {
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .headerHeroText {
            padding: 40px 20px;
        }
        .mockupContainerPosition {
            position: relative;
            margin-left: 0;
        }
    }

    @media (min-width: 640px) and (max-width: 900px) {
        .headerHeroText {
            max-width: 30%;
            padding-right: 70px;
            padding-left: 20px;
        }
    }
    @media (min-width: 900px) and (max-width: 1150px) {
        .headerHeroText {
            max-width: 40%;
        }
    }
`

const LinkButton = styled.a`
    ${(props) =>
        props.variant === 'outline'
            ? `color: ${COLORS.WHITE}`
            : `color: ${COLORS.RED_ORANGE}`};
    ${(props) =>
        props.variant === 'outline'
            ? `background : none`
            : `background:  ${COLORS.WHITE}`};
    transition: all 0.2s ease;
    border: 1px solid ${COLORS.WHITE};
    border-radius: 5px;
    margin: 10px;
    padding: 10px;
    min-width: 170px;
    max-width: 100%;
    &:hover {
        box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
    }
`

const MockupContainer = styled.div`
    position: relative;
    overflow: hidden;
    width: 450px;
    height: 600px;

    img {
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        width: 100%;
    }

    @media (max-width: 640px) {
        width: 350px;
        height: 450px;
    }
`

const AnimatedMask = styled.div`
    position: relative;
    border-radius: 40px;
    overflow: hidden;
    top: 36px;
    left: 36px;
    width: calc(100% - 72px);
    height: 100%;

    @media (max-width: 640px) {
        border-radius: 30px;
        top: 28px;
        left: 30px;
        width: calc(100% - 59px);
    }
`

const Header = () => {
    const { t } = useTranslation()

    return (
        <Wrapper>
            <InnerWrapper>
                <Menu />
                <Box
                    display="flex"
                    flexDirection="row"
                    className="headerContent">
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        flexGrow="1"
                        textAlign="center"
                        className="headerHeroText">
                        <Typography variant="h1" style={{ color: '#FFFFFF' }}>
                            {t('home.title')}
                        </Typography>
                        <Typography variant="h2" style={{ color: '#FFFFFF' }}>
                            {t('home.subtitle')}
                        </Typography>
                        <br />
                        <br />
                        <LinkButton href="/admin/">
                            {t('home.headerAction')}
                        </LinkButton>
                        <LinkButton
                            href={
                                isUsingEmulators
                                    ? '/testprojectid/'
                                    : '/eaJnyMXD3oNfhrrnBYDT/'
                            }
                            variant="outline">
                            {t('home.headerActionDemo')}
                        </LinkButton>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        alignItems="center"
                        flexGrow="1"
                        textAlign="center">
                        <Box className="mockupContainerPosition">
                            <MockupContainer>
                                <img src={MokckupBG} alt="" />
                                <AnimatedMask>
                                    <img src={DemoOF} alt="" />
                                </AnimatedMask>
                                <img src={MokckupOverlay} alt="" />
                            </MockupContainer>
                        </Box>
                    </Box>
                </Box>
            </InnerWrapper>
        </Wrapper>
    )
}

export default Header
