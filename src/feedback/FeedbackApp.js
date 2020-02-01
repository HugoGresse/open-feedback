import { Route, Switch } from 'react-router-dom'

import React from 'react'
import AppLayout from './AppLayout'
import TalksListWrapper from './talks/TalksListWrapper'
import Talk from './talk/Talk'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'

const FeedbackApp = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <Switch>
                <Route
                    exact
                    path="/:projectId"
                    render={props => (
                        <AppLayout {...props}>
                            <TalksListWrapper {...props} />
                        </AppLayout>
                    )}
                />
                <Route
                    exact
                    path="/:projectId/:date"
                    render={props => (
                        <AppLayout {...props}>
                            <TalksListWrapper {...props} />
                        </AppLayout>
                    )}
                />
                <Route
                    path="/:projectId/:date/:talkId"
                    render={props => (
                        <AppLayout {...props}>
                            <Talk {...props} />
                        </AppLayout>
                    )}
                />
            </Switch>
        </I18nextProvider>
    )
}

export default FeedbackApp
