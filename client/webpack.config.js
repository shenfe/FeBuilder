const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        index: './index.js'
    },
    output: {
        path: path.resolve(__dirname, `./dist`),
        filename: `[name].js`
    },
    resolve: {
        alias: {}
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif|woff|woff2)$/,
                use: ['url-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: `./index.html`,
            template: './index.html'
        })
    ]
};