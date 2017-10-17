/*!
 * project name: www.cos
 * name:         gulp.sass.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/17
 */

'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const sassVariables = require('gulp-sass-variables');
const autoprefixer = require('gulp-autoprefixer');

module.exports = (evt, reload) => {
  gulp.src(__dirname + '/www/sass/**/*.scss');
};
 
