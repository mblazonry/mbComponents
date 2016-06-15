/* jshint node: true */
/*********************/

"use strict";

//////////
// gulp //
//////////
var gulp = require('gulp');

///////////////////
// gulp plug-ins //
///////////////////
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
   forceDeploy = require('gulp-jsforce-deploy'),
   fileExists = require('file-exists'),
   taskListing = require('gulp-task-listing');

///////////
// Tasks //
///////////

// Delegate functions used in these calls
// are implemented below.

/**
 * Default task that tests gulp by logging a message.
 */
gulp.task('default', taskListing);
gulp.task('lint', lint);
gulp.task('clean-dev', clean_dev);
gulp.task('clean-min-release', clean_min_release);
gulp.task('build-min-timer', ['clean-min-release', 'lint'], build_min_timer);
gulp.task('build-dev', ['clean-dev', 'lint'], build_dev);
gulp.task('static-resource-dev', ['build-dev'], static_resource_dev);
gulp.task('deploy', ['static-resource-dev', 'env-dev'], mB_jsforce_deploy_dev);
gulp.task('env-dev', false, env_dev);

///////////////////
// Utility Tasks //
///////////////////
/**
 * Remove old dev files from directory.
 */
function clean_dev()
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
}

/**
 * Remove old release files from directory.
 */
function clean_min_release()
{
   return gulp.src('./*-min-release.zip',
      {
         read: false
      })
      .pipe(clean());
}

/**
 * Lint project source files using JShint.
 * Fails if any errors are found.
 */
function lint()
{
   gulp.src('components/**/*.js') // path to your files
   .pipe(jshint())
   // Dump results
   .pipe(jshint.reporter());
}

////////////
// Builds //
////////////

/**
 * Gets useful data from package.json
 */
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


////////////////
// Deployment //
////////////////

/**
 * Deploy development build to mBlazonry using jsforce
 * This will only update server if files are non-identical
 */
function mB_jsforce_deploy_dev()
{
   gulp.src('./src/**',
   {
      base: "."
   })
      .pipe(zip('pkg.zip'))
      .pipe(
         forceDeploy(
         {
            username: process.env.SF_USERNAME,
            password: process.env.SF_PASSWORD,
            loginUrl: 'https://mblazonry.my.salesforce.com',
            pollTimeout: 120 * 1000,
            pollInterval: 10 * 1000,
            version: '34.0',
            verbose: true,
            logLevel: "DEBUG",
            rollbackOnError: true
         })
   );
}

/**
 * Check for existing environment configs
 */
function env_dev()
{
   var envFileExists = fileExists('./.env');

   gutil.log((envFileExists ? "Found" : "Couldn't find") + " .env file!");

   if (envFileExists)
   {
      require('dotenv').config();
   }

   return envFileExists;
}

// possibly unnecesary
function static_resource_dev()
{
   gulp.src('./*-dev.zip',
   {
      base: "."
   })
   // rename
   .pipe(rename('mBlazonryComponents.resource'))
   // move to SF package
   .pipe(gulp.dest('src/staticresources'));
}

///////////////////////////////////////
// Delegate functions for gulp tasks //
///////////////////////////////////////

function build_dev()
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
}

function build_min_timer()
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
         gutil.log(details.name + ': ' + details.stats.originalSize);
         gutil.log(details.name + ': ' + details.stats.minifiedSize);
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
}
