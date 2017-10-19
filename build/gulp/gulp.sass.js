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
const chalk = require('chalk');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const sassVariables = require('gulp-sass-variables');
const cssBase64 = require('gulp-css-base64');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const header = require('gulp-header');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

const utils = require('../utils');
const sprite = require('./gulp.sprite');
const filterStyleFile = require('../gulp-modules/gulp-filter-style-file');

const node_env = process.env.NODE_ENV;

let flag = true;

const error = err => {
  flag = true;
  console.log(chalk.red('> Compiling sass error: ', err));
};

module.exports = opts => {
  let src = path.join(opts.root, opts.src, '/sass/**/*.scss');
  let dest = path.join(opts.root, opts.dest, '/css/');

  const task = (evt, options) => {
    let stream = gulp.src(src);

    if (options.env === 'development') {
      stream.pipe(sassVariables({$env: node_env}))
        .pipe(sourcemaps.init())
        .pipe(filterStyleFile())
        .pipe(sass().on('error', error))
        .pipe(autoprefixer({
          browsers: ['last 2 versions', 'Android >= 4.0'],
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
                console.log(chalk.cyan('> Compiling sass success'));
              }
            }
            catch (err) {
              console.log(chalk.red('> Compiling sass error(parse path): ', err));
            }
          }
        })
        .pipe(options.reload({stream: true}));
    }
    else {
      stream.pipe(filterStyleFile())
        .pipe(sass().on('error', error))
        .pipe(cssBase64({
          baseDir: '../img/base64',
          maxWeightResource: 1024 * 1000,
          extensionsAllowed: [".png", ".jpg", "gif", "jpeg", "svg"]
        }))
        .pipe(autoprefixer({
          browsers: ["last 2 versions", "Android >= 4.0"],
          cascade: true,
          remove: false
        }))
        .pipe(cleanCSS({
          compatibility: "ie8"
        }))
        .pipe(header(options.banner || ''))
        .pipe(gulp.dest(dest))
        .on('end', () => {
          gulp.src(`${dest}**/*.css`)
            .pipe(concat('_allIn.css'))
            .pipe(gulp.dest(dest))
            .on('end', () => {
              console.log(chalk.cyan('> Sass build success'));
              sprite(options);
            });
        });
    }
  };

  task(null, opts);

  if (opts.env === 'development') {
    // watch
    watch(src, evt => {task(evt, opts);});
  }
};
 
