import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from './rootReducer'
import thunk from 'redux-thunk'

export default function(initialState) {
    const middleware = [thunk]
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(...middleware))
    )

    return store
}
