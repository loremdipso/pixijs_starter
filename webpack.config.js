const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDev = process.env.NODE_ENV !== 'production';

const config = {
    mode: isDev ? 'development' : 'production',
    entry: './src/scripts/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/inline'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/index.html' },
                { from: 'src/css/style.css', to: 'css/' },
                { from: 'src/images/logo.png', to: 'images/' },
            ]
        }),
        new DefinePlugin({
            IS_DEBUG: JSON.stringify(isDev),
        }),
    ],
    devServer: {
        compress: true,
        historyApiFallback: true,
        port: 8080,
        hot: true
    },
    optimization: {
        minimize: !isDev
    }
};

module.exports = config;
