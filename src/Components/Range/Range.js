import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Proper from "../../Helpers/Proper" ;

import Label from "../Label/Label";
import Control from "../Control/Control";
import Bar from "../Bar/Bar";
import Slider from "../Slider/Slider";

import css from "./Range.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

class Range extends Component {

  static propTypes = {
    input: PropTypes.number,
    output: PropTypes.number,
    rawput: PropTypes.number,
    from: PropTypes.number,
    to: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    inverted: PropTypes.bool,
    vertical: PropTypes.bool
  }

  static defaultProps = {
    from: 0,
    to: 1,
    step: 0.01,
    inverted:false,
    vertical:false
  }

  static defaultFlags = {
    lock:(p, s)=>s.lock,
    vertical:p=>p.vertical,
    inverted:p=>p.inverted,
    focus:(p, s)=>s.focus,
    shifting:(p, s)=>s.shifting,
    dirtyOut:(p, s)=>s.outputDirty,
    dirtyIn:(p, s)=>s.inputDirty,
  }
  
  static validateValue(value, props) {
    const { min, max, from, to, step } = props;
    const val = jet.str.toNum(value);
    return step ? jet.num.snap(val, step, min||from, max||to) : jet.num.frame(val, min||from, max||to);
  }

  static valueToRatio(value, props) { return jet.filter("full", jet.num.toRatio(value, props.from, props.to)); }
  static ratioToValue(ratio, props) { return jet.filter("full", jet.num.fromRatio(ratio, props.from, props.to)); }
  static valuesToRatios(values, props) { return jet.obj.map(values, val=>Range.valueToRatio(val, props)); }
  static ratiosToValues(ratios, props) { return jet.obj.map(ratios, val=>Range.ratioToValue(val, props)); }

  static fetchPropState(props) {
    const { lock, focus, rawput, output, input} = props;
    return {
      lock, focus, 
      rawput:Range.validateValue(rawput, props), 
      output:Range.validateValue(jet.get("full", output, rawput), props),
      input:Range.validateValue(jet.get("full", input, output, rawput), props)
    };
  }
  constructor(props) {
    super(props);
    this.state = this.fetchState(Range.fetchPropState(props));
  }

  componentDidUpdate(props) {
    const changes = jet.obj.compare(Range.fetchPropState(props), Range.fetchPropState(this.props), true, true);
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

  submitOutput() { return this.setRawput(this.getOutput()); }
  rejectOutput() { return this.setOutput(this.getRawput()); }
  submitInput() { return this.setOutput(this.getInput()); }
  rejectInput() { return this.setInput(this.getOutput()); }

  reset() { return this.setState(Range.fetchPropState(this.props)); }

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
    if (now.shifting) { now.focus = true; }
    if (now.focus !== focus) {
      if (onFocus && now.focus) { onFocus(this, true); }
      else if (onBlur) { onBlur(this, false); }
    }
    if (onRawput && now.rawput !== rawput) { now.rawput = this.fetchValue(onRawput, now.rawput, rawput); }
    if (onOutput && now.output !== output) { now.output = this.fetchValue(onOutput, now.output, output); }
    if (!now.focus) { now.input = now.output; } //no focus = sync values
    else if (onInput && now.input !== input) { now.input = this.fetchValue(onInput, now.input, input); }

    now.rawput = Range.validateValue(now.rawput, this.props);
    now.output = Range.validateValue(now.output, this.props);
    now.input = Range.validateValue(now.input, this.props);
    
    now.outputDirty = now.rawput !== now.output;
    now.inputDirty = now.output !== now.input;

    return now;
  }

  fetchSelfProps() {
    const { id, title, style, className, flags} = this.props;
    return {
      id, title, style,
      className:CN.get("Range", className),
      "data-flag":Proper.fetchFlags({...Range.defaultFlags, ...flags}, this.props, this.state).joins(" ")
    }
  }

  fetchInterfaceProps() {
    return {
      className:CN.get("interface")
    }
  }

  fetchBarProps() {
    const { vertical, inverted } = this.props;
    const { input } = this.state;
    return { vertical, inverted, value:Range.valueToRatio(input, this.props), className:CN.get("Bar") }
  }

  fetchSliderProps() {
    const { from, min, max, step, inverted, vertical } = this.props;
    const { input, output, rawput, focus, lock } = this.state;
    return {
      ref:"slider", inverted, vertical, lock, focus,
      ...Range.valuesToRatios({step:from+step, min, max, input, output, rawput}, this.props),
      onChange:(slider)=>{
        const { rawput, output, input } = slider.state;
        this.setState({ ...slider.state, ...Range.ratiosToValues({ rawput, output, input}, this.props)})
      }
    }
  }

  fetchPropsLabel() {
    const { name, label } = this.props;
    return {
      className:CN.pass("Label"), name,
      children:label
    }
  }

  injectControl() { return { parent:this }; }

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
        {Proper.inject(children, this.injectControl.bind(this), true, Control)}
      </div>
    );
  }
}

export default Range;
