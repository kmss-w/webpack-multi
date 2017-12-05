/*!
 * project name: www.cos
 * name:         dev-server.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/12
 */

'use strict';

require('./check-versions')();

const config = require('./config');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const node_env = process.env.NODE_ENV;

const webpackConfig = (node_env === 'testing' || node_env === 'production') ?
  require('./webpack.prod.conf') :
  require('./webpack.dev.conf');

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
});

// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable;

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context];

  if (typeof options === 'string') {
    options = { target: options };
  }

  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./public/static'));


var _resolve;
var _reject;
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve;
  _reject = reject;
});

var server;


// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser;

const uri = 'http://localhost:' + port;

var portfinder = require('portfinder');
portfinder.basePort = port;

const opn = require('opn');

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }

    process.env.PORT = port;
    var uri = 'http://localhost:' + port;
    console.log('> Listening at ' + uri + '\n');

    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri);
    }

    server = app.listen(port);
    _resolve();
  });
});

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  }
};
