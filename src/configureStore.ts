import { applyMiddleware, compose, createStore } from 'redux'
import { rootReducer } from './rootReducer'
import { thunk } from 'redux-thunk'

export const configureStore = () => {
    const middleware = [thunk]
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    // Explicit `undefined` preloaded state: with typed action unions, redux
    // infers the preloaded state of combineReducers as `never`.
    return createStore(
        rootReducer,
        undefined,
        composeEnhancers(applyMiddleware(...middleware))
    )
}
