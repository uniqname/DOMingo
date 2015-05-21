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
        .pipe(gulp.dest('../'))
        .pipe(streamify(uglify()))
        .pipe(rename('DOMingo.min.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('build-tests', ['build'], function () {
    var bundler = browserify({ debug: true }),
        b;

    bundler.transform(babelify);
    bundler.add('./ES6/DOMingo.test.js');

    b = bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./ES6/DOMingo.test.js'))
        .pipe(rename('DOMingo-test.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('unit-tests', ['lint', 'build-tests'], function (done) {
    //the unit test task
    return karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('default', ['build', 'unit-tests']);
