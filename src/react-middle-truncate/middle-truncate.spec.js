import React from 'react';
import { mount } from 'enzyme';
import units from 'units-css';
import MiddleTruncate from './middle-truncate';

const TEST_TEXT_FITS = {
  component: { width: units.parse('100px'), height: units.parse('20px') },
  ellipsis: { width: units.parse('10px'), height: units.parse('20px') },
  text: { width: units.parse('80px'), height: units.parse('20px') }
};

const TEST_TEXT_OVERFLOWS = {
  component: { width: units.parse('80px'), height: units.parse('20px') },
  ellipsis: { width: units.parse('10px'), height: units.parse('20px') },
  text: { width: units.parse('100px'), height: units.parse('20px') }
};

const TEST_ELLIPSIS_OVERFLOWS = {
  component: { width: units.parse('4px'), height: units.parse('20px') },
  ellipsis: { width: units.parse('10px'), height: units.parse('20px') },
  text: { width: units.parse('100px'), height: units.parse('20px') }
};

function MockSelection(str) {
  this.selectedText = str;
}

MockSelection.prototype.toString = function() {
  return this.selectedText;
};

function MockClipboardEvent(data, options = { dataType: 'text/plain', bubbles: true, cancelable: false }) {
  this.data = data;
  this.dataType = options.dataType;
  this.bubbles = options.dataType;
  this.cancelable = options.dataType;

  this.clipboardData = {
    setData: sinon.stub()
  };
}

