import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from './rootReducer'
import thunk from 'redux-thunk'
import { googleAnalytics } from './reactGAMiddlewares'

export default function(initialState) {
    const middleware = [thunk, googleAnalytics]
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(...middleware))
    )

    // if (module.hot) {
    //     // Enable Webpack hot module replacement for reducers
    //     module.hot.accept('../reducers', () => {
    //         store.replaceReducer(createRootReducer(require('../reducers')))
    //     })
    // }

    return store
}
