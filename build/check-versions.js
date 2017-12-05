/*!
 * project name: www.cos
 * name:         check-versions.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/12
 */

'use strict';

const chalk = require('chalk');
const semver = require('semver');
const shell = require('shelljs');

const utils = require('./utils');
const packageConfig = require('../package.json');

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  }
];

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: utils.exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  });
}

module.exports = function () {
  const warnings = [];

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i];

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      );
    }
  }

  if (warnings.length) {
    console.log('');
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log();

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i];
      console.log('  ' + warning);
    }

    console.log();
    process.exit(1);
  }
};
