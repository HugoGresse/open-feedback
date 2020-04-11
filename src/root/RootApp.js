import React, { useEffect } from 'react'
import { setFavicon } from '../utils/dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { showSmallChat, useSmallchat } from '../admin/project/utils/smallchat'
import { configureAnchors } from 'react-scrollable-anchor'
import { Route, Switch } from 'react-router-dom'
import Root from './pages/root/Root'
import Page404 from '../Page404'
import PrivacyPolicy from './pages/privacy-policy/PrivacyPolicy'
import Header from './pages/root/Header'
import Footer from './component/Footer'
import Menu from './component/Menu'

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

const RootApp = () => {
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
                <Menu />

                <Switch>
                    <Route exact path="/" component={Root} />
                    <Route
                        exact
                        path="/l/privacy-policy"
                        component={PrivacyPolicy}
                    />
                    <Route component={Page404} status={404} />
                </Switch>

                <Footer />
            </ThemeProvider>
        </I18nextProvider>
    )
}

export default RootApp
