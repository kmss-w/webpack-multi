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



const opn = require('opn');
const path = require('path');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');

const app = require('../app');
const compiler = webpack(webpackConfig);

const devMiddleware = require('./koa-webpack/koa-webpack-dev')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
  serverSideRender: true
});

const hotMiddleware = require('./koa-webpack/koa-webpack-hot')(compiler, {
  log: (msg) => {
    console.log(msg);
  },
  heartbeat: 2000
});

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable;

Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context];

  if (typeof options === 'string') {
    options = { target: options }
  }

  app.use(proxyMiddleware(options.filter || context, options));
});

// serve webpack bundle output
app.use(devMiddleware.webpackDevMidd());

// serve pure static assets
const staticPath = path.posix.join(
  config.dev.assetsPublicPath, config.dev.assetsSubDirectory
);
app.use(require('koa-static')(staticPath));


// for ready
let _resolve;
let _reject;
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve;
  _reject = reject;
});

// default port where dev server listens for incoming traffic
const portfinder = require('portfinder');
portfinder.basePort = process.env.PORT || config.dev.port;

// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser;

let server;

console.log('> Starting dev server...');
devMiddleware.dev.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err);
    }

    process.env.PORT = port;
    let uri = 'http://localhost:' + port;
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

