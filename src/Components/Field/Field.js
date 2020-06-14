import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Proper from "../../Helpers/Proper" ;
import Checker from "../../Helpers/Checker";

import Button from "../Button/Button";
import Label from "../Label/Label";

import css from "./Field.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

class Field extends Component {
  
  static propTypes = {
    type: PropTypes.oneOf(["number", "text", "email", "tel", "textarea", "password"]),
    rows:PropTypes.number,
    cols:PropTypes.number,
    maxLength:PropTypes.number,
    flags:PropTypes.object,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onRawput: PropTypes.func,
    onOutput: PropTypes.func,
    onInput: PropTypes.func,
    onKeyDown: PropTypes.func,
    onPaste: PropTypes.func,
  }
  static defaultProps = {
    type:"text",
    rows:1,
    cols:20
  }

  static defaultFlags = {
    blank:p=>!p.state.input,
    full:p=>p.state.mark===1,
    focus:p=>p.state.focus,
    dirtyOut:p=>p.state.outputDirty,
    dirtyIn:p=>p.state.inputDirty,
    lock:p=>p.state.lock,
    autosize:p=>p.props.autoSize,
  }

  static validateValue(value, props) { return jet.str.to(value).slice(0, props.maxLength); }
  static fetchPropState(props) {
    const { lock, focus, rawput, output, input} = props;
    return {
      lock, focus, 
      rawput:Field.validateValue(rawput, props), 
      output:Field.validateValue(jet.get("full", output, rawput), props),
      input:Field.validateValue(jet.get("full", input, output, rawput), props)
    };
  }

  cleanUp;

  constructor(props) {
    super(props);
    this.state = this.fetchState(Field.fetchPropState(props));
  }
  componentDidMount() {
    const cleanUp = this.cleanUp = new jet.RunPool();
    const checker = this.checker.bind(this);
    let autoSizeTimeout;

    Checker.list.add(checker);

    cleanUp.add(_=>Checker.list.rem(checker));
    cleanUp.add(jet.event.hear(window, "resize", _=>{
      clearTimeout(autoSizeTimeout);
      autoSizeTimeout = setTimeout(this.autoSize.bind(this), 50);
    }));
    this.refresh();
  }
  componentWillUnmount() { this.cleanUp.run(); }
  componentDidUpdate(props) {
    const to = Field.fetchPropState(this.props);
    const from = Field.fetchPropState(props);
    this.setState(jet.obj.compare(from, to, true, true));
    this.refresh();
  }

  async setState(state) {
    const { onChange } = this.props;
    const to = this.fetchState(state);
    const changes = jet.obj.compare(this.state, to, true);
    if (changes.length) { await super.setState(to); jet.run(onChange, this, changes); }
    return changes;
  }

  isTextArea() { return this.props.type === "textarea"; }

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

  getOnbox() { return this.isTextArea() ? this.refs.inbox : this.refs.onbox; }

  getCarret() {
    const inbox = this.refs.inbox;
    return [ inbox.selectionStart, inbox.selectionEnd ];
  };

  async setRawput(rawput) { await this.setState({rawput, output:rawput, input:rawput}); return this.getRawput(); }
  async setOutput(output) { await this.setState({output, input:output}); return this.getOutput(); }
  async setInput(input) { await this.setState({input}); return this.getInput(); }

  setCarret(start, end) {
    const inbox = this.refs.inbox;
    const { input } = this.state;
    if (input && inbox.setSelectionRange) {
      inbox.setSelectionRange(input.carret(start), input.carret(end));
    };
  }

  submitOutput() { return this.setRawput(this.getOutput()); }
  rejectOutput() { return this.setOutput(this.getRawput()); }
  submitInput() { return this.setOutput(this.getInput()); }
  rejectInput() { return this.setInput(this.getOutput()); }

  reset() { return this.setState(Field.fetchPropState(this.props)); }

  focus() { return this.setState({focus:true}); }
  blur() { return this.setState({focus:false, output:this.getInput()}); }
  lock() { return this.setState({lock:true}); }
  unlock() { return this.setState({lock:false}); }

  refresh() {
    const { focus, input, output } = this.state;
    const { inbox, onbox } = this.refs;
    if (onbox && onbox.value !== input) { onbox.value = input; }
    if (inbox.value !== input) { inbox.value = input; }
    if (focus) { inbox.focus(); } else { inbox.blur(); } //sync state with reality
    this.autoSize();
  }

