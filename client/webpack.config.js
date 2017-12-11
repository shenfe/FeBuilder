const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = process.env.NODE_ENV;
console.log('env', env);

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    resolve: {
        alias: {
            preset: path.resolve(__dirname, '../base/preset'),
            view: path.resolve(__dirname, 'src/view'),
            model: path.resolve(__dirname, 'src/model')
        }
    },
    module: {
        rules: [
            {
                test: require.resolve('jquery'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'jQuery'
                    },
                    {
                        loader: 'expose-loader',
                        options: '$'
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: (env !== 'production') ? ['style-loader', 'css-loader', 'sass-loader'] : ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.(jpg|png|gif|woff|woff2|svg|ttf|eot)$/,
                use: ['url-loader']
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        ...((env === 'production') ? [new ExtractTextPlugin(`index.css`)] : []),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
};