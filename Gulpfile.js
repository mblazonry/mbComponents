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
   rename = require('gulp-rename'),
   clean = require('gulp-clean'),
   stripCode = require('gulp-strip-code'),
   header = require('gulp-header'),
   mavensmate = require('mavensmate');

///////////
// Tasks //
///////////

// create a default task and just log a message
gulp.task('default', function ()
{
   return gutil.log('Gulp is running!');
});

/**
 * Remove old dev files from directory.
 */
gulp.task('clean-dev', function ()
{
   return gulp.src(
         [
            './*-dev.zip',
            './resource-bundles/mBlazonryComponents.resource'
         ],
         {
            read: false,
            base: '.'
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

/**
 * Lint files project source files using jshint for errors and fail if any are found.
 */
gulp.task('lint', function ()
{
   gulp.src('components/**/*.js') // path to your files
   .pipe(jshint())
   // Dump results
   .pipe(jshint.reporter());
});

////////////////
// Deployment //
////////////////

gulp.task('mBlazonry-dev-deploy', ['static-resource-dev'], function ()
{
   var client = mavensmate.createClient(
   {
      name: 'mm-mBlazonry-Production'
   });

   client.addProjectByPath('.')
      .then(function (res)
      {
         return client.executeCommand('mavensmate deploy-resource-bundle ./resource-bundles/mBlazonryComponents.resource');
      })
      .then(function (res)
      {
         console.log('command result', res);
      });
});

// possibly unnecesary
gulp.task('static-resource-dev', ['build-dev'], function ()
{
   gulp.src('./*-dev.zip',
   {
      base: "."
   })
   // rename
   .pipe(rename('mBlazonryComponents.resource'))
   // move to SF package
   .pipe(gulp.dest('src/staticresources'));
});

////////////
// Builds //
////////////
///
// Get useful data from package.json
var npm_pkg = require('./package.json');
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
         start_comment: "start-timer-build-excludes",
         end_comment: "end-timer-build-excludes"
      }))
      // minify configs
      .pipe(jsonminify())
      // append header to config files
      .pipe(header(banner,
      {
         pkg: npm_pkg
      }));

   // Zip all files
   var zip_files = merge(min_src, min_configs)
      .pipe(zip('./mblazonryComponents-min-release.zip'))
      .pipe(gulp.dest('./'));

   return zip_files;
});

gulp.task('build-dev', ['clean-dev', 'lint'], function ()
{
   var src = gulp.src(['./components/**/*.*']);

   var min_configs = gulp.src('./skuid_*.json')
      // minify configs
      .pipe(jsonminify());

   return merge(src, min_configs)
      // then make them into a resource bundle
      .pipe(gulp.dest('./resource-bundles/mBlazonryComponents.resource'))
      // zip the files
      .pipe(zip('./mblazonryComponents-dev.zip')) // eventually remove this
      // drop the zip in the top level folder
      .pipe(gulp.dest('./'));
});
