/*!
 * project name: www.cos
 * name:         gulp.sprite.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/19
 */

'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const gulp = require('gulp');
const spriter = require('gulp-spriter');

const image = require('./gulp.image');

const buildSprite = (sprites, index, options) => {
  if (index + 1 > sprites.length) {
    console.log(chalk.cyan('> sprite images build success.'));
    image(options);
  }

  let file = sprites[index].name + '.png';
  let _path = sprites[index].path;
  let folder = sprites[index].type === 'folder' ? sprites[index].name + '/' : '';

  let dest = path.join(options.root, options.dest, '/css/');

  gulp.src(`${dest}/**/*.css`)
    .pipe(spriter({
      sprite: file,
      slice: _path,
      outPath: path.join(options.root, options.dest, '/_img/'),
      inputPath: `../img/sprite/${folder}`,
      cssUnit: options.cssUnit,
      allCss: `${dest}/_allIn.css`
    }))
    .pipe(gulp.dest(dest))
    .on('end', () => {
      buildSprite(sprites, ++index, options);
    });
};

module.exports = options => {
  if (options.env === 'development') {
    console.log(
      chalk.yellow('> warning: development do not need sprite images.')
    );
  }

  let src = path.join(options.root, options.src, '/img/sprite');

  let sprites = [];
  let isFile = false;

  fs.stat(src, (err, stats) => {
    if (err && err.code === 'ENOENT') {
      console.log(chalk.yellow('> warning: sprite images path is not exist.'));
      image(options);
    }
    else if (!err) {
      fs.readdir(src, (err, files) => {
        if (err) {
          throw err;
        }

        if (files.length <= 0) {
          image(options);
        }

        files.forEach((item, index) => {
          let file = `${src}/${item}`;

          fs.stat(file, (err, stats) => {
            if (err) {
              throw err;
            }

            if (stats.isDirectory()) {
              sprites.push({name: item, path: file, type: 'folder'});
            }
            else if (stats.isFile && item.indexOf('.png') > 0) {
              isFile = true;
            }

            if (index + 1 === files.length) {
              if (isFile) {
                sprites.push({name: 'sprite', path: src.replace(/\\/g, '/'), type: 'file'});
              }

              buildSprite(sprites, 0, options);
            }
          });
        });
      });
    }
  });
};