  autoSize(force) {
    if (!this.props.autoSize && !force) { return false; }
    const onbox = this.getOnbox();
    const style = onbox.style;
    style.height = style.width = null; 
    onbox.wrap = "off";
    style.width = (onbox.scrollWidth+5) + "px";
    if (this.isTextArea()) {
      onbox.wrap="soft"; 
      style.height = onbox.scrollHeight + "px";
      style.width = (onbox.scrollWidth+5) + "px";
    }
    return true;
  }

  handleKeyDown(ev) {
    const onKeyDown = this.props.onKeyDown;
    const k = ev.keyCode;
    if (onKeyDown && onKeyDown(this, ev) === false) { return; }
    else if (ev.isDefaultPrevented()) { return; }

    if (k === 27) { if (this.getInput() === this.getOutput()) { this.blur() } else { this.rejectInput(); } } //escape 
    else if (k === 13 && (ev.ctrlKey === this.isTextArea())) { this.blur(); } //not enter
    else { return }

    jet.event.stop(ev);
  }

  checker() {
    if (this.getFocus()) { return; }
    const { value } = this.refs.inbox;
    if (this.getOutput() !== value) { this.setOutput(value); }
  }

  fetchValue(validator, to, from) {
    const res = validator(this, to, from);
    return res === false ? from : (res === true || res === undefined) ? to : res;
  }

  fetchState(state) {
    const { onInput, onOutput, onRawput, onFocus, onBlur, maxLength } = this.props;
    const { focus, input, output, rawput } = jet.get("object", this.state);
    const now = jet.obj.merge(this.state, state);

    if (now.lock) { now.focus = false; } //locked input
    if (now.focus !== focus) { //change focus
      if (onFocus && now.focus  && onFocus(this, true) === false) { now.focus = false; }
      else if (onBlur && !now.focus && onBlur(this, false) === false) { now.focus = true; }
    }
    if (onRawput && now.rawput !== rawput) { now.rawput = this.fetchValue(onRawput, now.rawput, rawput); }
    if (onOutput && now.output !== output) { now.output = this.fetchValue(onOutput, now.output, output); }
    if (!now.focus) { now.input = now.output; } //no focus = sync values
    else if (onInput && now.input !== input) { now.input = this.fetchValue(onInput, now.input, input); }
    
    now.rawput = Field.validateValue(now.rawput, this.props);
    now.output = Field.validateValue(now.output, this.props);
    now.input = Field.validateValue(now.input, this.props);

    now.outputDirty = now.rawput !== now.output;
    now.inputDirty = now.output !== now.input;
    now.mark = maxLength ? now.input.length / maxLength : 0;

    return now;
  }

  fetchPropsSelf() {
    const { id, className, title, type, flags } = this.props;
    return {
      id, title, 
      "data-flag":Proper.fetchFlags({...Field.defaultFlags, ...flags}, this).joins(" "),
      className:CN.get("Field", type, className)
    }
  }

  fetchPropsInbox() {
    const {tabIndex, name, autoCorrect, autoCapitalize, spellCheck, autoComplete, onPaste, maxLength } = this.props;
    const { focus, lock } = this.state;
    return {
      ref:"inbox", className:CN.get("inbox"),
      name, autoFocus:focus, autoCorrect, autoCapitalize, spellCheck, autoComplete, maxLength, 
      readOnly:lock, disabled:lock, tabIndex:lock?-1:tabIndex,
      onFocus: _=> this.focus(),
      onBlur: _=> this.blur(),
      onInput: ev=> this.setInput(ev.target.value),
      onKeyDown: this.handleKeyDown.bind(this),
      onPaste: ev=>{if (onPaste) {onPaste(this, ev)}}
    };
  }

  fetchPropsOnbox() {
    const { rows, cols } = this.props;
    return { ref:"onbox", className:CN.get("onbox"), rows, cols };
  }

  fetchPropsMark() {
    const { mark } = this.state;
    return {
      ref:"mark", className:CN.get("mark"),
      style:{width:(mark*100)+"%"}
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
    const { type, children } = this.props;
    return (
      <div {...this.fetchPropsSelf()}>
        <Label {...this.fetchPropsLabel()}/>
        <div className={CN.get("interface")}>
          {
            this.isTextArea() ? 
            <textarea {...this.fetchPropsOnbox()} {...this.fetchPropsInbox()} /> :
            [
              <textarea key={0} {...this.fetchPropsOnbox()}/>,
              <input key={1} {...this.fetchPropsInbox()} type={type}/> 
            ]
          }
        </div>
        <div className={CN.get("underline")}>
          <div {...this.fetchPropsMark()}/>
        </div>
        {Proper.inject(children, ele=>Button.injectParent(this, ele), true, Button)}
      </div>
    );

  }
}

export default Field;
