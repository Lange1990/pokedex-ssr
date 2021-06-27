import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import Wrapper from './wrapper';
import store from './store';

ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <Wrapper />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);