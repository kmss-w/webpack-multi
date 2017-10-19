/*!
 * project name: www.cos
 * name:         gulp-dist.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/18
 */

'use strict';

var path = require('path');
var through = require('through2');
var glob = require('glob');
var fs = require('fs-extra');

module.exports = (options, callback) => {
  options = Object.assign({src: '', dest: ''}, options);

  let num = 0;

  return through.obj((file, enc, cb) => {
    num += 1;

    // ensure file number < all files.length
    glob(options.src, {}, (err, files) => {
      if (num >= files.length) {
        callback && callback(num);
        num = 0;
      }
    });

    fs.outputFile(path.join(options.dest, file.relative), file.contents.toString(), err => {
      cb(err);
    });
  });
};
