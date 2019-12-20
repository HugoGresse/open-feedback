import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import Title from '../baseComponents/design/Title'
import Box from '../baseComponents/design/Box'

import BackgroundHeader from './images/background-header.png'
import MokckupBG from './images/mockup-phone-bg.png'
import MokckupOverlay from './images/mockup-phone-overlay.png'
import DemoOF from './images/of-demo.webp'
import Menu from './Menu'
import InnerWrapper from './component/InnerWrapper'

const Wrapper = styled(Box)`
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
            padding: 40px 0;
        }
        .mockupContainerPosition {
            position: relative;
            margin-left: 0;
        }
    }
`

const LinkButton = styled.a`
    ${props =>
        props.variant === 'outline'
            ? `color: ${COLORS.WHITE}`
            : `color: ${COLORS.RED_ORANGE}`};
    ${props =>
        props.variant === 'outline'
            ? `background : none`
            : `background:  ${COLORS.WHITE}`}
    transition: all 0.2s ease;
    border: 1px solid ${COLORS.WHITE};
    border-radius: 5px;
    margin: 10px;
    padding: 10px;
    min-width: 170px;
    max-width:100%:
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

class Header extends Component {
    render() {
        return (
            <Wrapper>
                <InnerWrapper>
                    <Menu />
                    <Box flex flexDirection="row" className="headerContent">
                        <Box
                            flex
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            flexGrow="1"
                            textAlign="center"
                            className="headerHeroText">
                            <Title
                                component="h1"
                                m={0}
                                color={COLORS.WHITE}
                                fontWeight={600}>
                                Collect feedbacks easily
                            </Title>
                            <Title component="h3" m={0} color={COLORS.WHITE}>
                                Ideal solution for conferences, meetups, events,
                                summit and more.
                            </Title>
                            <br />
                            <br />
                            <LinkButton href="/admin/">
                                Create your event now
                            </LinkButton>
                            <LinkButton
                                href="/eaJnyMXD3oNfhrrnBYDT/"
                                variant="outline">
                                Demo
                            </LinkButton>
                        </Box>

                        <Box
                            flex
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
}

export default Header
