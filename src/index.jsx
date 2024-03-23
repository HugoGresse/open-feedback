import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { configureStore } from './configureStore'

const store = configureStore({})

const container = document.getElementById('root')
// noinspection JSCheckFunctionSignatures
const root = createRoot(container)
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>)
