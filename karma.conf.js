module.exports = function (config) {
    config.set({
        basePath: './',

        files: [
          //lib files

          //main app module
          'DOMingo.js',

          //everything else
          'DOMingo-test.js'
        ],

        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'chai'],
        reporters: ['spec'],
        port: 9876,
        colors: true,
        autoWatch: true
    });
};
