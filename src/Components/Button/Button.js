import React, { Component } from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import cssfile from "./Button.scss";
import csslib from "../../css";

const css = csslib.open(cssfile);

class Button extends Component {
  static propTypes = {
    type: PropTypes.oneOf(["button", "submit", "submitInput", "submitOutput", "rejectInput", "rejectOutput", "reset"]),
    flags: PropTypes.object
  }

  static defaultProps = {
    type:"button",
    flags:{}
  }

  static defaultFlags = {
    lock:p=>p.getLock(),
  }

  static getDerivedStateFromProps(props) {
    const { lock } = props;  
    return { lock:jet.to("boolean", lock) };
  }

  static injectLockTemplates = {
    rejectOutput:parent=>_=>!parent.isInputDirty() && !parent.isOutputDirty(),
    submitOutput:parent=>_=>parent.isInputDirty() || !parent.isOutputDirty(),
    rejectInput:parent=>_=>!parent.isInputDirty(),
    submitInput:parent=>_=>!parent.isInputDirty(),
    submit:parent=>_=>!parent.isInputDirty(),
  }

  static injectParent(parent, ele, key, level) {
    const { type, onSubmit, lock } = ele.props;
    const lockTemp = jet.run(Button.injectLockTemplates[type], parent);
    return {
      parent,
      onSubmit: jet.filter("full", onSubmit, parent[type] ? parent[type].bind(parent) : null),
      lock: jet.filter("full", lock, lockTemp)
    }
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  getLock() { return this.state.lock; }

  submit(ev) {
    const { onSubmit } = this.props;
    if (!this.state.lock && jet.is("function", onSubmit) && onSubmit(this, ev) !== false) {
      jet.event.stop(ev);
      return true;
    }
    return false
  }

  fetchSelfProps() {
    const { id, title, style, children, className, tabIndex, flags, type } = this.props;  
    const { lock } = this.state;
    return {
      id, title, style, children, type, 
      type:type.startsWith("submit") ? "submit" : type.startsWith("reject") ? "reset" : type,
      disabled:lock, readOnly:lock, tabIndex:lock?-1:tabIndex,
      className:css.get("Button", type, className),
      "data-flag":jet.react.fetchFlags({...Button.defaultFlags, ...flags}, this),
      onClick:this.submit.bind(this),
      onKeyUp:this.handleKeyUp.bind(this)
    }
  }

  handleKeyUp(ev) { if (ev.keyCode === 13) { this.submit(ev); } }

  render() {
    return <button {...this.fetchSelfProps()}/>
  }
}

export default Button;

