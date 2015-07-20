// TODO:
//	> look into using gulp-cache-buster and gulp-hasher to manage asset caching.
//	> look into typing npm scritps with executing gulp tasks (and pass args) from root w/o entering dev folder.
//	> look into using --require option to enable running gulp through transpiler first (supporting es6).
//	> look into utilizing gulp-sourcemaps with minified code (on production only).
//	> ensure use of --silent for less verbose output.


// import modules.
var chalk = require('chalk');
var parseArgs = require('minimist');
var clean = require('del');
var compileLESS = require('gulp-less');
var compileSASS = require('gulp-sass');
var copy = require('gulp-contrib-copy');
var filterChanged = require('gulp-changed');
var gulpIf = require('gulp-if');
var gulp = require('gulp');
var lintCSS = require('gulp-csslint');
var lintJS = require('gulp-jshint');
var minifyCSS = require('gulp-csso');
var prefixCSS = require('gulp-autoprefixer');
var reporterJS = require('jshint-stylish');


// parse the process arguments.
var procArgs = parseArgs(process.argv.slice(2));
var isProduction = !!procArgs.production;
var isWatching = !!procArgs.watch;


// change the cwd to root.
process.chdir('../');
console.log('Executing task automation at context: ' + process.cwd());


// helper function that reports the css lint results.
function reportCSSLint(file) {
	if (file.csslint.errorCount) {
		console.log(chalk.red('CSS Lint Errors: ' + file.csslint.errorCount));
		file.csslint.results.forEach(function(result) {
			console.log(chalk.red(result.error.message + ' on line ' + result.error.line));
		});
	} else {
		console.log(chalk.green('CSS Lint Error-Free'));
	}
}


// module settings.
var OPTIONS = {
	compileSASS: {
		errLogToConsole: true
	},
	lintCSS: 'dev/rc/.csslintrc',
	prefixCSS: {
		browsers: [ '> 1%' ],
		cascade: false,
		remove: true
	}
};


// source locations.
var SRC = {
	assets: 'app/assets/',
	path: 'app/'
};


// build locations.
var BUILD = {
	assets: 'private/assets/',
	path: 'private/'
};


// distribution locations.
var DIST = {
	assets: 'public/assets/',
	path: 'public/'
};


// =====================================================================================================================


// copies source css to build folder.
gulp.task('build-css', function() {
	console.log(chalk.magenta('Copying source CSS into build.'));
	gulp.src(SRC.assets + '**/*.css')
		.pipe(filterChanged(BUILD.assets))		
		.pipe(copy())
		.pipe(gulp.dest(BUILD.assets));
});


// deletes all files and folders in the build folder.
gulp.task('clean-build', function() {
	console.log(chalk.red('(DELETION): Cleaning files/folders in build.'));
	clean.sync([ BUILD.path + '**/*' ]);
});


// compiles source less to the build folder.
gulp.task('compile-less', function() {
	console.log(chalk.magenta('Compiling source LESS into build.'));
	gulp.src(SRC.assets + '**/*.less')
		.pipe(filterChanged(BUILD.assets))
		.pipe(compileLESS())
		.pipe(gulp.dest(BUILD.assets));
});


// compiles source sass to the build folder.
gulp.task('compile-sass', function() {
	console.log(chalk.magenta('Compiling source SASS into build.'));
	gulp.src(SRC.assets + '**/*.sass')
		.pipe(compileSASS(OPTIONS.compileSASS))
		.pipe(gulp.dest(BUILD.assets));
});


// lints the css in the build folder.
gulp.task('lint-css', function() {
	console.log(chalk.magenta('Linting build CSS.'));
	gulp.src(BUILD.assets + '**/*.css')
		//.pipe(filterChanged(BUILD.assets))
		.pipe(lintCSS(OPTIONS.lintCSS))
		.pipe(lintCSS.reporter(reportCSSLint));
});


// indicates the start of task automation.
gulp.task('post-automate', function() {
	console.log(chalk.yellow('\n================================================[Completed task automation]===\n'));
});


// indicates the end of task automation.
gulp.task('pre-automate', function() {
	console.log(chalk.yellow('\n\n\n===[Starting task automation]=================================================\n'));
});


// applies vendor prefixes to css in the build folder.
gulp.task('prefix-css', function() {
	console.log(chalk.magenta('Vendor-prefixing build CSS.'));
	gulp.src(BUILD.assets + '**/*.css')
		.pipe(prefixCSS(OPTIONS.prefixCSS))
		.pipe(gulp.dest(BUILD.assets));
});


