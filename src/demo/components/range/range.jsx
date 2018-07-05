import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './range.scss';

class Range extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    name: PropTypes.string,
    onChange: PropTypes.func,
    step: PropTypes.number,
    value: PropTypes.any
  };

  static defaultProps = {
    className: '',
    min: 0,
    max: 100,
    name: null,
    onChange: () => {},
    step: 1,
    value: ''
  };

  state = {
    value: this.props.value
  };

  handleOnChange = (event) => {
    this.setState({
      value: event.target.value
    });

    this.props.onChange(event);
  };

  render() {
    const { className, min, max, step, ...otherProps } = this.props;
    const { value } = this.state;

    const _className = classnames(
      styles.component,
      className
    );

    return (
      <input
        { ...otherProps }
        { ...name && { id: name, name: name } }
        type="range"
        className={_className}
        min={min}
        max={max}
        onChange={this.handleOnChange}
        step={step}
        value={value} />
    );
  }
}

export default Range;
export { Range };
