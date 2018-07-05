const chai = require('chai');
const chaiEnzyme = require('chai-enzyme');
const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
const sinonChai = require('sinon-chai');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

// Using this published fork of enzyme and react 16 adapter to resolve https://github.com/airbnb/enzyme/pull/1513
// while waiting for next release. Limited only to containers/app/app.spec.js which rely on React.context.
const PisanoEnzyme = require('@pisano/enzyme');
const PisanoAdapter = require('@pisano/enzyme-adapter-react-16');

PisanoEnzyme.configure({ adapter: new PisanoAdapter() });

sinonStubPromise(sinon);

require('jsdom-global')(undefined, { runScripts: 'outside-only' });

global.sinon = sinon;
global.expect = chai.expect;
global.HTMLElement = typeof window.HTMLElement === 'undefined' ? () => {} : window.HTMLElement;

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

// Mock canvas
window.HTMLCanvasElement.prototype.getContext = () => ({
  measureText: () => ({ width: 100 })
});

window.getSelection = () => ({})

// requestAnimationFrame Polyfill for React 16
require('raf/polyfill');
