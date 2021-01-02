import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/react-jetpack";

import Flagable from "../../Dummy/Flagable";

import cssfile from "./Bar.scss";
import csslib from "../../css";

class Bar extends Flagable {

  static css = csslib.open(cssfile);
  static className = "Bar";

  static defaultProps = {
    ...Flagable.defaultProps,
    value: 0,
    from: 0,
    to: 100,
  }

  static defaultFlags = {
    inverted:p=>p.props.inverted,
    vertical:p=>p.props.vertical,
    marker:p=>!!p.props.marker
  }

  valueToRatio(value) {
    const props = this.props;
    return jet.num.toRatio(this.validateValue(value), props.from, props.to);
  }

  validateValue(value) {
    const { from, to, min, max, step } = this.props;
    const n = jet.num.tap(min, Math.min(from, to), 0);
    const m = jet.num.tap( max, Math.max(from, to), 100);
    value = jet.type.is.full(value) ? jet.num.to(value) : from;
    return step ? jet.num.snap(value, step, n, m) : jet.num.frame(value, n, m);
  }

  fetchPropsMark() {
    const { vertical, inverted, marker, value, to, from, min, max } = this.props;
    const stickTo = vertical ? (inverted ? "bottom" : "top") : (inverted ? "right" : "left");
    
    const ratio = this.valueToRatio(value);

    return {
      className:this.css.get("mark"),
      children:marker,
      style:{
        width:(vertical?1:ratio)*100+"%",
        height:(vertical?ratio:1)*100+"%",
        pointerEvents:"none",
        [stickTo]:0,
      }
    }
  }

  render() {
    const { children, marker } = this.props;
    return (
      <div {...this.fetchPropsSelf()}>
        <div className={this.css.get("unmark")}>{marker || null}</div>
        <div {...this.fetchPropsMark()}/>
        {children ? <div className={this.css.get("caption")}>{children}</div>: null}
      </div>
    );
  }
}

export default Bar;
