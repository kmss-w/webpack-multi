/*!
 * project name: www.cos
 * name:         index.js
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/20
 */

'use strict';

// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
  build: {
    env: require('./prod.env'),

    assetsRoot: path.resolve(__dirname, '../../server/public'),
    assetsPublicPath: '/',
    assetsSubDirectory: 'static',

    productionSourceMap: false,

    // Before setting to `true`, make sure to:
    // npm install --save-dev webp-webpack-plugin
    productionWebp: true,

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // Before run this command parameter:
    // npm install --save-dev webpack-bundle-analyzer
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8080,
    autoOpenBrowser: true,

    assetsPublicPath: '/',
    assetsSubDirectory: 'static',

    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};
