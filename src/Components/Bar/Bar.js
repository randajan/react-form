import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from '@randajan/jetpack';

import cssfile from "./bar.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Bar extends Component {

  static propTypes = {
    value: PropTypes.number,
    flags: PropTypes.object
  }

  static defaultProps = {
    value: 0,
    flags:{}
  }

  static defaultFlags = {
    inverted:p=>p.props.inverted,
    vertical:p=>p.props.vertical
  }

  fetchSelfProps() {
    const { id, title, className, flags} = this.props;
    return {
      id, title,
      className:css.get("Bar",  className),
      "data-flag":jet.react.fetchFlags({...Bar.defaultFlags, ...flags}, this)
    }
  }

  fetchMarkProps() {
    const { vertical, inverted, value } = this.props;
    const stickTo = vertical ? (inverted ? "bottom" : "top") : (inverted ? "right" : "left");
    return {
      className:css.get("mark"),
      style:{
        width:(vertical?1:value)*100+"%",
        height:(vertical?value:1)*100+"%",
        [stickTo]:0
      }
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div {...this.fetchSelfProps()}>
        <div {...this.fetchMarkProps()}/>
        {children ? <div className={css.get("caption")}>{children}</div>: null}
      </div>
    );
  }
}

export default Bar;
