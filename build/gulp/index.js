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
module.exports = opts => {
  opts = Object.assign({
    env: '',
    root: '',
    src: '',
    dest: '',
    banner: '',
    reload: reload,
    browserSync: {
      ui: false,
      notify: false,
      ghostMode: false,
      timestamps: true
    }
  }, opts);

  // start all task
  if (opts.env === 'development') {
    sass(opts);
    html(opts);

    startBrowserSync(opts.browserSync);
  }
  else {
    html(opts);
  }
};

