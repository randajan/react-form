import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Valuable from '../../Dummy/Valuable';

import cssfile from "./Slider.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Slider extends Valuable {

  static className = "Slider";

  static propTypes = {
    ...Valuable.propTypes,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    inverted: PropTypes.bool,
    vertical: PropTypes.bool,
    autoSubmit: PropTypes.bool
  }

  static defaultProps = {
    ...Valuable.defaultProps,
    min: 0,
    max: 1,
    step: 0.01,
    inverted:false,
    vertical:false,
    autoSubmit:true
  }

  static defaultFlags = {
    ...Valuable.defaultFlags,
    vertical:p=>p.props.vertical,
    inverted:p=>p.props.inverted,
    shifting:p=>p.state.shifting,
  }
  
  static validateValue(props, value) {
    const { min, max, step } = props;
    const val = jet.num.to(value);
    return step ? jet.num.snap(val, step, min, max) : jet.num.frame(val, min, max);
  }

  static boundToValue(bound, props) {
    const value = props.vertical ? bound.relY : bound.relX;
    return Slider.validateValue(props, props.inverted ? 1-value : value);
  }

  static valueToBound(value, props) {
    const bound = props.inverted ? 1-value : value;
    return { relX:props.vertical?.5:bound, relY:props.vertical?bound:.5 }
  }


  draft() {
    const bound = Slider.valueToBound(this.state.input, this.props);
    this.cleanUp.add(jet.event.listenShift(this.body, this.handleShift.bind(this), bound.relX, bound.relY));
  }

  draw() {
    const { relX, relY } = Slider.valueToBound(this.state.input, this.props);
    const body = this.body;
    body.style.left = (relX*100)+"%";
    body.style.top = (relY*100)+"%";
    if (this.state.focus) { body.focus(); } else { body.blur(); } //sync state with reality
  }

  validateState(to, from) {
    const { autoSubmit, onShift } = this.props;
    if (to.shifting) { to.focus = true; }
    if (autoSubmit && to.shifting === false) { to.output = jet.get("number", to.input, from.input); }
    to = super.validateState(to, from);
    if (to.shifting != from.shifting) { jet.run(onShift, to.shifting); }
    return to;
  }

  handleShift(ev, bound) {
    const shifting = bound.state === "start" || bound.state === "move";
    const input = Slider.boundToValue(bound, this.props);
    const {relX, relY} = Slider.valueToBound(input, this.props);
    bound.relX = relX; bound.relY = relY;
    this.setState({ shifting, input });
  }

  handleKeyDown(ev) {
    const { onKeyDown, step, inverted, vertical, lock } = this.props;
    const k = ev.keyCode, inv = ((inverted !== vertical)*2-1);
    if (lock) { return jet.event.stop(ev); }
    if (onKeyDown && onKeyDown(this, ev) === false) { return; }
    else if (ev.isDefaultPrevented()) { return; }

    if (k === 27) { if (this.getInput() === this.getOutput()) { this.blur() } else { this.reject(); } } //escape 
    else if (k === 13) { this.blur(); } //not enter
    else if (k === 37 || k === 40) { this.setInput(this.getInput()+(inv*step)); }
    else if (k === 39 || k === 38) { this.setInput(this.getInput()-(inv*step)); }
    else { return; }

    jet.event.stop(ev);
  }

  fetchPropsSelf() {
    const { children, focus, tabIndex } = this.props;
    const { lock } = this.state;
    return {
      ...super.fetchPropsSelf(css),
      children, autoFocus:focus, type:"button",
      readOnly:lock, disabled:lock, tabIndex:lock?-1:tabIndex,
      onFocus: this.focus.bind(this),
      onBlur: this.blur.bind(this),
      onKeyDown: this.handleKeyDown.bind(this),
    }
  }

  render() {
    return <button {...this.fetchPropsSelf()}/>
  }
}

export default Slider;
