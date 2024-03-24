import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from './rootReducer'
import { thunk } from 'redux-thunk'

export const configureStore = () => {
    const middleware = [thunk]
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    return createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(...middleware))
    )
}
