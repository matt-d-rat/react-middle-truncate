import React, { PureComponent } from 'react';
import { debounce, toFinite } from 'lodash';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import measureText from './utils/measure-text';
import units from 'units-css';

const getStartOffset = (start, text) => {
  if (start === '' || start === null) {
    return 0;
  }

  if (!isNaN(parseInt(start, 10))) {
    return Math.round(toFinite(start));
  }

  const result = new RegExp(start).exec(text);
  return result ? result.index + result[0].length : 0;
};

const getEndOffset = (end, text) => {
  if (end === '' || end === null) {
    return 0;
  }

  if (!isNaN(parseInt(end, 10))) {
    return Math.round(toFinite(end));
  }

  const result = new RegExp(end).exec(text);
  return result ? result[0].length : 0;
};

// A React component for truncating text in the middle of the string.
//
// This component automatically calculates the required width and height of the text
// taking into consideration any inherited font and line-height styles, and compares it to
// the available space to determine whether to truncate or not.

// By default the component will truncate the middle of the text if
// the text would otherwise overflow using a position 0 at the start of the string,
// and position 0 at the end of the string.
//
// You can pass start and end props a number to offset this position, or alternatively
// a Regular Expression to calculate these positions dynamically against the text itself.
class MiddleTruncate extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    ellipsis: PropTypes.string,
    end: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(RegExp), PropTypes.string]),
    onResizeDebounceMs: PropTypes.number,
    smartCopy: PropTypes.oneOfType([PropTypes.oneOf(['partial', 'all']), PropTypes.bool]),
    start: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(RegExp), PropTypes.string]),
    style: PropTypes.object,
    text: PropTypes.string
  };

  static defaultProps = {
    className: '',
    ellipsis: '...',
    end: 0,
    onResizeDebounceMs: 100,
    smartCopy: 'all',
    start: 0,
    style: {},
    text: ''
  };

  constructor(props) {
    super(props);

    // Debounce the parsing of the text so that the component has had time to render its DOM for measurement calculations
    this.parseTextForTruncation = debounce(this.parseTextForTruncation.bind(this), 0);

    // Debounce the onResize handler
    this.onResize = debounce(this.onResize.bind(this), props.onResizeDebounceMs);
  }

  state = {
    truncatedText: this.props.text,
    start: getStartOffset(this.props.start, this.props.text),
    end: getEndOffset(this.props.end, this.props.text)
  };

  componentDidMount() {
    this.parseTextForTruncation(this.props.text);
    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      this.parseTextForTruncation(nextProps.text);
    }

    if (nextProps.start !== this.props.start) {
      this.setState({ start: getStartOffset(nextProps.start, nextProps.text) });
    }

    if (nextProps.end !== this.props.end) {
      this.setState({ end: getEndOffset(nextProps.end, nextProps.text) });
    }
  }

  componentWillUnmount() {
    // Cancel any pending debounced functions
    this.onResize.cancel();
    this.parseTextForTruncation.cancel();

    window.removeEventListener('resize', this.onResize);
  }

  onCopy = event => {
    const { smartCopy } = this.props;

    // If smart copy is not enabled, simply return and use the default behaviour of the copy event
    if (!smartCopy) {
      return;
    }

    const selectedText = window.getSelection().toString();

    // If smartCopy is set to partial or if smartCopy is set to all and the entire string was selected
    // copy the original full text to the user's clipboard
    if (smartCopy === 'partial' || (smartCopy === 'all' && selectedText === this.state.truncatedText)) {
      event.preventDefault();
      const clipboardData = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;

      clipboardData.setData('text/plain', this.props.text);
    }
  }

  onResize() {
    this.parseTextForTruncation(this.props.text);
  }

  getTextMeasurement = ref => {
    const node = findDOMNode(ref);
    const text = node.textContent;

    const {
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle
    } = window.getComputedStyle(node);

    const { width, height } = measureText({
      text,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      lineHeight: 1
    });

    return { width, height };
  }

  getComponentMeasurement = () => {
    const node = findDOMNode(this.refs.component);

    const offsetWidth = node && node.offsetWidth ? node.offsetWidth : 0;
    const offsetHeight = node && node.offsetHeight ? node.offsetHeight : 0;

    return {
      width: units.parse(offsetWidth, 'px'),
      height: units.parse(offsetHeight, 'px')
    };
  }

  calculateMeasurements() {
    return {
      component: this.getComponentMeasurement(),
      ellipsis: this.getTextMeasurement(this.refs.ellipsis),
      text: this.getTextMeasurement(this.refs.text)
    };
  }

  truncateText = measurements => {
    const { text, ellipsis } = this.props;
    const { start, end } = this.state;

    if (measurements.component.width.value <= measurements.ellipsis.width.value) {
      return ellipsis;
    }

    const delta = Math.ceil(measurements.text.width.value - measurements.component.width.value);
    const totalLettersToRemove = Math.ceil( delta / measurements.ellipsis.width.value);
    const middleIndex = Math.round(text.length / 2);

    const preserveLeftSide = text.slice(0, start);
    const leftSide = text.slice(start, middleIndex - totalLettersToRemove);
    const rightSide = text.slice(middleIndex + totalLettersToRemove, text.length - end);
    const preserveRightSide = text.slice(text.length - end, text.length);

    return `${preserveLeftSide}${leftSide}${ellipsis}${rightSide}${preserveRightSide}`;
  }

  parseTextForTruncation(text) {
    const measurements = this.calculateMeasurements();

    const truncatedText =
      Math.round(measurements.text.width.value) > Math.round(measurements.component.width.value)
        ? this.truncateText(measurements)
        : text;

    this.setState(() => ({ truncatedText }));
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { text, ellipsis, style, onResizeDebounceMs, smartCopy, ...otherProps } = this.props;
    const { truncatedText } = this.state;

    const componentStyle = {
      ...style,
      display: 'block',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    };

    const hiddenStyle = {
      display: 'none'
    };

    return (
      <div
        ref="component"
        style={componentStyle}
        onCopy={this.onCopy}
        {...otherProps}>
        <span ref="text" style={hiddenStyle}>{text}</span>
        <span ref="ellipsis" style={hiddenStyle}>{ellipsis}</span>

        { truncatedText }
      </div>
    );
  }
}

export default MiddleTruncate;
export { MiddleTruncate };
