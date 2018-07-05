const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');
const project = require('./project');

const config = {
  target: 'web',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: project.path.demo,
    publicPath: 'demo'
  },
  entry: {
    'index': path.resolve(project.path.src, 'demo/index.js')
  },
  node: {
    console: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false
  },
  optimization: {
    // Use the generated hashes as module names for smaller output
    namedModules: false,

    // Scope hoist all modules into a single wrapper function to improve execution performance in the browser
    concatenateModules: true,

    // Minimize and uglify the code
    minimize: true,

    // Split vendor dependencies into a seperate file output
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    // Assign the module and chunk ids by occurrence count. Ids that are used often get lower (shorter) ids.
    // This make ids predictable and reduces total file size.
    new webpack.optimize.OccurrenceOrderPlugin(),

    // Merge similar chunks if the total size is reduced enough to further optimize execution
    new webpack.optimize.AggressiveMergingPlugin(),

    // Creates HTML page for us at build time
    new HtmlWebpackPlugin({
      favicon: 'src/demo/assets/images/favicon.ico',
      title: 'Demo | react-middle-truncate',
      filename: path.join(__dirname, '/../index.html')
    }),

    // gzip compress output assets for smaller filesize served to the browser
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};

module.exports = merge.smart(baseWebpackConfig, config);
