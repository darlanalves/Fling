var gulp = require('gulp'),
	util = require('gulp-util'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	templateCache = require('gulp-templatecache'),
	livereload = require('gulp-livereload'),
	wrap = require('gulp-wrap'),
	pipeline = require('multipipe'),
	colors = util.colors,
	log = util.log,
	spawn = require('child_process').spawn,

	// NOTE: don't join the template strings, it will break Slush!
	wrapper = '(function(undefined){\n\n<' + '%= contents %>\n}());';

var PUBLIC = 'public/app';

gulp.task('min', function() {
	var pipe = pipeline(
		gulp.src(['src/app/module.js', 'src/app/**/*.js']),
		concat('app.js'),
		wrap(wrapper),
		gulp.dest(PUBLIC),
		uglify(),
		rename({
			suffix: '.min'
		}),
		gulp.dest(PUBLIC)
	);

	pipe.on('error', createLogger('min'));
	return pipe;
});

gulp.task('min-libs', function() {
	var pipe = pipeline(
		gulp.src(['src/lib/angular.js', 'src/lib/angular-ui-router.js', 'src/lib/*.js']),
		concat('angular.js'),
		gulp.dest(PUBLIC),
		uglify(),
		rename({
			suffix: '.min'
		}),
		gulp.dest(PUBLIC)
	);

	pipe.on('error', createLogger('min-libs'));
	return pipe;
});

gulp.task('sass', function() {
	var pipe = pipeline(
		gulp.src('scss/**/*.scss'),
		sass({
			outputStyle: 'nested',
			errLogToConsole: true
		}),
		concat('app.css'),
		gulp.dest(PUBLIC)
	);

	pipe.on('error', createLogger('sass'));
	return pipe;
});

gulp.task('mocks', function() {
	var pipe = pipeline(
		gulp.src(['mocks/module.js', 'mocks/**/*.js']),
		concat('mocks.js'),
		wrap(wrapper),
		gulp.dest(PUBLIC)
	);

	pipe.on('error', createLogger('mocks'));
	return pipe;
})


gulp.task('views', function() {
	var pipe = pipeline(
		gulp.src('src/app/**/*.html'),
		templateCache({
			output: 'views.js',
			strip: 'src/app',
			moduleName: 'fling',
			minify: {
				collapseBooleanAttributes: true,
				collapseWhitespace: true
			}
		}),
		gulp.dest(PUBLIC)
	);

	pipe.on('error', createLogger('views'));
	return pipe;
});

gulp.task('server', function() {
	require('./server');
});

gulp.task('test', function() {
	var karma = spawn('./node_modules/karma/bin/karma', ['start', 'test/karma.conf.js']);

	karma.stderr.on('data', function(data) {
		console.log('' + data);
	});

	karma.stdout.on('data', function(data) {
		console.log('' + data);
	});

	karma.on('close', function(code) {
		if (code !== 0) {
			console.log('Karma exited with code ' + code);
		}
	});
})

gulp.task('watch', function() {
	livereload.listen();

	function handleChanges(stream) {
		stream.on('change', livereload.changed);
	}

	handleChanges(gulp.watch('src/app/**/*.js', ['min']));
	handleChanges(gulp.watch('scss/**/*.scss', ['sass']));
	handleChanges(gulp.watch('src/app/**/*.html', ['views']));
	handleChanges(gulp.watch('mocks/**/*.js', ['mocks']));
});

gulp.task('build', ['min', 'sass', 'mocks', 'views'])

gulp.task('default', ['build', 'watch']);

function createLogger(name) {
	return function() {
		var i = arguments.length,
			args = new Array(i);

		while (i--) args[i] = arguments[i];

		args.unshift(colors.red('>>' + name) + ': ');
		log.apply(null, args);
	};
}