import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { App } from './App.tsx'
import { configureStore } from './configureStore'

const store = configureStore()

// The #root element is in index.html.
const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
)
