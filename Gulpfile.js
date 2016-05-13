/* jshint node: true */
/*********************/

// include gulp & grunt
var gulp = require('gulp');

// include plug-ins
var merge = require('merge-stream'),
   jshint = require("gulp-jshint"),
   uglify = require("gulp-uglify"),
   cleanCSS = require('gulp-clean-css'),
   jsonminify = require('gulp-jsonminify'),
   zip = require('gulp-zip'),
   gutil = require('gulp-util'),
   clean = require('gulp-clean'),
   stripCode = require('gulp-strip-code'),
   exec = require('child_process').exec,
   header = require('gulp-header');

///////////
// Tasks //
///////////

// create a default task and just log a message
gulp.task('default', function ()
{
   return gutil.log('Gulp is running!');
});

/**
 * Lint files project source files using jshint for errors and fail if any are found.
 */
gulp.task('lint', function ()
{
   gulp.src('./components/**/*.js') // path to your files
   .pipe(jshint())
      .pipe(jshint.reporter()); // Dump results
});

/**
 * Remove old dev files from directory.
 */
gulp.task('clean-dev', function ()
{
   return gulp.src('./*-dev.zip',
      {
         read: false
      })
      .pipe(clean());
});

/**
 * Remove old release files from directory.
 */
gulp.task('clean-min-release', function ()
{
   return gulp.src('./*-min-release.zip',
      {
         read: false
      })
      .pipe(clean());
});

gulp.task('deploy-dev', function ()
{
   gulp.src('./pkg') // , { base: "." }
   .pipe(zip('pkg.zip'))
   // Deploy
   .pipe(forceDeploy(
   {
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD,
      loginUrl: 'https://mblazonry.my.salesforce.com',
      //pollInterval: 10 * 1000,
      version: '33.0'
   }));
});

////////////
// Builds //
////////////

// get data from package.json
var pkg = require('./package.json');
var banner = ['/**',
   ' * <%= pkg.name %> - <%= pkg.description %>',
   ' * @version v<%= pkg.version %>',
   //' * @link <%= pkg.link %>',
   ' * @license <%= pkg.license %>',
   ' * @author <%= pkg.author %>',
   ' */',
   ''
].join('\n');

gulp.task('build-min-timer', ['clean-min-release', 'lint'], function ()
{
   // minify-js
   var min_js = gulp.src('./components/*_timer/*.js')
      .pipe(uglify());

   //minify-css
   var min_css = gulp.src('./components/*_timer/*.css')
      // .pipe(cleanCSS())
      .pipe(cleanCSS(
      {
         debug: true
      }, function (details)
      {
         console.log(details.name + ': ' + details.stats.originalSize);
         console.log(details.name + ': ' + details.stats.minifiedSize);
      }));

   // combine
   var min_src = merge(min_js, min_css);

   // configs
   var min_configs = gulp.src('./skuid_*.json')
      // strip non-timer stuff
      .pipe(stripCode(
      {
         start_comment: "start-build-timer",
         end_comment: "end-build-timer"
      }))
      // minify configs
      .pipe(jsonminify())
      // append header to config files
      .pipe(header(banner,
      {
         pkg: pkg
      }));

   // Zip all files
   var zip_files = merge(min_src, min_configs)
      .pipe(zip('./mblazonryComponents-min-release.zip'))
      .pipe(gulp.dest('./'));

   return zip_files;
});

gulp.task('build-dev', ['clean-dev', 'lint'], function ()
{
   // src
   var src = gulp.src(['./components/**/*.*']);

   // configs
   var min_configs = gulp.src('./skuid_*.json')
      // minify configs
      .pipe(jsonminify());

   return merge(src, min_configs)
      // zip files
      .pipe(zip('./mblazonryComponents-dev.zip'))
      .pipe(gulp.dest('./'));
});

/**
 * Generate component documentation
 */
gulp.task('gen-docs', function() {
  exec('jsdoc -c docs/jsdoc.conf -r', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});
