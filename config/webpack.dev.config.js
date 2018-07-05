const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');
const project = require('./project');

const config = {
  target: 'web',
  devtool: 'cheap-module-source-map',
  node: {
    console: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  entry: {
    index: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      path.resolve(project.path.src, 'demo/index.js')
    ]
  },
  plugins: [
    // Reference the vendor DLL (note a seperate build must be run to generate the appropriate manifest files)
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require( path.resolve(project.path.output, 'vendor.manifest.json') ),
      extensions: ['.js', '.jsx']
    }),

    // Creates HTML page for us at build time
    new HtmlWebpackPlugin({
      favicon: 'src/demo/assets/images/favicon.ico',
      title: 'Dev | react-middle-truncate'
    }),

    // Add the vendor DLL bundle to the generated HTML output created by the HtmlWebpackPlugin
    new AddAssetHtmlPlugin({
      includeSourcemap: false,
      filepath: path.resolve(project.path.output, '*.dll.js')
    }),

    // Enable HMR globally
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = merge.smart(baseWebpackConfig, config);
