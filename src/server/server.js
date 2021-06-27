import React from 'react';
import { StaticRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import Wrapper from '../client/src/wrapper.jsx';
import initServer from './initServer';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import counterApp from '../client/src/store/reducers';
const { app, port } = initServer();

app.get('/*', (req, res) => {
    const context = {};
    const store = createStore(counterApp)
    const preloadedState = store.getState()
    // store.getState()
    const content = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <Wrapper />
            </StaticRouter>
        </Provider>,
    );
    if (context.url) {
        res.redirect(301, context.url);
    } else {
        res.render('index', { content, preloadedState });
    }
});

app.listen(port, () => {
    console.log('App corriendo en el http://localhost:'.concat(port));
});