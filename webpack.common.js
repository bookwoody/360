// ============================== [Dependencies] ==============================

const defs = require('./webpack.defs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// ============================== [Exports] ==============================

module.exports = {

    // ------------------------------ [Entry] ------------------------------

    // The entry points of the web application. Each entry points results in its own bundled JavaScript file. If the bundled JavaScript file should
    // reside in a subfolder the path may be specified as key.
    entry: {
        index: path.join(defs.path.src, defs.path.scripts, 'index.js'),
        viewer: path.join(defs.path.src, defs.path.scripts, 'viewer.js'),

    },

    // ------------------------------ [Output] ------------------------------

    // The output of the web application. The filename specifies the default file name, which may be overwritten in dependent webpack configurations.
    output: {
        path: defs.path.build,
        filename: path.join(defs.path.scripts, '[name].js'),
    },

    resolve: {
        alias: {
            'photo-sphere-viewer': path.resolve(__dirname, 'node_modules/photo-sphere-viewer/dist/photo-sphere-viewer.js'),
            'photo-sphere-viewer-css': path.resolve(__dirname, 'node_modules/photo-sphere-viewer/dist/photo-sphere-viewer.css'),
            'D.js': 'd.js',
            doT: 'dot'
        }
    },

    // ------------------------------ [Plugins] ------------------------------

    plugins: [
        // Clean all paths and files created by webpack. Currently, this is the whole build directory.
        new CleanWebpackPlugin([defs.path.build]),

        new CopyWebpackPlugin([{from: 'src/public', to: 'public'}, {from: 'src/api', to: 'api'}]),

        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),

        // Multi Page Web Application: Process the HTML pages. Each page specifies its own chunk(s).
        new HtmlWebpackPlugin({
            template: path.join(defs.path.src, defs.path.html, 'index.html'),
            filename: 'index.html',
            chunks: ['index', 'vendor', 'manifest']
        }),

        new HtmlWebpackPlugin({
            template: path.join(defs.path.src, defs.path.html, 'viewer.html'),
            filename: 'viewer.html',
            chunks: ['viewer', 'vendor', 'manifest']
        }),
    ],

    // ------------------------------ [Modules] ------------------------------

    module: {
        rules: [
            // JavaScript transpilation via Babel (https://babeljs.io/). See also the configuration file '.babelrc'.
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // Enable caching for improved performance during
                        // development.
                        // It uses default OS directory by default. If you need
                        // something more custom, pass a path to it.
                        // I.e., { cacheDirectory: '<path>' }
                        cacheDirectory: true,
                    }
                }
            },

            // Load font and create a hashed filename. The hash is used during browser caching.
            {
                test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]',
                        outputPath: defs.path.fonts + '/',
                        publicPath: '../',
                    },
                },
            },

            // Load HTML files and replace the images by their filename or with their corresponding data URL - depending on the url-loader or
            // file-loader used in dependent webpack configuration. This loader works together with the html-webpack-plugin.
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['link:href', 'img:src']
                    }
                }
            },

            {
                test: /\.(njk|nunjucks)$/,
                use: {
                    loader: 'nunjucks-loader'
                }
            },

            {
                test: /\.json$/,
                use:{
                    loader: 'json-loader'
                }
            }
        ]
    }

};
