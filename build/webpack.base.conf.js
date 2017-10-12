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

var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

const resolve = dir => {
  return path.join(__dirname, '..', dir)
};

const entries = () => {
  const src = resolve('www/js');

  let stats = fs.statSync(src);

  if (stats) {
    let files = fs.readdirSync(src);
    let enties = {};

    files.forEach(file => {
      if (file.indexOf('.js') > 0 && file.indexOf('_') != 0) {
        enties[file.split('.js')[0]] = [hotMiddlewareScript].concat(
          `${src}\\${file}`
        );
      }
    });

    return enties;
  }
};

module.exports = {
  context: __dirname,
  entry: entries(),
  output: {
    path: resolve('public'),
    filename: 'javascript/[name].js',
    publicPath: '/public',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {}
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('www')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('www')]
      }
    ]
  }
};
 
