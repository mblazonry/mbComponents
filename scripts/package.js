#!/usr/bin/env node
const Archiver = require('archiver'),
  Fs = require('fs'),
  Path = require('path'),
  Constants = require('../utils/constants.js'),
  Log = require('../utils/elog.js');

/** @function packageBuild
 * Packages all bundled files and manifests into a final component pack archive.
 */
function packageBuild() {
  Log.info('Packaging bundled files...');
  var build = Fs.createWriteStream(
      Path.resolve(Constants.BUILD_DIRECTORY, `${Constants.PACKAGE_NAME}.zip`));
  var archive = Archiver('zip', {
    zlib: {
      level: 9
    }
  });

  build.on('close', () => {
    Log.info(`Packaged ${Math.round(archive.pointer() / 1024)} total kB.`);
  });

  archive.on('error', err => {
    throw err;
  });

  archive.pipe(build);
  archive.directory(Constants.BUNDLE_DIRECTORY, '/');
  archive.directory(Constants.CONFIG_DIRECTORY, '/');
  archive.finalize();
}

packageBuild();
