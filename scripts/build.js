#!/usr/bin/env node
var Cp = require('child_process'),
    Rimraf = require('rimraf'),
    Path = require('path'),
    Log = require('../utils/elog.js');

const BUILD_DIRECTORY = Path.resolve('.', 'build');

// Clean build directory
Rimraf(BUILD_DIRECTORY, () => {
    Log.info('Build directory cleaned');
});
