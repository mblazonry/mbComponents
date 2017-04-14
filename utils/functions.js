/** @module Functions */
const Fs = require('fs'),
  Path = require('path'),
  Constants = require('./constants');

/** @function forComponent
 * Executes a callback for every Skuid component found in the environment, passing the component name into the callback.
 *
 * @callback componentCallback
 * @param {string} componentName
 */
function forComponent(f) {
  var files = Fs.readdirSync(Constants.COMPONENT_DIRECTORY).filter(file => {
    return Fs.statSync(Path.resolve(Constants.COMPONENT_DIRECTORY, file)).isDirectory();
  });

  files.forEach(f);
}

var exports = module.exports = {
  forComponent: forComponent
};
