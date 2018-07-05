import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'raf/polyfill'; // requestAnimationFrame Polyfill

Enzyme.configure({ adapter: new Adapter() });

sinonStubPromise(sinon);
chai.use(chaiEnzyme());
chai.use(sinonChai);

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();

// Find all tests that live in the packages folder and load them into the runner
// (excluding those which may be present in the node_modules of a given package)
const testsContext = require.context('../src', true, /^((?!node_modules).)*[.]spec[.]js$/im);
testsContext.keys().forEach(testsContext);
