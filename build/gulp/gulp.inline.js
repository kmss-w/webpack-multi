/*!
 * project name: www.cos
 * name:         gulp.inline.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/19
 */

'use strict';

const path = require('path');
const chalk = require('chalk');
const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const inlineSource = require('gulp-inline-source');

const asserts = require('../gulp-modules/gulp-asserts');
const makeUrlVer = require('../gulp-modules/gulp-make-css-url-version');

const cssVersion = options => {
  let dest = path.join(options.root, options.dest, '/css/');

  gulp.src(`${dest}**/*.css`)
    .pipe(makeUrlVer())
    .pipe(gulp.dest(dest))
    .on('end', () => {
      require('./gulp.asserts')(options);
    });
};

module.exports = options => {
  let dest = path.join(options.root, '/views/');

  gulp.src(`${dest}/**/*.html`)
    .pipe(preprocess({context: {env: options.env}}).on('error', err => {
      console.error(chalk.red(err.toString()));
    }))
    .pipe(inlineSource())
    .pipe(asserts({path: options.assets}))
    .pipe(gulp.dest(dest))
    .on('end', () => {
      console.log(chalk.cyan('> Inline html success'));
      cssVersion(options);
    });
};
 
