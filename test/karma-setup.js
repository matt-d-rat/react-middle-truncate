import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// Using this published fork of enzyme and react 16 adapter to resolve https://github.com/airbnb/enzyme/pull/1513
// while waiting for next release. Limited only to containers/app/app.spec.js which rely on React.context.
import PisanoEnzyme from '@pisano/enzyme';
import PisanoAdapter from '@pisano/enzyme-adapter-react-16';

PisanoEnzyme.configure({ adapter: new PisanoAdapter() });

sinonStubPromise(sinon);
chai.use(chaiEnzyme());
chai.use(sinonChai);

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();

// requestAnimationFrame Polyfill
import 'raf/polyfill';

// Find all tests that live in the packages folder and load them into the runner
// (excluding those which may be present in the node_modules of a given package)
const testsContext = require.context('../src', true, /^((?!node_modules).)*[.]spec[.]js$/im);
testsContext.keys().forEach(testsContext);
