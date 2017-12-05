/*!
 * project name: www.cos
 * name:         utils.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/17
 */

'use strict';

const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./config');

exports.exec = cmd => {
  return require('child_process').execSync(cmd).toString().trim();
};

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

// only find index.js(be careful not to nesting)
exports.entries = (_path, pattern) => {
  let entries = {};

  glob.sync(path.join(_path, pattern)).forEach(entry => {
    let base = exports.parsePath(entry);

    // get entry name(get recent upper file directory name)
    // let name = path.normalize(base.dirname).replace(path.normalize(_path), '');
    //
    // if (name !== '') {
    //   entries[name] = entry;
    // }
    // else {
    //   entries[base.basename] = entry;
    // }

    entries[base.basename] = entry;
  });

  return entries;
};

exports.pages = _path => {
  let files = {};

  //_path.replace('**', '**!(shared)');

  glob.sync(_path).forEach(html => {
    let base = exports.parsePath(html);

    files[base.basename] = {};
    files[base.basename]['chunk'] = base.basename;
    files[base.basename]['path'] = html;
  });

  return files;
};

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory;

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
  function generateLoaders (loader, loaderOptions) {
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
        use: loaders,
        fallback: 'vue-style-loader'
      });
    }
    else {
      return ['vue-style-loader'].concat(loaders);
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
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
