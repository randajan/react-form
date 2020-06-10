import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Proper from "../../Helpers/Proper";

import css from "./Slider.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

class Slider extends Component {

  static propTypes = {
    input: PropTypes.number,
    output: PropTypes.number,
    rawput: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    inverted: PropTypes.bool,
    vertical: PropTypes.bool
  }

  static defaultProps = {
    min: 0,
    max: 1,
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
    const { min, max, step } = props;
    const val = jet.num.to(value);
    return step ? jet.num.snap(val, step, min, max) : jet.num.frame(val, min, max);
  }

  static boundToValue(bound, props) {
    const value = props.vertical ? bound.y : bound.x;
    return Slider.validateValue(props.inverted ? 1-value : value, props);
  }

  static valueToBound(value, props) {
    const bound = props.inverted ? 1-value : value;
    return { x:props.vertical?.5:bound, y:props.vertical?bound:.5 }
  }

  static fetchPropState(props) {
    const { lock, focus, rawput, output, input} = props;
    return {
      lock, focus, 
      rawput:Slider.validateValue(rawput, props), 
      output:Slider.validateValue(jet.get("full", output, rawput), props),
      input:Slider.validateValue(jet.get("full", input, output, rawput), props)
    };
  }

  cleanUp;

  constructor(props) {
    super(props);
    this.state = this.fetchState(Slider.fetchPropState(props));
  }

  componentDidMount() {
    this.refresh();
  }

  componentWillUnmount() {
    this.cleanUp.run();
  }

  componentDidUpdate(props) {
    const changes = jet.obj.compare(Slider.fetchPropState(props), Slider.fetchPropState(this.props), true, true);
    this.setState(changes);
    this.refresh();
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

  reset() { return this.setState(Slider.fetchPropState(this.props)); }

  focus() { return this.setState({focus:true}); }
  blur() { return this.setState({focus:false, output:this.getInput()}); }
  lock() { return this.setState({lock:true}); }
  unlock() { return this.setState({lock:false}); }


  refresh() {
    const { focus, shifting } = this.state;
    const { body } = this.refs;
    if (focus) { body.focus(); } else { body.blur(); } //sync state with reality
    if (!shifting) { this.hearShift(); }
  }

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

    now.rawput = Slider.validateValue(now.rawput, this.props);
    now.output = Slider.validateValue(now.output, this.props);
    now.input = Slider.validateValue(now.input, this.props);

    now.outputDirty = now.rawput !== now.output;
    now.inputDirty = now.output !== now.input;

    return now;
  }

  hearShift() {
    if (this.cleanUp) { this.cleanUp.run(); }
    this.cleanUp = new jet.RunPool();
    const bound = Slider.valueToBound(this.state.input, this.props);
    this.cleanUp.add(jet.event.listenShift(this.refs.body, this.handleShift.bind(this), bound));
  }

  handleShift(ev, bound, state) {
    const shifting = state !== "stop";
    const input = Slider.boundToValue(bound, this.props);
    const {x, y} = Slider.valueToBound(input, this.props);
    bound.x = x; bound.y = y;
    this.setState({shifting, input });
  }

  handleKeyDown(ev) {
    const { onKeyDown, step, inverted, vertical } = this.props;
    const k = ev.keyCode, inv = ((inverted !== vertical)*2-1);
    if (onKeyDown && onKeyDown(this, ev) === false) { return; }
    else if (ev.isDefaultPrevented()) { return; }

    if (k === 27) { if (this.getInput() === this.getOutput()) { this.blur() } else { this.rejectInput(); } } //escape 
    else if (k === 13) { this.blur(); } //not enter
    else if (k === 37 || k === 40) { this.setInput(this.getInput()+(inv*step)); }
    else if (k === 39 || k === 38) { this.setInput(this.getInput()-(inv*step)); }
    else { return; }

    jet.event.stop(ev);
  }

  fetchSelfProps() {
    const { id, title, children, style, className, focus, flags, tabIndex } = this.props;
    const { lock } = this.state;
    return {
      id, title, style, children, autoFocus:focus, ref:"body", type:"button",
      readOnly:lock, disabled:lock, tabIndex:lock?-1:tabIndex,
      className:CN.get("Slider", className),
      "data-flag":Proper.fetchFlags({...Slider.defaultFlags, ...flags}, this.props, this.state).joins(" "),
      onFocus: this.focus.bind(this),
      onBlur: this.blur.bind(this),
      onKeyDown:this.handleKeyDown.bind(this),
    }
  }

  render() {
    return <button {...this.fetchSelfProps()}/>
  }
}

export default Slider;
