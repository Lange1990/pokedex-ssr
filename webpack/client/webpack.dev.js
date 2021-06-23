const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge').merge;
const common = require('./webpack.common');
const dotenv = require('dotenv');
const { devBuildPath, staticDirname, fileLoaderRegex } = require('../../config');

const rules = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                comments: true, // Preserve webpack magic comments
                sourceMaps: true,
                presets: ['@babel/env', '@babel/react'],
                plugins: [
                    [
                        '@babel/plugin-proposal-class-properties',
                        {
                            loose: true,
                        },
                    ], // Generates PropTypes from Typescript types
                    '@babel/transform-runtime',
                ],
                cacheDirectory: true,
            },
        },
    },
    {
        test: fileLoaderRegex,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',

                // Resources will be copied in /staticDirname by server compiler
                emitFile: false,
                outputPath: staticDirname,
                publicPath: '.',
            },
        },
    },
];

module.exports = merge(common, {
    name: 'client',
    mode: 'development',
    output: {
        path: path.resolve(devBuildPath,'static'),
        filename: 'dev.bundle.js',
        // libraryTarget: 'commonjs2',
        // clean: true,
        publicPath: '/',
    },
    devtool: 'inline-source-map',
    module: { rules },
    plugins: [
        new webpack.DefinePlugin(
            Object.fromEntries(
                Object.entries({
                    NODE_ENV: 'development',
                    STATIC_DIRNAME: 'bundle',
                    ...dotenv.config().parsed,
                }).map((pair) => ['process.env.' + pair[0], JSON.stringify(pair[1])]),
            ),
        ),
    ],
});
