import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Root from './component/Root'
import App from './App'
import Page404 from './component/Page404'
import { initGA } from './reactGAMiddlewares'
import configureStore from './configureStore'

initGA()

const store = configureStore({})

const render = Component => {
    return ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Root} />
                    <Route path="/:projectId" component={Component} />
                    <Route component={Page404} />
                </Switch>
            </BrowserRouter>
        </Provider>,
        document.getElementById('root')
    )
}

render(App)

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default
        render(NextApp)
    })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
