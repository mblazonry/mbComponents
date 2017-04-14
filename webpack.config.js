const Path = require('path'),
  Fs = require('fs'),
  Webpack = require('webpack'),
  ExtractTextPlugin = require("extract-text-Webpack-plugin"),
  Constants = require('./utils/constants.js');


// Plugin setup
const extractSass = new ExtractTextPlugin({
  filename: `[name].css`,
});

const extractVendor = new Webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: (module) =>
                module.context && module.context.indexOf('node_modules') !== -1
});

const extractManifest = new Webpack.optimize.CommonsChunkPlugin({
  name: 'manifest'
});

// Custom functions
function getDirEntries() {
  var compPath = Path.resolve(__dirname, 'components'),
    dirNames = Fs.readdirSync(compPath)
        .filter(file =>
                      Fs.statSync(Path.resolve(compPath, file)).isDirectory());

  return dirNames.reduce((obj, dir) => {
    return Object.assign(obj, {
      [dir]: Path.resolve(compPath, dir, `${dir}.jsx`),
      [`${dir}_builder`]: Path.resolve(compPath, dir, `${dir}_builder.js`)
    });
  }, {});
}

// Standard config
module.exports = function(env) {
  return {
    entry: getDirEntries(),
    output: {
      path: Path.resolve(__dirname, 'build/bundle'),
      filename: `[name].js`
    },
    resolve: {
      modules: [
        'node_modules'
      ],
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [{
        test: /\.js$|\.jsx$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
            plugins: ['transform-object-rest-spread']
          }
        }, {
          loader: 'eslint-loader'
        }],
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
      extractSass,
      extractVendor,
      extractManifest
    ]
  };
};
