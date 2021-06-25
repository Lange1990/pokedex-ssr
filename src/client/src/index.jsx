import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import Wrapper from './wrapper';
import counterApp from './store/reducers';
import store from './store';
// Grab the state from a global variable injected into the server-generated HTML
// const preloadedState = window.__PRELOADED_STATE__

// // Allow the passed state to be garbage-collected
// delete window.__PRELOADED_STATE__

// // Create Redux store with initial state
// const store = createStore(counterApp, preloadedState)
console.log(store)

ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <Wrapper />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);