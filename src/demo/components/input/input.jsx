import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './input.scss';

class Input extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.any
  };

  static defaultProps = {
    className: '',
    label: '',
    name: null,
    onChange: () => {},
    placeholder: '',
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
    const { className, label, name, placeholder, ...otherProps } = this.props;
    const { value } = this.state;

    const _className = classnames(
      styles.component,
      className
    );

    return (
      <div className={_className}>
        <input
          { ...otherProps }
          { ...name && {id: name, name: name } }
          type="text"
          placeholder={placeholder}
          onChange={this.handleOnChange}
          value={value}
          className={styles.input} />

        <label
          { ...name && { htmlFor: name} }
          className={styles.label}>{label}</label>
      </div>
    );
  }
}

export default Input;
export { Input };
