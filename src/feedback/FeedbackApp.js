import { Route, Switch } from 'react-router-dom'

import React from 'react'
import AppLayout from './AppLayout'
import TalksListWrapper from './talks/TalksListWrapper'
import Talk from './talk/Talk'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'

const feedbackTheme = createMuiTheme({
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

const FeedbackApp = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <MuiThemeProvider theme={feedbackTheme}>
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
            </MuiThemeProvider>
        </I18nextProvider>
    )
}

export default FeedbackApp
