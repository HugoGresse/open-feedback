import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { reduxFirestore, getFirestore } from 'redux-firestore';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';

import rootReducer from './store/reducer/rootReducer'
import firestoreInstance from './Firestore'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


const middleware = [thunk.withExtraArgument({getFirebase, getFirestore})]


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose


const store = createStore(rootReducer,
    composeEnhancers(
        applyMiddleware(...middleware),
        reactReduxFirebase(firestoreInstance, {userProfile: 'users', useFirestoreForProfile: true, attachAuthIsReady: true}),
        reduxFirestore(firestoreInstance) // redux bindings for firestore
    )
)

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