describe('MiddleTruncate component', function() {
  let component;
  let calculateMeasurementsStub;

  beforeEach(function() {
    // Stub out the calculateMeasurements method so that we can control the execution path of the tests.
    calculateMeasurementsStub = sinon.stub(MiddleTruncate.prototype, 'calculateMeasurements');

    // Set the default behaviour of the calculateMeasurementsStub
    calculateMeasurementsStub.returns(TEST_TEXT_FITS);

    component = mount(
      <MiddleTruncate
        className="test"
        text="0123456789"
      />
    );
  });

  afterEach(function() {
    component = null;
    calculateMeasurementsStub.restore();
  });

  describe('#rendering', function() {
    it('should be a function', function() {
      expect(MiddleTruncate).to.be.a('function');
    });

    it('should render a div as the root node', function() {
      expect(component).to.have.type(MiddleTruncate);
    });

    it('should pass the className prop to the root node of the component', function() {
      expect(component).to.have.className('test');
    });

    it('should render a hidden text span', function() {
      const node = component.ref('text');

      expect(node).to.exist;
      expect(node.innerHTML).to.equal('0123456789');
    });

    it('should render a hidden ellipsis span', function() {
      const node = component.ref('ellipsis');

      expect(node).to.exist;
      expect(node.innerHTML).to.equal('...');
    });

    it('should render the custom ellipsis provided via props', function() {
      const ellipsis = '😎';
      component.setProps({ ellipsis });

      const node = component.ref('ellipsis');
      expect(node.innerHTML).to.equal(ellipsis);
    });
  });

  describe('#behaviour', function() {
    context('when the text fits within the available space', function() {
      beforeEach(function() {
        calculateMeasurementsStub.returns(TEST_TEXT_FITS);
        component.unmount();
        component.mount();
      });

      it('should NOT truncate the text', function(done) {
        // parseTextForTruncation is a debounced function, make the test async
        setTimeout(() => {
          expect(component.state('truncatedText')).to.equal('0123456789');
          done();
        }, 10);
      });
    });

    context('when the available space is smaller than the ellipsis width', function() {
      beforeEach(function() {
        calculateMeasurementsStub.returns(TEST_ELLIPSIS_OVERFLOWS);
        component.unmount();
        component.mount();
      });

      it('should truncate the text', function(done) {
        // parseTextForTruncation is a debounced function, make the test async
        setTimeout(() => {
          expect(component.state('truncatedText')).to.equal('...');
          done();
        }, 10);
      });
    });

    context('when the text overflows the available space', function() {
      beforeEach(function() {
        calculateMeasurementsStub.returns(TEST_TEXT_OVERFLOWS);
        component.unmount();
        component.mount();
      });

      it('should truncate the text', function(done) {
        // parseTextForTruncation is a debounced function, make the test async
        setTimeout(() => {
          expect(component.state('truncatedText')).to.equal('012...789');
          done();
        }, 10);
      });

      context('and the start prop is set to an integer', function() {
        beforeEach(function() {
          component.setProps({ start: 4 });
          component.unmount();
          component.mount();
        });

        it('should truncate the text, preserving the start by the specified number of characters', function(done) {
          // parseTextForTruncation is a debounced function, make the test async
          setTimeout(() => {
            expect(component.state('truncatedText')).to.equal('0123...789');
            done();
          }, 10);
        });
      });

      context('and the end prop is set to an integer', function() {
        beforeEach(function() {
          component.setProps({ end: 4 });
          component.unmount();
          component.mount();
        });

        it('should truncate the text, preserving the end by the specified number of characters', function(done) {
          // parseTextForTruncation is a debounced function, make the test async
          setTimeout(() => {
            expect(component.state('truncatedText')).to.equal('012...6789');
            done();
          }, 10);
        });
      });

      context('and the start prop is set to a RegExp', function() {
        beforeEach(function() {
          component.setProps({ start: /^\d{4}/ });
          component.unmount();
          component.mount();
        });

        it('should truncate the text, preserving the start as matched by the regular expression', function(done) {
          // parseTextForTruncation is a debounced function, make the test async
          setTimeout(() => {
            expect(component.state('truncatedText')).to.equal('0123...789');
            done();
          }, 10);
        });
      });

      context('and the end prop is set to a RegExp', function() {
        beforeEach(function() {
          component.setProps({ end: /\d{4}$/ });
          component.unmount();
          component.mount();
        });

        it('should truncate the text, preserving the end as matched by the regular expression', function(done) {
          // parseTextForTruncation is a debounced function, make the test async
          setTimeout(() => {
            expect(component.state('truncatedText')).to.equal('012...6789');
            done();
          }, 10);
        });
      });

      context('and the start and end props are used in conjunction', function() {
        beforeEach(function() {
          component.setProps({ start: 4, end: /\d{4}$/ });
          component.unmount();
          component.mount();
        });

        it('should truncate the text, preserving the start and the end accordingly', function(done) {
          // parseTextForTruncation is a debounced function, make the test async
          setTimeout(() => {
            expect(component.state('truncatedText')).to.equal('0123...6789');
            done();
          }, 10);
        });
      });
    });

    context('when the user selects and copies the rendered text to the clipboard', function() {
      let getSelectionStub;
      let clipboardEvent;
      let selection;
      let selectedText;

      beforeEach(function() {
        getSelectionStub = sinon.stub(window, 'getSelection');
        calculateMeasurementsStub.returns(TEST_TEXT_OVERFLOWS);
      });

      afterEach(function() {
        getSelectionStub.restore();

        clipboardEvent = null;
        selection = null;
        selectedText = null;
      });

      context('smartCopy is set to false', function() {
        beforeEach(function() {
          component.setProps({ smartCopy: false });
          component.unmount();
          component.mount();
        });

        context('and the text selection is a fractal', function() {
          beforeEach(function() {
            selection = new MockSelection('234');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);
          });

          it('should not get the selected text', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);

              getSelectionStub.should.not.have.been.calledOnce;
              done();
            }, 10);
          });

          it('should not override the default copy behaviour', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);
              clipboardEvent.clipboardData.setData.should.not.have.been.called;
              done();
            }, 10);
          });
        });

        context('and the text selection is the entire truncated text', function() {
          beforeEach(function() {
            selection = new MockSelection('012...789');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);
          });

          it('should not get the selected text', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);

              getSelectionStub.should.not.have.been.calledOnce;
              done();
            }, 10);
          });

          it('should not override the default copy behaviour', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);
              clipboardEvent.clipboardData.setData.should.not.have.been.called;
              done();
            }, 10);
          });
        });
      });

      context('smartCopy is set to "partial"', function() {
        beforeEach(function() {
          component.setProps({ smartCopy: 'partial' });
          component.unmount();
          component.mount();
        });

        context('and the text selection is a fractal', function() {
          beforeEach(function() {
            selection = new MockSelection('234');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);
          });

          it('should get the selected text', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);

              getSelectionStub.should.have.been.calledOnce;
              getSelectionStub.should.have.returned(selection);
              done();
            }, 10);
          });

          it('should set the clipboardData value to the full untruncated text', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);
              clipboardEvent.clipboardData.setData.should.have.been.calledWith('text/plain', component.prop('text'));
              done();
            }, 10);
          });
        });

        context('and the text selection is the entire truncated text', function() {
          beforeEach(function() {
            selection = new MockSelection('012...789');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);
          });

          it('should get the selected text', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);

              getSelectionStub.should.have.been.calledOnce;
              getSelectionStub.should.have.returned(selection);
              done();
            }, 10);
          });

          it('should set the clipboardData value to the full untruncated text', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);
              clipboardEvent.clipboardData.setData.should.have.been.calledWith('text/plain', component.prop('text'));
              done();
            }, 10);
          });
        });
      });

      context('smartCopy is set to "all"', function() {
        beforeEach(function() {
          component.setProps({ smartCopy: 'all' });
          component.unmount();
          component.mount();
        });

        context('and the text selection is a fractal', function() {
          beforeEach(function() {
            selection = new MockSelection('234');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);
          });

          it('should get the selected text', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);

              getSelectionStub.should.have.been.calledOnce;
              getSelectionStub.should.have.returned(selection);
              done();
            }, 10);
          });

          it('should not override the default copy behaviour', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);
              clipboardEvent.clipboardData.setData.should.not.have.been.called;
              done();
            }, 10);
          });
        });

        context('and the text selection is the entire truncated text', function() {
          beforeEach(function() {
            selection = new MockSelection('012...789');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);
          });

          it('should get the selected text', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);

              getSelectionStub.should.have.been.calledOnce;
              getSelectionStub.should.have.returned(selection);
              done();
            }, 10);
          });

          it('should set the clipboardData value to the full untruncated texr', function(done) {
            // parseTextForTruncation is a debounced function, make the test async
            setTimeout(() => {
              component.simulate('copy', clipboardEvent);
              clipboardEvent.clipboardData.setData.should.have.been.calledWith('text/plain', component.prop('text'));
              done();
            }, 10);
          });
        });
      });
    });
  });
});
