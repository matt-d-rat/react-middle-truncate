const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssNano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const project = require('./project');

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  '__DEV__': JSON.stringify(JSON.parse(process.env.NODE_ENV !== 'production'))
};

// Base Webpack configuration, used by all other configurations for common settings
module.exports = {
  mode: (process.env.NODE_ENV !== 'production') ? 'development' : 'production',
  output: {
    filename: '[name].js',
    path: project.path.output,
    publicPath: '/',
    library: 'ReactMiddleTruncation',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      components: path.join(project.path.src, 'demo/components'),
      containers: path.join(project.path.src, 'demo/containers'),
      fonts: path.join(project.path.src, 'demo/assets/fonts'),
      images: path.join(project.path.src, 'demo/assets/images'),
      lib: path.join(project.path.src, 'react-middle-truncate'),
      scss: path.join(project.path.src, 'demo/assets/scss'),
      utils: path.join(project.path.src, 'utils')
    },
    extensions: ['.js', '.jsx', '.json', '.scss', '.css']
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
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development' // only enable hot in development
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              modules: {
                localIdentName: (process.env.NODE_ENV === 'production')
                  ? '[hash:base64:5]'
                  : project.name + '_[name]_[local]---[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            ident: 'postcss',
            options: {
              sourceMap: true,
              plugins: function() {
                return [
                  cssNano(),
                  autoprefixer('last 2 versions')
                ];
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              outputStyle: 'expanded'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          query: {
            limit: 8192,
            name: 'assets/images/[name].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader',
          query: {
            limit: 8192,
            name: 'assets/fonts/[name].[ext]'
          }
        }]
      },
      {
        test: /\.md$/,
        use: [
          { loader: 'raw-loader' }
        ]
      }
    ]
  },
  optimization: {
    // Do not emit compiled assets that include errors
    noEmitOnErrors: true,

    // Prints more readable module names in the browser console on HMR updates
    namedModules: true
  },
  plugins: [
    // Defines global variables
    new webpack.DefinePlugin(GLOBALS),

    // Extracts the imported Sass dependencies into a single CSS file
    new MiniCssExtractPlugin({
      ignoreOrder: false,
      filename: process.env.NODE_ENV !== 'production' ? '[name].css' : '[name].[hash].css',
      chunkFilename: process.env.NODE_ENV !== 'production' ? '[id].css' : '[id].[hash].css'
    })
  ]
};
