/*!
 * project name: www.cos
 * name:         gulp.clean.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/20
 */

'use strict';

const path = require('path');
const del = require('del');

module.exports = options => {
  let _path = path.join(options.root, options.dest, '/css/_allIn.css');
  del([_path], {force: true});
};
 
