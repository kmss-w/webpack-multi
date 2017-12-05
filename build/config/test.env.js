/*!
 * project name: www.cos
 * name:         test.env.js
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/20
 */

'use strict';

const merge = require('webpack-merge');
const devEnv = require('./dev.env');

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
});
