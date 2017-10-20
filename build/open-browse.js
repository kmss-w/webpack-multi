/*!
 * project name: www.cos
 * name:         open-browse.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/20
 */

'use strict';

const opn = require('opn');

const config = require('./config');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser;

let port = process.env.PORT || config.dev.port;
let uri = 'http://localhost:' + port;

// when env is testing, don't need open it
if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
  opn(uri);
}

require('./clean')();
 
