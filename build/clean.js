/*!
 * project name: www.cos
 * name:         clean.js
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/11/6
 */

'use strict';

const del = require('del');
const chalk = require('chalk');

const utils = require('./utils');
const config = require('./config');

del([
  config.build.assetsRoot,
  utils.resolve('server/views'),
  utils.resolve('src/styles/sprite.png'),
  utils.resolve('test/e2e/reports'),
  utils.resolve('test/unit/coverage')
]).then(paths => {
  console.log(chalk.cyan('  Clean complete.\n'));
});
 
