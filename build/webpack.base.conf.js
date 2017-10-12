/*!
 * project name: www.cos
 * name:         webpack.base.conf.js.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/12
 */

'use strict';

const fs = require('fs');
const path = require('path');

const entries = () => {
  const src = __dirname + 'www/js';

  let enties = {};

  fs.stat(src, (err, stats) => {
    if (err) {
      console.log(`project path error: ${err}`);
      return;
    }

    fs.readdir(src, (err, files) => {
      if (err) {
        console.log(`project path entry file error: ${err}`);
        return;
      }

      files.forEach(file => {
        if (file.indexOf('.js') > 0 && file.indexOf('_') != 0) {
          enties[item.split('.js')[0]] = ['./build/dev-client'].concat(
            './src/main.js'
          );
        }
      });
    });
  });

  return enties;
};

module.exports = {
  context: __dirname,
  entry: entries(),
  output: {
    path: 'public',
    filename: 'javascript/[name].js',
    publicPath: ''
  },
};
 