// defines the defult gulp task.
gulp.task('default', [

	'pre-automate',
	
	'clean-build',
	
	'build-css',
	'compile-less',
	//'compile-sass',
	//'prefix-css'
	//'lint-css',
	//'minify-css',

	//'build-js',
	//'lint-js',
	//'minify-js',

	//'build-html',
	//'minify-html',

	//'build-images',
	//'compress-images',

	//'build-static-assets'
	'post-automate'
]);


/*  


*** Make sure to exclude folders like 'node_modules' and the 'data' folder.
*** Utilize gulp-changed to only process files that changed since last run. This should make automation faster.

SEQ.		COMMAND						ACTION																					DEV			PROD

			css-compile					Takes .less and .sass source code and compiles to .css.
			css-prefix					Adds vendor prefixes onto .css files.
			css-style					Ensures that css files are written to spec.
			css-lint						Error checks the css.
			css-build					Copies css files from app to build folder.
			css-dist						Copies css files from build to dist.
			css-minify					Minifies css files.

			js-style						Ensure that js files are written to spec.
			js-lint						Error checks the js.
			js-build						Copies js files from app to build folder.
			js-dist						Copies js files from build to dist.
			js-minify					Minifies js files.

			json-lint					Error checks the json.
			json-minify					Minifies json files.

			image-compress				Compresses gif/jpeg/png/svg files.

			html-minify					Minifies html files.
			html-build					Copies html files from app to build folder.
			html-dist					Copies html files from build to dist.

			clear-build					Deletes all files in the build folder.
			clear-dist					Deletes all files in the dist folder.

			build							Performs a series of builds (css, js, etc.)
			dist							Performs a series of dist (css, js, etc.)






NOTE! in dev, we compile, copy, style check and lint, but we do not minify. that is a step for production only.
same goes for images. we compress them on pushing a build to production.

STEPS:
Dev     Prod        Result
compile-less/sass   X                   Compiles css dynamically, copies to build
prefix-css          X                   Ensures vendor compatibility
style-css           X                   Ensures style adherence in css
lint-css            X                   Syntax/Error check in css
build-css           X                   Copies css to build folder
dist-css                    X           Copies css to dist folder
minify-css                  X           Compresses css
bundle-assets               X           Reduces HTTP calls

*/

// =====================================================================================================================

// define tasks.

// gulp.task('dev:build', ['dev:cleanBuild', 'dev:compileLESS', 'dev:compileSASS', /*'dev:buildCSS', 'dev:buildJS', 
//	'dev:prefixCSS', 'dev:lintCSS' */]);

// =====================================================================================================================

/*

// copy .css files from 'src' to 'build'.
gulp.task('dev:buildCSS', function() {
gulp.src(SRC.css)
.pipe(copyFiles())
.pipe(gulp.dest(DEST.css));
});

// copy .js files from 'src' to 'build'.
gulp.task('dev:buildJS', function() {
gulp.src(SRC.js)
.pipe(copyFiles())
.pipe(gulp.dest(DEST.js));
});

// deletes contents of 'build' folder.
gulp.task('dev:cleanBuild', function() {
clean([SRC.build], function(err, paths) {
console.log('Cleaning files/folders:\n', paths.join('\n'));
});
});

// compile.less from 'src' to 'build'.
gulp.task('dev:compileLESS', function() {
gulp.src(SRC.less)
.pipe(compileLESS())
.pipe(gulp.dest(DEST.less));
});

// compile .sass from 'src' to 'build'.
gulp.task('dev:compileSASS', function() {
gulp.src(SRC.sass)
.pipe(compileSASS())
.pipe(gulp.dest(DEST.sass));
});

// error check .css in 'build'.
gulp.task('dev:lintCSS', function() {
gulp.src(SRC.compiledCSS)
.pipe(lintCSS())
.pipe(gulp.dest(DEST.compiledCSS));
});

// error check .js in 'build'.
gulp.task('dev:lintJS', function() {
gulp.src(SRC.js)
.pipe(lintJS())
.pipe(lintJS.reporter(lintStyler))
.pipe(lintJS.reporter('fail'))
.pipe(gulp.dest(DEST.js));
});

// adds vendor prefixes to .css in 'build'.
gulp.task('dev:prefixCSS', function() {
gulp.src(SRC.compiledCSS)
.pipe(prefixCSS(SETTINGS.prefixCSS))
.pipe(gulp.dest(DEST.compiledCSS));
});

// minify .css in 'dist'.
gulp.task('prod:minifyCSS', function() {
gulp.src(SRC.compiledCSS)
.pipe(minifyCSS())
.pipe(gulp.dest(DEST.compiledCSS));
});

// minify .js in 'dist'.
gulp.task('prod:minifyJS', function() {
gulp.src(SRC.buildJS)
.pipe(minifyJS())
.pipe(gulp.dest(DEST.buildJS));
});

*/
