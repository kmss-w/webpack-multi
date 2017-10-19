/*!
 * project name: www.cos
 * name:         build.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/12
 */

'use strict';

require('./check-versions')();

process.env.NODE_ENV = 'production';

const path = require('path');
const ora = require('ora');
const rm = require('rimraf');
const chalk = require('chalk');
const webpack = require('webpack');

const utils = require('./utils');
const config = require('./config');
const webpackConfig = require('./webpack.prod.conf');

const spinner = ora('building for production...');
spinner.start();

const rmPublic = () => new Promise((resolve, reject) => {
  rm(path.join(config.build.assetsRoot, config.build.assetsPublicPath, '*'), err => {
    if (err) {
      throw err;
    }

    resolve();
  });
});

const rmViews = () => new Promise((resolve, reject) => {
  rm(path.join(config.build.assetsRoot, 'views/*'), err => {
    if (err) {
      throw err;
    }

    resolve();
  });
});

const runGulp = () =>  new Promise((resolve, reject) => {
  require('./gulp')({
    dev: process.env.NODE_ENV,
    root: utils.resolve('/'),
    src: 'www',
    dest: 'public'
  });
});

rmPublic().then(rmViews).then(runGulp).then(() => {
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();

    if (err) {
      throw err;
    }

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n'
    ));
  });
});
 
