import React, { useEffect } from 'react'
import { setFavicon } from '../utils/dom'
import Header from './Header.jsx'
import HowItWorks from './HowItWorks.jsx'
import FAQ from './FAQ.jsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { showSmallChat, useSmallchat } from '../admin/project/utils/smallchat'
import { Footer } from './Footer.jsx'
import { Contact } from './Contact.jsx'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const theme = createTheme({
    typography: {
        h1: {
            fontSize: 28,
            fontWeight: 600,
        },
        h2: {
            fontSize: 24,
            fontWeight: 400,
        },
    },
    palette: {
        mode: 'light',
        primary: {
            light: '#ff9c76',
            main: '#ff6a49',
            dark: '#c6381e',
            contrastText: '#fff',
        },
    },
})

const Root = () => {
    const [scriptLoaded] = useSmallchat()
    useEffect(() => {
        setFavicon('/favicon-root.ico')
    }, [])

    useEffect(() => {
        if (scriptLoaded) {
            setTimeout(() => {
                showSmallChat()
            }, 1000) // defer to let the time to the script to display the help
        }
    }, [scriptLoaded])

    return (
        <I18nextProvider i18n={i18n}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <GoogleReCaptchaProvider
                        reCaptchaKey={import.meta.env.VITE_RECAPTCHAV3_SITE_KEY}
                    >
                        <Header />
                        <main>
                            <HowItWorks />
                            <FAQ />
                            <Contact />
                        </main>
                        <Footer />
                    </GoogleReCaptchaProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </I18nextProvider>
    );
}

export default Root
