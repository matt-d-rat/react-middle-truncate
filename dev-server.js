// Creates a hot reloading development environment
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const historyApiFallback = require('connect-history-api-fallback');
const config = require('./config/webpack.dev.config');

const app = express();
const compiler = webpack(config);

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

function log() {
  arguments[0] = '\nWebpack: ' + arguments[0];
  console.log.apply(console, arguments); // eslint-disable-line no-console
}

app.use(historyApiFallback({
  verbose: false
}));

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  stats: {
    assets: true,
    colors: true,
    chunks: true,
    children: false
  },
  historyApiFallback: true,
  disableHostCheck: true
}));

app.use(webpackHotMiddleware(compiler));

app.listen(port, host, (err) => {
  if (err) {
    log(err);
    return;
  }

  log('🚀 Kappa Boilerplate is listening at http://%s:%s', host, port);
});
