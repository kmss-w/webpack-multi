/*!
 * project name: www.cos
 * name:         index.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/17
 */

'use strict';

const sass = require('./gulp.sass');
const html = require('./gulp.html');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const startBrowserSync = options => {
  browserSync.init(options, (err, instance) => {
    if (err) {
      console.log(err);
      return;
    }

    process.env.BROWSERSYNC_SNIPPET = instance.getOption('snippet');
  });
};

// start gulp
// TODO: <cb> function call timing is not accurate. Not complete the call.
module.exports = (opts, cb) => {
  opts = Object.assign({
    env: '', // build environment
    root: '', // root path
    src: '', // source code path name (relative path)
    dest: '', // build path name (relative path)
    banner: '', // code banner information
    cssUnit: 'px', // px or rem (sprite image size unit)
    webp: true, // convert image to webp
    reload: reload, // browser reload instance (internal use)
    browserSync: {
      ui: false,
      notify: false,
      ghostMode: false,
      timestamps: true
    } // browsersync config information
  }, opts);

  // start all task
  if (opts.env === 'development') {
    sass(opts);
    html(opts);

    startBrowserSync(opts.browserSync);
  }
  else {
    html(opts);
    cb && cb();
  }
};

