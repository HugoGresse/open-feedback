import { Route, Switch } from 'react-router-dom'

import React from "react"
import AppLayout from "./AppLayout"
import SessionsListWrapper from "./sessions/SessionsListWrapper"
import Session from "./session/Session"

const FeedbackApp = () => {

    return (
        <Switch>
            <Route
                exact
                path="/:projectId"
                render={props => (
                    <AppLayout {...props}>
                        <SessionsListWrapper {...props} />
                    </AppLayout>
                )}
            />
            <Route
                exact
                path="/:projectId/:date"
                render={props => (
                    <AppLayout {...props}>
                        <SessionsListWrapper {...props} />
                    </AppLayout>
                )}
            />
            <Route
                path="/:projectId/:date/:sessionId"
                render={props => (
                    <AppLayout {...props}>
                        <Session {...props} />
                    </AppLayout>
                )}
            />

        </Switch>
    )

}

export default FeedbackApp
