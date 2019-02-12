import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import './index.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Root from './component/Root'
import Page404 from './component/Page404'
import Session from './component/session/Session'
import SessionsListWrapper from './component/sessions/SessionsListWrapper'
import AppLayout from './AppLayout'

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
        console.log('Router')
        return (
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Root} />
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
