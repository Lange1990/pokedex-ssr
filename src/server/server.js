import React from 'react';
import { StaticRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import Wrapper from '../client/src/wrapper.jsx';
import initServer from './initServer';

const { app, port } = initServer();

app.get('/*', (req, res) => {
    const context = {};

    const content = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <Wrapper />
        </StaticRouter>,
    );
    if (context.url) {
        res.redirect(301, context.url);
    } else {
        res.render('index', { content });
    }
});

app.listen(port, () => {
    console.log('Node app is running on http://localhost:'.concat(port));
});