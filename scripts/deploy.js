#!/usr/bin/env node

const Log = require('../utils/elog.js'),
    Fs = require('fs'),
    Path = require('path'),
    Jsforce = require('jsforce'),
    Constants = require('../utils/constants.js');

/* Functions */
function check(org) {
    try {
        if (!Fs.existsSync(org)) {
            return null;
        }

        var o = JSON.parse(Fs.readFileSync(org));

        if (!o.user || !o.password || !o.token) {
            return null;
        }

        return o;
    } catch (err) {
        Log.error(err);
    }
}

function deploy(conn) {
    var buildStream = Fs.createReadStream(Path.resolve(Constants.BUILD_DIRECTORY, `${Constants.PACKAGE_NAME}.zip`));
    conn.metadata.deploy(buildStream).complete((err, res) => {
        if (err) {
            Log.error(err);
        }
    });
}

var org = process.argv[2],
    credPath = Path.resolve(Constants.ORG_DIRECTORY, `${org}.json`);

var creds = check(credPath);
Log.info(`Checking credentials for org ${org}...`);
if (!creds) {
    Log.error(`Invalid credentials found for org "${org}."`);
}
Log.info(`Valid credentials found for org "${org}", starting deploy...`);

var conn = new Jsforce.Connection();
conn.login(creds.username, `${creds.password}`, (err, res) => {
    if (err) {
        Log.error(err);
    }
    deploy(conn);
});
