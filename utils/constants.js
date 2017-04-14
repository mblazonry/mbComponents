/** @module Constants */
const Path = require('path');

var exports = module.exports = {};

exports.CONTEXT_DIRECTORY = Path.resolve('.');
exports.BUILD_DIRECTORY = Path.resolve(exports.CONTEXT_DIRECTORY, 'build');
exports.BUNDLE_DIRECTORY = Path.resolve(exports.BUILD_DIRECTORY, 'bundle');
exports.CONFIG_DIRECTORY = Path.resolve(exports.BUILD_DIRECTORY, 'config');
exports.COMPONENT_DIRECTORY = Path.resolve(
                                      exports.CONTEXT_DIRECTORY, 'components');
exports.ORG_DIRECTORY = Path.resolve(exports.CONTEXT_DIRECTORY, 'orgs'),
exports.PACKAGE_NAME = 'mblazonryBeta';
exports.PACKAGE_ID = exports.PACKAGE_NAME.toLowerCase();
