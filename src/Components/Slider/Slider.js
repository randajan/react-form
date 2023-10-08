import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";

import Valuable from '../../Dummy/Valuable';

import "./Slider.scss";
import { cn } from '../../css';



class Slider extends Valuable {

  static className = "Slider";

  static propTypes = {
    ...Valuable.propTypes,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    inverted: PropTypes.bool,
    vertical: PropTypes.bool,
    shiftSubmit: PropTypes.bool
  }

  static defaultProps = {
    ...Valuable.defaultProps,
    step: 1,
    from: 0,
    to: 100,
    inverted:false,
    vertical:false,
    shiftSubmit:true
  }

  static defaultFlags = {
    ...Valuable.defaultFlags,
    vertical:p=>p.props.vertical,
    inverted:p=>p.props.inverted,
    shifting:p=>p.state.shifting,
  }

  boundToRatio(bound) {
    const { vertical, inverted } = this.props;
    const ratio = vertical ? bound.relY : bound.relX;
    return inverted ? 1-ratio : ratio;
  }

  ratioToBound(ratio) {
    const { vertical, inverted } = this.props;
    const bound = inverted ? 1-ratio : ratio;
    return { relX:vertical?.5:bound, relY:vertical?bound:.5 }
  }

  valueToRatio(value) {
    const props = this.props;
    return Number.jet.toRatio(this.validateValue(value), props.from, props.to);
  }
  ratioToValue(ratio) {
    const props = this.props;
    return this.validateValue(Number.jet.fromRatio(ratio, props.from, props.to));
  }

  valueToBound(value) { return this.ratioToBound(this.valueToRatio(value)); }
  boundToValue(bound) { return this.ratioToValue(this.boundToRatio(bound)); }

  draft() {
    const { relX, relY } = this.valueToBound(this.state.input);
    this.cleanUp.add(Element.jet.drag(this.pin, this.handleShift.bind(this), {autoPick:true, initX:relX, initY:relY,}));
  }

  draw() {
    const { relX, relY } = this.valueToBound(this.state.input);
    this.pin.style.left = (relX*100)+"%";
    this.pin.style.top = (relY*100)+"%";
    if (this.state.focus) { this.pin.focus(); } else { this.pin.blur(); } //sync state with reality
  }

  validateValue(value) {
    const { from, to, min, max, step } = this.props;
    const n = Number.jet.tap(min, Math.min(from, to), 0);
    const m = Number.jet.tap(max, Math.max(from, to), 100);
    value = jet.isFull(value) ? Number.jet.to(value) : from;
    return step ? Number.jet.snap(value, step, n, m) : Number.jet.frame(value, n, m);
  }

  validateState(to, from) {
    const { shiftSubmit, onShift } = this.props;
    if (to.shifting) { to.focus = true; }
    if (shiftSubmit && to.shifting === false) { to.output = Number.jet.tap(to.input, from.input); }
    to = super.validateState(to, from);
    if (to.shifting != from.shifting) { this.effect.run(_=>jet.run(onShift, to.shifting)); }
    return to;
  }

  handleShift(ev, bound) {
    const shifting = bound.state === "start" || bound.state === "move";
    const input = this.boundToValue(bound);
    const {relX, relY} = this.valueToBound(input);
    bound.relX = relX; bound.relY = relY;
    this.setState({ shifting, input });
    //Event.jet.cut(ev);
  }

  handleKeyDown(ev) {
    const { onKeyDown, step, inverted, vertical, lock, from, to } = this.props;
    const k = ev.keyCode, inv = (((inverted !== from > to) !== vertical)*2-1);
    if (lock) { return ev.preventDefault(); }
    if (onKeyDown && onKeyDown(this, ev) === false) { return; }
    else if (ev.isDefaultPrevented()) { return; }

    if (k === 27) { if (this.getInput() === this.getOutput()) { this.blur() } else { this.undo(); } } //escape 
    else if (k === 13) { this.blur(); } //not enter
    else if (k === 37 || k === 40) { this.setInput(this.getInput()+(inv*step)); }
    else if (k === 39 || k === 38) { this.setInput(this.getInput()-(inv*step)); }
    else { return; }

    ev.preventDefault();
  }

  fetchPropsPin() {
    const { focus, tabIndex, flags } = this.props;
    const { lock } = this.state;
    return {
      className:cn("pin"), autoFocus:focus, type:"button",
      readOnly:lock, disabled:lock, tabIndex:lock?-1:tabIndex,
      onFocus: this.focus.bind(this),
      onBlur: this.blur.bind(this),
      onKeyDown: this.handleKeyDown.bind(this),
      "data-flags":Component.jet.flags({...this.constructor.defaultFlags, ...flags}, this),
      ref:pin=>this.pin=pin
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div {...this.fetchPropsSelf()}>
        <button {...this.fetchPropsPin()}>{children}</button>
      </div>
    );
  }
}

export default Slider;
