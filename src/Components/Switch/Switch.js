import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Proper from "../../Helpers/Proper" ;

import Label from "../Label/Label";
import Button from "../Button/Button";
import Bar from "../Bar/Bar";
import Slider from "../Slider/Slider";

import css from "./Switch.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

class Switch extends Component {

  static propTypes = {
    input: PropTypes.bool,
    output: PropTypes.bool,
    rawput: PropTypes.bool,
    inverted: PropTypes.bool,
    vertical: PropTypes.bool
  }

  static defaultProps = {
    inverted:false,
    vertical:false,
  }

  static defaultFlags = {
    lock:p=>p.state.lock,
    vertical:p=>p.props.vertical,
    inverted:p=>p.props.inverted,
    focus:p=>p.state.focus,
    dirtyOut:p=>p.state.outputDirty,
    dirtyIn:p=>p.state.inputDirty,
    on:p=>p.state.input,
    off:p=>!p.state.input
  }
  
  static validateValue(value) { return !!value; }

  static fetchPropState(props) {
    const { lock, focus, rawput, output, input} = props;
    return {
      lock, focus, 
      rawput:Switch.validateValue(rawput, props), 
      output:Switch.validateValue(jet.get("full", output, rawput), props),
      input:Switch.validateValue(jet.get("full", input, output, rawput), props)
    };
  }
  constructor(props) {
    super(props);
    this.state = this.fetchState(Switch.fetchPropState(props));
  }

  componentDidUpdate(props) {
    const changes = jet.obj.compare(Switch.fetchPropState(props), Switch.fetchPropState(this.props), true, true);
    this.setState(changes);
  }

  async setState(state) {
    const { onChange } = this.props;
    const to = this.fetchState(state);
    const changes = jet.obj.compare(this.state, to, true);
    if (changes.length) { await super.setState(to); jet.run(onChange, this, changes); }
    return changes;
  }

  isOutputDirty() { return this.state.outputDirty; }
  isInputDirty() { return this.state.inputDirty; }

  getOutputDirty() { return this.state.outputDirty; }
  getInputDirty() { return this.state.inputDirty; }

  getName() { return this.props.name; }
  getFocus() { return this.state.focus; }
  getLock() { return this.state.lock; }

  getRawput() { return this.state.rawput; }
  getOutput() { return this.state.output; }
  getInput() { return this.state.input; }

  async setRawput(rawput) { await this.setState({rawput, output:rawput, input:rawput}); return this.getRawput(); }
  async setOutput(output) { await this.setState({output, input:output}); return this.getOutput(); }
  async setInput(input) { await this.setState({input}); return this.getInput(); }

  async tap() { await this.setState({focus:true, input:!this.getInput()}); return this.getInput(); }

  submitOutput() { return this.setRawput(this.getOutput()); }
  rejectOutput() { return this.setOutput(this.getRawput()); }
  submitInput() { return this.setOutput(this.getInput()); }
  rejectInput() { return this.setInput(this.getOutput()); }

  reset() { return this.setState(Switch.fetchPropState(this.props)); }

  focus() { return this.setState({focus:true}); }
  blur() { return this.setState({focus:false, output:this.getInput()}); }
  lock() { return this.setState({lock:true}); }
  unlock() { return this.setState({lock:false}); }

  fetchValue(validator, to, from) {
    const res = validator(this, to, from);
    return res === false ? from : (res === true || res === undefined) ? to : res;
  }

  fetchState(state) {
    
    const { onFocus, onBlur, onRawput, onInput, onOutput } = this.props;
    const { focus, rawput, output, input } = jet.get("object", this.state);
    const now = jet.obj.merge(this.state, state);

    if (now.lock) { now.focus = false; } //locked input
    if (now.focus !== focus) {
      if (onFocus && now.focus) { onFocus(this, true); }
      else if (onBlur) { onBlur(this, false); }
    }
    if (onRawput && now.rawput !== rawput) { now.rawput = this.fetchValue(onRawput, now.rawput, rawput); }
    if (onOutput && now.output !== output) { now.output = this.fetchValue(onOutput, now.output, output); }
    if (!now.focus) { now.input = now.output; } //no focus = sync values
    else if (onInput && now.input !== input) { now.input = this.fetchValue(onInput, now.input, input); }

    now.rawput = Switch.validateValue(now.rawput, this.props);
    now.output = Switch.validateValue(now.output, this.props);
    now.input = Switch.validateValue(now.input, this.props);
    
    now.outputDirty = now.rawput !== now.output;
    now.inputDirty = now.output !== now.input;

    return now;
  }

  fetchSelfProps() {
    const { id, title, style, className, flags} = this.props;
    return {
      id, title, style,
      className:CN.get("Switch", className),
      "data-flag":Proper.fetchFlags({...Switch.defaultFlags, ...flags}, this).joins(" ")
    }
  }

  fetchInterfaceProps() {
    return {
      className:CN.get("interface"),
      onMouseDown:ev=>{this.tap(); jet.event.stop(ev, true);}
    }
  }

  fetchBarProps() {
    const { vertical, inverted } = this.props;
    const { input } = this.state;
    return { vertical, inverted, value:+input, className:CN.get("Bar") }
  }

  fetchSliderProps() {
    const { inverted, vertical } = this.props;
    const { input, output, rawput, focus, lock } = this.state;

    return {
      ref:"slider", style:{pointerEvents:"none"},
      step:1, input:+input, output:+output, rawput:+rawput, inverted, vertical, lock, focus,
      onChange:(slider)=>this.setState(slider.state)
    }
  }

  fetchPropsLabel() {
    const { name, label } = this.props;
    return {
      className:CN.pass("Label"), name,
      children:label
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div {...this.fetchSelfProps()}>
        <Label {...this.fetchPropsLabel()}/>
        <div {...this.fetchInterfaceProps()}>
          <div className={CN.get("track")}>
            <Bar {...this.fetchBarProps()}/>
            <Slider {...this.fetchSliderProps()}/>
          </div>
        </div>
        {Proper.inject(children, ele=>Button.injectParent(ele, this), true, Button)}
      </div>
    );
  }
}

export default Switch;
