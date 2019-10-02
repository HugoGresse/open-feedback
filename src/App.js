import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import './App.css'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Root from './root/Root'
import Page404 from './Page404'
import AdminApp from './admin/AdminApp'
import FeedbackApp from "./feedback/FeedbackApp"
import initAndTrackWithGoogleAnalytics from "./utils/google-analytics/GoogleAnalytics"
import { ThemeProvider } from "styled-components"

export const history = createBrowserHistory()

initAndTrackWithGoogleAnalytics(history, process.env.REACT_APP_GOOGLE_ANALYTICS)

const theme = createMuiTheme({
    typography: {
        fontFamily: 'roboto, Helvetica, Arial, sans-serif'
    }
})

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <ThemeProvider theme={{}}>
                    <Router history={history}>
                        <Switch>
                            <Route exact path="/" component={Root}/>

                            <Redirect strict exact from="/admin" to="/admin/"/>
                            <Route path="/admin/" component={AdminApp}/>

                            <Route path="/:projectId" component={FeedbackApp}/>

                            <Route component={Page404}/>
                        </Switch>
                    </Router>
                </ThemeProvider>
            </MuiThemeProvider>
        )
    }
}

export default App
