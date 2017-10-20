/*!
 * project name: www.cos
 * name:         gulp.asserts.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/20
 */

'use strict';

const path = require('path');
const gulp = require('gulp');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const header = require('gulp-header');
const htmlVersion = require('gulp-html-version');

const clean = require('./gulp.clean');

const buildHTML = options => {
  let dest = path.join(options.root, '/views/');

  gulp.src(`${dest}**/*.html`)
    .pipe(useref())
    .pipe(gulpif('*.js', header(options.banner)))
    .pipe(gulpif('*.css', header(options.banner)))
    .pipe(htmlVersion({
      //paramName: '',
      paramType: 'timestamp',
      suffix: ['css', 'js', 'jpg', 'png', 'gif']
    }))
    .pipe(gulp.dest(dest))
    .on('end', () => {
      clean(options);
    });
};

const moveAsserts = options => new Promise((resolve, reject) => {
  gulp
    .src([path.join(options.root, options.src, 'asserts/**/*'),])
    .pipe(gulp.dest(path.join(options.root, options.dest, 'asserts')))
    .on('end', () => {
      resolve(options);
    });
});

const moveFonts = options => new Promise((resolve, reject) => {
  gulp
    .src([path.join(options.root, options.src, 'fonts/**/*')])
    .pipe(gulp.dest(path.join(options.root, options.dest, 'fonts')))
    .on('end', () => {
      resolve(options);
    });
});

module.exports = options => {
  moveAsserts(options).then(moveFonts).then(() => {
    if (options.env !== 'development') {
      buildHTML(options);
    }
  });
};
 
