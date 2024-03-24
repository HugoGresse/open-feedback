import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import logoColorWhite from '../assets/logo-openfeedback-color&white.png'
import { Box, Grid, SvgIcon } from '@mui/material'
import InnerWrapper from './component/InnerWrapper.jsx'
import { useTranslation } from 'react-i18next'

const Wrapper = styled.footer`
    background-color: ${COLORS.DARK_GRAY};
    color: ${COLORS.WHITE};
    text-align: center;
    padding: 50px 0 30px 0;
    a {
        color: white;
    }
`
const Link = styled.a`
    color: ${COLORS.WHITE};
    padding: 12px;
    &:hover {
        color: ${COLORS.RED_ORANGE};
    }
`

export const Footer = () => {
    const { t } = useTranslation()

    const year = new Date().getFullYear()

    return (
        <>
            <Wrapper>
                <InnerWrapper>
                    <Grid container component={Box} textAlign="right">
                        <Grid item xs={12} sm={6}>
                            <Box textAlign="left">
                                <img
                                    height="30"
                                    src={logoColorWhite}
                                    alt="open feedback"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <a href="#about">{t('footer.about')}</a>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Link
                                href="https://github.com/HugoGresse/open-feedback"
                                target="_blank">
                                GitHub
                            </Link>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <a href="#contact">{t('footer.contact')}</a>
                        </Grid>
                    </Grid>
                </InnerWrapper>
            </Wrapper>
            <Box bgcolor="#444" padding={9} paddingTop={2} color={COLORS.WHITE}>
                <InnerWrapper>
                    <Grid container>
                        <Grid item xs={12} sm={8}>
                            © 2021-{year} OpenFeedback
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={4}
                            component={Box}
                            textAlign="right">
                            <Link
                                href="https://twitter.com/openFeedback_io"
                                title="Twitter"
                                target="_blank">
                                <SvgIcon viewBox="0 0 512 512">
                                    <path
                                        d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016
			c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992
			c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056
			c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152
			c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792
			c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44
			C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568
			C480.224,136.96,497.728,118.496,512,97.248z"
                                    />
                                </SvgIcon>
                            </Link>
                            <Link
                                href="https://linkedin.com/company/openfeedback-io"
                                title="LinkedIn"
                                target="_blank">
                                <SvgIcon viewBox="0 0 382 382">
                                    <path
                                        d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889
	C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056
	H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806
	c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1
	s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73
	c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079
	c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426
	c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472
	L341.91,330.654L341.91,330.654z"
                                    />
                                </SvgIcon>
                            </Link>
                        </Grid>
                    </Grid>
                </InnerWrapper>
            </Box>
        </>
    )
}
