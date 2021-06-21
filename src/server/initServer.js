import express from 'express';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

const initServer = () => {
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
    const port = 4123
    const maxAge = devMode ? 0 : 31536000;
    const app = express();
    app.set('port', process.env.PORT || 3000);

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
    ? `http://${DEV_SERVER_ADDRESS}:${HMR_SERVER_PORT}/dev.bundle.js`
    : fs
        .readdirSync(path.resolve(__dirname, STATIC_DIRNAME))
        .find((filename) => /^.*bundle\..*\.js$/.test(filename));
    if (!clientBundleFilename){
        throw new Error(
            `Cannot find client bundle in ${
                devMode ? `http://${DEV_SERVER_ADDRESS}:${HMR_SERVER_PORT}/` : path.resolve(__dirname, STATIC_DIRNAME)
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

    return {
        app,
        port,
    };
};

export default initServer;
