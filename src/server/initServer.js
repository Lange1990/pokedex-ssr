import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import ejs from 'ejs';
import csp from 'helmet-csp';
import compression from 'compression';
import minifyHtml from 'express-minify-html-terser';

const initServer = () => {
    console.log(process.env.NODE_ENV)
    const {
        STATIC_DIRNAME,
        DEV_SERVER_ADDRESS = "localhost",
        NODE_ENV = "development",
        HMR_SERVER_PORT,
        INJECT_STYLES,
        SERVER_PORT,
    } = process.env;

    console.log({NODE_ENV},{INJECT_STYLES})
    const devMode = NODE_ENV === 'development';
    const port = devMode ? 8000 : 9000;
    const maxAge = devMode ? 0 : 31536000;
    const app = express();

    // Middleware for static files
    app.use(express.static(path.resolve(__dirname, 'static'), { maxAge }));
    // Template engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.engine('ejs', ejs.renderFile);

    //Styles injection
    if (!INJECT_STYLES) {
        const stylesheetFilename = fs
                    .readdirSync(path.resolve(__dirname, './static'))
                    .find((filename) => /^.*style.*\.css$/.test(filename));
        if (!stylesheetFilename){
            throw new Error(`Cannot find the stylesheet in ${path.resolve(__dirname, './static')}`);
        }
        app.use((req, res, next) => {
            const render = res.render;
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
    }

    // Bundle injection
    const clientBundleFilename = devMode
    ? `http://${DEV_SERVER_ADDRESS}:${port}/dev.bundle.js`
    : fs
        .readdirSync(path.resolve(__dirname, './static'))
        .find((filename) => /^.*bundle\..*\.js$/.test(filename));
    if (!clientBundleFilename){
        throw new Error(
            `Cannot find client bundle in ${
                devMode ? `http://${DEV_SERVER_ADDRESS}:${HMR_SERVER_PORT}/` : path.resolve(__dirname, './static')
            }`,
        );
    }
    app.use((req, res, next) => {
        const render = res.render;
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

    if (devMode) {
        console.log("DEV-MODE")
        // [STATIC_DIRNAME, DEV_SERVER_ADDRESS, DEV_SERVER_PORT, NODE_ENV, HMR_SERVER_PORT].forEach((env) => {
        //     console.log(env)
        //     // if (!env) throw new Error(`Env key missed. Check webpack.dev.config`);
        // });

        // Set permissive CORS and CSP directives to avoid cross-domain issues with webpack-dev-server
        app.use(cors());
        app.use(
            csp({
                directives: {
                    defaultSrc: [
                        '*',
                        'data:',
                        'blob:',
                        'filesystem:',
                        'about:',
                        'ws:',
                        'wss:',
                        "'unsafe-inline'",
                        "'unsafe-eval'",
                    ],
                },
            }),
        );
    } else {
        [STATIC_DIRNAME, NODE_ENV, SERVER_PORT].forEach((env) => {
            console.log(env)
            // if (!env) throw new Error(`Env key missed. Check webpack.prod.config`);
        });

        // Minify the output on request
        app.use(minifyHtml());

        // Compress the responses.
        // Use this values carefully. Test first your server performance, network speed, amount of requests etc
        app.use(
            compression({
                threshold: 20000,
                level: 9,
                memLevel: 9,
            }),
        );
    }

    return {
        app,
        port,
    };
};

export default initServer;
