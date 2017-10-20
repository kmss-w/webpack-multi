/*!
 * project name: www.cos
 * name:         gulp.webp.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/19
 */

'use strict';

const path = require('path');
const chalk = require('chalk');
const gulp = require('gulp');
const webp = require('gulp-webp');
const webpCSS = require('gulp-webp-css');
const webpHTML = require('gulp-webp-html');
const rename = require('gulp-rename');

const inline = require('./gulp.inline');

const webpHtmlTask = options => {
  let dest = path.join(options.root, '/views/');

  gulp.src(`${dest}**/*.html`)
    .pipe(webpHTML())
    .pipe(gulp.dest(dest))
    .on('end', () => {
      console.log(chalk.cyan('> Convert webp success'));
      inline(options);
    });
};

const webpCssTask = options => {
  let dest = path.join(options.root, options.dest, '/css/');

  gulp.src(`${dest}**/*.css`)
    .pipe(webpCSS(['.jpg', '.jpeg', '.png']))
    .pipe(rename(path => {path.basename += '-webp';}))
    .pipe(gulp.dest(dest))
    .on('end', () => {
      webpHtmlTask(options);
    });
};

module.exports = options => {
  let dest = path.join(options.root, options.dest, '/img/');

  gulp.src(`${dest}**/*.png`)
    .pipe(webp())
    .pipe(gulp.dest(dest))
    .on('end', () => {
      webpCssTask(options);
    });
};
 
