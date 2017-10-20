/*!
 * project name: www.cos
 * name:         gulp-assets.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/20
 */

'use strict';

const through = require('through2');

const IMG_REGEXP = /(\.\.\/\.\.\/img\/|\.\.\/img\/|\.\/img\/)/g;
const CSS_REGEXP = /(\.\.\/\.\.\/css\/|\.\.\/css\/|\.\/css\/)/g;
const JS_REGEXP = /(\.\.\/\.\.\/js\/|\.\.\/js\/|\.\/js\/)/g;

module.exports = options => {
  options = Object.assign({path: ''}, options);

  return through.obj((file, enc, cb) => {
    if (!file.isBuffer()) {
      cb(null, file);
      return;
    }

    let content = file.contents.toString();

    if (options.path && options.path !== '') {
      if (options.path.substr(options.path.length - 1) === '/') {
        options.path = options.path.substr(0, options.path.length - 1);
      }

      // replace img
      content = content.replace(IMG_REGEXP, `${options.path}/img/`);

      // replace css
      content = content.replace(CSS_REGEXP, `${options.path}/css/`);

      // replace js
      content = content.replace(JS_REGEXP, `${options.path}/js/`);

      file.contents = new Buffer(content || '');
      cb(null, file);

      return;
    }

    content.replace(IMG_REGEXP, '/img/')
      .replace(CSS_REGEXP, '/css/')
      .replace(JS_REGEXP, '/js/');

    file.contents = new Buffer(content || '');
    cb(null, file);
  });
};
 
