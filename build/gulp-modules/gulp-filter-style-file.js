/*!
 * project name: www.cos
 * name:         gulp-filter-style-file.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/17
 */

'use strict';

const through = require('through2');

module.exports = option => {
  return through.obj((file, enc, cb) => {
    if (file.isBuffer()) {
      let name = file.path.replace(/\\/g, '/').split('/').pop();

      if (name.indexOf('_') === 0) {
        cb();
        return;
      }

      cb(null, file);
      return;
    }
  });
};
 
