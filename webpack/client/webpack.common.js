const path = require('path');
const { injectStyles } = require('../../config');

const rules = [
    {
        test: /\.woff2$/i,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                emitFile: false,
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
                  'style-loader',
                  'css-loader',
                  {
                      loader: 'sass-loader',
                      options: {
                          sourceMap: true,
                      },
                  },
              ],
    },
    {
        test: /\.css$/,
        use: injectStyles ? ['style-loader', 'css-loader'] : ['null-loader'],
    },
];

module.exports = {
    entry: [path.resolve(__dirname, '..', '..', 'src', 'client', 'src', 'index.jsx')],
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    module: { rules },
};
