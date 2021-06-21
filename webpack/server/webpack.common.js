const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');

const rules = [
    {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',
                outputPath: 'static',
                publicPath: '.',
            },
        },
    },
    {
        test: /\.woff2$/i,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'static',
                publicPath: '.',
            },
        },
    },
    {
        test: /\.svg$/,
        use: {
            loader: 'react-svg-loader',
            options: {
                svgo: {
                    plugins: [{ cleanupIDs: false }],
                },
            },
        },
    },
    {
        test: /\.s[ac]ss$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: false,
                },
            },
            'css-loader',
            {
                loader: 'sass-loader',
                // options: {
                //     sourceMap: true,
                // },
            },
        ],
    },
    {
        test: /\.css$/,
        use: [...(false ? [] : [MiniCssExtractPlugin.loader]), 'css-loader'],
    },
];

module.exports = {
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: [path.resolve(__dirname, '..', '..', 'src', 'server', 'server.jsx')],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname,'..', '..', 'src', 'server', 'views'),
                    to: 'views',
                },
                {
                    from: path.resolve(__dirname, '..', '..','public'),
                    to: 'static',
                },
            ],
        }),
    ],
    module: { rules },
};
