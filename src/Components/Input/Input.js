import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Checker from "../../Helpers/Checker";

import css from "./Input.scss";
import ClassNames from "../../Helpers/ClassNames";
const CN = ClassNames.getFactory(css);

//@name
//@value
//@type
//@className
//@id
class Input extends Component {
  lastPropsValue;
  autoSizeDelay;
  
  static propTypes = {
    type: PropTypes.oneOf(["number", "text", "email", "tel", "textarea"]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onInput: PropTypes.func,
    autoSize: PropTypes.bool
  }
  static defaultProps = {
    type:"text",
    rows:1,
    cols:20,
    onChange: ()=>{},
    onBlur: ()=>{},
    onFocus: ()=>{},
    onInput: ()=>{}
  }

  constructor(props) {
    super(props);
    this.state = {
      focus:false,
      output:""
    };
  }

  componentDidMount() {
    Checker.list.add(this.checker.bind(this));
    jet.event.hear(window, "resize", this.autoSizeWithDelay.bind(this));
    this.setState({output:this.props.value});
  }

  componentDidUpdate() {
    
    if (this.lastPropsValue !== this.props.value) {
      this.setState({output:this.props.value});
      
      this.lastPropsValue = this.props.value;
    }
  }

  componentWillUnmount() {
    Checker.list.rem(this.checker.bind(this));
    jet.event.deaf(window, "resize", this.autoSizeWithDelay.bind(this));
  }

  eventHandler(ev) {
    const k = ev.keyCode;
    if (k === 27) { this.escapeInput(); }//escape 
    else if (k === 13 && (ev.ctrlKey === this.isTextArea())) { this.blurInput(); }//not enter
    else { return; }
    jet.event.stop(ev);
  }

  isTextArea() {
    return this.props.type === "textarea";
  }

  getInput() {return this.isTextArea() ? this.refs.area : this.refs.input; }
  getArea() {return this.refs.area; }

  refreshInput() { 
    if (!this.isTextArea()) { this.getArea().value = this.getInputValue(); }
    this.autoSize(); 
  }

  setInputValue(value) { 
    this.getInput().value = jet.str.to(value);
    this.refreshInput(); 
  }

  resetInputValue() { this.setInputValue(this.state.output); }
  getInputValue() { return this.getInput().value; }

  focusInput() { return this.getInput().focus(); }
  blurInput() { return this.getInput().blur(); }
  escapeInput() { return this.getInputValue() === this.state.output ? this.blurInput() : this.resetInputValue(); }

  autoSize(force) {
    const { autoSize } = this.props;
    if (!autoSize && !force) { return false; }
    const area = this.getArea();
    const style = area.style;
   
    style.height = style.width = null; 
    area.wrap = "off";
    style.width = (area.scrollWidth+5) + "px";
    if (this.isTextArea()) {
      area.wrap="soft"; 
      style.height = area.scrollHeight + "px";
      style.width = (area.scrollWidth+5) + "px";
    }
    return true;
  }

  autoSizeWithDelay() { 
    clearTimeout(this.autoSizeDelay);
    this.autoSizeDelay = setTimeout(this.autoSize.bind(this), 50);
  }

  setState(state) {
    state = jet.get("object", state);

    const { output, focus } = this.state;
    const { onInput, onChange, onFocus, onBlur } = this.props;

    state.focus = jet.get("boolean", state.focus, focus);
    state.output = jet.isEmpty(state.output) ? state.focus ? output : this.getInputValue() : state.output;

    if (output !== state.output) {
      this.setInputValue(state.output);
      onInput(state.output, output);
    }

    if (focus !== state.focus) {
      if (state.focus) { onFocus(); } else { onBlur(); }
    }

    if (focus !== state.focus || output !== state.output) {
      onChange(state);
      super.setState(state);
    }
  }

  checker() {
    if (!this.state.focus && this.state.output !== this.getInputValue()) {
      this.setState();
    }
  }

  getBodyProps() {
    const { focus, output } = this.state
    const { id, className, title, autoSize, type } = this.props;

    return {
      id,
      title,
      className:CN.get("Input", type, autoSize?"dynamic":"static", focus ? "focus" : "blur", output ? "full" : "empty", className)
    }
  }


  getInputProps() {
    const { name, step, autoFocus, pattern, required, readOnly, autoCorrect, autoCapitalize, spellCheck, autoComplete } = this.props;
    return {
      ref:"input",
      name, step, autoFocus, required, pattern, readOnly, autoCorrect, autoCapitalize, spellCheck, autoComplete,
      onKeyDown: this.eventHandler.bind(this),
      onFocus: _ => this.setState({focus:true}),
      onBlur: _ => this.setState({focus:false}),
      onChange: _=> this.setState(),
      onInput: _=> this.refreshInput(),
    };
  }

  getAreaProps() {
    const { rows, cols } = this.props;
    return {
      ref:"area",
      rows, cols,
    };
  }

  render() {
    const { type } = this.props;

    if (this.isTextArea()) {
      return (
        <div {...this.getBodyProps()}>
        <textarea {...this.getInputProps()} {...this.getAreaProps()}/>
      </div>
      )
    } else {
      return (
        <div {...this.getBodyProps()}>
          <textarea {...this.getAreaProps()} readOnly/>
          <input type={type} {...this.getInputProps()}/>
        </div>
      );
    }

  }
}

export default Input;
