// ============================== [Dependencies] ==============================

const defs = require('./webpack.defs');
const CommonConfig = require('./webpack.common.js');
const path = require('path');
const Merge = require('webpack-merge');
const WatchIgnorePlugin = require("webpack").WatchIgnorePlugin;
const webpack = require('webpack');

// ============================== [Exports] ==============================

module.exports = Merge(CommonConfig, {

    // ------------------------------ [Development Server] ------------------------------

    devServer: {
        contentBase: defs.path.build,

        overlay: {
            errors: true,
            warnings: true,
        },
    },

    // ------------------------------ [Source Maps] ------------------------------

    devtool: 'cheap-module-eval-source-map',

    // ------------------------------ [Plugins] ------------------------------

    plugins: [
        new WatchIgnorePlugin([
            path.resolve(__dirname, 'src/public'),
        ]),

        new webpack.DefinePlugin({
            'SEVER_URL': JSON.stringify("http://localhost:8181/")
        })
    ],

    // ------------------------------ [Modules] ------------------------------

    module: {
        rules: [

            // Load the CSS. This loader works together with the html-loader specified in the parent webpack configuration.
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },

            // Load all images. This loader works together with the html-loader specified in the parent webpack configuration. In the development
            // build all images will be added as data URL.
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: {
                    loader: 'url-loader',
                },
            },
        ],
    },

});
