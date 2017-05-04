const Webpack = require('webpack'),
  Gulp = require('gulp'),
  WebpackConfig = require('./webpack.config.js');

/* @function onBuild */
function onBuild(done) {
  return (err, stats) => {
    if (stats.hasWarnings()) {
      console.log(stats.compilation.warnings.toString({
        colors: true
      }));
    }

    if (stats.hasErrors()) {
      console.log(stats.compilation.errors.toString({
        colors: true
      }));
    }

    if (done) { done(); }
  };
}

Gulp.task('build', done => {
  Webpack(WebpackConfig()).run(onBuild(done));
});

Gulp.task('build-dev', done => {
  var newConf =  Object.assign({}, WebpackConfig());
  newConf.plugins = [...newConf.plugins, new Webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })];

  Webpack(newConf).run(onBuild(done));
});

Gulp.task('deploy', done => {
  console.log(process.argv.pop());
});
