// ============================== [Dependencies] ==============================

const defs = require('./webpack.defs');
const CommonConfig = require('./webpack.common.js');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const cssnano = require('cssnano');
const Merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCssPlugin = require('purifycss-webpack');
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


// ============================== [Exports] ==============================

module.exports = Merge(CommonConfig, {

    // ------------------------------ [Output] ------------------------------

    // The output of the web application. The overwrites the output specified in the parent webpack configuration. The 'chunkFilename' is used by all
    // chunks, not explicitly specified in the 'entry'. This may be chunks created by code splitting. Currently, this parameter is not used.
    output: {
        chunkFilename: '[name].[chunkhash].js',
        filename: path.join(defs.path.scripts, '[name].[chunkhash].js'),
    },

    // ------------------------------ [Source Maps] ------------------------------

    devtool: 'source-map',

    // ------------------------------ [Plugins] ------------------------------

    plugins: [
        new webpack.DefinePlugin({
            'SEVER_URL': JSON.stringify("")
        }),

        // Instead of integer IDs use 4-character hash values. This may be better for debugging purposes.
        new webpack.HashedModuleIdsPlugin(),

        // This plugin is used to minify the CSS.
        // Caution: This plugin has to be specified before the extract-text-webpack-plugin (ExtractTextPlugin) !!!
        new PurifyCssPlugin({
            paths: glob.sync(`${defs.path.src}/${defs.path.scripts}/**/*.js`, {nodir: true})
        }),

        // Extracts the CSS files created by the css-loader and style-loader, respectively. Both loader return text. This plugin stores the CSS text
        // output in files.
        new ExtractTextPlugin({
            filename: path.join(defs.path.styles, '[name].[contenthash].css')
        }),

        // Minify the JavaScript files.
        new BabelMinifyWebpackPlugin(),

        // Minimize the CSS files.
        new OptimizeCssAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true,
                },
                safe: true, // Run cssnano in safe mode to avoid potentially unsafe transformations.
            },
            canPrint: false,
        }),

        // Create the common chunks. The last chunk contains the manifest, regardless of its name!
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({resource}) => (
                resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.js$/)
            )
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
        }),
    ],

    // ------------------------------ [Modules] ------------------------------

    module: {
        rules: [

            // Load an possibly prefixes CSS rules (e.g. '-webkit-' or '-ms-'). The autoprefixer uses the 'Can I Use' service to figure out which
            // rules should be prefixed.
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => ([require('autoprefixer')(),]),
                            },
                        },
                    ],
                    fallback: 'style-loader',
                })
            },

            // Load all images. This loader works together with the html-loader specified in the parent webpack configuration. In the production
            // build images with a size smaller than the specified limit will be added as data URL. All other images will be saved as a file.
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: '[name].[hash].[ext]',
                            outputPath: defs.path.images + '/'
                        }
                    },
                ],
            },
        ]
    }
});
