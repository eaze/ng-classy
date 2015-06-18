
var path = require('path');
var webpack = require('webpack');

var webpackConfig = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['', '.js']
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'babel?stage=0',
        include: path.join(__dirname, 'test')
      },
      {
        test: /\.js$/,
        loader: 'isparta',
        include: path.join(__dirname, 'lib')
      }
    ],
    loaders: [
    ]
  },
  plugins: [
  ],
  stats: {
    colors: true
  }
};


module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/**/*.js'
    ],
    exclude: [
    ],
    webpack: webpackConfig,
    webpackMiddleware: {
      quiet: true
    },
    preprocessors: {
      'test/**/*.js': ['webpack']
    },

    browsers: [
      'Chrome'
    ],
    reporters: ['progress'],
    coverageReporter: {
      dir: './coverage/',
      subdir: function (browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
      },
      reporters: [
        {type: 'text', file: 'text.txt'},
        {type: 'text-summary', file: 'text-summary.txt'},
        {type: 'html'}
      ]
    },
    port: 9876,
    colors: true,
    logLevel: 'INFO',
    autoWatch: true,
    singleRun: true
  });
};
