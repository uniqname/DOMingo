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
    fs = require('fs');

gulp.task('lint', function() {
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', ['lint'], function () {
    var bundler = browserify({ debug: true }),
        b;

    bundler.transform(babelify);
    bundler.add('./DOMingo/DOMingo.js');

    b = bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./DOMingo/DOMingo.js'))
        .pipe(gulp.dest('../'))
        .pipe(streamify(uglify()))
        .pipe(rename('DOMingo.min.js'))
        .pipe(gulp.dest('./'));

});

gulp.task('build-tests', function () {
    var bundler = browserify({ debug: true }),
        b;

    bundler.transform(babelify);
    bundler.add('./DOMingo/DOMingo.test.js');

    b = bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./DOMingo/DOMingo.test.js'))
        .pipe(rename('DOMingo-test.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['build', 'build-tests']);
