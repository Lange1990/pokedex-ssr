const path = require('path');
const merge = require('webpack-merge').merge;
const webpack = require('webpack');
const dotenv = require('dotenv');
const webpackNodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common');

const rules = [
    {
        test: /\.j(s|sx)?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                comments: true, // Preserve webpack magic comments
                sourceMaps: true,
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    '@babel/plugin-transform-react-jsx',
                    '@babel/plugin-transform-runtime',
                    '@babel/plugin-proposal-async-generator-functions',
                    '@babel/plugin-transform-async-to-generator',
                    '@babel/plugin-transform-regenerator',
                ],
            },
        },
    },
];

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '..', '..', 'build'),
        filename: 'server.js',
    },
    optimization: {
        minimize: false,
    },
    externalsPresets: {
        node: true,
    },
    externals: [...(false ? [webpackNodeExternals()] : [])],
    module: { rules },
    plugins: [
        // Override process.env with custom vars defined in .env
        new webpack.DefinePlugin(
            Object.fromEntries(
                Object.entries({
                    NODE_ENV: 'production',
                    STATIC_DIRNAME: 'static',
                    PORT: 4123,
                    INJECT_STYLES: false,

                    ...dotenv.config().parsed,
                }).map((pair) => ['process.env.' + pair[0], JSON.stringify(pair[1])]),
            ),
        ),

        // Extract styles
        ...(false
            ? []
            : [
                  new MiniCssExtractPlugin({
                      filename: path.join('static', 'style.[hash].css'),
                  }),
              ]),
    ],
});
