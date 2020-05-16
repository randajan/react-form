import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Checker from "../../Helpers/Checker";

import css from "./Feed.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);


function reqValue(self, handle, to, from) {
  const res = handle(self, jet.str.to(to), jet.str.to(from));
  return jet.str.to(res === false ? from : (res === true || res === undefined) ? to : res);
}

class Feed extends Component {
  cleanUp;
  
  static propTypes = {
    type: PropTypes.oneOf(["number", "text", "email", "tel", "textarea", "password"]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onInput: PropTypes.func,
    onOutput: PropTypes.func,
    onKeyDown: PropTypes.func,
    onPaste: PropTypes.func,
  }
  static defaultProps = {
    type:"text",
    rows:1,
    cols:20,
    onChange: ()=>{},
    onBlur: ()=>{},
    onFocus: ()=>{},
    onInput: ()=>{},
    onOutput: ()=>{},
    onKeyDown: ()=>{},
    onPaste: ()=>{}
  }

  constructor(props) {
    super(props);
    this.state = {
      focus:false,
      input:"",
      output:"",
      preput:""
    }
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
    
    this.setState();
  }

  componentDidUpdate() { this.setState(); }
  componentWillUnmount() { this.cleanUp.run(); }

  getOnbox() { return this.isTextArea() ? this.refs.inbox : this.refs.onbox; }

  isTextArea() { return this.props.type === "textarea"; }
  isFocused() { return this.refs.inbox === document.activeElement; }

  setInput(input) { return this.setState({input}); }
  setOutput(output) { return this.setState({output}); }
  getInput() { return this.refs.inbox.value; }
  getOutput() { return this.refs.outbox.value; }

  undo() { return this.setInput(this.state.output); }
  clear(hard) { return hard ? this.setOutput("") : this.setInput(""); }
  reset(hard) { return hard ? this.setOutput(this.state.preput) : this.setInput(this.state.preput); }

  focus() { return this.setState({focus:true}); }
  blur() { return this.setState({focus:false}); }
  escape() {
    const { input, output } = this.state;
    if (input === output) { this.blur(); } 
    else { this.undo(); } 
  }

  setCarret(start, end) {
    const inbox = this.refs.inbox;
    const { input } = this.state;
    if (input && inbox.setSelectionRange) {
      inbox.setSelectionRange(input.carret(start), input.carret(end));
    };
  }

  getCarret() {
    const inbox = this.refs.inbox;
    return [ inbox.selectionStart, inbox.selectionEnd ];
  };

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

  refresh() {
    const { input, output } = this.state;
    const { inbox, outbox, onbox } = this.refs;
    if (onbox && onbox.value !== input) { onbox.value = input; }
    if (inbox.value !== input) { inbox.value = input; }
    if (outbox.value !== output) { outbox.value = output; }
    this.autoSize();
  }

  async setState(now) {
    const { onInput, onOutput, onChange, onFocus, onBlur, readOnly, value } = this.props;
    const { focus, input, output, preput } = this.state;
    const changes = [];

    now = {...this.state, ...jet.get("object", now), preput:value};

    if (readOnly) { now.focus = false; now.input = input; } //locked input
    if (now.focus !== focus) { //change focus
      if (now.focus && onFocus(this, true) === false) { now.focus = false; }
      else if (!now.focus && onBlur(this, false) === false) { now.focus = true; }
      else { changes.push("focus"); }; 
    }
    if (now.preput !== preput) { now.output = now.preput; changes.push("preput"); } //redefine output 
    if (now.output !== output) { now.input = now.output; } //output changing input
    if (now.input !== input) { //input change
      now.input = reqValue(this, onInput, now.input, input);
      if (now.input !== input) { changes.push("input"); }
    }
    if (now.output !== output || !now.focus) { now.output = now.input; } //input changing output
    if (now.output !== output) { //output change
      now.output = reqValue(this, onOutput, now.output, output);
      if (now.output !== output) { changes.push("output"); }
    }

    if (changes.length) {
      await super.setState(now); this.refresh(); onChange(this, changes);
    }
    if (now.focus) { this.refs.inbox.focus(); } else { this.refs.inbox.blur(); } //sync state with reality
    return changes;
  }

  handleKeyDown(ev) {
    const k = ev.keyCode;
    if (this.props.onKeyDown(this, ev) === false) { return; }
    else if (ev.isDefaultPrevented()) { return; }

    if (k === 27) { this.escape(); }//escape 
    else if (k === 13 && (ev.ctrlKey === this.isTextArea())) { this.blur(); }//not enter
    else { return }
    jet.event.stop(ev);
  }

  checker() {
    if (this.state.focus) { return; }
    const { value } = this.refs.inbox;
    if (this.state.input !== value) { this.setOutput(value); }
  }

  fetchPropsSelf() {
    const { focus, input } = this.state
    const { id, className, title, autoSize, type, readOnly } = this.props;

    return {
      id, title,
      className:CN.get("Feed", type, readOnly?"readonly":"editable", autoSize?"dynamic":"static", focus ? "focus" : "blur", input ? "full" : "empty", className)
    }
  }

  fetchPropsInbox() {
    const {tabIndex, name, autoFocus, readOnly, autoCorrect, autoCapitalize, spellCheck, autoComplete, onPaste, maxLength } = this.props;
    return {
      ref:"inbox", className:CN.get("inbox"),
      name, autoFocus, readOnly, autoCorrect, autoCapitalize, spellCheck, autoComplete, maxLength, 
      tabIndex:readOnly?-1:tabIndex,
      onFocus: _=> this.focus(),
      onBlur: _=> this.blur(),
      onInput: ev=> this.setInput(ev.target.value),
      onKeyDown: this.handleKeyDown.bind(this),
      onPaste: ev=>onPaste(this, ev)
    };
  }

  fetchPropsOutbox() {
    const { name } = this.props;
    return {
      ref:"outbox", className:CN.get("outbox"),
      name, style: {display:"none"}
    }
  }

  fetchPropsOnbox() {
    const { rows, cols } = this.props;
    return { ref:"onbox", className:CN.get("onbox"), rows, cols };
  }

  render() {
    const { type } = this.props;

    return (
      <div {...this.fetchPropsSelf()}>
        <textarea {...this.fetchPropsOutbox()}/>
        {
          this.isTextArea() ? 
          <textarea {...this.fetchPropsOnbox()} {...this.fetchPropsInbox()} /> :
          [
            <textarea key={0} {...this.fetchPropsOnbox()}/>,
            <input key={1} {...this.fetchPropsInbox()} type={type}/> 
          ]
        }
      </div>
    );

  }
}

export default Feed;
