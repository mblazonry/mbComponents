#!/usr/bin/env node

const Archiver = require('archiver'),
    Fs = require('fs'),
    Path = require('path'),
    Log = require('../utils/elog.js'),
    Constants = require('../utils/constants.js'),
    Functions = require('../utils/functions.js');

/** @function genRuntimeConfig
 * Generates a component pack runtime manifest from all bundled components.
 */
function genRuntimeConfig() {
    var runtimeOptions = {
        id: Constants.PACKAGE_ID,
        components: []
    };

    Functions.forComponent(component => {
        var compId = `${Constants.PACKAGE_ID}_${component}`,
            compPath = Path.resolve(Constants.BUNDLE_DIRECTORY, compId);

        var o = {
            id: `${compId}`
        };

        if (!Fs.existsSync(`${compPath}.js`)) {
            Log.error(`${compId} runtime missing!`);
        }

        Log.info(`Registering ${compId}.js...`);
        o.js = [
            {
                path: `${compId}.js`
            }
        ]

        if (Fs.existsSync(`${compPath}.css`)) {
            Log.info(`Registering ${compId}.css...`);
            o.css = [
                {
                    path: `${compId}.css`
                }
            ];
        }

        runtimeOptions.components.push(o);
    });

    Fs.writeFileSync(Path.resolve(Constants.CONFIG_DIRECTORY, "skuid_runtime.json"), JSON.stringify(runtimeOptions), err => {
        if (err) {
            Log.error(err);
        }
        Log.info('Generated runtime configuration file.');
    });
}

/** @function genBuilderConfig
 * Generates a component pack builder manifest from all bundled components.
 */
function genBuilderConfig() {
    var builderOptions = Object.assign({
        id: Constants.PACKAGE_ID,
        components: []
    }, {
        folders: [Object.assign({
                id: Constants.PACKAGE_ID
            }, JSON.parse(Fs.readFileSync('package_options.json')))]
    });

    Functions.forComponent(component => {
        var compId = `${Constants.PACKAGE_ID}_${component}`,
            compPath = Path.resolve(Constants.BUNDLE_DIRECTORY, compId);

        var o = {
            id: compId,
            folderId: Constants.PACKAGE_ID
        };

        if (!Fs.existsSync(`${compPath}_builder.js`)) {
            Log.error(`${compId} builder missing!`);
        }

        Log.info(`Registering ${compId}_builder.js...`);
        o.js = [
            {
                path: `${compId}_builder.js`
            }
        ]

        if (Fs.existsSync(`${compPath}_builder.css`)) {
            Log.info(`Registering ${compId}_builder.css...`);
            o.css = [
                {
                    path: `${compId}_builder.css`
                }
            ];
        }

        builderOptions.components.push(o);
    });

    Fs.writeFileSync(Path.resolve(Constants.CONFIG_DIRECTORY, "skuid_builders.json"), JSON.stringify(builderOptions), err => {
        if (err) {
            Log.error(err);
        }
        Log.info('Generated builder configuration file.');
    });
}

/** @function wrapBundledBuilders
  * Wraps bundled component builders in bootstrap code required by Skuid.
  */
function wrapBundledBuilders() {
    Functions.forComponent(component => {
        var compId = `${Constants.PACKAGE_ID}_${component}`,
            compPath = Path.resolve(Constants.BUNDLE_DIRECTORY, compId);

        var temp = `(function ($, skuid, window)
            {
                var ${component}Options;
                ${Fs.readFileSync(Path.resolve(Constants.BUNDLE_DIRECTORY, `${compId}_builder.js`))}
              skuid.builder.registerBuilder(new skuid.builder.Builder(Object.assign(${Fs.readFileSync(Path.resolve(Constants.COMPONENT_DIRECTORY, component, 'builder.json'))}, ${component}Options, { id: "${compId}"})));
            })(window.skuid.$, window.skuid, window);`;

        Fs.writeFileSync(Path.resolve(Constants.BUNDLE_DIRECTORY, `${compId}_builder.js`), temp);
    });
}

/** @function wrapBundledRuntime
 * Wraps bundled component runtimes in bootstrap code required by Skuid.
 */
function wrapBundledRuntime() {
    Functions.forComponent(component => {
        var compId = `${Constants.PACKAGE_ID}_${component}`,
            compPath = Path.resolve(Constants.BUNDLE_DIRECTORY, compId),
        temp = `(function ($, skuid, window)
        {

            skuid.componentType.register("${compId}", function (element, xmlDefinition, component)
            {
                ${Fs.readFileSync(`${compPath}.js`)}
            });

            console.log("REGISTERING ${Constants.PACKAGE_ID}__${compId}");
        })(window.skuid.$, window.skuid, window);`;

        Fs.writeFileSync(`${compPath}.js`, temp);
    });
}

wrapBundledRuntime();
wrapBundledBuilders()

Fs.mkdirSync(Constants.CONFIG_DIRECTORY);

genRuntimeConfig();
genBuilderConfig();
