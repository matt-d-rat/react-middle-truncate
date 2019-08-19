const webpack = require('webpack');
const path = require('path');
const project = require('./project');

module.exports = {
  mode: 'production',
  target: 'web',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: project.path.lib,
    publicPath: '/',
    library: 'ReactMiddleTruncation',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
  entry: {
    'react-middle-truncate': path.resolve(project.path.src, 'react-middle-truncate/index.js')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ],
        exclude: [/node_modules/]
      }
    ]
  },
  externals: ['react', 'react-dom'],
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
    minimize: true
  },
  plugins: [
    // Assign the module and chunk ids by occurrence count. Ids that are used often get lower (shorter) ids.
    // This make ids predictable and reduces total file size.
    new webpack.optimize.OccurrenceOrderPlugin(),

    // Merge similar chunks if the total size is reduced enough to further optimize execution
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};
