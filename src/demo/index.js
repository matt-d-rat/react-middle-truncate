import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Redbox from 'redbox-react';
import 'raf/polyfill'; // requestAnimationFrame Polyfill

// Import the global scss file. These are the only global styles declared for the application.
// All other styles should be defined as component CSS-Module styles (ie: each component has its own associated .scss file)
import 'scss/index.scss';

// Import our main application container after global styles
import App from 'containers/app';

// Since we are using HtmlWebpackPlugin WITHOUT a template,
// we should create our own root node in the body element before rendering into it.
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

// Create a HMR enabled render function
const hmrRender = Component => {
  render(
    <AppContainer errorReporter={Redbox}>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

// Render our application to the DOM
hmrRender(App);

if (module.hot) {
  module.hot.accept('containers/app', () => {
    hmrRender(App);
  });
}
