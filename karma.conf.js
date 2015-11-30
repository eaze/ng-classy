module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    frameworks: ['mocha', 'browserify'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/**/*.js'
    ],
    exclude: [
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [ ['babelify', {sourceMap: 'inline', stage: 0}] ],
      extensions: ['.js']
    },
    browsers: [
      'Chrome'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: 'INFO',
    autoWatch: true,
    singleRun: true
  })
}
