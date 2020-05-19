import React, { Component } from "react";
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Proper from "../../Helpers/Proper";

import Label from "../Label/Label";
import Pin from "../Pin/Pin";


import css from "./Track.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

function invert(bol, value) {
  return bol ? 1-value : value;
}

class Track extends Component {
  static propTypes = {
    vertical: PropTypes.bool,
    downend: PropTypes.bool,
    pins: PropTypes.number,
    free: PropTypes.bool,
    from: PropTypes.number,
    to: PropTypes.number,
    value: PropTypes.number,
    step: PropTypes.number,
    onFocus: PropTypes.func,
    onInput: PropTypes.func,
    onOutput: PropTypes.func,
    onClick: PropTypes.func
  }
  static defaultProps = {
    from:0,
    to:100,
    value:0,
    step:1,
    pins:1,
    onBlur: ()=>{},
    onFocus: ()=>{},
    onInput: ()=>{},
    onOutput: ()=>{},
    onClick: ()=>{}
  }

  constructor(props) {
    super(props);
    this.state = {
      focus:false,
      preput:0,
      output:0,
      input:0,
    };
  }

  componentDidMount() { this.setState(); }
  componentDidUpdate() { this.setState(); }

  setInput(input) { return this.setState({input}); }
  setOutput(output) { return this.setState({output}); }
  getInput() { return this.state.input; }
  getOutput() { return this.state.output; }

  getStepCount() {
    const { from, to, step} = this.props;
    return Math.round((1+to-from)/step);
  }

  refresh() {
    const { output } = this.state;
    const { outbox } = this.refs;
    if (outbox.value !== output) { outbox.value = output; }
  }

  async setState(now) {
    const { onFocus, onBlur, onChange, onInput, onOutput, value, from, to } = this.props;
    const { focus, input, output, preput } = this.state;
    const changes = [];

    now = {...this.state, ...jet.get("object", now), preput:value};

    if (now.focus !== focus) {
      if (now.focus) { onFocus(this, true); }
      else if (!now.focus) { onBlur(this, false); }
      changes.push("focus");
    }

    if (now.preput !== preput) { now.output = now.preput; changes.push("preput"); } //redefine output
    if (now.output !== output) { now.input = now.output; } //output changing input

    if (now.input !== input) {
      now.input = jet.str.toNum(now.input);
      now.mark = jet.num.toRatio(now.input, from, to);
      onInput(this, now.input);
      changes.push("input");
    }
    
    if (now.output !== output || !now.focus) { now.output = now.input; } //input changing output

    if (now.output !== output) {
      onOutput(this, now.output);
      changes.push("output");
    }

    if (changes.length) {
      await super.setState(now); jet.run(onChange, this, changes);
      this.refresh();
    }
    
  }

  handleClick(ev) {
    const { onClick } = this.props;
    if (onClick(this, ev) === false) { return; }
    else if (ev.isDefaultPrevented()) { return; }
    jet.event.stop(ev);
  }

  fetchSelfProps() {
    const { vertical, className, pins, free, step, from, to, downend, value, label, onChange, onFocus, onInput, onOutput } = this.props;
    const { focus, mark } = this.state;
    return Proper.pass(this.props, {
      className:CN.get("Track", free?"free":"snap", focus?"focus":"blur", vertical?"vertical":"horizontal", downend?"downend":"upend", className),
      "data-mark": ClassNames.getDataMark(mark),
    }, { vertical, onChange, pins, free, step, from, to, downend, value, label, onFocus, onInput, onOutput });
  }

  fetchMarkProps() {
    const { vertical, from, to } = this.props;
    const { input } = this.state;
    const ratioInput = jet.num.toRatio(input, from, to)*100;
    return {
      ref:"mark", className:CN.get("mark"),
      style:{width:(vertical?100:ratioInput)+"%", height:(vertical?ratioInput:100)+"%"}
    }
  }

  fetchPinProps() {
    const { vertical, free, from, to, step, downend } = this.props;
    const { output } = this.state;
    const ratioValue = invert(downend, jet.num.toRatio(output, from, to));
    const ratioStep = jet.num.toRatio(step, from, to);

    return {
      x:vertical?.5:ratioValue, y:vertical?ratioValue:.5, 
      onChange:(bound, state)=>{
        const focus = state !== "stop";
        const position = vertical ? bound.y : bound.x;
        const snap = jet.num.snap(position, ratioStep, 0, 1);
        const value = (focus && free) ? jet.num.frame(position, 0, 1) : snap;
        bound.x = vertical ? .5 : value;
        bound.y = !vertical ? .5 : value;
        this.refs.mark.style[vertical?"height":"width"] = (invert(downend, value)*100)+"%";
        this.setState({focus, input:jet.num.fromRatio(invert(downend, snap), from, to)})
      }
    }
  }

  fetchPropsPath() {
    return {
      className:CN.get("path"),
      onClick:this.handleClick.bind(this)
    }
  }

  fetchPropsOutbox() {
    const { name } = this.props;
    return {
      ref:"outbox", className:CN.get("outbox"),
      name, style: {display:"none"}
    }
  }

  fetchLabelProps() {
    const { name, label } = this.props;
    return {
      className:CN.pass("Label"), name,
      children:label
    }
  }

  render() {
    const { pins } = this.props;
    return (
      <div {...this.fetchSelfProps()}>
        <Label {...this.fetchLabelProps()}/>
        <div className={CN.get("interface")}>
          <div {...this.fetchPropsPath()}>
            <textarea {...this.fetchPropsOutbox()}/>
            <div className={CN.get("rail")}>
              <div {...this.fetchMarkProps()}/>
            </div>
            {pins ? <Pin {...this.fetchPinProps()}/> : null}
          </div>
        </div>
      </div>
    )
  }
}

export default Track;
