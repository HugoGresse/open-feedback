import React, { useEffect } from 'react'
import { setFavicon } from '../utils/dom'
import Header from './Header'
import Footer from './Footer'
import HowItWorks from './HowItWorks'
import FAQ from './FAQ'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { showSmallChat, useSmallchat } from '../admin/project/utils/smallchat'
import { configureAnchors } from 'react-scrollable-anchor'

configureAnchors({ offset: -60, scrollDuration: 300 })

const theme = createMuiTheme({
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
                <Header />
                <HowItWorks />
                <FAQ />
                <Footer />
            </ThemeProvider>
        </I18nextProvider>
    )
}

export default Root
