const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const config = {
  devtool: 'cheap-module-eval-source-map',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  stats: {
    warnings: false
  },
  externals: {
    'jsdom': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'ignore-loader'
      }
    ]
  }
};

module.exports = merge(baseWebpackConfig, config);
