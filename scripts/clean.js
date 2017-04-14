#!/usr/bin/env node
var Cp = require('child_process'),
  Rimraf = require('rimraf'),
  Path = require('path'),
  Log = require('../utils/elog.js'),
  Constants = require('../utils/constants.js');

Rimraf(Constants.BUILD_DIRECTORY, () => {
  Log.info('Build directory cleaned.');
});
