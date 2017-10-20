/*!
 * project name: www.cos
 * name:         clean.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/20
 */

'use strict';

const path = require('path');
const rm = require('rimraf');
const config = require('./config');

const rmPublic = () => new Promise((resolve, reject) => {
  rm(path.join(config.build.assetsRoot, config.build.assetsPublicPath, '*'), err => {
    if (err) {
      throw err;
    }

    resolve();
  });
});

const rmViews = () => new Promise((resolve, reject) => {
  rm(path.join(config.build.assetsRoot, 'views/*'), err => {
    if (err) {
      throw err;
    }

    resolve();
  });
});

module.exports = () => {
  return rmPublic().then(rmViews);
};
 
