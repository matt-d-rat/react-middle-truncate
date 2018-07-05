const chai = require('chai');
const chaiEnzyme = require('chai-enzyme');
const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
const sinonChai = require('sinon-chai');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

require('raf/polyfill'); // requestAnimationFrame Polyfill for React 16

Enzyme.configure({ adapter: new Adapter() });

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
