const path = require('path');
const merge = require('webpack-merge').merge;
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssRules = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
}

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '..', '..', 'build', 'static'),
        filename: 'bundle.[hash].js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            cssRules,
            // sassRules,
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-proposal-async-generator-functions',
                            '@babel/plugin-transform-async-to-generator',
                            '@babel/plugin-transform-regenerator',
                            '@babel/plugin-transform-runtime',
                        ],
                    },
                },
            },
        ],
    },
    plugins: [
        ...(false
            ? []
            : [
                  new MiniCssExtractPlugin({
                      filename: path.join('static', 'style.[hash].css'),
                  }),
              ]),
    ],
});
