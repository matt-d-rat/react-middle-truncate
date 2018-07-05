const webpackConfig = require('./config/webpack.karma.config');

module.exports = function(config) {
  config.set({
    basePath: '',
    files: [
      {
        pattern: 'test/karma-setup.js',
        watched: false,
        served: true,
        included: true
      }
    ],
    preprocessors: {
      'test/karma-setup.js': ['webpack', 'sourcemap']
    },
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    reporters: ['mocha'],
    webpack: webpackConfig
  });
};
