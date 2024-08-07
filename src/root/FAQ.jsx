import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import InnerWrapper from './component/InnerWrapper.jsx'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const List = styled.ul`
    padding-inline-start: 0;
    text-align: left;
    padding: 0 20px;

    li {
        display: inline-block;
        width: calc(50% - 60px);
        max-width: 100%;
        margin: 0 10px 30px 10px;
        list-style: none;
        vertical-align: top;
        text-align: justify;
        box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
        padding: 0 20px 20px;
        border-radius: 4px;
    }

    a {
        color: ${COLORS.RED_ORANGE};
    }

    @media (max-width: 640px) {
        li {
            width: calc(100% - 60px);
        }
    }
`

const FAQTitle = styled.h6`
    font-size: 1rem;
    font-weight: 500;
    padding: 10px 0;
    color: ${COLORS.RED_ORANGE};
    margin-top: 10px;
    margin-bottom: 10px;
`

const FAQ = () => {
    const { t } = useTranslation()
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

    return (
        <InnerWrapper>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                flexGrow="1"
                textAlign="center">
                <Typography
                    variant="h2"
                    id={'faq'}
                    style={{ marginTop: 16, marginBottom: 32 }}>
                    FAQ
                </Typography>

                <List>
                    <li>
                        <FAQTitle>
                            <Trans i18nKey="faq.scale" />
                        </FAQTitle>
                        <Trans i18nKey="faq.scaleAnswer" />
                    </li>
                    <li>
                        <FAQTitle>
                            <Trans i18nKey="faq.accurate" />
                        </FAQTitle>
                        <Trans i18nKey="faq.accurateAnswer">
                            TL;DR: no. It should be close to 98% of the real
                            vote count. <br /> While in most use case it is not
                            a big issue, the vote count aggregation can be
                            re-process after the event to have the exact count.{' '}
                            <br /> <br /> Contact {{ adminEmail }} if needed.
                        </Trans>
                    </li>
                    <li>
                        <FAQTitle>
                            <Trans i18nKey="faq.price" />
                        </FAQTitle>
                        <Trans i18nKey="faq.priceAnswer" />
                    </li>
                    <li>
                        <FAQTitle>
                            <Trans i18nKey="faq.voteIncrease" />
                        </FAQTitle>
                        <Trans i18nKey="faq.voteIncreaseAnswer" />
                    </li>
                    <li>
                        <FAQTitle>
                            <Trans i18nKey="faq.private" />
                        </FAQTitle>
                        <Trans i18nKey="faq.privateAnswser" />
                    </li>
                    <li>
                        <FAQTitle>
                            <Trans i18nKey="faq.newFeature" />
                        </FAQTitle>
                        <Trans i18nKey="faq.newFeatureAnwser">
                            {{ adminEmail }}
                        </Trans>
                        <a
                            href="https://github.com/HugoGresse/open-feedback/issues/new"
                            target="_blank"
                            rel="noopener noreferrer">
                            github.com
                        </a>
                        .
                        <Trans i18nKey="faq.newFeatureAnwserBis" />
                        <a
                            href="https://github.com/HugoGresse/open-feedback/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement"
                            target="_blank"
                            rel="noopener noreferrer">
                            {t('faq.newFeatureAnwserBisHere')}
                        </a>
                        .
                    </li>
                    <li>
                        <FAQTitle>
                            <Trans i18nKey="faq.custom" />
                        </FAQTitle>
                        <Trans i18nKey="faq.customAnswer" />
                        <a
                            href="https://github.com/HugoGresse/open-feedback#community-sdk"
                            target="_blank"
                            rel="noopener noreferrer">
                            {t('faq.customAnswerSDKLink')}
                        </a>
                    </li>
                </List>

                <Box margin="20px">
                    <Trans i18nKey="faq.additionalSupport">
                        {{ adminEmail }}
                    </Trans>
                </Box>
            </Box>
        </InnerWrapper>
    )
}

export default FAQ
