import React from 'react';
import PropTypes from 'prop-types';

import jet from "@randajan/jetpack";

import Label from "../Label/Label";
import Button from "../Button/Button";
import Bar from "../Bar/Bar";
import Range from "../Range/Range";

import cssfile from "./Switch.scss";
import csslib from "../../css";


class Switch extends Range {

  static css = csslib.open(cssfile, Range.css);
  static className = ["Switch", Range.className];

  static defaultProps = {
    ...Range.defaultProps,
    step:1
  }

  static defaultFlags = {
    ...Range.defaultFlags,
    on:p=>p.state.input,
    off:p=>!p.state.input
  }

  async tap() {
    await this.setState({focus:true, input:!this.state.input});
    return this.getInput();
  }

  handleMouseDown(ev) {
    this.tap();
    jet.event.stop(ev, true)
  }

  validateValue(to, from) {
    return jet.num.frame(jet.num.to(to), 0, 1);
  }

  fetchPropsTrack() {
    return {
      ...super.fetchPropsTrack(),
      className:Switch.css.get("track", Range.css.get("track"))
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
