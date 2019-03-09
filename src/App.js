import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Root from './root/Root'
import Page404 from './Page404'
import Session from './feedback/session/Session'
import SessionsListWrapper from './feedback/sessions/SessionsListWrapper'
import AppLayout from './feedback/AppLayout'
import Admin from './admin/Admin'

const theme = createMuiTheme({
    typography: {
        fontFamily: 'roboto, Helvetica, Arial, sans-serif',
        useNextVariants: true
    },
    spacing: {
        default: 16
    }
})

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Root} />
                        <Route exact path="/admin" component={Admin} />
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

                        <Route component={Page404} />
                    </Switch>
                </BrowserRouter>
            </MuiThemeProvider>
        )
    }
}

export default App
