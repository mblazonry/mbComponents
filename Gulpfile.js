/* jshint node: true */
/*********************/

"use strict";

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
   header = require('gulp-header');

///////////
// Tasks //
///////////

// XXX: delegate functions used in these calls are implemented below the Builds
// section.

// create a default task and just log a message
gulp.task('default', function ()
{
   return gutil.log('Gulp is running!');
});

/**
 * Lint files project source files using jshint for errors and fail if any are
 * found.
 */
gulp.task('lint', lint);

/**
 * Remove old dev files from directory.
 */
gulp.task('clean-dev', clean_dev);

/**
 * Remove old release files from directory.
 */
gulp.task('clean-min-release', clean_min_release);

/**
 * Deploy development build
 */
gulp.task('deploy-dev', deploy_dev);

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

gulp.task('build-min-timer', ['clean-min-release', 'lint'], build_min_timer);

gulp.task('build-dev', ['clean-dev', 'lint'], build_dev);

//////////////////////////////////////////////////
// Delegate functions for gulp.task calls above //
//////////////////////////////////////////////////

function lint() {
	// apply linter to JS sources
	gulp.src('./components/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter());
}

function clean_dev() {
	// create a dev build and clean the working directory
	return gulp.src('./*-dev.zip', {
		read : false
	})
	.pipe(clean());
}

function clean_min_release() {
	// create a release build and clean the working directory
	return gulp.src('./*-min-release.zip',
	{
		read : false;
	})
	.pipe(clean());
}

function deploy_dev() {
	gulp.src('./pkg')
		.pipe(zip('pkg.zip'))
		// deploy to Salesforce
		.pipe(forceDeploy({
			username : process.env.SF_USERNAME,
			password : process.ENV.SF_PASSWORD,
			loginUrl : 'https://mblazonry.my.salesforce.com',
			//pollInterval : 10 * 1000,
			version : '33.0',
		}));
}

function build_min_timer() {
	// minify JS
	var min_js = gulp.src('./components/*_timer/*.js')
		.pipe(uglify());

	// minify CSS
	var min_css = gulp.src('./components/*_timer/*.css')
		.pipe(cleanCSS({
			debug : true,
		}, function (details) {
			console.log(details.name + ': ' + details.stats.originalSize);
			console.log(details.name + ': ' + details.stats.minifiedSize);
		}));
	
	// combine minified CSS and JS
	var min_src = merge(min_js, min_css);

	// configs
	var min_configs = gulp.src('./skuid_*.json')
		// strip non-timer stuff
		.pipe(stripCode({
			start_comment : 'start-build-timer',
			end_comment : 'end-build-timer'
		}))
		// minify configs
		.pipe(jsonminify())
		// append header to config files
		.pipe(header(banner, {
			pkg : pkg
		}));
	
	// compress all files
	var zip_files = merge(min_src, min_configs)
		.pipe(zip('./mblzaonryComponents-min-release.zip'))
		.pipe(gulp.dest('./'));
	
	return zip_files;
}

function build_dev() {
	// source
	var src = gulp.src(['./components/**/*.*']);

	// minified configs
	var min_configs = gulp.src('./skuid_*.json')
		.pipe(jsonminify());

	// return compressed source + configus
	return merge(src, min_configs)
		.pipe(zip('./mblazonryComponents-dev.zip'))
		.pipe(gulp.dest('./'));
}

