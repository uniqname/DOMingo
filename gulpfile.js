var gulp = require('gulp'),
    glob = require("glob"),
    path = require('path'),
    pkg = require('./package.json'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    karma = require('karma').server;

gulp.task('lint', function() {
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', ['lint'], function () {
    var bundler = browserify({ debug: true });

    bundler.transform(babelify);
    bundler.add('./ES6/DOMingo.js');

    bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./ES6/DOMingo.js'))
        .pipe(rename('DOMingo.js'))
        .pipe(gulp.dest('./'))
        .pipe(streamify(uglify()))
        .pipe(rename('DOMingo.min.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('build-tests', function () {
    var bundler = browserify(),
        b;

    bundler.transform(babelify);
    bundler.add('./ES6/DOMingo.test.js');

    b = bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./ES6/DOMingo.test.js'))
        .pipe(rename('DOMingo-test.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('unit-tests', function (done) {
    //the unit test task
    return karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('watch-src', function () {
    gulp.watch('ES6/*.js', ['build', 'build-tests']);
});

gulp.task('watch-test-build', function () {
    gulp.watch('DOMingo-test.js', ['unit-tests']);
});

gulp.task('dev', ['watch-src', 'watch-test-build'], function () {
    gulp.start('build', 'build-tests');
});

gulp.task('default', function () {
    var testWatch = gulp.watch('DOMingo-test.js', function () {
        gulp.start('unit-tests');
        testWatch.end();
    });
    gulp.start('build', 'build-tests');
});
