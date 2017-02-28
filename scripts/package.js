#!/usr/bin/env node

const Archiver = require('archiver'),
    Fs = require('fs'),
    Path = require('path'),
    Log = require('../utils/elog.js'),
    Constants = require('../utils/constants.js');

// Functions
function forComponent(f) {
    var files = Fs.readdirSync(Constants.COMPONENT_DIRECTORY).filter(file => {
        return Fs.statSync(Path.resolve(Constants.COMPONENT_DIRECTORY, file)).isDirectory();
    });

    files.forEach(f);
}

function packageBuild() {
    Log.info('Packaging bundled files...');
    var build = Fs.createWriteStream(Path.resolve(Constants.BUILD_DIRECTORY, `${Constants.PACKAGE_NAME}.zip`));
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

function genRuntimeConfig() {
    var runtimeOptions = {
        id: Constants.PACKAGE_ID,
        components: []
    };

    forComponent(component => {
        var compPath = Path.resolve(Constants.BUNDLE_DIRECTORY, component)

        var o = {
            id: component
        };

        if (!Fs.existsSync(`${compPath}.js`)) {
            Log.error(`${component} runtime missing!`);
        }

        Log.info(`Registering ${component}.js...`);
        o.js = [
            {
                path: `${component}.js`
            }
        ]

        if (Fs.existsSync(`${compPath}.css`)) {
            Log.info(`Registering ${component}.css...`);
            o.css = [
                {
                    path: `${component}.css`
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

function genBuilderConfig() {
    var builderOptions = Object.assign({
        id: Constants.PACKAGE_ID,
        components: []
    }, {
        folders: [Object.assign({
                id: Constants.PACKAGE_ID
            }, JSON.parse(Fs.readFileSync('package_options.json')))]
    });

    forComponent(component => {
        var compPath = Path.resolve(Constants.BUNDLE_DIRECTORY, component)

        var o = {
            id: component,
            folderId: Constants.PACKAGE_ID
        };

        if (!Fs.existsSync(`${compPath}_builder.js`)) {
            Log.error(`${component} builder missing!`);
        }

        Log.info(`Registering ${component}_builder.js...`);
        o.js = [
            {
                path: `${component}_builder.js`
            }
        ]

        if (Fs.existsSync(`${compPath}_builder.css`)) {
            Log.info(`Registering ${component}_builder.css...`);
            o.css = [
                {
                    path: `${component}_builder.css`
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

function embedBundledBuilders() {
    forComponent(component => {
        var compPath = Path.resolve(Constants.COMPONENT_DIRECTORY, component);
        var temp = `(function ($, skuid, undefined)
            {
                ${Fs.readFileSync(Path.resolve(Constants.BUNDLE_DIRECTORY, `${component}_builder.js`))}
            	skuid.builder.registerBuilder(new skuid.builder.Builder(Object.assign(${Fs.readFileSync(Path.resolve(compPath, 'builder.json'))}, ${component}Options)));
            })(window.skuid.$, window.skuid);`;

        Fs.writeFileSync(Path.resolve(Constants.BUNDLE_DIRECTORY, `${component}_builder.js`), temp);
    });
}

function embedBundledRuntime() {
    forComponent(component => {
        var compPath = Path.resolve(Constants.BUNDLE_DIRECTORY, component),
            temp = `(function ($, skuid, window, undefined)
        {

            var Runtime_${component} = function (element, xmlDefinition, component)
            {
                ${Fs.readFileSync(`${compPath}.js`)}
            };

            skuid.componentType.register("mblazonry__${component}", Runtime__${component});
        })(window.skuid.$, window.skuid, window);`;
        Fs.writeFileSync(`${compPath}.js`, temp);
    });
}

embedBundledRuntime();
embedBundledBuilders()

Fs.mkdirSync(Constants.CONFIG_DIRECTORY);

genRuntimeConfig();
genBuilderConfig();
packageBuild();
