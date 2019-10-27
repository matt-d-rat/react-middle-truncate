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
  let onResizeSpy;
  let parseTextForTruncationSpy;

  beforeEach(function() {
    // Stub out the calculateMeasurements method so that we can control the execution path of the tests.
    calculateMeasurementsStub = sinon.stub(MiddleTruncate.prototype, 'calculateMeasurements');

    // Spy on methods so we can assert certain behaviors
    onResizeSpy = sinon.spy(MiddleTruncate.prototype, 'onResize');
    parseTextForTruncationSpy = sinon.spy(MiddleTruncate.prototype, 'parseTextForTruncation');

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
    // Restore the spies and stubs
    calculateMeasurementsStub.restore();
    onResizeSpy.restore();
    parseTextForTruncationSpy.restore();

    component = null;
    calculateMeasurementsStub = null;
    onResizeSpy = null;
    parseTextForTruncationSpy = null;
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
    let clock;

    beforeEach(function() {
      // Control the timers so that we can advance the clock to trigger the debounced functions
      clock = sinon.useFakeTimers();

      // Unmount the component, so that we can test the mounting of the component in the suites below
      component.unmount();
    });

    afterEach(function() {
      // Restore the timers
      clock.restore();
      clock = null;
    });

    context('when the text fits within the available space', function() {
      beforeEach(function() {
        calculateMeasurementsStub.returns(TEST_TEXT_FITS);
        component.mount();

        // Advance the timer so the debounced parseTextForTruncation is executed
        clock.tick(1);
      });

      it('should NOT truncate the text', function() {
        expect(component.state('truncatedText')).to.equal('0123456789');
      });
    });

    context('when the available space is smaller than the ellipsis width', function() {
      beforeEach(function() {
        calculateMeasurementsStub.returns(TEST_ELLIPSIS_OVERFLOWS);
        component.mount();

        // Advance the timer so the debounced parseTextForTruncation is executed
        clock.tick(1);
      });

      it('should truncate the text', function() {
        expect(component.state('truncatedText')).to.equal('...');
      });
    });

    context('when the text overflows the available space', function() {
      beforeEach(function() {
        calculateMeasurementsStub.returns(TEST_TEXT_OVERFLOWS);
        component.mount();

        // Advance the timer so the debounced parseTextForTruncation is executed
        clock.tick(1);
      });

      it('should truncate the text', function() {
        expect(component.state('truncatedText')).to.equal('012...789');
      });

      context('and the start prop is set to an integer', function() {
        beforeEach(function() {
          component.setProps({ start: 4 });
          component.unmount();
          component.mount();

          // Advance the timer so the debounced parseTextForTruncation is executed
          clock.tick(1);
        });

        it('should truncate the text, preserving the start by the specified number of characters', function() {
          expect(component.state('truncatedText')).to.equal('0123...789');
        });
      });

      context('and the end prop is set to an integer', function() {
        beforeEach(function() {
          component.setProps({ end: 4 });
          component.unmount();
          component.mount();

          // Advance the timer so the debounced parseTextForTruncation is executed
          clock.tick(1);
        });

        it('should truncate the text, preserving the end by the specified number of characters', function() {
          expect(component.state('truncatedText')).to.equal('012...6789');
        });
      });

      context('and the start prop is set to a RegExp', function() {
        beforeEach(function() {
          component.setProps({ start: /^\d{4}/ });
          component.unmount();
          component.mount();

          // Advance the timer so the debounced parseTextForTruncation is executed
          clock.tick(1);
        });

        it('should truncate the text, preserving the start as matched by the regular expression', function() {
          expect(component.state('truncatedText')).to.equal('0123...789');
        });
      });

      context('and the end prop is set to a RegExp', function() {
        beforeEach(function() {
          component.setProps({ end: /\d{4}$/ });
          component.unmount();
          component.mount();

          // Advance the timer so the debounced parseTextForTruncation is executed
          clock.tick(1);
        });

        it('should truncate the text, preserving the end as matched by the regular expression', function() {
          expect(component.state('truncatedText')).to.equal('012...6789');
        });
      });

      context('and the start and end props are used in conjunction', function() {
        beforeEach(function() {
          component.setProps({ start: 4, end: /\d{4}$/ });
          component.unmount();
          component.mount();

          // Advance the timer so the debounced parseTextForTruncation is executed
          clock.tick(1);
        });

        it('should truncate the text, preserving the start and the end accordingly', function() {
          expect(component.state('truncatedText')).to.equal('0123...6789');
        });
      });
    });

    context('when the window is resized', function() {
      beforeEach(function() {
        calculateMeasurementsStub.returns(TEST_TEXT_OVERFLOWS);
        component.mount();

        // Advance the timer so the debounced parseTextForTruncation is executed
        clock.tick(1);

        // Reset the spy calls which would have been called on mount
        parseTextForTruncationSpy.resetHistory();
        onResizeSpy.resetHistory();

        // Dispatch a resize event on the window
        window.dispatchEvent(new Event('resize'));
      });

      context('and the component remains mounted', function() {
        beforeEach(function() {
          const onResizeDebounceMs = component.prop('onResizeDebounceMs');

          // Advance the clock by the amount specified for the `onResize` debounce
          clock.tick(onResizeDebounceMs + 1);
        });

        it('should call the debounced `onResize` handler', function() {
          onResizeSpy.should.have.been.called;
        });

        it('should call the debounced `parseTextForTruncation` handler', function() {
          parseTextForTruncationSpy.should.have.been.called;
        });

        it('should call the debounced `parseTextForTruncation` handler with the correct arguments', function() {
          const text = component.prop('text');
          parseTextForTruncationSpy.should.have.been.calledWith(text);
        });
      });

      context('and the component is unmounted before the `onResize` handler is called', function() {
        beforeEach(function() {
          const onResizeDebounceMs = component.prop('onResizeDebounceMs');

          component.unmount();

          // Advance the clock by the amount specified for the `onResize` debounce
          clock.tick(onResizeDebounceMs);
        });

        it('should NOT call the debounced `onResize` handler', function() {
          onResizeSpy.should.not.have.been.called;
        });

        it('should NOT call the debounced `parseTextForTruncation` handler', function() {
          parseTextForTruncationSpy.should.not.have.been.called;
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
          component.mount();

          // Advance the timer so the debounced parseTextForTruncation is executed
          clock.tick(1);
        });

        context('and the text selection is a fractal', function() {
          beforeEach(function() {
            selection = new MockSelection('234');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);

            component.simulate('copy', clipboardEvent);
          });

          it('should not get the selected text', function() {
            getSelectionStub.should.not.have.been.calledOnce;
          });

          it('should not override the default copy behaviour', function() {
            clipboardEvent.clipboardData.setData.should.not.have.been.called;
          });
        });

        context('and the text selection is the entire truncated text', function() {
          beforeEach(function() {
            selection = new MockSelection('012...789');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);

            component.simulate('copy', clipboardEvent);
          });

          it('should not get the selected text', function() {
            getSelectionStub.should.not.have.been.calledOnce;
          });

          it('should not override the default copy behaviour', function() {
            clipboardEvent.clipboardData.setData.should.not.have.been.called;
          });
        });
      });

      context('smartCopy is set to "partial"', function() {
        beforeEach(function() {
          component.setProps({ smartCopy: 'partial' });
          component.mount();

          // Advance the timer so the debounced parseTextForTruncation is executed
          clock.tick(1);
        });

        context('and the text selection is a fractal', function() {
          beforeEach(function() {
            selection = new MockSelection('234');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);

            component.simulate('copy', clipboardEvent);
          });

          it('should get the selected text', function() {
            getSelectionStub.should.have.been.calledOnce;
            getSelectionStub.should.have.returned(selection);
          });

          it('should set the clipboardData value to the full untruncated text', function() {
            clipboardEvent.clipboardData.setData.should.have.been.calledWith('text/plain', component.prop('text'));
          });
        });

        context('and the text selection is the entire truncated text', function() {
          beforeEach(function() {
            selection = new MockSelection('012...789');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);

            component.simulate('copy', clipboardEvent);
          });

          it('should get the selected text', function() {
            getSelectionStub.should.have.been.calledOnce;
            getSelectionStub.should.have.returned(selection);
          });

          it('should set the clipboardData value to the full untruncated text', function() {
            clipboardEvent.clipboardData.setData.should.have.been.calledWith('text/plain', component.prop('text'));
          });
        });
      });

      context('smartCopy is set to "all"', function() {
        beforeEach(function() {
          component.setProps({ smartCopy: 'all' });
          component.mount();

          // Advance the timer so the debounced parseTextForTruncation is executed
          clock.tick(1);
        });

        context('and the text selection is a fractal', function() {
          beforeEach(function() {
            selection = new MockSelection('234');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);

            component.simulate('copy', clipboardEvent);
          });

          it('should get the selected text', function() {
            getSelectionStub.should.have.been.calledOnce;
            getSelectionStub.should.have.returned(selection);
          });

          it('should not override the default copy behaviour', function() {
            clipboardEvent.clipboardData.setData.should.not.have.been.called;
          });
        });

        context('and the text selection is the entire truncated text', function() {
          beforeEach(function() {
            selection = new MockSelection('012...789');
            selectedText = selection.toString();

            getSelectionStub.returns(selection);
            clipboardEvent = new MockClipboardEvent(selectedText);

            component.simulate('copy', clipboardEvent);
          });

          it('should get the selected text', function() {
            getSelectionStub.should.have.been.calledOnce;
            getSelectionStub.should.have.returned(selection);
          });

          it('should set the clipboardData value to the full untruncated text', function() {
            clipboardEvent.clipboardData.setData.should.have.been.calledWith('text/plain', component.prop('text'));
          });
        });
      });
    });
  });
});
