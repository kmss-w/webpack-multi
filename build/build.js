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


const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');

const utils = require('./utils');
const webpackConfig = require('./webpack.prod.conf');

const spinner = ora('building for production...');
spinner.start();

require('./clean')().then(() => {
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

    require('./gulp')({
      dev: process.env.NODE_ENV,
      root: utils.resolve('/'),
      src: 'www',
      dest: 'public'
    }, () => {
      console.log(chalk.cyan('  Build complete.\n'));
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n'
      ));
    });
  });
});
 
