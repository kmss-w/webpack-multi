/*!
 * project name: www.cos
 * name:         gulp.sass.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/17
 */

'use strict';

const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const sassVariables = require('gulp-sass-variables');
const autoprefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');

const utils = require('../utils');
const filterStyleFile = require('../gulp-modules/gulp-filter-style-file');

const node_env = process.env.NODE_ENV;

let flag = true;

const error = err => {
  flag = true;
  console.log('> Compiling sass error: ', err);
};

module.exports = opts => {
  let src = path.join(opts.root, opts.src, '/sass/**/*.scss');
  let dest = path.join(opts.root, opts.dest, '/css/');

  const task = (evt, options) => {
    let stream = gulp.src(src);

    stream.pipe(sassVariables({$env: node_env}))
      .pipe(sourcemaps.init())
      .pipe(filterStyleFile())
      .pipe(sass().on("error", error))
      .pipe(autoprefixer({
        browsers: ["last 2 versions", "Android >= 4.0"],
        cascade: true,
        remove: false
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(dest))
      .on('end', () => {
        if (evt && flag) {
          try {
            const file = utils.parsePath(evt.relative);
            let ext = file.extname;
            let base = file.basename;

            if (base !== '_img' && ext !== 'scss') {
              flag = false;
              console.log('> Compiling sass success');
            }
          }
          catch (err) {
            console.log('> Compiling sass error(parse path): ', err);
          }
        }
      })
      .pipe(options.reload({stream: true}));
  };

  task(null, opts);

  // watch
  watch(src, evt => {task(evt, opts);});
};
 
