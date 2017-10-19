/*!
 * project name: www.cos
 * name:         utils.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/17
 */

'use strict';

const path = require('path')
const config = require('./config');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.resolve = dir => {
  return path.join(__dirname, '..', dir);
};

// convert path to path object(contains more file and path information)
exports.parsePath = _path => {
  var ext = path.extname(_path);

  return {
    dirname: path.dirname(_path),
    basename: path.basename(_path, ext),
    extname: ext
  };
};

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsPublicPath :
    config.dev.assetsPublicPath;
  return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function (options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = [cssLoader];

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders
      })
    }
    else {

    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension];

    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }

  return output;
};
 
