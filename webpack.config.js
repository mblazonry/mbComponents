const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Plugin setup
const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
});

// Custom functions
function getDirEntries() {
    var compPath = path.resolve(__dirname, 'components'),
        dirNames = fs.readdirSync(compPath)
        .filter(file => fs.statSync(path.resolve(compPath, file)).isDirectory());

    return dirNames.reduce((obj, dir) => {
        return Object.assign(obj, {
            [dir]: path.resolve(compPath, dir, `${dir}.jsx`),
            [`${dir}_builder`]: path.resolve(compPath, dir, `${dir}_builder.js`)
        });
    }, {});
}

// Standard config
module.exports = function(env) {
    return {
        entry: getDirEntries(),
        output: {
            path: path.resolve(__dirname, 'build/bundle'),
            filename: '[name].js'
        },
        resolve: {
            modules: [
                'node_modules'
            ],
            extensions: ['.js', '.jsx']
        },
        module: {
            loaders: [{
                test: /\.js$|\.jsx$/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react']
                    }
                },
            }, {
                test: /\.scss$/,
                loader: extractSass.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }]
                })
            }]
        },
        plugins: [
            extractSass
        ]
    }
}
