import express from 'express';
import path from 'path';
import React from 'react';
import fs from 'fs';
import { StaticRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
// import { renderToString } from 'react-dom/server';
// import { StaticRouter, Route, } from 'react-router';
import App from '../client/src/components/app.jsx';
import ejs from 'ejs';
import Wrapper from '../client/src/wrapper.jsx';
// import { Tabs } from "../client/src/components/Tabs.jsx";
// import { BerryListView } from "../client/src/components/BerryListView.jsx";
// import { PokemonListView } from "../client/src/components/PokemonListView.jsx";
// import { getPokemon } from '../client/src/data/pokemon';
// import { getBerries } from '../client/src/data/berries';
// import "isomorphic-fetch";
const {
    STATIC_DIRNAME,
    DEV_SERVER_ADDRESS,
    DEV_SERVER_PORT,
    NODE_ENV,
    HMR_SERVER_PORT,
    INJECT_STYLES,
    SERVER_PORT,
} = process.env;

const devMode = NODE_ENV === 'development';
const maxAge = devMode ? 0 : 31536000;
const app = express();
app.set('port', process.env.PORT || 3000);

// Define middleware for static resources
app.use(express.static(path.resolve(__dirname, 'static'), { maxAge }));
// Define template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejs.renderFile);
const stylesheetFilename = fs
            .readdirSync(path.resolve(__dirname, './static'))
            .find((filename) => /^.*style.*\.css$/.test(filename));
console.log(stylesheetFilename)
if (!stylesheetFilename)
            throw new Error(`Cannot find the stylesheet in ${path.resolve(__dirname, './static')}`);
app.use((req, res, next) => {
    const render = res.render;

    // Override the render method to include the var automatically
    res.render = function (
        view,
        options,
        callback,
    ) {
        const _render = render.bind(this);

        if (typeof options === 'function') {
            callback = options;
            _render(view, { stylesheetFilename }, callback);
        } else _render(view, { stylesheetFilename, ...options }, callback);
    };

    next();
});
 // Define middleware to inject the client bundle URL in the <script> tag
 const clientBundleFilename = devMode
 ? `http://${DEV_SERVER_ADDRESS}:${HMR_SERVER_PORT}/dev.bundle.js`
 : fs
       .readdirSync(path.resolve(__dirname, STATIC_DIRNAME))
       .find((filename) => /^.*bundle\..*\.js$/.test(filename));

 if (!clientBundleFilename)
        throw new Error(
            `Cannot find client bundle in ${
                devMode ? `http://${DEV_SERVER_ADDRESS}:${HMR_SERVER_PORT}/` : path.resolve(__dirname, STATIC_DIRNAME)
            }`,
        );
app.use((req, res, next) => {
        const render = res.render;

        // Override the render method to include the var automatically
        res.render = function (
            view,
            options,
            callback,
        ) {
            const _render = render.bind(this);

            if (typeof options === 'function') {
                callback = options;
                _render(view, { clientBundleFilename }, callback);
            } else _render(view, { clientBundleFilename, ...options }, callback);
        };

        next();
    });
// app.get('/*', async function (req, res) {
//     const context = {};
//     const url = req.url;

//     let data = [];
//     let reactDomString = "";
//     try {
//         // if (url === "/berries") {
//         //     const berries = await getBerries();
//         //     data = berries.results;
//         // }

//         // if (url === "/" || url === "/pokemon") {
//         //     const pokemon = await getPokemon(0, 151);
//         //     data = pokemon.results;
//         // }

//         const jsx = (
//             <StaticRouter location={url} context={context}>
//                 <Wrapper/>
//                  {/* <React.Fragment>
//                     <header>Pokedex Bglobal</header>
//                     <main>
//                         {url === "/berries" && (
//                             <Route
//                                 path="/berries/"
//                                 render={(props) =>
//                                     <BerryListView {...props} data={data} />
//                                 }
//                             />
//                         )}
//                         {url === "/" && (
//                             <Route
//                                 path="/"
//                                 render={(props) =>
//                                     <App {...props} data={data} />
//                                 }
//                             />
//                         )}
//                     </main>
//                 </React.Fragment>  */}
//             </StaticRouter>
//         );

//         reactDomString = renderToString(jsx);

//     } catch (error) {
//         reactDomString = "<p>Oops... something went wrong.</p>"
//     }

//     if (context.url) {
//         res.writeHead(301, {
//             Location: context.url,
//         });
//         res.end();
//     } else {
//         res.writeHead(200, {
//             'Content-Type': 'text/html',
//         });

//         res.end(htmlTemplate(reactDomString));
//     }
// });
app.get('/*', (req, res) => {
    const context = {};

    const content = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <Wrapper />
        </StaticRouter>,
    );

    if (context.url) {
        console.log("IF", context.url)
        // Somewhere a `<Redirect>` was rendered
        res.redirect(301, context.url);
    } else {
        console.log("ELSE", { content })
        res.render('index', { content });
    }
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on http://localhost:'.concat(app.get('port')));
});

// function htmlTemplate(reactDom) {
//     return `
//         <!DOCTYPE html>
//         <html>
//             <head>
//                 <meta charset="utf-8" />
//                 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//                 <title>Jolly Pokedex</title>
//                 <meta name="viewport" content="width=device-width, initial-scale=1" />
                
//                 <link rel="stylesheet" href=${stylesheetFilename}>
//                 <script src="bundle.27c42b1a5f2c718a44c8.js"></script>
//             </head>

//             <body>
//                 <div id="jolly-pokedex">${reactDom}</div>                
//             </body>
//         </html>
//     `;
// }
