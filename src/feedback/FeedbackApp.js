import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AppLayout from './AppLayout'
import TalksListWrapper from './talks/TalksListWrapper'
import Talk from './talk/Talk'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'
import { responsiveFontSizes, useMediaQuery } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const FeedbackApp = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const theme = React.useMemo(
        () =>
            responsiveFontSizes(
                createMuiTheme({
                    typography: {
                        h1: {
                            fontSize: 24,
                            fontWeight: 400,
                        },
                    },
                    palette: {
                        type: prefersDarkMode ? 'dark' : 'light',
                        headerShadow: prefersDarkMode ? '#000' : '#B3B3B3',
                    },
                })
            ),
        [prefersDarkMode]
    )

    return (
        <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
                <Switch>
                    <Route
                        exact
                        path="/:projectId"
                        render={props => (
                            <AppLayout>
                                <TalksListWrapper {...props} />
                            </AppLayout>
                        )}
                    />
                    <Route
                        exact
                        path="/:projectId/:date"
                        render={props => (
                            <AppLayout>
                                <TalksListWrapper {...props} />
                            </AppLayout>
                        )}
                    />
                    <Route
                        path="/:projectId/:date/:talkId"
                        render={props => (
                            <AppLayout>
                                <Talk {...props} />
                            </AppLayout>
                        )}
                    />
                </Switch>
            </ThemeProvider>
        </I18nextProvider>
    )
}

export default FeedbackApp
