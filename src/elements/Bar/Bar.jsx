import React from 'react';

import jet from "@randajan/jet-react";

import { Flagable } from "../../components/Flagable";

import "./Bar.scss";
import { cn } from '../../css';

export class Bar extends Flagable {

  static className = "Bar";

  static customProps = [
    ...Flagable.customProps,
    "children", "value", "from", "to", "marker", "inverted", "vertical"
];

  static defaultProps = {
    ...Flagable.defaultProps,
    value: 0,
    from: 0,
    to: 100,
  }

  static defaultFlags = {
    ...Flagable.defaultFlags,
    inverted:p=>p.props.inverted,
    vertical:p=>p.props.vertical,
    marker:p=>!!p.props.marker
  }

  valueToRatio(value) {
    const props = this.props;
    return Number.jet.toRatio(this.validateValue(value), props.from, props.to);
  }

  validateValue(value) {
    const { from, to, min, max, step } = this.props;
    const n = Number.jet.tap(min, Math.min(from, to), 0);
    const m = Number.jet.tap( max, Math.max(from, to), 100);
    value = jet.isFull(value) ? Number.jet.to(value) : from;
    return step ? Number.jet.snap(value, step, n, m) : Number.jet.frame(value, n, m);
  }

  fetchPropsMark() {
    const { vertical, inverted, marker, value, to, from, min, max } = this.props;
    const stickTo = vertical ? (inverted ? "bottom" : "top") : (inverted ? "right" : "left");
    
    const ratio = this.valueToRatio(value);

    return {
      className:cn("mark"),
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
      <div {...this.fetchProps()}>
        <div className={cn("unmark")}>{marker || null}</div>
        <div {...this.fetchPropsMark()}/>
        {children ? <div className={cn("caption")}>{children}</div>: null}
      </div>
    );
  }
}