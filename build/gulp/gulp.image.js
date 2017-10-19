/*!
 * project name: www.cos
 * name:         gulp.image.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/19
 */

'use strict';

const path = require('path');
const chalk = require('chalk');
const del = require('del');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

const webp = require('./gulp.webp');
const inline = require('./gulp.inline');

module.exports = options => {
  let src = path.join(options.root, options.src, '/img/**');
  let dest = path.join(options.root, options.dest, '/img');

  let stream = gulp.src(src);

  if (opts.env === 'development') {
    // watch
    return;
  }

  stream.pipe(gulp.dest(dest)).on('end', () => {
    del([`${dest}/base64`, `${dest}/sprite`], {force: true}).then(paths => {
      gulp.src([`${dest}/../_img/**/*.gif`, `${dest}../_img/**/*svg`])
        .pipe(gulp.dest(dest))
        .on('end', () => {
          gulp
            .src([
              `${dest}/../_img/**/*.png`,
              `${dest}/../_img/**/*.jpg`,
              `${dest}/../_img/**/*.JPG`
            ])
            .pipe(imagemin({progressive: true}))
            .pipe(gulp.dest(dest))
            .on('end', () => {
              del([`${dest}/../_img`], {force: true});

              console.log(chalk.cyan('> Compress image success'));

              if (options.webp) {
                webp(options);
              }
              else {
                // inline html task
                inline(options);
              }
            });
        });
    });
  });
};

