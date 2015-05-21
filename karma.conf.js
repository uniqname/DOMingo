module.exports = function (config) {
    config.set({
        basePath: './',

        files: ['DOMingo-test.js'],

        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'chai'],
        reporters: ['spec'],
        port: 9876,
        colors: true,
        autoWatch: false
    });
};
