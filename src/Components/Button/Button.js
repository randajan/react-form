import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Focusable from "../../Dummy/Focusable";

import cssfile from "./Button.scss";
import csslib from "../../css";

class Button extends Focusable {

  static css = csslib.open(cssfile);
  static className = "Button";

  static propTypes = {
    ...Focusable.propTypes,
    type: PropTypes.oneOf(["button", "submit", "reject", "reset"]),
    onSubmit:PropTypes.func,
  }

  static defaultProps = {
    ...Focusable.defaultProps,
    type:"button",
  }

  static injectParent(parent, ele) {
    const { type, onSubmit } = ele.props;
    return {
      parent,
      onSubmit: jet.filter("full", onSubmit, parent[type] ? parent[type].bind(parent) : null),
    }
  }

  getLock() {
    const { parent, type } = this.props;
    if (parent && (type === "submit" || type === "reject") && !parent.isOutputDirty()) {
      return true;
    }
    
    return this.state.lock;
  }

  submit(ev) {
    const { onSubmit } = this.props;
    if (onSubmit && onSubmit(this, ev) !== false) {
      jet.event.stop(ev);
      return true;
    }
    return false
  }

  fetchPropsSelf() {
    const { children, tabIndex, type } = this.props;  
    const lock = this.getLock();
    return {
      ...super.fetchPropsSelf(type),
      children, 
      type:type.startsWith("submit") ? "submit" : type.startsWith("reject") ? "reset" : type,
      disabled:lock, readOnly:lock, tabIndex:lock?-1:tabIndex,
      onFocus: _=>this.focus(),
      onBlur: _=>this.blur(),
      onClick:lock?null:this.submit.bind(this),
      onKeyUp:this.handleKeyUp.bind(this)
    }
  }

  handleKeyUp(ev) {
    if (this.getLock()) { return jet.event.stop(ev); }
    if (ev.keyCode === 13) { this.submit(ev); }
  }

  render() {
    return <button {...this.fetchPropsSelf()}/>
  }
}

export default Button;

