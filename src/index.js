import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import './index.css'
import * as serviceWorker from './serviceWorker'
import App from './App'
import { initGA } from './reactGAMiddlewares'
import configureStore from './configureStore'

initGA()

const store = configureStore({})

const render = AppComponent => {
    return ReactDOM.render(
        <Provider store={store}>
            <AppComponent />
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
