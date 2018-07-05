const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseWebpackConfig = require('./webpack.base.config');
const project = require('./project');

const config = {
  target: 'node', // webpack should compile node compatible code for tests
  externals: [ nodeExternals() ],
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        enforce: 'post', // Enforce as a post step so babel can do its compilation prior to instrumenting code
        exclude: [
          /node_modules/,
          /constants/,
          /config/,
          /lib/,
          /.tmp/,
          /\.spec\.js$/
        ],
        include: project.path.src.client,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: {
            esModules: true
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'ignore-loader'
      }
    ]
  }
};

module.exports = merge(baseWebpackConfig, config);
