/*!
 * project name: www.cos
 * name:         webpack.dev.conf.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/12
 */

'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const utils = require('./utils');
const config = require('./config');
const baseWebpackConfig = require('./webpack.base.conf');


var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = [hotMiddlewareScript].concat(baseWebpackConfig.entry[name])
});

module.exports = merge(baseWebpackConfig, {
  // module: {
  //   rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  // },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.join(config.build.assetsRoot, '/www/static'),
        to: path.join(config.build.assetsRoot, config.build.assetsSubDirectory),
        ignore: ['.*']
      }
    ]),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
});
