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

const parsePath = _path => {
  var ext = path.extname(_path);

  return {
    dirname: path.dirname(_path),
    basename: path.basename(_path, ext),
    extname: ext
  };
};

module.exports = (_path, cb) => {

  let num = 0;

  return through.obj((file, enc, callback) => {
    num += 1;

    // ensure file number < all files.length
    glob(`${_path}/ejs/*.ejs`, {}, (err, files) => {
      if (num > files.length) {
        callback && callback(num);
        num = 0;
      }
    });

    // get file name
    let name = parsePath(file.relative);
    let filename = `${name.basename}${name.extname}`;

    // ensure last with '/'
    let str = _path.substring(_path.length - 1);

    if (str !== '/' && str !== '\\') {
      _path = `${_path}/`;
    }

    fs.outputFile(`${path}${filename}`, file.contents.toString(), err => {
      cb(err);
    });
  });
};
