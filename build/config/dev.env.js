/*!
 * project name: www.cos
 * name:         dev.env.js
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/20
 */

'use strict';

const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
});
