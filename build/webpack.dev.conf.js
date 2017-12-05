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
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');

const utils = require('./utils');
const config = require('./config');
const baseWebpackConfig = require('./webpack.base.conf');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

let devConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  resolve: {
    modules: ['node_modules', 'src/styles']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin(),

    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, '../src/assets/sprite'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, '../src/styles/sprite.png'),
        css: path.resolve(__dirname, '../src/styles/_img.scss')
      },
      apiOptions: {
        cssImageRef: '~sprite.png'
      }
    }),
    new webpack.WatchIgnorePlugin([
      path.resolve(__dirname, '../src/styles/sprite.png'),
      path.resolve(__dirname, '../src/styles/_img.scss')
    ])
  ]
});

let pagePath = utils.resolve('src/views');
let pages = utils.pages(pagePath + '/**/*.html');

for (let entryName in pages) {
  let fileName = path.normalize(pages[entryName]['path']).replace(
    path.normalize(pagePath), ''
  );

  let conf = {
    //filename: entryName + '.html', // html file name
    filename: './views' + fileName, // html file name
    template: pages[entryName]['path'],
    inject: true, // auto inject static files to html
    chunks: ['vendor', 'manifest', pages[entryName]['chunk']]
  };

  // entry corresponds to the HTML file (configure multiple, corresponding to an entry through a page chunks)
  devConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = devConfig;
