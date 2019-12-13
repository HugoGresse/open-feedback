import { Route, Switch } from 'react-router-dom'

import React from 'react'
import AppLayout from './AppLayout'
import TalksListWrapper from './talks/TalksListWrapper'
import Talk from './talk/Talk'

const FeedbackApp = () => {
    return (
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
    )
}

export default FeedbackApp
