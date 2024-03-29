import React from 'react';
import { CSSTransition } from "react-transition-group";
import PropTypes from 'prop-types';

import jet from "@randajan/jet-react";

import Flagable from "../../Dummy/Flagable";

import cssfile from "./Trigger.scss";
import csslib from "../../../_old/src/css";

class Trigger extends Flagable {

  static css = csslib.open(cssfile);
  static className = "Trigger";

  static defaultFlags = {
    active:p=>p.props.active,
    lock:p=>p.props.lock,
    switch:p=>p.props.switch
  }

  static propTypes = {
    ...Flagable.propTypes,
    onTap:PropTypes.func,
  }

  handleClick(ev) {
    const { lock, active, onTap } = this.props;
    const sw = this.props.switch;
    if (lock || (!sw && active)) { return; }
    jet.run(onTap, sw ? !active : true);
    jet.ele.listen.cut(ev);
  }

  fetchPropsSelf(...classNames) {
    const { children} = this.props;
    return {
      ...super.fetchPropsSelf(...classNames),
      onClick:this.handleClick.bind(this),
      children
    };
  }

  fetchTransitionProps() {
    const { transition, appear, active } = this.props;
    return { in:active, timeout:transition, appear, classNames:this.css.transitions()}
  }

  render() {
    const body = <div {...this.fetchPropsSelf()}/>;
    return this.props.transition ? <CSSTransition {...this.fetchTransitionProps()} children={body}/> : body;
  }
}

export default Trigger;
