import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './app.scss';

import Input from 'components/input';
import Range from 'components/range';
import MiddleTruncate from 'lib';

class App extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  state = {
    start: /Lorem\sipsum/,
    end: 5,
    width: 55,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer risus ante, molestie eu ex suscipit, mollis pellentesque metus.',
    ellipsis: '...'
  }

  onDemoTextChange = (event) => {
    this.setState({
      text: event.target.value
    });
  }

  onDemoStartChange = (event) => {
    this.setState({
      start: event.target.value
    }, () => {
      window.dispatchEvent( new Event('resize') );
    });
  }

  onDemoEndChange = (event) => {
    this.setState({
      end: event.target.value
    }, () => {
      window.dispatchEvent( new Event('resize') );
    });
  }

  onDemoWidthChange = (event) => {
    this.setState({
      width: event.target.value
    }, () => {
      window.dispatchEvent( new Event('resize') );
    });
  }

  onDemoEllipsisChange = (event) => {
    this.setState({
      ellipsis: event.target.value
    }, () => {
      window.dispatchEvent( new Event('resize') );
    });
  }

  render() {
    const { className } = this.props;
    const { start, end, width, text, ellipsis } = this.state;

    const _className = classnames(
      styles.root,
      className
    );

    const demoStyle = {
      width: `${width}%`
    };

    return (
      <div className={_className}>
        <header className={classnames(styles.header)}>
          <Input
            name="demoText"
            label="Text to Truncate"
            onChange={this.onDemoTextChange}
            placeholder="Enter a long string into this box to see it rendered below."
            value={text}
            className={classnames(styles['header-input'])} />

          <Input
            name="demoStart"
            label="Start"
            onChange={this.onDemoStartChange}
            placeholder="Number or RegExp to preserve start of the text."
            value={start}
            className={classnames(styles['header-input'])} />

          <Input
            name="demoEnd"
            label="End"
            onChange={this.onDemoEndChange}
            placeholder="Number or RegExp to preserve end of the text."
            value={end}
            className={classnames(styles['header-input'])} />

          <Input
            name="demoEllipsis"
            label="Ellipsis"
            required
            onChange={this.onDemoEllipsisChange}
            placeholder="The ellipsis to use when the text is truncated."
            value={ellipsis}
            className={classnames(styles['header-input'])} />
        </header>

        <section className={classnames(styles.section)}>
          <div className={classnames(styles.controls)}>
            <div className={classnames(styles.widthText)}>width: {width}%</div>
          </div>

          {text && <div
            className={classnames(styles.demo)}
            style={demoStyle}>
            <MiddleTruncate
              start={start}
              end={end}
              text={text}
              ellipsis={ellipsis}
              smartCopy="all" />
          </div> }

          <div className={classnames(styles.controls)}>
            <Range
              name="demoWidth"
              onChange={this.onDemoWidthChange}
              min={30}
              max={100}
              value={width}
              step={1} />
          </div>

          <div className={classnames(styles.instructions)}>
            <p>Enter text to trucate in the input. Drag the slider above to increase/decrease the width
            of the parent container to see the middle truncation be applied.</p>

            <p>If you wish to preserve portions of the start and/or end of the text, you can enter either a
            numeric value, or a regular expression to find the character position to preserve up to.</p>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
export { App };
