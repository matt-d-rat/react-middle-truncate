const webpack = require('webpack');
const path = require('path');
const project = require('./project');

// This webpack configuration only needs to be run if the dependencies in the package.json change.
// By producing a vendor bundle that changes infrequently helps to improve the build performance.
module.exports = {
  mode: 'development',
  output: {
    filename: '[name].dll.js',
    path: project.path.output,
    library: '[name]'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: {
    vendor: project.vendor
  },
  plugins: [
    // Produces a vendor DLL bundle and a manifest file which is referenced by other webpack development builds.
    new webpack.DllPlugin({
      // The name of the global variable which the library's
      // require function has been assigned to. This must match the output.library option above
      name: '[name]',

      // The path to the manifest file which maps between modules included in a bundle and the internal IDs
      // within that bundle
      path: path.join(project.path.output, '[name].manifest.json')
    })
  ]
};
