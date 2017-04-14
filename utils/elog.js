/** @module EasyLog */

var colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    white: '\x1b[37m'
  },
  effects = {
    reset: '\x1b[0m',
    bold: '\x1b[1m'
  };

/** @function log
 *
 */
function log(level, msg) {
  console.log(`${level}\t${msg}`);
}

/** @function info
 *
 */
function info(msg) {
  exports.log(`${colors.green}${effects.bold}INFO${colors.white}${effects.reset}`, msg);
}

/** @function error
 *
 */
function error(msg) {
  exports.log(`${colors.red}${effects.bold}ERROR${colors.white}${effects.reset}`, msg);
  throw msg;
}

var exports = module.exports = {
  log: log,
  info: info,
  error: error
};
