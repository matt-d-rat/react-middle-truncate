const path = require('path');

const SRC_PATH = path.join(__dirname, '/../src');
const OUTPUT_PATH = path.join(__dirname, '/../build');
const LIB_PATH = path.join(__dirname, '/../lib');
const DEMO_PATH = path.join(__dirname, '/../demo');

module.exports = {
  name: 'react-middle-truncate',
  path: {
    // The src path to our application
    src: SRC_PATH,

    // The build path to where our bundle will be output for dev
    output: OUTPUT_PATH,

    // The build path to where our library bundle will be output for dist
    lib: LIB_PATH,

    // The build path to where our demo bundle will be output for dist
    demo: DEMO_PATH
  },
  globals: {},
  vendor: [
    'classnames',
    'lodash',
    'measure-text',
    'react',
    'react-dom',
    'units-css'
  ]
};
