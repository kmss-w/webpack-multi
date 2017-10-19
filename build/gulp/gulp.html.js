/*!
 * project name: www.cos
 * name:         gulp.ejs.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/17
 */

'use strict';

const path = require('path');
const chalk = require('chalk');
const gulp = require('gulp');
const preprocess = require('gulp-preprocess');
const watch = require('gulp-watch');

const gulpDist = require('../gulp-modules/gulp-dist');
const sass = require('./gulp.sass');

const node_env = process.env.NODE_ENV;

module.exports = opts => {
  let src = path.join(opts.root, opts.src, '/html/**/*.html');
  let dest = path.join(opts.root, '/views/');

  const task = (evt, options) => {
    let stream = gulp.src(src);

    stream.pipe(preprocess({context: {env: node_env}}).on('error', err => {
      console.error(chalk.red(err.toString()));
    }));

    if (options.env === 'development') {
      stream.pipe(gulpDist({src: src, dest: dest}, num => {
        console.log(chalk.cyan(`> EJS files numbers: ${num}`));
        options.reload();
      }));
    }
    else {
      stream.pipe(gulp.dest(dest)).on('end', () => {
        console.log(chalk.cyan('> EJS build success'));
        sass(options);
      });
    }
  };

  task(null, opts);

  if (opts.env === 'development') {
    // watch
    watch(src, evt => {task(evt, opts);});
  }
};

