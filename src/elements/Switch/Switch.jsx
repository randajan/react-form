import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";


import { Range } from "../Range/Range";

import "./Switch.scss";


export class Switch extends Range {

  static className = "Switch " + Range.className;

  static bindMethods = [
    ...Range.bindMethods,
    "handleClick"
  ];

  static defaultProps = {
    ...Range.defaultProps,
    from:0,
    to:1,
    step:1,
    skipInput:true
  }

  static defaultFlags = {
    ...Range.defaultFlags,
    on:p=>!!p.state.input,
    off:p=>!p.state.input
  }

  tap() {
    this.setState({focus:true, input:!this.state.input});
    return this.getInput();
  }

  afterMount() {}

  handleClick(ev) {
    if (!this.getLock()) { this.tap(); }
    ev?.preventDefault();
    ev?.stopPropagation();
  }

  validateValue(to, from) {
    return Math.round(Number.jet.frame(Number.jet.to(to), 0, 1));
  }

  fetchPropsTrack() {
    return {
      ...super.fetchPropsTrack(),
      onClick:this.handleClick,
    }
  }

  fetchPropsPin() {
    return {
      ...super.fetchPropsPin(),
      style:{pointerEvents:"none"}
    }
  }

}

export default Switch;
