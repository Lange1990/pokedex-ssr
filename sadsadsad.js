const webpack = require('webpack');
const path = require('path');

const sassRules = {
    test: /\.s[ac]ss$/,
    // If styles will be served separately, the server will extract them to create the stylesheet to link on request
    use: [
              'style-loader',
              'css-loader',
              {
                  loader: 'sass-loader',
                  options: {
                      sourceMap: true,
                  },
              },
          ]
}
const cssRules = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
}

module.exports = {
    entry: {
        // 'styles.bundle': './client/src/styles.js',
        'client.bundle': 'src/client/src/index.jsx',
        app: 'src/client/src/index.jsx'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     use: [MiniCssExtractPlugin.loader, 'css-loader'],
            // },
            cssRules,
            sassRules,
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // {
            //     test: /\.(svg|png|jpg)$/,
            //     use: 'url-loader',
            // },
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
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors.bundle',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: JSON.stringify('production'),
        //     },
        // }),
        // new MiniCssExtractPlugin({
        //     filename: '[name].css',
        //     chunkFilename: '[id].css',
        // }),
    ],
};
