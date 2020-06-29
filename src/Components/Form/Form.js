import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Button from "../Button/Button";

import Field from "../Field/Field";
import Switch from "../Switch/Switch";
import Range from "../Range/Range";

import cssfile from "./Form.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Form extends Component {

  static propTypes = {
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onInput: PropTypes.func,
    onOutput: PropTypes.func,
    flags:PropTypes.object
  }

  static defaultProps = {
    flags:{}
  }

  static defaultFlags = {
    lock:p=>p.getLock(),
    focus:p=>p.getFocus(),
    dirtyOut:p=>p.isOutputDirty(),
    dirtyIn:p=>p.isInputDirty(),
  }

  static childs = [Field, Switch, Range, Button];

  static fetchName(name, key, level) {
    return jet.get("string", name, jet.num.toLetter(level)+key);
  }
  static fetchValue(val, key, def) {
    val = (jet.is("object", val) ? val[key] : jet.is("function", val) ? val(key) : val);
    return val !== undefined ? val : def;
  }
  static fetchPropState(props) {
    const { children, rawput, output, input, lock } = props; 
    const state = {lock, rawput:{}, output:{}, input:{}};

    jet.react.injectProps(children, (ele, key, level)=>{
      if (ele.type === Button) { return; }
      const name = Form.fetchName(ele.props.name, key, level); /*RAWPUT?*/
      state.rawput[name] = ele.type.validateValue(Form.fetchValue(rawput, name), ele.props);
      state.output[name] = ele.type.validateValue(jet.get("full", Form.fetchValue(output, name, ele.props.rawput), state.rawput[name]), ele.props);
      state.input[name] = ele.type.validateValue(jet.get("full", Form.fetchValue(input, name, ele.props.output), state.output[name]), ele.props);
    }, true, Form.childs);

    return state;
  }

  constructor(props) {
    super(props);
    this.state = this.fetchState(Form.fetchPropState(this.props));
  }
  componentDidUpdate(props) {
    const to = Form.fetchPropState(this.props);
    const from = Form.fetchPropState(props);
    this.setState(jet.obj.match(to, from, (t, f, p)=>t === f ? jet.obj.get(this.state, p) : t));
  }

  async setState(state) {
    const { onChange } = this.props;
    const to = this.fetchState(state);
    const changes = jet.obj.compare(this.state, to);
    if (changes.length) { await super.setState(to); jet.run(onChange, this, changes); }
    return changes;
  }

  isOutputDirty() { return jet.isFull(this.getOutputDirty()); }
  isInputDirty() { return jet.isFull(this.getInputDirty()); }

  getOutputDirty() { return this.state.outputDirty; }
  getInputDirty() { return this.state.inputDirty; }

  getName() { return this.props.name; }
  getFocus() { return this.state.focus; }
  getLock() { return this.state.lock; }

  getRawput() { return jet.pull("object", this.state.rawput); }
  getInput() { return jet.pull("object", this.state.input); }
  getOutput() { return jet.pull("object", this.state.output); }

  async setRawput(rawput) { await this.setState({rawput, output:rawput, input:rawput}); return this.getRawput(); }
  async setOutput(output) { await this.setState({output, input:output}); return this.getOutput(); }
  async setInput(input) { await this.setState({input}); return this.getInput(); }

  submitOutput() { return this.setRawput(this.getOutput()); }
  rejectOutput() { return this.setOutput(this.getRawput()); }
  submitInput() { return this.setOutput(this.getInput()); }
  rejectInput() { return this.setInput(this.getOutput()); }

  reset() { return this.setState(Field.fetchPropState(this.props)); }

  fetchState(state) {
    const { onFocus, onBlur, onInput, onOutput, onRawput } = this.props;
    const { focus, rawput, input, output } = jet.get("object", this.state);
    const now = jet.obj.merge(this.state, state); //merge now state
    let rawputChanges, outputChanges, inputChanges;
    [now.output, now.input, now.keys] = jet.get([["object", now.output], ["object", now.input], ["object", now.keys]]);

    if (now.focus !== focus) {
      if (onFocus && now.focus) { onFocus(this, true); }
      else if (onBlur) { onBlur(this, false); }
    }
    
    if (onRawput && jet.isFull(rawputChanges = jet.obj.compare(rawput, now.rawput))) {
      onRawput(this, now.rawput, rawput, rawputChanges);
    }
    if (onOutput && jet.isFull(outputChanges = jet.obj.compare(output, now.output))) {
      onOutput(this, now.output, output, outputChanges);
    }
    if (onInput && jet.isFull(inputChanges = jet.obj.compare(input, now.input))) {
      onInput(this, now.input, input, inputChanges);
    }

    now.outputDirty = jet.obj.compare(now.rawput, now.output);
    now.inputDirty = jet.obj.compare(now.output, now.input);

    return now;
  }

  fetchSelfProps() {
    const { id, title, className, flags } = this.props;

    return {
      id, title,
      "data-flag":jet.react.fetchFlags({...Form.defaultFlags, ...flags}, this),
      className:css.get(["Form", className]),
      onReset:ev=>{ this.reset(); jet.event.stop(ev); },
      onSubmit:ev=>{ this.submitInput(); jet.event.stop(ev); },
    };
  }

  injectProps(ele, key, level) {
    if (ele.type === Button) { return Button.injectParent(this, ele, key, level); }
    const { labels, titles } = this.props;
    const { lock } = this.state;
    const { label, title, onChange } = ele.props;
    const name = Form.fetchName(ele.props.name, key, level);
    return {
      name, ref:name, parent:this,
      rawput: this.getOutput()[name],
      output: this.getInput()[name],
      label: Form.fetchValue(labels, name, label),
      title: Form.fetchValue(titles, name, title),
      lock:jet.get("full", ele.props.lock, lock),
      onChange:[
        onChange, 
        (ele, changes)=>{if (changes.includes("focus") || changes.includes("output")) {
            const name = ele.getName();
            this.setState({
              focus:ele.getFocus() ? name : false,
              output:{[name]:ele.getRawput()},
              input:{[name]:ele.getOutput()},
            });
        }}
      ]
    }
  }

  render() {
    const { children } = this.props;
    return (
      <form {...this.fetchSelfProps()}>
        {jet.react.injectProps(React.Children.toArray(children), this.injectProps.bind(this), true, Form.childs)}
      </form>
    )
  }
}


export default Form;




