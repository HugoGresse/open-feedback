import React, { useEffect } from 'react'
import { setFavicon } from '../utils/dom'
import Header from './Header'
import HowItWorks from './HowItWorks'
import FAQ from './FAQ'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { showSmallChat, useSmallchat } from '../admin/project/utils/smallchat'
import { configureAnchors } from 'react-scrollable-anchor'
import { Footer } from './Footer'
import { Contact } from './Contact'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

configureAnchors({ offset: -60, scrollDuration: 300 })

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
        type: 'light',
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
            <ThemeProvider theme={theme}>
                <GoogleReCaptchaProvider
                    reCaptchaKey={process.env.REACT_APP_RECAPTCHAV3_SITE_KEY}
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
        </I18nextProvider>
    )
}

export default Root
