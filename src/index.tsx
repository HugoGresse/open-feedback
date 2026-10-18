import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { App } from './App.tsx'
import { configureStore } from './configureStore'

const store = configureStore({})

const container = document.getElementById('root')
// noinspection JSCheckFunctionSignatures
const root = createRoot(container)
root.render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
)
