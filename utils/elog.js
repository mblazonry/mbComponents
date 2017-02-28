/* EasyLog logger */
var exports = module.exports = {},
    colors = {
        green: '\x1b[32m',
        red: '\x1b[31m',
        white: '\x1b[37m'
    },
    effects = {
        reset: '\x1b[0m',
        bold: '\x1b[1m'
    };

exports.log = function(level, msg) {
    console.log(`${level}\t${msg}`);
}

/* Level-specific logging functions */
exports.info = function(msg) {
    exports.log(`${colors.green}${effects.bold}INFO${colors.white}${effects.reset}`, msg);
}

exports.error = function(msg) {
    exports.log(`${colors.red}${effects.bold}ERROR${colors.white}${effects.reset}`, msg);
    throw msg;
}
