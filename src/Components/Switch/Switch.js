import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";


import Range from "../Range/Range";

import cssfile from "./Switch.scss";
import csslib from "../../css";


class Switch extends Range {

  static css = csslib.open(cssfile, Range.css);
  static className = ["Switch", Range.className];

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

  draft() {}

  handleClick(ev) {
    if (!this.getLock()) { this.tap(); }
    jet.event.stop(ev, true);
  }

  validateValue(to, from) {
    return jet.num.round(jet.num.frame(jet.num.to(to), 0, 1));
  }

  fetchPropsTrack() {
    return {
      ...super.fetchPropsTrack(),
      onClick:this.handleClick.bind(this),
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
