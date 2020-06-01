import React, { Component } from 'react';


import jet from "@randajan/jetpack";

import Proper from "../../Helpers/Proper" ;

import css from "./Control.scss";
import ClassNames from "../../Helpers/ClassNames";

const CN = ClassNames.getFactory(css);

class Control extends Component {

  static defaultFlags = {
    lock:(p,s)=>s.lock,
  }

  static lockTemplates = {
    rejectOutput:form=>!form.isInputDirty() && !form.isOutputDirty(),
    submitOutput:form=>form.isInputDirty() || !form.isOutputDirty(),
    rejectInput:form=>!form.isInputDirty(),
    submitInput:form=>!form.isInputDirty(),
  }

  static fetchLock(lock, parent, onSubmit) {
    if (lock === undefined && parent.getLock()) { return true; }
    if (lock === undefined) { return Control.fetchLock(Control.lockTemplates[onSubmit], parent); }
    if (jet.is("boolean", lock)) { return lock; }
    if (jet.is("function", lock)) { return lock(parent); }
    if (jet.is("function", parent[lock])) { return parent[lock](); }
  }

  static getDerivedStateFromProps(props) {
    const { parent, lock, onSubmit } = props;  
    return { lock:(!onSubmit || !parent || Control.fetchLock(lock, parent, onSubmit)) };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  getLock() { return this.state.lock; }

  submit() {
    const { lock, parent, onSubmit } = this.props;  
    if (lock) { return; }
    if (jet.is("function", onSubmit)) { return onSubmit(parent); }
    if (jet.is("function", parent[onSubmit])) {parent[onSubmit](); }
  }

  fetchSelfProps() {
    const { id, title, style, children, className, tabIndex, flags } = this.props;  
    const { lock } = this.state;

    return {
      id, title, style, children,
      type:"button", disabled:lock, readOnly:lock, tabIndex:lock?-1:tabIndex,
      className:CN.get("Control", className),
      "data-flag":Proper.fetchFlags({...Control.defaultFlags, ...flags}, this.props, this.state).joins(" "),
      onClick:this.handleClick.bind(this),
      onKeyUp:this.handleKeyUp.bind(this)
    }
  }

  handleClick(ev) {
    this.submit();
    jet.event.stop(ev);
  }

  handleKeyUp(ev) {
    if (ev.keyCode === 13) {
      this.submit();
      jet.event.stop(ev);
    }
  }

  render() {
    return <button {...this.fetchSelfProps()}/>
  }
}

export default Control;

