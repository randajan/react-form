import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Proper from "../../Helpers/Proper";

import css from "./Bar.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

class Bar extends Component {

  static propTypes = {
    value: PropTypes.number
  }

  static defaultProps = {
    value: 0
  }

  static defaultFlags = {
    inverted:p=>p.props.inverted,
    vertical:p=>p.props.vertical
  }

  fetchSelfProps() {
    const { id, title, className, flags} = this.props;
    return {
      id, title,
      className:CN.get("Bar",  className),
      "data-flag":ClassNames.fetchFlags([Bar.defaultFlags, flags], this).joins(" ")
    }
  }

  fetchMarkProps() {
    const { vertical, inverted, value } = this.props;
    const stickTo = vertical ? (inverted ? "bottom" : "top") : (inverted ? "right" : "left");
    return {
      className:CN.get("mark"),
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
        {children ? <div className={CN.get("caption")}>{children}</div>: null}
      </div>
    );
  }
}

export default Bar;
