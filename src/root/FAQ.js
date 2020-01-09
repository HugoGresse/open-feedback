import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import Title from '../baseComponents/design/Title'
import Box from '../baseComponents/design/Box'
import InnerWrapper from './component/InnerWrapper'

const List = styled.ul`
    padding-inline-start: 0;
    text-align: left;
    padding: 0 20px;

    li {
        display: inline-block;
        width: calc(50% - 20px);
        max-width: 100%;
        margin: 0 10px 30px 10px;
        list-style: none;
        vertical-align: top;
        text-align: justify;
    }

    @media (max-width: 640px) {
        li {
            width: calc(100% - 20px);
        }
    }
`

const FAQTitle = styled.h6`
    font-size: 1rem;
    padding: 10px;
    background: ${COLORS.RED_ORANGE};
    color: ${COLORS.WHITE};
    border-left: 6px solid ${COLORS.DARK_RED_ORANGE};
    margin-top: 10px;
    margin-bottom: 10px;
`

class FAQ extends Component {
    render() {
        return (
            <InnerWrapper>
                <Box
                    flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    flexGrow="1"
                    textAlign="center">
                    <Title>FAQ</Title>

                    <List>
                        <li>
                            <FAQTitle>
                                Will it scale? Will it work correctly?
                            </FAQTitle>
                            OpenFeedback is hosted on Firebase/Google Cloud
                            Platform with a pay as you go plan. It mean that the
                            infrastucture will scale as expected. <br /> <br />
                            It has already been used by Sunny Tech and BDX.io
                            without issue with 300 voters and 1600 votes each in
                            two days. Feedback related features are tested on
                            each code modification.
                        </li>
                        <li>
                            <FAQTitle>Is the vote count accurate?</FAQTitle>
                            TL;DR: no. It should be close to 98% of the real
                            vote count. <br /> While in most use case it is not
                            a big issue, the vote count aggregation can be
                            re-process after the event to have the exact count.{' '}
                            <br /> <br /> Contact{' '}
                            {process.env.REACT_APP_ADMIN_EMAIL} if needed.
                        </li>
                        <li>
                            <FAQTitle>How much does it cost?</FAQTitle>
                            Open Feedback is currently free for everyone. <br />{' '}
                            <br /> When the service will be more used, it may
                            have a paying tier but it will stay free for NGO and
                            non-profitable organization.
                        </li>
                        <li>
                            <FAQTitle>
                                How to increase the participation/votes?
                            </FAQTitle>
                            Without much communication, not many feedback will
                            be received through Open Feedback. <br />
                            <br />{' '}
                            <b>
                                To increase this, you may try the following:
                            </b>{' '}
                            <br /> - display QRCode on wall, website, printed
                            map/design <br /> - notify attendees/voters to give
                            feedbacks after the event. Doing this, ensure you
                            let add some days to the vote end time. <br /> -
                            promote OpenFeedback to all speakers so they display
                            the QRCode going directly to their talk during their
                            Q&A.
                        </li>

                        <li>
                            <FAQTitle>
                                How can I request a new feature?
                            </FAQTitle>
                            Send an email to {process.env.REACT_APP_ADMIN_EMAIL}{' '}
                            or open a new issue on{' '}
                            <a
                                href="https://github.com/HugoGresse/open-feedback/issues/new"
                                target="_blank"
                                rel="noopener noreferrer">
                                github.com
                            </a>
                            . You can find the pending features to be added{' '}
                            <a
                                href="https://github.com/HugoGresse/open-feedback/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement"
                                target="_blank"
                                rel="noopener noreferrer">
                                here
                            </a>
                            .
                        </li>
                    </List>

                    <Box margin="20px">
                        Need additional support? contact{' '}
                        {process.env.REACT_APP_ADMIN_EMAIL}
                    </Box>
                </Box>
            </InnerWrapper>
        )
    }
}

export default FAQ
