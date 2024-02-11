import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";

import { Focusable } from "../../components/Focusable";

import "./Button.scss";


export class Button extends Focusable {

  static className = "Button";

  static bindMethods = [
    ...Focusable.bindMethods,
    "submit", "handleKeyUp"
  ];

  static customProps = [
    ...Focusable.customProps,
    "type", "onSubmit",
  ];

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
      onSubmit: jet.isFull(onSubmit) ? onSubmit : parent[type] ? parent[type].bind(parent) : null,
    }
  }

  getLock() {
    const { parent, type } = this.props;
    if (parent && (type === "submit" || type === "reject") && !parent.isInputDirty()) {
      return true;
    }

    return this.state.lock;
  }

  submit(ev) {
    const { onSubmit } = this.props;
    if (onSubmit && onSubmit(this, ev) !== false) {
      ev.preventDefault();
      return true;
    }
    return false
  }

  fetchProps() {
    const { focus, blur, submit, handleKeyUp, props: { tabIndex, type } } = this;
    const lock = this.getLock();

    return {
      ...super.fetchProps(type),
      type:type.startsWith("submit") ? "submit" : type.startsWith("reject") ? "reset" : type,
      disabled:lock,
      readOnly:lock,
      tabIndex:lock?-1:tabIndex,
      onFocus: focus,
      onBlur: blur,
      onClick:lock?null:submit,
      onKeyUp:handleKeyUp
    }
  }

  handleKeyUp(ev) {
    if (this.getLock()) { return ev.preventDefault(); }
    if (ev.keyCode === 13) { this.submit(ev); }
  }

  render() {
    return <button {...this.fetchProps()}/>
  }
}

