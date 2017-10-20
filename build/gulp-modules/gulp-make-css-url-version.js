/*!
 * project name: www.cos
 * name:         gulp-make-css-url-version.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/20
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const gutil = require('gulp-util');
const through = require('through2');
const Q = require('q');

const PLUGIN_NAME = 'gulp-make-css-url-version';

const md5 = data => {
  let hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('base64');
};

const formatDate = (format, date) => {
  date = date || new Date();
  format = format
    .replace(/y{4}/, date.getFullYear())
    .replace(/y{2}/, date.getFullYear().toString().substring(2));

  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };

  for (let k in o) {
    format = format.replace(new RegExp(k), m => {
      return m.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length);
    });
  }

  return format;
};

module.exports = options => {
  options = Object.assign({
    type: 'timestamp', // timestamp\version\none\md5
    version: '',
    format: 'yyyy-MM-dd',
    assertsDir: ''
  }, options);

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    let name = file.path.split(path.seq).pop();

    // css file only
    if (!/^\.css?$/.test(path.extname(file.path))) {
      gutil.log(gutil.colors.yellow('[WARN] file ' + name + ' is not a css file'));
      this.push(file);
      return cb();
    }

    let content = file.contents.toString();

    let self = this;
    let promises = [];

    content = content.replace(/url\("?([^\)"]+)"?\)/g, (str, url) => {
      url = url.replace(/\?[\s\S]*$/, '').trim();
      url = url.replace(/['"]*/g, '');

      if (url.indexOf("base64,") > -1 ||
        url.indexOf("about:blank") > -1 ||
        url.indexOf("http://") > -1 ||
        url === '/') {
        return str;
      }

      // speacial string as the version
      if (options.type === 'version') {
        return `url(${url}?v=${options.version})`;
      }
      // use date as the version
      else if (options.type === 'timestamp') {
        return `url(${url}?v=${formatDate(options.format, new Date())})`;
      }
      else if (options.type === '') {
        return `url(${url})`;
      }

      // use md5
      let safeUrl = url.replace(/#[\s\S]*$/,'');
      let imgPath = options.assertsDir ?
        path.join(options.assertsDir, safeUrl) :
        path.resolve(path.dirname(file.path), safeUrl);

      let tmpKey = Math.random().toString();
      let readFile = Q.denodeify(fs.readFile);

      promises.push(readFile(imgPath).then(data => {
        let ver = data ? encodeURIComponent(md5(data.toString())) : formatDate(options.format);

        return {key: tmpKey, value: `url(${url}?v=${ver})`};
      }, err => {
        gutil.log(gutil.colors.red(err));
        return {
          key: tmpKey,
          value: `url(${url}?v=${formatDate(options.format)})`
        };
      }));

      return tmpKey;
    });

    if (options.type === 'version' || options.type === 'timestamp') {
      file.contents = new Buffer(content);
      self.push(file);

      return cb();
    }

    Q.all(promises).then(mathces => {
      mathces.forEach(function (match) {
        content = content.replace(match.key, match.value);
      });

      file.contents = new Buffer(content);
      self.push(file);

      return cb();
    });
  });
};

